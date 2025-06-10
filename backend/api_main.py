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


@router.get("/api/backlog/tabela")
def get_tabela_backlog(
    request: Request,
    area: Optional[str] = Query(None, description="Nome da área (ex: 'TI', 'Financeiro')"),
    epico: Optional[str] = Query(None, description="Nome do épico (ex: 'CP simplificado', 'Integração Sefaz')"),
    status: Optional[str] = Query(None, description="Status do card (ex: 'Tarefas pendentes', 'Em andamento')"),
    prioridade: Optional[str] = Query(None, description="Prioridade do Jira (ex: 'Highest', 'Medium')"),
    grupo_solicitante: Optional[str] = Query(None, description="Grupo solicitante (ex: 'Franqueadora', 'Franqueado')"),
    solicitante: Optional[str] = Query(None, description="Nome do solicitante (quem abriu o chamado)")
):
    """
    Retorna a tabela completa do backlog Jira (board_id=71), com suporte a filtros via query string.
    """
    service = JiraService()
    issues = service.get_raw_backlog_issues(board_id=71).get("issues", [])
    df = parse_issues_to_dataframe(issues)

    if df.empty:
        return {"tabela_backlog": []}

    # Conversão de datas e cálculo de dias no backlog
    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"], errors="coerce").dt.tz_localize(None)
    df["Última Atualização"] = pd.to_datetime(df["Última Atualização"], errors="coerce").dt.tz_localize(None)
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
    if area:
        df = df[df["Unidade / Departamento"] == area]
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

    # Formatação de datas para string ISO
    df["Data de Criação"] = df["Data de Criação"].dt.strftime('%Y-%m-%dT%H:%M:%S')
    df["Última Atualização"] = df["Última Atualização"].dt.strftime('%Y-%m-%dT%H:%M:%S')

    # Conversão para float para compatibilidade com JSON
    df["Estimativa Original (segundos)"] = df["Estimativa Original (segundos)"].astype(float)
    df["Controle de Tempo (segundos)"] = df["Controle de Tempo (segundos)"].astype(float)
    df["Dias no Backlog"] = df["Dias no Backlog"].astype(int)

    # Substitui NaN por None
    df = df.where(pd.notnull(df), None)

    return {"tabela_backlog": df.to_dict(orient="records")}


app.include_router(router)

