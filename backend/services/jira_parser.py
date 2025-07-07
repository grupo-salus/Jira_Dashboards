import pandas as pd
from datetime import datetime
import numpy as np
from datetime import timedelta
from .project_analysis_utils import (
    calcular_tempo_por_fase,
    calcular_dias_na_fase_atual,
    classificar_status_ideacao,
    classificar_prazo,
    verificar_risco_atual,
)
import logging 
logger = logging.getLogger(__name__)

def parse_issues_to_dataframe_acompanhamento_ti(issues: list) -> pd.DataFrame:
    """
    Converte uma lista de issues do Jira em um DataFrame com foco em campos de tempo, datas e equipe,
    baseado no projeto Acompanhamento T.I.
    """
    logger.info(f"Iniciando parsing de {len(issues)} issues para DataFrame de Acompanhamento T.I.")
    
    def get(field, default=None):
        return field if field is not None else default

    rows = []
    for i, issue in enumerate(issues):
        if i % 100 == 0:  # Log a cada 100 issues processadas
            logger.debug(f"Processando issue {i+1}/{len(issues)}")
            
        fields = issue.get("fields", {})
        
        if not fields:
            logger.warning(f"Issue {issue.get('key', 'N/A')} sem campos válidos")

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

    logger.debug(f"Criando DataFrame com {len(rows)} linhas")
    df = pd.DataFrame(rows)

    # Converter datas
    logger.debug("Convertendo colunas de data para datetime")
    for col in ["Criado em", "Atualizado em", "Data de Início", "Data Prevista de Término", "Data Limite", "Data de Conclusão"]:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.tz_localize(None)

    # Cálculo de métricas temporais
    logger.debug("Calculando métricas temporais")
    df["Dias no Backlog"] = (pd.Timestamp.today() - df["Criado em"]).dt.days
    df["Dias até Entrega (estimado)"] = (df["Data Prevista de Término"] - df["Data de Início"]).dt.days

    logger.info(f"DataFrame de Acompanhamento T.I. criado com sucesso: {len(df)} issues, {len(df.columns)} colunas")
    return df

def project_specific_columns(df: pd.DataFrame) -> pd.DataFrame:
    fases = [
        "Backlog",
        "Bloqueado",
        "Backlog priorizado",
        "Análise técnica e negócios",
        "Em andamento",
        "Em homologação",
        "Operação assistida",
        "Concluído",
        "Cancelado",
    ]

    for fase in fases:
        col_name = f"Tempo na fase {fase} (dias)"
        df[col_name] = df.apply(lambda row: calcular_tempo_por_fase(row, fase), axis=1)

    df["Dias na fase atual"] = df.apply(calcular_dias_na_fase_atual, axis=1)

    df["Status de ideação"] = df.apply(
        lambda row: classificar_status_ideacao(row["Dias na fase atual"])
        if str(row.get("Status", "")).strip().lower() == "ideação" else None,
        axis=1
    )

    df["Status de prazo"] = df.apply(classificar_prazo, axis=1)
    df["Risco de atraso atual?"] = df.apply(verificar_risco_atual, axis=1)

    # Limpar valores infinitos e NaN das colunas numéricas
    numeric_cols = df.select_dtypes(include=['number']).columns
    for col in numeric_cols:
        df[col] = df[col].replace([float('inf'), float('-inf'), float('nan')], None)

    return df

