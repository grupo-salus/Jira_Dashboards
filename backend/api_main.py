from fastapi import FastAPI, Request, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from services.jira_service import JiraService
from services.jira_parser import parse_issues_to_dataframe_acompanhamento_ti, parse_issues_to_dataframe_espaco_de_projetos
from datetime import datetime
from typing import Optional
import pandas as pd
from collections import defaultdict
import numpy as np
from datetime import timedelta

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


@router.get("/api/acompanhamento_ti/tabela")
def get_tabela_acompanhamento_ti(
    request: Request,
    responsavel: Optional[str] = Query(None, description="Responsável técnico (ex: 'Luis Henrique Gomes da Fonseca')"),
    prioridade: Optional[str] = Query(None, description="Prioridade da issue (ex: 'Média', 'Alta')"),
    periodo_dias: Optional[int] = Query(None, description="Filtrar por datas nos últimos X dias (opcional)")
):
    """
    Retorna a tabela de issues do projeto 'Acompanhamento T.I' (BL), com suporte a filtros de responsável, prioridade e período (opcional).
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("BL").get("issues", [])
    df = parse_issues_to_dataframe_acompanhamento_ti(issues)

    if df.empty:
        return {"tabela_dashboard_ti": []}

    # Conversão de datas
    df["Criado em"] = pd.to_datetime(df["Criado em"], errors="coerce").dt.tz_localize(None)
    df["Atualizado em"] = pd.to_datetime(df["Atualizado em"], errors="coerce").dt.tz_localize(None)

    # Preenchimento padrão
    for col in ["Responsável", "Prioridade", "Status", "Time", "Categoria"]:
        df[col] = df[col].fillna("Não informado")

    # Filtros por parâmetros
    if responsavel:
        df = df[df["Responsável"] == responsavel]
    if prioridade:
        df = df[df["Prioridade"] == prioridade]
    if periodo_dias is not None:
        hoje = pd.Timestamp.today()
        inicio_periodo = hoje - timedelta(days=periodo_dias)
        df = df[
            (df["Criado em"] >= inicio_periodo) |
            (df["Atualizado em"] >= inicio_periodo)
        ]

    # Formatação de datas
    for col in [
        "Criado em", "Atualizado em", "Data de Início", "Data Prevista de Término", "Data Limite", "Data de Conclusão"
    ]:
        df[col] = df[col].dt.strftime('%Y-%m-%dT%H:%M:%S')

    # Conversões numéricas
    df["Tempo Gasto (segundos)"] = df["Tempo Gasto (segundos)"].astype(float)
    df["Estimativa (segundos)"] = df["Estimativa (segundos)"].astype(float)
    df["Esforço Registrado Total"] = df["Esforço Registrado Total"].astype(float)
    df["Dias no Backlog"] = df["Dias no Backlog"].astype(int)
    df["Dias até Entrega (estimado)"] = df["Dias até Entrega (estimado)"].astype("Int64")

    # Substituição de NaN por None
    df = df.where(pd.notnull(df), None)

    return {"tabela_dashboard_ti": df.to_dict(orient="records")}

@router.get("/api/espaco_de_projetos/tabela")
def get_tabela_espaco_de_projetos(
    request: Request,
    area: Optional[str] = Query(None, description="Departamento solicitante (ex: 'TI', 'Financeiro')"),
    projeto: Optional[str] = Query(None, description="Nome do projeto"),
    status: Optional[str] = Query(None, description="Status da issue (ex: 'Em andamento', 'Concluído')"),
    prioridade: Optional[str] = Query(None, description="Prioridade da issue (ex: 'Média', 'Alta')"),
    grupo_solicitante: Optional[str] = Query(None, description="Grupo solicitante (ex: 'Franqueadora', 'Franqueado')"),
    solicitante: Optional[str] = Query(None, description="Nome do solicitante (quem abriu o chamado)")
):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP), com suporte a filtros via query string.
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("EP").get("issues", [])
    df = parse_issues_to_dataframe_espaco_de_projetos(issues)

    if df.empty:
        return {"tabela_dashboard_ep": []}

    # Conversão de datas
    df["Data de criação"] = pd.to_datetime(df["Data de criação"], errors="coerce").dt.tz_localize(None)
    df["Data de atualização"] = pd.to_datetime(df["Data de atualização"], errors="coerce").dt.tz_localize(None)

    # Preenchimento padrão
    for col in ["Responsável", "Prioridade", "Status", "Grupo Solicitante", "Departamento Solicitante", "Categoria", "Relator", "Solicitante"]:
        df[col] = df[col].fillna("Não informado")

    # Aplicação de filtros
    if area:
        df = df[df["Departamento Solicitante"] == area]
    if projeto:
        df = df[df["Título"] == projeto]  # Usando Título como projeto
    if status:
        df = df[df["Status"] == status]
    if prioridade:
        df = df[df["Prioridade"] == prioridade]
    if grupo_solicitante:
        df = df[df["Grupo Solicitante"] == grupo_solicitante]
    if solicitante:
        df = df[df["Solicitante"] == solicitante]

    # Formatação de datas
    for col in [
        "Data de criação", "Data de atualização", "Target start", "Target end", "Data de término"
    ]:
        df[col] = df[col].dt.strftime('%Y-%m-%dT%H:%M:%S')

    # Conversões numéricas
    df["Estimativa original (segundos)"] = df["Estimativa original (segundos)"].astype(float)
    df["Dias no Backlog"] = df["Dias no Backlog"].astype(int)
    df["Dias até Entrega (estimado)"] = df["Dias até Entrega (estimado)"].astype("Int64")

    # Substituição de NaN por None
    df = df.where(pd.notnull(df), None)

    return {"tabela_dashboard_ep": df.to_dict(orient="records")}


app.include_router(router)







