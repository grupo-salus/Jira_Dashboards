from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.jira_service import JiraService
from services.jira_parser import parse_issues_to_dataframe

app = FastAPI()

# Libera acesso para o frontend Vite (porta padrão 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

jira = JiraService()

@app.get("/api/backlog")
def get_backlog():
    raw_data = jira.get_raw_backlog_issues(board_id=71)
    df = parse_issues_to_dataframe(raw_data["issues"])
    return df.to_dict(orient="records")

@app.get("/api/sprint")
def get_sprint():
    raw_data = jira.get_raw_active_sprint_issues(board_id=71)
    df = parse_issues_to_dataframe(raw_data["issues"])
    return df.to_dict(orient="records")
