import os
import requests
import logging
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class JiraService:
    """
    Serviço de integração com a API do Jira para busca de issues de projetos.
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

