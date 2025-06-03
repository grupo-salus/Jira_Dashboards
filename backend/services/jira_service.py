import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv

load_dotenv()


class JiraService:
    def __init__(self):
        self.jira_url = os.getenv("JIRA_URL")
        self.username = os.getenv("JIRA_EMAIL")
        self.api_token = os.getenv("JIRA_API_TOKEN")
        self.auth = HTTPBasicAuth(self.username, self.api_token)
        self.headers = {"Accept": "application/json"}

    def get_raw_backlog_issues(self, board_id: int):
        """
        Retorna todas as issues do backlog (sem sprint), com paginação.
        """
        print(f"🔄 Coletando JSON completo do backlog (board {board_id})...")
        all_issues = []
        start_at = 0
        max_results = 100

        while True:
            url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/backlog?startAt={start_at}&maxResults={max_results}"
            try:
                response = requests.get(url, headers=self.headers, auth=self.auth)
                response.raise_for_status()
                data = response.json()

                issues = data.get("issues", [])
                all_issues.extend(issues)

                if start_at + max_results >= data.get("total", 0):
                    break

                start_at += max_results

            except requests.RequestException as e:
                print(f"❌ Erro ao buscar backlog: {e}")
                break

        print(f"✅ Total de {len(all_issues)} issues coletadas do backlog.")
        return {"issues": all_issues}


    def get_raw_active_sprint_issues(self, board_id: int):
        """
        Retorna todas as issues da sprint ativa (com paginação).
        """
        print(f"🔄 Buscando sprint ativa no board {board_id}...")
        sprint_url = f"{self.jira_url}/rest/agile/1.0/board/{board_id}/sprint?state=active"

        try:
            sprint_response = requests.get(sprint_url, headers=self.headers, auth=self.auth)
            sprint_response.raise_for_status()
            sprints = sprint_response.json().get("values", [])

            if not sprints:
                print("⚠️ Nenhuma sprint ativa encontrada.")
                return {"issues": []}

            sprint = sprints[0]
            sprint_id = sprint["id"]
            print(f"✅ Sprint ativa encontrada: {sprint.get('name')} (ID: {sprint_id})")

            all_issues = []
            start_at = 0
            max_results = 100

            while True:
                issues_url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue?startAt={start_at}&maxResults={max_results}"
                issues_response = requests.get(issues_url, headers=self.headers, auth=self.auth)
                issues_response.raise_for_status()
                data = issues_response.json()

                issues = data.get("issues", [])
                all_issues.extend(issues)

                if start_at + max_results >= data.get("total", 0):
                    break

                start_at += max_results

            print(f"✅ Total de {len(all_issues)} issues coletadas da sprint ativa.")
            return {"issues": all_issues}

        except requests.RequestException as e:
            print(f"❌ Erro ao buscar sprint ativa: {e}")
            return {"issues": []}
