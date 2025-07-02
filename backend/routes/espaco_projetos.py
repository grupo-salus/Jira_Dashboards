from fastapi import APIRouter, Request
import logging
from services.jira_service import JiraService
from services.jira_parser import (
    parse_issues_to_dataframe_espaco_de_projetos,
    prepare_dataframe_for_json_export,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/espaco_de_projetos", tags=["Espaço de Projetos"])


@router.get("/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP).
    """
    logger.info("Requisição recebida: /api/espaco_de_projetos/tabela")
    service = JiraService()

    try:
        issues = service.get_all_issues_from_project("EP").get("issues", [])
        #issues = [issue for issue in issues if issue['key'] == "EP-45"]
        logger.info(f"Total de issues retornadas do projeto EP: {len(issues)}")

        df = parse_issues_to_dataframe_espaco_de_projetos(issues)
        logger.info(f"DataFrame gerado com {len(df)} linhas para espaço de projetos")

        cols_to_normalize = [   
            "Estimativa original (segundos)", "Tempo registrado (segundos)", "Tempo restante (segundos)",
            "Investimento Esperado", "PosicaoBacklog", "Dias na fase atual",
            "Tempo na fase Backlog (dias)", "Tempo na fase Bloqueado (dias)", 
            "Tempo na fase Backlog priorizado (dias)", "Tempo na fase Em andamento (dias)",
            "Tempo na fase Em homologação (dias)", "Tempo na fase Operação assistida (dias)",
            "Tempo na fase Concluído (dias)", "Tempo na fase Cancelado (dias)"
        ]
        df = prepare_dataframe_for_json_export(df, cols_to_normalize)

        logger.info("Resposta final da tabela de espaço de projetos concluída com sucesso")
        

        return {"tabela_dashboard_ep": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ep": []}

    except Exception as e:
        logger.exception("Erro ao processar /api/espaco_de_projetos/tabela")
        return {"erro": str(e)} 