from fastapi import FastAPI, Request, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from services.jira_service import JiraService
from services.jira_parser import parse_issues_to_dataframe
from datetime import datetime
from typing import Optional
import pandas as pd
from collections import defaultdict
import numpy as np

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


 
    # =========================================================================
    # 2. APLICAÇÃO DOS FILTROS
    # =========================================================================
    
    # Os filtros agora operam em um DataFrame limpo
    if departamento:
        df = df[df["Unidade / Departamento"] == departamento]
    if prioridade:
        df = df[df["Prioridade"] == prioridade]
    if grupo_solicitante:
        df = df[df["Grupo Solicitante"] == grupo_solicitante]
    if solicitante:
        df = df[df["Solicitante"] == solicitante]
    if epico:
        df = df[df["Épico"] == epico]

    # Se o DataFrame ficar vazio após os filtros, retorna uma resposta vazia
    if df.empty:
        return {"total_geral_cards": 0, "total_projetos": 0, "projetos": [], "por_departamento": {}}

    # =========================================================================
    # 3. AGRUPAMENTO E ESTRUTURAÇÃO DA RESPOSTA
    # =========================================================================

    # --- Visão por Projeto (Épico) ---
    projetos = []
    agrupado_por_epico = df.groupby("Épico")

    for epico_nome, grupo in agrupado_por_epico:
        # Ordena o grupo por 'Dias no Backlog' para pegar o mais antigo
        grupo_ordenado = grupo.sort_values("Dias no Backlog", ascending=False)
        
        projeto = {
            "epico": epico_nome,
            "total_cards": len(grupo),
            "prioridade_distribuicao": grupo["Prioridade"].value_counts().to_dict(),
            "media_dias_backlog": int(grupo["Dias no Backlog"].mean()),
            # Pega a chave do primeiro item (o mais antigo) de forma segura
            "mais_antigo": grupo_ordenado.iloc[0]["Chave"] if not grupo_ordenado.empty else None,
            "estimativa_total_horas": int(grupo["Estimativa Original (segundos)"].sum() / 3600),
            "cards": grupo_ordenado[[
                "Chave", "Título", "Solicitante", "Unidade / Departamento", "Dias no Backlog", "Prioridade"
            ]].to_dict(orient="records")
        }
        projetos.append(projeto)

    # --- Visão por Departamento (Mais eficiente) ---
    dep_dict = {}
    # Agrupa tanto por departamento quanto por épico de uma vez
    agrupado_dep_epico = df.groupby(["Unidade / Departamento", "Épico"])

    # Primeiro, vamos criar um dicionário para rastrear projetos únicos por departamento
    projetos_por_departamento = {}

    for (dep, ep), sub_grupo in agrupado_dep_epico:
        if dep not in dep_dict:
            dep_dict[dep] = {"total_projetos": 0, "projetos": []}
            projetos_por_departamento[dep] = set()  # Usar set para garantir projetos únicos
        
        # Adiciona o projeto ao set do departamento
        if ep != "Épico não informado":  # Ignora projetos não informados
            projetos_por_departamento[dep].add(ep)
        
        dep_dict[dep]["projetos"].append({
            "epico": ep,
            "total_cards": len(sub_grupo),
            "cards": sub_grupo[["Chave", "Título", "Dias no Backlog"]].to_dict(orient="records")
        })

    # Atualiza o total de projetos por departamento usando o set de projetos únicos
    for dep in dep_dict:
        dep_dict[dep]["total_projetos"] = len(projetos_por_departamento.get(dep, set()))

    # Calcula o total de projetos excluindo "Épico não informado"
    total_projetos = len(df[df["Épico"] != "Épico não informado"]["Épico"].unique())

    return {
        "total_geral_cards": len(df),
        "total_projetos": total_projetos,  # Agora exclui os não informados
        "projetos": sorted(projetos, key=lambda p: p['total_cards'], reverse=True),
        "por_departamento": dep_dict
    }

