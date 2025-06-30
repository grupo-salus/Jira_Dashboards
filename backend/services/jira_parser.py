import pandas as pd
from datetime import datetime
import numpy as np
from datetime import timedelta
from .project_analysis_utils import (
    get_reference_date,
    classificar_status_ideacao,
    calcular_pct_tempo,
    classificar_status_prazo,
    calcular_pct_estimativa,
    classificar_status_esforco,
)

def parse_issues_to_dataframe_acompanhamento_ti(issues: list) -> pd.DataFrame:
    """
    Converte uma lista de issues do Jira em um DataFrame com foco em campos de tempo, datas e equipe,
    baseado no projeto Acompanhamento T.I.
    """
    def get(field, default=None):
        return field if field is not None else default

    rows = []
    for issue in issues:
        fields = issue.get("fields", {})

        row = {
            "ID": issue.get("id"),
            "Chave": issue.get("key"),
            "Título": get(fields.get("summary")),
            "Status": (fields.get("status") or {}).get("name"),
            "Tipo": (fields.get("issuetype") or {}).get("name"),
            "Prioridade": (fields.get("priority") or {}).get("name"),

            # Responsáveis
            "Responsável": (fields.get("assignee") or {}).get("displayName"),
            "Relator": (fields.get("creator") or {}).get("displayName"),
            "Time": (fields.get("customfield_10119") or {}).get("value"),  # Ex: Administrativo
            "Categoria": (fields.get("customfield_10092") or {}).get("value"),  # Ex: Atividade

            # Datas importantes
            "Criado em": get(fields.get("created")),
            "Atualizado em": get(fields.get("updated")),
            "Data de Início": get(fields.get("customfield_10015")),
            "Data Prevista de Término": get(fields.get("customfield_10112")),
            "Data Limite": get(fields.get("duedate")),
            "Data de Conclusão": get(fields.get("resolutiondate")),

            # Tempo e controle de esforço
            "Tempo Gasto (segundos)": int(fields.get("aggregatetimespent") or 0),
            "Controle de tempo": (fields.get("timetracking") or {}).get("timeSpent"),
            "Estimativa (segundos)": int(fields.get("timeoriginalestimate") or 0),
            "Esforço Registrado Total": sum(w.get("timeSpentSeconds", 0) for w in (fields.get("worklog", {}).get("worklogs", []))),

            # Outras
            "Labels": ", ".join(fields.get("labels", [])) if fields.get("labels") else None
        }

        rows.append(row)

    df = pd.DataFrame(rows)

    # Converter datas
    for col in ["Criado em", "Atualizado em", "Data de Início", "Data Prevista de Término", "Data Limite", "Data de Conclusão"]:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.tz_localize(None)

    # Cálculo de métricas temporais
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Criado em"]).dt.days
    df["Dias até Entrega (estimado)"] = (df["Data Prevista de Término"] - df["Data de Início"]).dt.days

    return df

def project_specific_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Enriquecimento do DataFrame com colunas derivadas para análise estratégica:
    - Prazo e progresso (execução)
    - Tempo registrado vs estimativa
    - Status de prazo e esforço
    - Análise de obsolescência (ideação)
    """
    hoje = datetime.now().date()

    # Garantir que as colunas de data estejam no formato datetime
    date_cols = ["Data de criação", "Data de atualização", "Target start", "Target end", "Data de término"]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce")

    # --- IDEIAÇÃO ---
    df["Dias desde criação"] = df["Data de criação"].apply(
        lambda x: (hoje - x.date()).days if pd.notnull(x) else None
    )
    df["Status de ideação"] = df["Dias desde criação"].apply(classificar_status_ideacao)

    # --- EXECUÇÃO ---
    df["Dias planejados"] = (df["Target end"] - df["Target start"]).dt.days
    df["Dias desde o início"] = df.apply(
        lambda row: (get_reference_date(row) - row["Target start"].date()).days
        if pd.notnull(row["Target start"]) else None,
        axis=1
    )
    df["Dias restantes"] = df.apply(
        lambda row: (row["Target end"].date() - get_reference_date(row)).days
        if pd.notnull(row["Target end"]) else None,
        axis=1
    )
    df["% do tempo decorrido"] = df.apply(calcular_pct_tempo, axis=1)
    df["Status de prazo"] = df.apply(lambda row: classificar_status_prazo(row, hoje), axis=1)

    # --- ESFORÇO ---
    df["% da estimativa usada"] = df.apply(calcular_pct_estimativa, axis=1)
    df["Status de esforço"] = df["% da estimativa usada"].apply(classificar_status_esforco)

    return df

def position_in_backlog(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adiciona coluna de posição apenas para issues com status 'Backlog Priorizado',
    numerando conforme a ordem em que aparecem no DataFrame.
    """
    # Primeiro, limpar todas as posições existentes
    df["PosicaoBacklog"] = None
    
    # Filtrar apenas issues com status 'Backlog Priorizado'
    backlog_priorizado_issues = df[df["Status"] == "Backlog Priorizado"]
    
    # Numerar apenas as issues do backlog priorizado
    for pos, (index, _) in enumerate(backlog_priorizado_issues.iterrows(), start=1):
        df.at[index, "PosicaoBacklog"] = pos

    print(f"Posição no backlog adicionada para {len(backlog_priorizado_issues)} issues com status 'Backlog Priorizado'")
    return df

