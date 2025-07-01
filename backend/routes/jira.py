from fastapi import APIRouter, Request
import logging
from services.jira_service import JiraService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/jira", tags=["Jira"])


@router.get("/opcoes-campo-customizado/{field_id}")
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