from fastapi import FastAPI, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from services.jira_service import JiraService
from services.jira_parser import (
    parse_issues_to_dataframe_acompanhamento_ti,
    parse_issues_to_dataframe_espaco_de_projetos,
    prepare_dataframe_for_json_export,
)
from config.logging_config import setup_logging

# Configura o logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS
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
    logger.info("Requisição recebida: /api/acompanhamento_ti/tabela")
    service = JiraService()

    try:
        issues = service.get_all_issues_from_project("BL").get("issues", [])
        logger.info(f"Total de issues retornadas do projeto BL: {len(issues)}")

        df = parse_issues_to_dataframe_acompanhamento_ti(issues)
        logger.info(f"DataFrame gerado com {len(df)} linhas para acompanhamento T.I")

        cols_to_normalize = [
            "Tempo Gasto (segundos)", "Estimativa (segundos)", "Esforço Registrado Total",
            "Dias no Backlog", "Dias até Entrega (estimado)"
        ]
        df = prepare_dataframe_for_json_export(df, cols_to_normalize)

        logger.info("Resposta final da tabela de acompanhamento T.I concluída com sucesso")
        return {"tabela_dashboard_ti": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ti": []}

    except Exception as e:
        logger.exception("Erro ao processar /api/acompanhamento_ti/tabela")
        return {"erro": str(e)}


@router.get("/api/espaco_de_projetos/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP).
    """
    logger.info("Requisição recebida: /api/espaco_de_projetos/tabela")
    service = JiraService()

    try:
        issues = service.get_all_issues_from_project("EP").get("issues", [])
        logger.info(f"Total de issues retornadas do projeto EP: {len(issues)}")

        df = parse_issues_to_dataframe_espaco_de_projetos(issues)
        logger.info(f"DataFrame gerado com {len(df)} linhas para espaço de projetos")

        cols_to_normalize = [
            "Estimativa original (segundos)", "Tempo registrado (segundos)", "Tempo restante (segundos)",
            "Investimento Esperado", "Dias desde criação", "Dias planejados", "Dias desde o início",
            "Dias restantes", "% do tempo decorrido", "% da estimativa usada", "PosicaoBacklog"
        ]
        df = prepare_dataframe_for_json_export(df, cols_to_normalize)

        logger.info("Resposta final da tabela de espaço de projetos concluída com sucesso")
        return {"tabela_dashboard_ep": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ep": []}

    except Exception as e:
        logger.exception("Erro ao processar /api/espaco_de_projetos/tabela")
        return {"erro": str(e)}


@router.get("/api/jira/opcoes-campo-customizado/{field_id}")
def get_opcoes_campo_customizado(request: Request, field_id: str):
    """
    Retorna as opções de um campo customizado para um contexto específico.
    """
    logger.info(f"Requisição recebida: /api/jira/opcoes-campo-customizado/{field_id}")
    service = JiraService()

    try:
        contexts = service.get_field_contexts(field_id)
        context_id = contexts['values'][0]['id']
        logger.debug(f"Context ID recuperado: {context_id}")

        options = service.get_field_context_options(field_id, context_id)['values']
        list_options = [option['value'] for option in options]

        logger.info(f"Total de opções retornadas para o campo {field_id}: {len(list_options)}")
        return {"opcoes_campo_customizado": list_options}

    except Exception as e:
        logger.exception(f"Erro ao buscar opções do campo customizado {field_id}")
        return {"erro": str(e)}

# Roteador das APIs
app.include_router(router)

# Servir frontend da pasta dist
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