def position_in_backlog(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adiciona coluna de posição apenas para issues com status 'Backlog Priorizado',
    numerando conforme a ordem em que aparecem no DataFrame.
    """
    logger.info("Iniciando cálculo de posição no backlog")
    
    # Primeiro, limpar todas as posições existentes
    df["PosicaoBacklog"] = None
    
    # Filtrar apenas issues com status 'Backlog Priorizado'
    backlog_priorizado_issues = df[df["Status"] == "Backlog Priorizado"]
    
    logger.debug(f"Encontradas {len(backlog_priorizado_issues)} issues com status 'Backlog Priorizado'")
    
    # Numerar apenas as issues do backlog priorizado
    for pos, (index, _) in enumerate(backlog_priorizado_issues.iterrows(), start=1):
        df.at[index, "PosicaoBacklog"] = pos

    logger.info(f"Posição no backlog adicionada para {len(backlog_priorizado_issues)} issues com status 'Backlog Priorizado'")
    return df

def parse_issues_to_dataframe_espaco_de_projetos(issues: list) -> pd.DataFrame:
    """
    Converte uma lista de issues do Jira em um DataFrame com foco em campos de tempo, datas e equipe,
    baseado no projeto Espaço de Projetos.
    As colunas de data/hora serão do tipo datetime64[ns] do Pandas.
    """
    logger.info(f"Iniciando parsing de {len(issues)} issues para DataFrame de Espaço de Projetos")
    
    rows = []
    for index, issue in enumerate(issues):
        if index % 100 == 0:  # Log a cada 100 issues processadas
            logger.debug(f"Processando issue {index+1}/{len(issues)}")
            
        fields = issue.get("fields", {})
        
        if not fields:
            logger.warning(f"Issue {issue.get('key', 'N/A')} sem campos válidos")

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
            "Squads": [squad['value'] for squad in issue.get("fields", {}).get("customfield_10377", []) or []],

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

            # Datas por fase
            "Data: Início Backlog": issue.get("fields", {}).get("customfield_10345"),
            "Data: Fim Backlog": issue.get("fields", {}).get("customfield_10346"),
            "Data: Início Análise técnica e negócios": issue.get("fields", {}).get("customfield_10410"),
            "Data: Fim Análise técnica e negócios": issue.get("fields", {}).get("customfield_10411"),
            "Data: Início Backlog priorizado": issue.get("fields", {}).get("customfield_10347"),
            "Data: Fim Backlog priorizado": issue.get("fields", {}).get("customfield_10348"),
            "Data: Início Em andamento": issue.get("fields", {}).get("customfield_10349"),
            "Data: Fim Em andamento": issue.get("fields", {}).get("customfield_10350"),
            "Data: Início Em homologação": issue.get("fields", {}).get("customfield_10351"),
            "Data: Fim Em homologação": issue.get("fields", {}).get("customfield_10352"),
            "Data: Início Operação assistida": issue.get("fields", {}).get("customfield_10353"),
            "Data: Fim Operação assistida": issue.get("fields", {}).get("customfield_10354"),
            "Data: Início Concluído": issue.get("fields", {}).get("customfield_10355"),
            "Data: Fim Concluído": issue.get("fields", {}).get("customfield_10356"),
            "Data: Início Cancelado": issue.get("fields", {}).get("customfield_10357"),
            "Data: Fim Cancelado": issue.get("fields", {}).get("customfield_10358"),
            "Motivo para Cancelamento de Projeto": (
                issue.get("fields", {}).get("customfield_10412", {}).get("value")
                if issue.get("fields", {}).get("customfield_10412") else None
            ),
            "Data: Início Bloqueado": issue.get("fields", {}).get("customfield_10359"),
            "Data: Fim Bloqueado": issue.get("fields", {}).get("customfield_10360"),
            "Motivo para Bloqueio de Projeto": (
                issue.get("fields", {}).get("customfield_10344", {}).get("value")
                if issue.get("fields", {}).get("customfield_10344") else None
            )
        }
        rows.append(row)

    logger.debug(f"Criando DataFrame com {len(rows)} linhas")
    df = pd.DataFrame(rows)

    # Converter colunas de data/hora para o tipo datetime do Pandas e remover timezone
    logger.debug("Convertendo colunas de data/hora para datetime")
    date_cols = ["Data de criação", "Data de atualização", "Target start", "Target end", "Data de término", 
                 "Data: Início Backlog", "Data: Fim Backlog", 
                 "Data: Início Backlog priorizado", "Data: Fim Backlog priorizado", 
                 "Data: Início Análise técnica e negócios", "Data: Fim Análise técnica e negócios",
                 "Data: Início Em andamento", "Data: Fim Em andamento", 
                 "Data: Início Em homologação", "Data: Fim Em homologação", 
                 "Data: Início Operação assistida", "Data: Fim Operação assistida", 
                 "Data: Início Concluído", "Data: Fim Concluído", 
                 "Data: Início Cancelado", "Data: Fim Cancelado", 
                 "Data: Início Bloqueado", "Data: Fim Bloqueado"]
    
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.tz_localize(None)

    logger.debug("Aplicando enriquecimento específico do projeto")
    df = position_in_backlog(df)
    df = project_specific_columns(df)   
    
    logger.info(f"DataFrame de Espaço de Projetos criado com sucesso: {len(df)} issues, {len(df.columns)} colunas")
    return df

def prepare_dataframe_for_json_export(df: pd.DataFrame, numeric_or_object_cols_with_nan: list = None) -> pd.DataFrame:
    """
    Prepara um DataFrame, ajustando tipos de dados para exportação JSON.
    Converte datetime64[ns] para strings e NaN/NaT para None.
    Retorna uma CÓPIA do DataFrame para evitar modificações no original.
    """
    logger.info("Iniciando preparação do DataFrame para exportação JSON")
    df_adjusted = df.copy() # Trabalha em uma cópia para não alterar o DF original

    # 1. Converter colunas de data/hora (datetime64[ns]) para string formatada ou None
    datetime_cols = df_adjusted.select_dtypes(include=['datetime64[ns]']).columns
    logger.debug(f"Convertendo {len(datetime_cols)} colunas de datetime para string: {list(datetime_cols)}")
    
    for col in datetime_cols:
        df_adjusted[col] = df_adjusted[col].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S') if pd.notna(x) else None)

    # 2. Converter valores NaN/NaT/inf em colunas numéricas para None para JSON
    # Isso inclui as colunas de "dias" calculadas e quaisquer outras colunas numéricas
    # que possam ter vindo com NaN (ex: Estimativa original (segundos), Investimento Esperado)

    if numeric_or_object_cols_with_nan:
        logger.debug(f"Tratando valores NaN em {len(numeric_or_object_cols_with_nan)} colunas: {numeric_or_object_cols_with_nan}")
        
        for col in numeric_or_object_cols_with_nan:
            if col in df_adjusted.columns:
                # Substitui NaN (float), pd.NA (missing data), pd.NaT (missing datetime), inf por None
                # e converte a coluna para o tipo 'object' para permitir misturar números e None
                df_adjusted[col] = df_adjusted[col].replace({
                    pd.NA: None, 
                    pd.NaT: None, 
                    float('nan'): None,
                    float('inf'): None,
                    float('-inf'): None
                }).astype(object)
            else:
                logger.warning(f"Coluna '{col}' não encontrada no DataFrame para tratamento de NaN")
    else:
        logger.debug("Nenhuma coluna específica fornecida para tratamento de NaN")
    
    # 3. Tratar todas as colunas numéricas para valores infinitos e NaN
    numeric_cols = df_adjusted.select_dtypes(include=['number']).columns
    logger.debug(f"Tratando valores infinitos e NaN em {len(numeric_cols)} colunas numéricas")
    
    for col in numeric_cols:
        df_adjusted[col] = df_adjusted[col].replace({
            float('inf'): None,
            float('-inf'): None,
            float('nan'): None
        })
            
    logger.info("DataFrame preparado com sucesso para exportação JSON")
    return df_adjusted