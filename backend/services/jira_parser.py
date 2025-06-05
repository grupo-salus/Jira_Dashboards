import pandas as pd

def parse_issues_to_dataframe(issues: list) -> pd.DataFrame:
    def get(field, default=''):
        return field if field is not None else default

    rows = []
    for issue in issues:
        fields = issue.get("fields", {})

        row = {
            "ID": issue.get("id"),
            "Chave": issue.get("key"),
            "Épico": issue.get("epic", {}).get("summary", '') or '',            
            "Título": get(fields.get("summary")),
            "Tipo": (fields.get("issuetype") or {}).get("name", ''),
            "Status": (fields.get("status") or {}).get("name", ''),
            "Data de Criação": get(fields.get("created")),
            "Última Atualização": get(fields.get("updated")),
            
            "Relator Técnico": (fields.get("creator") or {}).get("displayName", ''),
            "Grupo Solicitante": (fields.get("customfield_10083") or {}).get("value", ''),
            "Unidade / Departamento": get(fields.get("customfield_10095")),
            "Solicitante": (fields.get("customfield_10093")),
            "Sprint": (fields.get("sprint") or {}).get("name", ''),
            "Responsável (Dev)": (fields.get("assignee") or {}).get("displayName", ''),
            "Estimativa Original (segundos)": (fields.get("timetracking") or {}).get("originalEstimateSeconds", ''),
            "Controle de Tempo (segundos)": get(fields.get("aggregatetimespent")),
            "Prioridade": (fields.get("priority") or {}).get("name", ''),
            "Branch": get(fields.get("customfield_10115")),
            "versões afetadas": ", ".join(v.get("name") for v in fields.get("versions", [])),
            "versões corrigidas": ", ".join(v.get("name") for v in fields.get("fixVersions", [])),
            "Backlog (nome)": get(fields.get("customfield_10212")),
            
    

        }

        rows.append(row)

    return pd.DataFrame(rows)