def parse_issues_to_dataframe_espaco_de_projetos(issues: list) -> pd.DataFrame:
    """
    Converte uma lista de issues do Jira em um DataFrame com foco em campos de tempo, datas e equipe,
    baseado no projeto Espaço de Projetos.
    As colunas de data/hora serão do tipo datetime64[ns] do Pandas.
    """
    rows = []
    for index, issue in enumerate(issues):
        fields = issue.get("fields", {})

        row = {
            "ID": issue.get("id"),
            "Tipo": issue.get("fields", {}).get("issuetype", {}).get("name"),
            "Chave": issue.get("key"),
            "Título": issue.get("fields", {}).get("summary"),
            "Prioridade": issue.get("fields", {}).get("priority", {}).get("name"),

            # Posição no backlog (será definida apenas para 'Backlog Priorizado')
            "PosicaoBacklog": None,

            # Campos descritivos
            "Descrição": (
                issue.get("fields", {}).get("description", {}).get("content", [{}])[0]
                .get("content", [{}])[0].get("text")
                if issue.get("fields", {}).get("description") else None
            ),
            "Aprovador por (diretor)": issue.get("fields", {}).get("customfield_10250"),
            "Benefícios Esperados": (
                issue.get("fields", {}).get("customfield_10248", {}).get("content", [{}])[0]
                .get("content", [{}])[0].get("text")
                if issue.get("fields", {}).get("customfield_10248") else None
            ),

            # Status
            "Status": issue.get("fields", {}).get("status", {}).get("name"),

            # Solicitante e organização
            "Grupo Solicitante": (
                issue.get("fields", {}).get("customfield_10083")["value"]
                if issue.get("fields", {}).get("customfield_10083") else None
            ),
            "Departamento Solicitante": (
                issue.get("fields", {}).get("customfield_10245")["value"]
                if issue.get("fields", {}).get("customfield_10245") else None
            ),
            "Solicitante": (
                issue.get("fields", {}).get("customfield_10093", {}).get("content", [{}])[0]
                .get("content", [{}])[0].get("text")
                if issue.get("fields", {}).get("customfield_10093") else None
            ),
            "Telefone do Solicitante": issue.get("fields", {}).get("customfield_10246"),
            "Email do Solicitante": issue.get("fields", {}).get("customfield_10247"),

            # Responsáveis
            "Responsável": issue.get("fields", {}).get("assignee", {}).get("displayName"),
            "Relator": issue.get("fields", {}).get("creator", {}).get("displayName"),

            # Categorização
            "Squad": (
                issue.get("fields", {}).get("customfield_10278")["value"]
                if issue.get("fields", {}).get("customfield_10278") else None
            ),

            # Tempo e estimativas
            "Estimativa original (segundos)": issue.get("fields", {}).get("timetracking", {}).get("originalEstimateSeconds"),
            "Tempo registrado (segundos)": issue.get("fields", {}).get("timetracking", {}).get("timeSpentSeconds"),
            "Tempo restante (segundos)": issue.get("fields", {}).get("timetracking", {}).get("remainingEstimateSeconds"),
            
            # VALORES DE INVESTIMENTO
            "Investimento Esperado": issue.get("fields", {}).get("customfield_10249"),

            # Datas importantes
            "Data de criação": issue.get("fields", {}).get("created"),
            "Data de atualização": issue.get("fields", {}).get("updated"),
            "Target start": issue.get("fields", {}).get("customfield_10022"),
            "Target end": issue.get("fields", {}).get("customfield_10023"),
            "Data de término": issue.get("fields", {}).get("resolutiondate"),
        }
        rows.append(row)

    df = pd.DataFrame(rows)

    # Converter colunas de data/hora para o tipo datetime do Pandas e remover timezone
    date_cols = ["Data de criação", "Data de atualização", "Target start", "Target end", "Data de término"]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.tz_localize(None)

    df = position_in_backlog(df)
    df = project_specific_columns(df)   
    return df

def prepare_dataframe_for_json_export(df: pd.DataFrame, numeric_or_object_cols_with_nan: list = None) -> pd.DataFrame:
    """
    Prepara um DataFrame, ajustando tipos de dados para exportação JSON.
    Converte datetime64[ns] para strings e NaN/NaT para None.
    Retorna uma CÓPIA do DataFrame para evitar modificações no original.
    """
    df_adjusted = df.copy() # Trabalha em uma cópia para não alterar o DF original

    # 1. Converter colunas de data/hora (datetime64[ns]) para string formatada ou None
    for col in df_adjusted.select_dtypes(include=['datetime64[ns]']).columns:
        df_adjusted[col] = df_adjusted[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if pd.notna(x) else None)

    # 2. Converter valores NaN/NaT em colunas numéricas para None para JSON
    # Isso inclui as colunas de "dias" calculadas e quaisquer outras colunas numéricas
    # que possam ter vindo com NaN (ex: Estimativa original (segundos), Investimento Esperado)

    for col in numeric_or_object_cols_with_nan:
        if col in df_adjusted.columns:
            # Substitui NaN (float), pd.NA (missing data), pd.NaT (missing datetime) por None
            # e converte a coluna para o tipo 'object' para permitir misturar números e None
            df_adjusted[col] = df_adjusted[col].replace({pd.NA: None, pd.NaT: None, float('nan'): None}).astype(object)
            
    return df_adjusted