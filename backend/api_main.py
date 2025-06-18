from fastapi import FastAPI, Request, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from services.jira_service import JiraService
from services.jira_parser import parse_issues_to_dataframe_acompanhamento_ti, parse_issues_to_dataframe_espaco_de_projetos, prepare_dataframe_for_json_export
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
    request: Request):
    """
    Retorna a tabela de issues do projeto 'Acompanhamento T.I' (BL), com suporte a filtros de responsável, prioridade e período (opcional).
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("BL").get("issues", [])
    df = parse_issues_to_dataframe_acompanhamento_ti(issues)
    numeric_or_object_cols_with_nan = [
        "Tempo Gasto (segundos)", "Estimativa (segundos)", "Esforço Registrado Total", "Dias no Backlog", "Dias até Entrega (estimado)"
    ]
    df = prepare_dataframe_for_json_export(df, numeric_or_object_cols_with_nan)

    if df.empty:
        return {"tabela_dashboard_ti": []}

    return {"tabela_dashboard_ti": df.to_dict(orient="records")}

@router.get("/api/espaco_de_projetos/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP), com suporte a filtros via query string.
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("EP").get("issues", [])
    df = parse_issues_to_dataframe_espaco_de_projetos(issues)
    numeric_or_object_cols_with_nan = ["Estimativa original (segundos)", "Controle de tempo", "Investimento Esperado"]
    
    df = prepare_dataframe_for_json_export(df, numeric_or_object_cols_with_nan)

    if df.empty:
        return {"tabela_dashboard_ep": []}

    return {"tabela_dashboard_ep": df.to_dict(orient="records")}


app.include_router(router)







