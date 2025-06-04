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
    status: Optional[str] = Query(None, description="Status atual do card (ex: 'Tarefas pendentes', 'Em andamento')"),
    prioridade: Optional[str] = Query(None, description="Prioridade do Jira (ex: 'Highest', 'Medium')"),
    grupo_solicitante: Optional[str] = Query(None, description="Grupo solicitante do card (ex: 'Franqueadora', 'Franqueado')"),
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

    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"], errors="coerce").dt.tz_localize(None)
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days

    # Normaliza campos vazios para "Não informado"
    df["Unidade / Departamento"] = df["Unidade / Departamento"].fillna("Não informado")
    df["Solicitante"] = df["Solicitante"].fillna("Não informado")
    df["Grupo Solicitante"] = df["Grupo Solicitante"].fillna("Não informado")
    df["Prioridade"] = df["Prioridade"].fillna("Não informado")
    df["Status"] = df["Status"].fillna("Não informado")
    df["Prioridade Calculada"] = df["Prioridade Calculada"].fillna("")

    # Aplicando filtros
    if departamento:
        df = df[df["Unidade / Departamento"] == departamento]
    if status:
        df = df[df["Status"] == status]
    if prioridade:
        df = df[df["Prioridade"] == prioridade]
    if grupo_solicitante:
        df = df[df["Grupo Solicitante"] == grupo_solicitante]
    if solicitante:
        df = df[df["Solicitante"] == solicitante]

    total = len(df)
    tempo_medio = int(df["Dias no Backlog"].mean()) if not df.empty else 0
    mais_antigo = df.sort_values("Dias no Backlog", ascending=False).iloc[0] if not df.empty else {}

    resumo = {
        "total": total,
        "tempo_medio": tempo_medio,
        "mais_antigo": {
            "chave": mais_antigo.get("Chave"),
            "titulo": mais_antigo.get("Título"),
            "dias_no_backlog": int(mais_antigo.get("Dias no Backlog", 0))
        } if not df.empty else {},
        "top_5_fila": df[["Chave", "Título", "Dias no Backlog"]]
                        .head(5)
                        .rename(columns={"Dias no Backlog": "dias"})
                        .to_dict(orient="records"),
        "por_departamento": df["Unidade / Departamento"].value_counts().to_dict(),
        "por_solicitante": df["Solicitante"].value_counts().to_dict(),
        "por_prioridade": df["Prioridade"].value_counts().to_dict(),
        "por_status": df["Status"].value_counts().to_dict(),
        "tempo_medio_por_departamento": df.groupby("Unidade / Departamento")["Dias no Backlog"]
                                           .mean()
                                           .round()
                                           .astype(int)
                                           .to_dict(),
        "por_mes_criacao": [
            {"mes": str(row["mes"]), "total": int(row["total"])}
            for _, row in df["Data de Criação"].dt.to_period("M")
                .value_counts()
                .sort_index()
                .rename_axis("mes")
                .reset_index(name="total")
                .iterrows()
        ],
        "acima_de_15_dias": int(len(df[df["Dias no Backlog"] > 15])),
        "sem_prioridade_calculada": int(len(df[df["Prioridade Calculada"] == ""])),
    }

    return resumo

@router.get("/api/backlog/raw")
def get_backlog_raw(request: Request):

    print("🔄 Coletando JSON completo do backlog (board 71)...")
    service = JiraService()
    issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(issues)

    if df.empty:
        print("⚠️ Nenhum card encontrado.")
        return []

    # Converte e trata datas
    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"], errors="coerce").dt.tz_localize(None)
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days

    # 🧪 Aplica filtros via query string
    params = request.query_params
    if (departamento := params.get("departamento")):
        df = df[df["Unidade / Departamento"] == departamento]
    if (status := params.get("status")):
        df = df[df["Status"] == status]
    if (prioridade := params.get("prioridade")):
        df = df[df["Prioridade Calculada"] == prioridade]
    if (solicitante := params.get("solicitante")):
        df = df[df["Solicitante"] == solicitante]
    if (data_min := params.get("data_min")):
        df = df[df["Data de Criação"] >= pd.to_datetime(data_min)]
    if (data_max := params.get("data_max")):
        df = df[df["Data de Criação"] <= pd.to_datetime(data_max)]

    # Converte para dicionário e retorna
    df["Data de Criação"] = df["Data de Criação"].astype(str)  # serialização segura
    print(f"✅ Total de {len(df)} issues coletadas do backlog com filtros: {dict(params)}")
    return df.to_dict(orient="records")


app.include_router(router)

