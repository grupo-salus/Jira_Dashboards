import pandas as pd # type: ignore
import sys
import os

# Adiciona o diretório raiz do projeto ao path para encontrar o módulo services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from services.jira_service import JiraService  # seu service acima
from datetime import datetime
from services.jira_parser import parse_issues_to_dataframe_espaco_de_projetos, prepare_dataframe_for_json_export
import json
from datetime import timedelta


service = JiraService()

issues = service.get_all_issues_from_project("EP").get("issues", [])

ep45 = []   #apenas a issue EP-45
for issue in issues:
    if issue['key'] == "EP-45":
        ep45.append(issue)

df = parse_issues_to_dataframe_espaco_de_projetos(ep45)

cols_to_normalize = [   
            "Estimativa original (segundos)", "Tempo registrado (segundos)", "Tempo restante (segundos)",
            "Investimento Esperado", "PosicaoBacklog", "Dias na fase atual"
        ]

df = prepare_dataframe_for_json_export(df, cols_to_normalize)
