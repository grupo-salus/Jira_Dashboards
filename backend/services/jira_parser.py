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
    def get(field, default=''):
        """
        Função auxiliar para garantir que sempre retornamos um valor válido,
        mesmo quando o campo está vazio ou nulo
        """
        return field if field is not None else default

    rows = []
    for issue in issues:
        fields = issue.get("fields", {})
        epic_summary = (fields.get("epic") or {}).get("summary")
        if not epic_summary and (fields.get("parent") or {}).get("fields", {}).get("issuetype", {}).get("name") == "Epic":
            epic_summary = fields["parent"]["fields"].get("summary")

        row = {
            # Identificadores básicos da issue
            "ID": issue.get("id"),
            "Chave": issue.get("key"),

            # Informações do épico e título
            "Épico": epic_summary or "Não informado",
            "Título": get(fields.get("summary")),

            # Metadados da issue
            "Tipo": (fields.get("issuetype") or {}).get("name", '') or "Não informado",
            "Status": (fields.get("status") or {}).get("name", '') or "Não informado",

            # Datas importantes
            "Data de Criação": get(fields.get("created")),
            "Última Atualização": get(fields.get("updated")),

            # Informações do relator
            "Relator Técnico": (fields.get("creator") or {}).get("displayName", '') or "Não informado",

            # Informações do solicitante e departamento
            "Grupo Solicitante": (fields.get("customfield_10083") or {}).get("value", '') or "Não informado",
            "Unidade / Departamento": get(fields.get("customfield_10095") or "Não informado"),
            "Solicitante": get(fields.get("customfield_10093") or "Não informado"),

            # Informações de sprint e responsável
            "Sprint": (fields.get("sprint") or {}).get("name", '') or "Não informado",
            "Responsável (Dev)": (fields.get("assignee") or {}).get("displayName", '') or "Não informado",

            # Métricas de tempo e estimativas
            "Estimativa Original (segundos)": int((fields.get("timetracking") or {}).get("originalEstimateSeconds") or 0),
            "Controle de Tempo (segundos)": int(get(fields.get("aggregatetimespent") or 0)),

            # Informações de prioridade
            "Prioridade": (fields.get("priority") or {}).get("name", '') or "Não informado",
            "Prioridade Calculada": get(fields.get("customfield_10099") or "Não informado"),

            # Informações de versão e branch
            "Branch": get(fields.get("customfield_10115") or "Não informado"),
            "versões afetadas": ", ".join(v.get("name") for v in fields.get("versions", [])) or "Nenhuma",
            "versões corrigidas": ", ".join(v.get("name") for v in fields.get("fixVersions", [])) or "Nenhuma",

            # Informação do backlog
            "Backlog (nome)": get(fields.get("customfield_10212") or "Não informado"),
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
