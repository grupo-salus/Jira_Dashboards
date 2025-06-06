import pandas as pd

def parse_issues_to_dataframe(issues: list) -> pd.DataFrame:
    """
    Converte uma lista de issues do Jira em um DataFrame do Pandas.
    Esta função processa os dados brutos do Jira e os organiza em um formato tabular.
    
    Args:
        issues (list): Lista de issues retornadas pela API do Jira
        
    Returns:
        pd.DataFrame: DataFrame contendo os dados processados das issues
    """
    def get(field, default=None):
        """
        Função auxiliar para garantir que sempre retornamos um valor válido,
        mesmo quando o campo está vazio ou nulo
        """
        return field if field is not None else default

    rows = []
    for issue in issues:
        fields = issue.get("fields", {})

        # Processamento do campo de épico (casos diferentes para suportar variações da API)
        epic_raw = fields.get("epic")
        epic_summary = None
        if isinstance(epic_raw, dict):
            epic_summary = epic_raw.get("summary")
        elif isinstance(epic_raw, str):
            epic_summary = epic_raw
        elif (fields.get("parent") or {}).get("fields", {}).get("issuetype", {}).get("name") == "Epic":
            epic_summary = fields["parent"]["fields"].get("summary")

        row = {
            # Identificadores básicos da issue
            "ID": issue.get("id"),
            "Chave": issue.get("key"),

            # Informações do épico e título
            "Épico": epic_summary or None,
            "Título": get(fields.get("summary")),

            # Metadados da issue
            "Tipo": (fields.get("issuetype") or {}).get("name"),
            "Status": (fields.get("status") or {}).get("name"),

            # Datas importantes
            "Data de Criação": get(fields.get("created")),
            "Última Atualização": get(fields.get("updated")),

            # Informações do relator
            "Relator Técnico": (fields.get("creator") or {}).get("displayName"),

            # Informações do solicitante e departamento
            "Grupo Solicitante": (fields.get("customfield_10083") or {}).get("value"),
            "Unidade / Departamento": get(fields.get("customfield_10095")),
            "Solicitante": get(fields.get("customfield_10093")),

            # Informações de sprint e responsável
            "Sprint": (fields.get("sprint") or {}).get("name"),
            "Responsável (Dev)": (fields.get("assignee") or {}).get("displayName"),

            # Métricas de tempo e estimativas
            "Estimativa Original (segundos)": int((fields.get("timetracking") or {}).get("originalEstimateSeconds") or 0),
            "Controle de Tempo (segundos)": int(get(fields.get("aggregatetimespent") or 0)),

            # Informações de prioridade
            "Prioridade": (fields.get("priority") or {}).get("name"),
            # Informações de versão e branch
            "Branch": get(fields.get("customfield_10115")),
            "versões afetadas": ", ".join(v.get("name") for v in fields.get("versions", []) if v.get("name")) or None,
            "versões corrigidas": ", ".join(v.get("name") for v in fields.get("fixVersions", []) if v.get("name")) or None,

            # Informação do backlog
            "Backlog (nome)": get(fields.get("customfield_10212")),
        }

        rows.append(row)

    # Cria o DataFrame a partir da lista de dicionários
    df = pd.DataFrame(rows)

    # Processamento de datas e cálculo de métricas temporais
    df["Data de Criação"] = pd.to_datetime(df["Data de Criação"], errors="coerce")  # Converte strings de data para objetos datetime
    print('ANTES tz_localize:', df["Data de Criação"].dt.tz)  # Log do timezone antes
    df["Data de Criação"] = df["Data de Criação"].dt.tz_localize(None)  # Remove timezone
    print('DEPOIS tz_localize:', df["Data de Criação"].dt.tz)  # Log do timezone depois
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Data de Criação"]).dt.days  # Calcula quantos dias a issue está no backlog

    return df
