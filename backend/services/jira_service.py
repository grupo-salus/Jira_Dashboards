import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()


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

    def _fetch_paginated_issues(self, url: str) -> list:
        """
        Função auxiliar para buscar issues com paginação.
        """
        issues = []
        start_at = 0
        max_results = 100

        while True:
            paged_url = f"{url}&startAt={start_at}&maxResults={max_results}"
            try:
                response = requests.get(paged_url, headers=self.headers, auth=self.auth)
                response.raise_for_status()
                data = response.json()

                batch = data.get("issues", [])
                issues.extend(batch)

                if start_at + max_results >= data.get("total", 0):
                    break

                start_at += max_results

            except requests.RequestException as e:
                print(f"❌ Erro ao buscar issues: {e}")
                break

        return issues

    def get_raw_backlog_issues(self, board_id: int) -> dict:
        """
        Retorna todas as issues do backlog (sem sprint associada).
        """
        print(f"🔄 Buscando issues do backlog no board {board_id}...")
        url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/backlog?"
        issues = self._fetch_paginated_issues(url)
        print(f"✅ {len(issues)} issues encontradas no backlog.")
        return {"issues": issues}

    def get_raw_active_sprint_issues(self, board_id: int) -> dict:
        """
        Retorna todas as issues da sprint ativa (se houver).
        """
        print(f"🔄 Verificando sprint ativa no board {board_id}...")
        sprint_url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/sprint?state=active"

        try:
            response = requests.get(sprint_url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            sprints = response.json().get("values", [])

            if not sprints:
                print("⚠️ Nenhuma sprint ativa encontrada.")
                return {"issues": []}

            sprint_id = sprints[0]["id"]
            sprint_name = sprints[0].get("name")
            print(f"✅ Sprint ativa: {sprint_name} (ID: {sprint_id})")

            url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue?"
            issues = self._fetch_paginated_issues(url)
            print(f"✅ {len(issues)} issues coletadas da sprint ativa.")
            return {"issues": issues}

        except requests.RequestException as e:
            print(f"❌ Erro ao buscar sprint ativa: {e}")
            return {"issues": []}

    def get_future_sprints(self, board_id: int) -> list:
        """
        Retorna todas as sprints futuras (não iniciadas) de um board.
        """
        print(f"🔄 Buscando sprints futuras no board {board_id}...")
        url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/sprint?state=future"

        try:
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()
            sprints = response.json().get("values", [])
            print(f"✅ {len(sprints)} sprints futuras encontradas.")
            return sprints

        except requests.RequestException as e:
            print(f"❌ Erro ao buscar sprints futuras: {e}")
            return []

    def get_issues_from_sprint(self, sprint_id: int) -> dict:
        """
        Retorna todas as issues da sprint futura específica (ex: 'Ponto de Comprometimento').
        """
        print(f"🔄 Buscando issues da sprint ID {sprint_id} (futura)...")
        url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue?"
        issues = self._fetch_paginated_issues(url)
        print(f"✅ {len(issues)} issues coletadas da sprint {sprint_id}.")
        return {"issues": issues}

    def get_all_issues_from_project(self, project_key: str) -> dict:
        """
        Retorna todas as issues do projeto com a ordenação visual (Rank do board Kanban).
        """
        print(f"🔄 Buscando todas as issues ordenadas por Rank do projeto '{project_key}'...")
        jql_query = f"project={project_key} ORDER BY Rank ASC"
        url = f"{self.jira_url}/rest/api/3/search?jql={jql_query}&fields=*all"
        
        issues = self._fetch_paginated_issues(url)
        print(f"✅ {len(issues)} issues encontradas no projeto '{project_key}'.")
        return {"issues": issues}

        