@router.get("/api/backlog/por-projetos")
def get_backlog_by_projects(request: Request):
    """
    Fornece uma visão geral e completa do backlog com métricas chave e insights adicionais.
    """
    # -----------------------------------------------------
    # 1. BUSCA E PREPARAÇÃO DOS DADOS
    # -----------------------------------------------------
    service = JiraService()
    issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
    
    if not issues:
        return {"mensagem": "Nenhum dado encontrado no backlog."}

    df = parse_issues_to_dataframe(issues)

    if df.empty:
        return {"mensagem": "O DataFrame do backlog está vazio após o parse."}

    # --- Limpeza de dados para cálculos seguros ---
    df['Épico'] = df['Épico'].fillna('')
    # Para os insights, vamos garantir que outras colunas importantes também não tenham nulos
    df['Status'] = df['Status'].fillna('Não informado')
    df['Unidade / Departamento'] = df['Unidade / Departamento'].fillna('Não informado')
    df['Prioridade'] = df['Prioridade'].fillna('Não informada')
    df['Dias no Backlog'] = df['Dias no Backlog'].fillna(0)
    df['Estimativa Original (segundos)'] = df['Estimativa Original (segundos)'].fillna(0)

    # -----------------------------------------------------
    # 2. CÁLCULO DAS MÉTRICAS SOLICITADAS
    # -----------------------------------------------------

    total_cards = len(df)
    df_com_epico = df[df['Épico'] != '']
    df_sem_epico = df[df['Épico'] == '']
    total_epicos_unicos = df_com_epico['Épico'].nunique()
    total_cards_sem_epico = len(df_sem_epico)
    primeiro_card_fila = df.iloc[0].to_dict() if not df.empty else None
    primeiro_projeto_fila = df_com_epico.iloc[0].to_dict() if not df_com_epico.empty else None
    
    distribuicao_prioridade = {}
    if not df_com_epico.empty:
        distribuicao_prioridade = df_com_epico.groupby('Épico')['Prioridade'].value_counts().unstack(fill_value=0).to_dict('index')

    fila_com_epicos = df_com_epico.replace({np.nan: None}).to_dict(orient='records')
    colunas_principais = ['Chave', 'Título', 'Prioridade', 'Épico', 'Unidade / Departamento']
    fila_geral_resumida = df[colunas_principais].replace({np.nan: None}).to_dict(orient='records')
    
    # --------------------------------------------------------------------------
    # 3. CÁLCULO DOS INSIGHTS ADICIONAIS PARA O DASHBOARD (NOVA SEÇÃO)
    # --------------------------------------------------------------------------

    # Insight 1: Saúde do Backlog (Aging)
    saude_backlog = {
        "idade_media_dias": int(df['Dias no Backlog'].mean()),
        "card_mais_antigo_dias": int(df['Dias no Backlog'].max())
    }
    # Cria faixas de idade e conta os cards em cada uma
    bins = [-1, 30, 60, 90, np.inf] # Começa com -1 para incluir o dia 0
    labels = ["0-30 dias", "31-60 dias", "61-90 dias", "91+ dias"]
    df['faixa_idade'] = pd.cut(df['Dias no Backlog'], bins=bins, labels=labels, right=True)
    saude_backlog['distribuicao_por_idade'] = df['faixa_idade'].value_counts().sort_index().to_dict()
    
    # Insight 2: Distribuição por Status
    distribuicao_status = df['Status'].value_counts().to_dict()

    # Insight 3: Carga de Trabalho por Departamento
    carga_por_departamento = {
        "total_cards": df['Unidade / Departamento'].value_counts().to_dict(),
        "horas_estimadas": (df.groupby('Unidade / Departamento')['Estimativa Original (segundos)'].sum() / 3600).round(2).to_dict()
    }

    # Insight 4: Análise de Prioridades (Geral)
    distribuicao_geral_prioridade = df['Prioridade'].value_counts().to_dict()

    # Insight 5: Relação Departamento vs. Prioridade
    crosstab_dep_prio = pd.crosstab(df['Unidade / Departamento'], df['Prioridade']).to_dict('index')

    # -----------------------------------------------------
    # 4. MONTAGEM DA RESPOSTA FINAL
    # -----------------------------------------------------
    return {
        # Métricas originais
        "total_cards": total_cards,
        "total_epicos_unicos": total_epicos_unicos,
        "total_cards_sem_epico": total_cards_sem_epico,
        "primeiro_card_na_fila": primeiro_card_fila,
        "primeiro_projeto_na_fila": primeiro_projeto_fila,
        "distribuicao_prioridade_por_epico": distribuicao_prioridade,
        
        "saude_do_backlog": saude_backlog,
        "distribuicao_por_status": distribuicao_status,
        "carga_de_trabalho_por_departamento": carga_por_departamento,
        "distribuicao_geral_de_prioridade": distribuicao_geral_prioridade,
        "relacao_departamento_vs_prioridade": crosstab_dep_prio,

        # Detalhes das filas (mantidos no final)
        "detalhes_cards_com_epico": fila_com_epicos,
        "resumo_geral_cards": fila_geral_resumida,
    }

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

