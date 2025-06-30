import os
import requests
import logging
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class JiraService:
    """
    Serviço de integração com a API do Jira Agile (Scrum/Kanban).
    Suporta busca de issues do backlog, sprints ativas e futuras.
    """

    def __init__(self):
        self.jira_url = os.getenv("JIRA_URL")
        self.username = os.getenv("JIRA_EMAIL")
        self.api_token = os.getenv("JIRA_API_TOKEN")
        self.auth = HTTPBasicAuth(self.username, self.api_token)
        self.headers = {"Accept": "application/json"}
        
        logger.info(f"[JiraService] Inicializado com URL: {self.jira_url}")
        logger.debug(f"[JiraService] Usuário configurado: {self.username}")
        
        if not self.jira_url or not self.username or not self.api_token:
            logger.error("[JiraService] Configurações de ambiente incompletas!")
            raise ValueError("Configurações JIRA_URL, JIRA_EMAIL e JIRA_API_TOKEN são obrigatórias")

    def _fetch_paginated_issues(self, url: str) -> list:
        """
        Função auxiliar para buscar issues com paginação.
        """
        logger.debug(f"[_fetch_paginated_issues] Iniciando busca paginada: {url}")
        issues = []
        start_at = 0
        max_results = 100
        total_requests = 0

        while True:
            paged_url = f"{url}&startAt={start_at}&maxResults={max_results}"
            total_requests += 1
            logger.debug(f"[_fetch_paginated_issues] Requisição #{total_requests}: startAt={start_at}, maxResults={max_results}")
            
            try:
                response = requests.get(paged_url, headers=self.headers, auth=self.auth)
                response.raise_for_status()
                data = response.json()

                batch = data.get("issues", [])
                total_issues = data.get("total", 0)
                issues.extend(batch)
                
                logger.debug(f"[_fetch_paginated_issues] Lote #{total_requests}: {len(batch)} issues (total acumulado: {len(issues)}/{total_issues})")

                if start_at + max_results >= total_issues:
                    logger.info(f"[_fetch_paginated_issues] Paginação concluída: {len(issues)} issues em {total_requests} requisições")
                    break

                start_at += max_results

            except requests.RequestException as e:
                logger.error(f"[_fetch_paginated_issues] Erro na requisição #{total_requests}: {e}")
                logger.debug(f"[_fetch_paginated_issues] URL que falhou: {paged_url}")
                break

        return issues

    def get_raw_backlog_issues(self, board_id: int) -> dict:
        """
        Retorna todas as issues do backlog (sem sprint associada).
        """
        logger.info(f"[get_raw_backlog_issues] Iniciando busca do backlog no board {board_id}")
        url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/backlog?"
        
        try:
            issues = self._fetch_paginated_issues(url)
            logger.info(f"[get_raw_backlog_issues] Backlog do board {board_id}: {len(issues)} issues encontradas")
            return {"issues": issues}
        except Exception as e:
            logger.error(f"[get_raw_backlog_issues] Erro ao buscar backlog do board {board_id}: {e}")
            return {"issues": []}

    def get_raw_active_sprint_issues(self, board_id: int) -> dict:
        """
        Retorna todas as issues da sprint ativa (se houver).
        """
        logger.info(f"[get_raw_active_sprint_issues] Verificando sprint ativa no board {board_id}")
        sprint_url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/sprint?state=active"

        try:
            logger.debug(f"[get_raw_active_sprint_issues] Buscando sprints ativas: {sprint_url}")
            response = requests.get(sprint_url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            sprints = response.json().get("values", [])

            if not sprints:
                logger.warning(f"[get_raw_active_sprint_issues] Nenhuma sprint ativa encontrada no board {board_id}")
                return {"issues": []}

            sprint_id = sprints[0]["id"]
            sprint_name = sprints[0].get("name")
            logger.info(f"[get_raw_active_sprint_issues] Sprint ativa encontrada: {sprint_name} (ID: {sprint_id})")

            url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue?"
            issues = self._fetch_paginated_issues(url)
            logger.info(f"[get_raw_active_sprint_issues] Sprint {sprint_name}: {len(issues)} issues coletadas")
            return {"issues": issues}

        except requests.RequestException as e:
            logger.error(f"[get_raw_active_sprint_issues] Erro ao buscar sprint ativa no board {board_id}: {e}")
            return {"issues": []}

    def get_future_sprints(self, board_id: int) -> list:
        """
        Retorna todas as sprints futuras (não iniciadas) de um board.
        """
        logger.info(f"[get_future_sprints] Buscando sprints futuras no board {board_id}")
        url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/sprint?state=future"

        try:
            logger.debug(f"[get_future_sprints] URL da requisição: {url}")
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            sprints = response.json().get("values", [])
            
            logger.info(f"[get_future_sprints] Board {board_id}: {len(sprints)} sprints futuras encontradas")
            for sprint in sprints:
                logger.debug(f"[get_future_sprints] Sprint: {sprint.get('name')} (ID: {sprint.get('id')})")
            
            return sprints

        except requests.RequestException as e:
            logger.error(f"[get_future_sprints] Erro ao buscar sprints futuras no board {board_id}: {e}")
            return []

    def get_issues_from_sprint(self, sprint_id: int) -> dict:
        """
        Retorna todas as issues da sprint futura específica (ex: 'Ponto de Comprometimento').
        """
        logger.info(f"[get_issues_from_sprint] Buscando issues da sprint ID {sprint_id}")
        url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue?"
        
        try:
            issues = self._fetch_paginated_issues(url)
            logger.info(f"[get_issues_from_sprint] Sprint {sprint_id}: {len(issues)} issues coletadas")
            return {"issues": issues}
        except Exception as e:
            logger.error(f"[get_issues_from_sprint] Erro ao buscar issues da sprint {sprint_id}: {e}")
            return {"issues": []}

    def get_all_issues_from_project(self, project_key: str) -> dict:
        """
        Retorna todas as issues do projeto com a ordenação visual (Rank do board Kanban).
        """
        logger.info(f"[get_all_issues_from_project] Buscando todas as issues do projeto '{project_key}' ordenadas por Rank")
        jql_query = f"project={project_key} ORDER BY Rank ASC"
        url = f"{self.jira_url}/rest/api/3/search?jql={jql_query}&fields=*all"
        
        logger.debug(f"[get_all_issues_from_project] JQL Query: {jql_query}")
        logger.debug(f"[get_all_issues_from_project] URL da requisição: {url}")
        
        try:
            issues = self._fetch_paginated_issues(url)
            logger.info(f"[get_all_issues_from_project] Projeto '{project_key}': {len(issues)} issues encontradas")
            return {"issues": issues}
        except Exception as e:
            logger.error(f"[get_all_issues_from_project] Erro ao buscar issues do projeto '{project_key}': {e}")
            return {"issues": []}

    def get_field_contexts(self, field_id: str) -> dict:
        """
        Retorna os contextos de um campo customizado.
        """
        logger.info(f"[get_field_contexts] Buscando contextos do campo {field_id}")
        url = f"{self.jira_url}/rest/api/3/field/{field_id}/context"

        try:
            logger.debug(f"[get_field_contexts] URL da requisição: {url}")
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            contexts = response.json()
            
            context_count = len(contexts.get('values', []))
            logger.info(f"[get_field_contexts] Campo {field_id}: {context_count} contextos encontrados")
            
            for context in contexts.get('values', []):
                logger.debug(f"[get_field_contexts] Contexto: {context.get('name', 'N/A')} (ID: {context.get('id')})")
            
            return contexts

        except requests.RequestException as e:
            logger.error(f"[get_field_contexts] Erro ao buscar contextos do campo {field_id}: {e}")
            logger.debug(f"[get_field_contexts] URL que falhou: {url}")
            return {}

    def get_field_context_options(self, field_id: str, context_id: str) -> dict:
        """
        Retorna as opções de um campo customizado para um contexto específico.
        """
        logger.info(f"[get_field_context_options] Buscando opções do campo {field_id} no contexto {context_id}")
        url = f"{self.jira_url}/rest/api/3/field/{field_id}/context/{context_id}/option"

        try:
            logger.debug(f"[get_field_context_options] URL da requisição: {url}")
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            options = response.json()
            
            options_count = len(options.get('values', []))
            logger.info(f"[get_field_context_options] Campo {field_id} (contexto {context_id}): {options_count} opções encontradas")
            
            # Log das primeiras 5 opções para debug
            for i, option in enumerate(options.get('values', [])[:5]):
                logger.debug(f"[get_field_context_options] Opção {i+1}: {option.get('value', 'N/A')} (ID: {option.get('id')})")
            
            if options_count > 5:
                logger.debug(f"[get_field_context_options] ... e mais {options_count - 5} opções")
            
            return options

        except requests.RequestException as e:
            logger.error(f"[get_field_context_options] Erro ao buscar opções do campo {field_id} (contexto {context_id}): {e}")
            logger.debug(f"[get_field_context_options] URL que falhou: {url}")
            return {}
        
    def get_issue_with_changelog(self, issue_key: str) -> dict:
        """
        Retorna uma issue completa com histórico de mudanças (changelog).
        """
        logger.info(f"[get_issue_with_changelog] Buscando changelog da issue {issue_key}")
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}?expand=changelog"

        try:
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            issue = response.json()
            logger.debug(f"[get_issue_with_changelog] Issue {issue_key} carregada com changelog")
            return issue
        except Exception as e:
            logger.error(f"[get_issue_with_changelog] Erro ao buscar changelog da issue {issue_key}: {e}")
            return {}

