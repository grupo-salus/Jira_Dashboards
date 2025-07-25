from fastapi import APIRouter, Request
import logging
from services.jira_service import JiraService
from services.espaco_projetos_service import EspacoProjetosService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/espaco_de_projetos", tags=["Espaço de Projetos"])


@router.get("/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP).
    """
    logger.info("Requisição recebida: /api/espaco_de_projetos/tabela")
    
    try:
        # Buscar dados do Jira
        jira_service = JiraService()
        issues = jira_service.get_all_issues_from_project("EP").get("issues", [])
        logger.info(f"Total de issues retornadas do projeto EP: {len(issues)}")
        
        # Processar dados
        espaco_service = EspacoProjetosService()
        dados_processados = espaco_service.processar_issues(issues)
        
        logger.info("Resposta final da tabela de espaço de projetos concluída com sucesso")
        return {"tabela_dashboard_ep": dados_processados}

    except Exception as e:
        logger.exception("Erro ao processar /api/espaco_de_projetos/tabela")
        return {"erro": str(e)} 