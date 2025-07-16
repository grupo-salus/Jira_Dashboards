from fastapi import APIRouter, Request
import logging
from services.jira_service import JiraService
from services.jira_parser import (
    parse_issues_to_dataframe_espaco_de_projetos,
    prepare_dataframe_for_json_export,
)
from schemas.projeto_schema import ProjetoJiraInput
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/espaco_de_projetos", tags=["Espaço de Projetos"])


def convert_text_to_adf(text: str) -> Dict:
    """
    Converte texto simples para o formato ADF (Atlassian Document Format).
    """
    if not text:
        return None
    
    return {
        "version": 1,
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "content": [
                    {
                        "type": "text",
                        "text": str(text)
                    }
                ]
            }
        ]
    }


@router.get("/tabela")
def get_tabela_espaco_de_projetos(request: Request):
    """
    Retorna a tabela de issues do projeto 'Espaço de Projetos' (EP).
    """
    logger.info("Requisição recebida: /api/espaco_de_projetos/tabela")
    service = JiraService()

    try:
        issues = service.get_all_issues_from_project("EP").get("issues", [])
        
        #issues = [issue for issue in issues if issue['key'] in ["EP-49"]]
        logger.info(f"Total de issues retornadas do projeto EP: {len(issues)}")

        df = parse_issues_to_dataframe_espaco_de_projetos(issues)
        logger.info(f"DataFrame gerado com {len(df)} linhas para espaço de projetos")

        cols_to_normalize = [   
            "Estimativa original (segundos)", "Tempo registrado (segundos)", "Tempo restante (segundos)",
            "Investimento Esperado", "PosicaoBacklog", "Dias na fase atual", "Status da fase atual",
            "Tempo na fase Ideação (dias)", "Tempo na fase Bloqueado (dias)", 
            "Tempo na fase Backlog priorizado (dias)", "Tempo na fase Em desenvolvimento (dias)",
            "Tempo na fase Análise técnica e negócios (dias)",
            "Tempo na fase Em homologação (dias)", "Tempo na fase Operação assistida (dias)",
            "Tempo na fase Entregue (dias)", "Tempo na fase Cancelado (dias)"
        ]
        df = prepare_dataframe_for_json_export(df, cols_to_normalize)

        logger.info("Resposta final da tabela de espaço de projetos concluída com sucesso")
        

        return {"tabela_dashboard_ep": df.to_dict(orient="records")} if not df.empty else {"tabela_dashboard_ep": []}

    except Exception as e:
        logger.exception("Erro ao processar /api/espaco_de_projetos/tabela")
        return {"erro": str(e)} 
    

@router.get("/campos_projeto")
def listar_campos_projeto():
    """
    Retorna apenas os campos específicos para o formulário de criação de projeto.
    """
    service = JiraService()
    all_fields = service.get_fields_for_issue_type(project_key="EP")
    
    # Lista de campos que queremos mostrar no formulário (baseado no HTML)
    campos_desejados = [
        "customfield_10093",          # Nome completo do solicitante
        "customfield_10247",          # E-mail corporativo
        "customfield_10245",          # Departamento / Unidade solicitante
        "customfield_10250",          # Diretor responsável pela aprovação
        "summary",                    # Nome ou Título do Projeto (obrigatório)
        "customfield_10481",          # Objetivo do Projeto
        "description",                # Descrição do Projeto
        "customfield_10476",          # Escopo Inicial ou Solução Proposta pela Área
        "customfield_10477",          # Stakeholders Diretos ou Equipes Envolvidas
        "customfield_10478",          # Tipo de Projeto
        "priority",                   # Prioridade da Solicitação
        "customfield_10479",          # Prazo Desejado ou Restrição Temporal
        "customfield_10480",          # Impacto Esperado
        "customfield_10248",          # Benefícios Esperados
        "customfield_10482",          # Riscos Conhecidos ou Percebidos pela Área
        "customfield_10483",          # Estimativa de Custo
        "customfield_10484",          # Existe orçamento reservado para este projeto?
        "customfield_10485",          # Observações adicionais
        "customfield_10486"           #confirmação 
    ]
    
    # Filtra apenas os campos desejados
    campos_filtrados = [
        field for field in all_fields 
        if field.get("key") in campos_desejados
    ]
    
    # Ordena os campos na ordem desejada
    campos_ordenados = []
    for key in campos_desejados:
        for field in campos_filtrados:
            if field.get("key") == key:
                campos_ordenados.append(field)
                break
    
    return {"fields": campos_ordenados}


@router.post("/criar_projeto")
def criar_projeto(projeto: Dict):
    """
    Cria um novo projeto no Jira com os campos validados.
    """
    logger.info("[criar_projeto] Recebendo dados para criar projeto no Jira.")
    logger.debug(f"[criar_projeto] Dados recebidos: {projeto}")

    try:
        # Campos que precisam ser convertidos para ADF
        text_fields_to_convert = [
            "customfield_10093",  # Nome completo do solicitante
            "customfield_10481",  # Objetivo do Projeto
            "description",        # Descrição do Projeto
            "customfield_10476",  # Escopo Inicial ou Solução Proposta
            "customfield_10477",  # Stakeholders Diretos ou Equipes Envolvidas
            "customfield_10248",  # Benefícios Esperados
            "customfield_10482",  # Riscos Conhecidos
            "customfield_10485"   # Observações adicionais
        ]
        
        # Converter campos de texto para ADF
        projeto_convertido = projeto.copy()
        for field in text_fields_to_convert:
            if field in projeto_convertido and projeto_convertido[field]:
                projeto_convertido[field] = convert_text_to_adf(projeto_convertido[field])
        
        # Tratar campo customfield_10486 (Confirmação)
        if "customfield_10486" in projeto_convertido:
            # Converter lista de strings para lista de objetos com id
            confirmacao_list = projeto_convertido["customfield_10486"]
            if isinstance(confirmacao_list, list):
                projeto_convertido["customfield_10486"] = [{"id": item} for item in confirmacao_list]
        
        service = JiraService()
        payload = {
            "fields": {
                "project": { "key": "EP" },
                "issuetype": { "id": "10105" },
                **projeto_convertido
            }
        }
        
        logger.debug(f"[criar_projeto] Payload para Jira: {payload}")
        result = service.post_issue(payload)
        
        if "erro" in result:
            logger.error(f"[criar_projeto] Erro retornado pelo serviço: {result['erro']}")
            return {"detail": result["erro"]}
        
        logger.info(f"[criar_projeto] Projeto criado com sucesso: {result.get('key', 'N/A')}")
        return result
        
    except Exception as e:
        logger.exception(f"[criar_projeto] Erro inesperado: {e}")
        return {"detail": f"Erro interno do servidor: {str(e)}"}
