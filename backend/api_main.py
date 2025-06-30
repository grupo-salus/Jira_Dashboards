from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from services.jira_service import JiraService
from services.jira_parser import (
    parse_issues_to_dataframe_acompanhamento_ti,
    parse_issues_to_dataframe_espaco_de_projetos,
    prepare_dataframe_for_json_export,
)

app = FastAPI()

# Libera CORS (caso o frontend consuma APIs diretamente)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

@router.get("/api/acompanhamento_ti/tabela")
def get_tabela_acompanhamento_ti(request: Request):
    """
    Retorna a tabela de issues do projeto 'Acompanhamento T.I' (BL), com suporte a filtros.
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("BL").get("issues", [])
    df = parse_issues_to_dataframe_acompanhamento_ti(issues)

    cols_to_normalize = [
        "Tempo Gasto (segundos)", "Estimativa (segundos)", "Esforço Registrado Total",
        "Dias no Backlog", "Dias até Entrega (estimado)"
    ]

    df = prepare_dataframe_for_json_export(df, cols_to_normalize)

    return {"tabela_dashboard_ti": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ti": []}

@router.get("/api/espaco_de_projetos/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP).
    """
    service = JiraService()
    issues = service.get_all_issues_from_project("EP").get("issues", [])
    df = parse_issues_to_dataframe_espaco_de_projetos(issues)

    cols_to_normalize = [
        "Estimativa original (segundos)", "Tempo registrado (segundos)", "Tempo restante (segundos)",
        "Investimento Esperado", "Dias desde criação", "Dias planejados", "Dias desde o início",
        "Dias restantes", "% do tempo decorrido", "% da estimativa usada", "PosicaoBacklog"
    ]

    df = prepare_dataframe_for_json_export(df, cols_to_normalize)

    return {"tabela_dashboard_ep": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ep": []}

@router.get("/api/jira/opcoes-campo-customizado/{field_id}")
def get_opcoes_campo_customizado(request: Request, field_id: str):
    """
    Retorna as opções de um campo customizado para um contexto específico.
    """
    service = JiraService()

    contexts = service.get_field_contexts(field_id)
    context_id = contexts['values'][0]['id']
    options = service.get_field_context_options(field_id, context_id)['values']
    
    list_options = []
    for option in options:
        list_options.append(option['value'])
    return {"opcoes_campo_customizado": list_options}


# Roteador das APIs
app.include_router(router)

# Servir o frontend (Vite - build) a partir da pasta 'dist'
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
