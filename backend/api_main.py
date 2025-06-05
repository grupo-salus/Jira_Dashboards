from fastapi import FastAPI, Request, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from services.jira_service import JiraService
from services.jira_parser import parse_issues_to_dataframe
from datetime import datetime
from typing import Optional
import pandas as pd


app = FastAPI()

# Libera CORS (caso você esteja usando frontend separado)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


router = APIRouter()

@router.get("/api/backlog/resumo")
def get_backlog_summary(
    request: Request,
    departamento: Optional[str] = Query(None, description="Nome do departamento (ex: 'TI', 'Financeiro')"),
    epico: Optional[str] = Query(None, description="Nome do épico (ex: 'CP simplificado', 'Integração Sefaz')"),
    status: Optional[str] = Query(None, description="Status do card (ex: 'Tarefas pendentes', 'Em andamento')"),
    prioridade: Optional[str] = Query(None, description="Prioridade do Jira (ex: 'Highest', 'Medium')"),
    grupo_solicitante: Optional[str] = Query(None, description="Grupo solicitante (ex: 'Franqueadora', 'Franqueado')"),
    solicitante: Optional[str] = Query(None, description="Nome do solicitante (quem abriu o chamado)")
):
    """
    Retorna um resumo estatístico dos cards do backlog Jira (board_id=71), com suporte a filtros via query string.
    """
    service = JiraService()
    issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(issues)

    if df.empty:
        return {"total": 0, "mensagem": "Nenhum card encontrado."}

    # Conversão de datas e cálculo de dias no backlog
    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"], errors="coerce").dt.tz_localize(None)
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days

    # Preenchimento padrão para colunas-chave
    for col in [
        "Unidade / Departamento", "Solicitante", "Grupo Solicitante", "Prioridade", "Status"
    ]:
        df[col] = df[col].fillna("Não informado")

    # Tratamento seguro para a coluna "Épico"
    if "Épico" not in df.columns:
        df["Épico"] = ""
    else:
        df["Épico"] = df["Épico"].fillna("")

    # Aplicação de filtros
    if departamento:
        df = df[df["Unidade / Departamento"] == departamento]
    if epico:
        df = df[df["Épico"] == epico]
    if status:
        df = df[df["Status"] == status]
    if prioridade:
        df = df[df["Prioridade"] == prioridade]
    if grupo_solicitante:
        df = df[df["Grupo Solicitante"] == grupo_solicitante]
    if solicitante:
        df = df[df["Solicitante"] == solicitante]

    # Resumo
    total = len(df)
    tempo_medio = int(df["Dias no Backlog"].mean()) if total > 0 else 0
    mais_antigo = df.sort_values("Dias no Backlog", ascending=False).iloc[0] if total > 0 else {}

    resumo = {
        "total": total,
        "tempo_medio": tempo_medio,
        "mais_antigo": {
            "chave": mais_antigo.get("Chave"),
            "titulo": mais_antigo.get("Título"),
            "dias_no_backlog": int(mais_antigo.get("Dias no Backlog", 0))
        } if total > 0 else {},
        "fila_de_espera": df[df["Tipo"] != "Subtarefa"][["Chave", "Título", "Dias no Backlog"]]
            .rename(columns={"Dias no Backlog": "dias"})
            .to_dict(orient="records"),
        "por_departamento": df["Unidade / Departamento"].value_counts().to_dict(),
        "por_solicitante": df["Solicitante"].value_counts().to_dict(),
        "por_prioridade": df["Prioridade"].value_counts().to_dict(),
        "por_status": df["Status"].value_counts().to_dict(),
        "tempo_medio_por_departamento": df.groupby("Unidade / Departamento")["Dias no Backlog"]
            .mean().round().astype(int).to_dict(),
        "por_mes_criacao": [
            {"mes": str(row["mes"]), "total": int(row["total"])}
            for _, row in df["Data de Criação"].dt.to_period("M")
                .value_counts()
                .sort_index()
                .rename_axis("mes")
                .reset_index(name="total")
                .iterrows()
        ],
        "acima_de_15_dias": int((df["Dias no Backlog"] > 15).sum()),
        "sem_prioridade_calculada": int((df["Prioridade Calculada"] == "").sum()) if "Prioridade Calculada" in df.columns else 0,
    }

    return resumo

@router.get("/api/sprint/resumo")
def get_sprint_summary(request: Request):
    """
    Retorna um resumo de desempenho da sprint ativa, incluindo comparação de tempo estimado vs. tempo real por desenvolvedor.
    """
    service = JiraService()
    issues = service.get_raw_active_sprint_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(issues)

    if df.empty:
        return {"mensagem": "Nenhum card encontrado na sprint ativa."}

    # Prepara os campos
    df["Estimativa Original (horas)"] = df["Estimativa Original (segundos)"].apply(lambda x: round(x / 3600, 2) if pd.notnull(x) and x != '' else 0)
    df["Tempo Gasto (horas)"] = df["Controle de Tempo (segundos)"].apply(lambda x: round(x / 3600, 2) if pd.notnull(x) and x != '' else 0)
    df["Dentro do Prazo"] = df["Tempo Gasto (horas)"] <= df["Estimativa Original (horas)"]

    # Preenche campos vazios
    df["Responsável (Dev)"] = df["Responsável (Dev)"].fillna("Não atribuído")
    df["Status"] = df["Status"].fillna("Não informado")

    # Resumo geral
    total_cards = len(df)
    dentro_prazo = int(df["Dentro do Prazo"].sum())
    fora_prazo = total_cards - dentro_prazo
    percentual_no_prazo = round((dentro_prazo / total_cards) * 100, 2) if total_cards > 0 else 0

    resumo_geral = {
        "total_cards": total_cards,
        "entregues_no_prazo": dentro_prazo,
        "fora_do_prazo": fora_prazo,
        "percentual_no_prazo": percentual_no_prazo
    }

    # Por desenvolvedor
    dev_group = df.groupby("Responsável (Dev)").agg(
        qtd_cards=("Chave", "count"),
        horas_estimadas=("Estimativa Original (horas)", "sum"),
        horas_gastas=("Tempo Gasto (horas)", "sum"),
        entregues_no_prazo=("Dentro do Prazo", "sum")
    ).reset_index()

    dev_group["fora_do_prazo"] = dev_group["qtd_cards"] - dev_group["entregues_no_prazo"]
    dev_group["percentual_no_prazo"] = dev_group.apply(
        lambda row: round((row["entregues_no_prazo"] / row["qtd_cards"]) * 100, 2) if row["qtd_cards"] > 0 else 0, axis=1
    )

    por_desenvolvedor = dev_group.to_dict(orient="records")

    # Por status
    por_status = df["Status"].value_counts().to_dict()

    # Top 5 mais estourados (tempo gasto >> estimado)
    df["Desvio"] = df["Tempo Gasto (horas)"] - df["Estimativa Original (horas)"]
    top_5_mais_estourados = df[df["Desvio"] > 0].sort_values("Desvio", ascending=False).head(5)
    top_5 = top_5_mais_estourados[["Chave", "Título", "Responsável (Dev)", "Estimativa Original (horas)", "Tempo Gasto (horas)"]].to_dict(orient="records")

    return {
        "resumo_geral": resumo_geral,
        "por_desenvolvedor": por_desenvolvedor,
        "por_status": por_status,
        "top_5_mais_estourados": top_5
    }


app.include_router(router)

