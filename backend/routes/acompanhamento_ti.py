from fastapi import APIRouter, Request
import logging
from services.jira_service import JiraService
from services.jira_parser import (
    parse_issues_to_dataframe_acompanhamento_ti,
    prepare_dataframe_for_json_export,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/acompanhamento_ti", tags=["Acompanhamento TI"])


@router.get("/tabela")
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
            "Dias na Ideação", "Dias até Entrega (estimado)"
        ]
        df = prepare_dataframe_for_json_export(df, cols_to_normalize)

        logger.info("Resposta final da tabela de acompanhamento T.I concluída com sucesso")
        return {"tabela_dashboard_ti": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ti": []}

    except Exception as e:
        logger.exception("Erro ao processar /api/acompanhamento_ti/tabela")
        return {"erro": str(e)} 