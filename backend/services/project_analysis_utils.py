# backend/services/project_analysis_utils.py
from datetime import date
import pandas as pd
import logging

logger = logging.getLogger(__name__)
hoje = pd.Timestamp(date.today())

def calcular_tempo_por_fase(row: pd.Series, fase: str) -> int:
    logger.debug(f"Calculando tempo para fase: {fase}")
    logger.debug(f"Data: Início {fase}: {row.get(f'Data: Início {fase}')}")
    logger.debug(f"Data: Fim {fase}: {row.get(f'Data: Fim {fase}')}")
    logger.debug(f"Data de hoje: {hoje.date()}")
    inicio = row.get(f"Data: Início {fase}")
    fim = row.get(f"Data: Fim {fase}")

    if pd.notnull(inicio):
        if pd.notnull(fim):
            fim_efetivo = fim
        else:
            fim_efetivo = hoje
            logger.debug(f"Data de fim não disponível para fase '{fase}'. Usando data atual: {hoje.date()}")

        try:
            dias = (fim_efetivo - inicio).days
            if pd.isna(dias) or dias == float('inf') or dias == float('-inf'):
                logger.debug(f"Valor inválido para fase {fase}: {dias}")
                return None
            logger.debug(f"Tempo na fase {fase}: {dias} dias")
            return dias
        except Exception as e:
            logger.error(f"Erro ao calcular tempo para fase {fase}: {str(e)}")
            return None

    logger.debug(f"Data de início ausente para fase {fase}")
    return None

def calcular_dias_na_fase_atual(row: pd.Series) -> int:
    logger.debug(f"testando maunalnte: {row.get('Data: Início Backlog')}")
    status = str(row.get("Status", "")).strip().capitalize()
    logger.debug(f"Calculando dias na fase atual: {status}")
    logger.debug(f"Data: Início {status}: {row.get(f'Data: Início {status}')}")
    logger.debug(f"Data: Fim {status}: {row.get(f'Data: Fim {status}')}")
    inicio = row.get(f"Data: Início {status}")
    fim = row.get(f"Data: Fim {status}")
    logger.debug(f"Data de início: {inicio}")
    logger.debug(f"Data de fim: {fim}")
    if pd.isnull(inicio):
        logger.debug(f"Data de início ausente para status {status}")
        return None
    fim_efetivo = fim if pd.notnull(fim) else hoje
    try:
        dias = (fim_efetivo - inicio).days
        # Verificar se o resultado é infinito ou NaN
        if pd.isna(dias) or dias == float('inf') or dias == float('-inf'):
            logger.debug(f"Valor inválido encontrado para dias na fase {status}: {dias}")
            return None
        logger.debug(f"Dias calculados na fase {status}: {dias}")
        return dias
    except Exception as e:
        logger.error(f"Erro ao calcular dias na fase {status}: {str(e)}")
        return None

def classificar_status_ideacao(dias: int) -> str:
    logger.debug(f"Classificando status de ideação para {dias} dias")
    if dias is None:
        logger.debug("Dias é None, retornando None")
        return None
    if dias <= 90:
        return "Recente"
    elif dias <= 180:
        return "Rever"
    elif dias <= 365:
        return "Quase obsoleto"
    return "Obsoleto"

def is_final_status(status: str) -> bool:
    finais = ["concluído"]
    resultado = status.strip().lower() in finais
    logger.debug(f"Verificando se {status} é status final: {resultado}")
    return resultado

def classificar_prazo(row: pd.Series) -> str:
    logger.debug(f"--------------------------------")
    logger.debug(f"Classificando prazo do projeto: {row.get('Chave')}")
    target_end = row.get("Target end")
    logger.debug(f"Target end: {target_end}")

    # 1. Se existe data de finalização (preferencialmente Data de término, senão Data: Fim Concluído)
    data_entrega = row.get("Data: Fim Concluído")
    logger.debug(f"Data: Fim Concluído: {data_entrega}")
    if pd.notnull(data_entrega): # Se existe data de finalização
        if pd.isnull(target_end):
            logger.debug("Target end ausente")
            return None
        if data_entrega <= target_end:
            logger.debug(f"Projeto finalizado no prazo: {data_entrega} <= {target_end}")
            return "No prazo"
        else:
            logger.debug(f"Projeto finalizado atrasado: {data_entrega} > {target_end}")
            return "Atrasado"

    # 2. Se não existe data de finalização, faz a lógica normal
    if pd.isnull(target_end):
        logger.debug("Target end ausente")
        return None

    dias_restantes = (target_end - hoje).days
    logger.debug(f"Dias restantes: {dias_restantes}")

    if dias_restantes < 0:
        logger.debug(f"Dias restantes: {dias_restantes}, retornando atrasado")
        return "Atrasado"
    
    elif dias_restantes <= 2:
        logger.debug(f"Dias restantes: {dias_restantes}, retornando em risco")
        return "Em risco"
    
    logger.debug(f"Dias restantes: {dias_restantes}, retornando no prazo")
    logger.debug(f"--------------------------------")
    return "No prazo"

def verificar_risco_atual(row: pd.Series) -> str:
    logger.debug("Verificando risco atual")
    target_end = row.get("Target end")
    status = str(row.get("Status", "")).strip().lower()
    if pd.isnull(target_end):
        logger.debug("Target end ausente")
        return None
    dias_restantes = (target_end - hoje).days
    logger.debug(f"Dias restantes: {dias_restantes}")
    fases_iniciais = ["ideação", "backlog priorizado", "análise técnica e negócios", "em desenvolvimento"]
    if status in fases_iniciais and (dias_restantes <= 2 or hoje > target_end):
        logger.debug("Risco identificado")
        return "Sim"
    logger.debug("Sem risco identificado")
    return "Não"

def calcular_status_fase_atual(row: pd.Series) -> str:
    """
    Calcula o status da fase atual do projeto baseado no status atual e nas datas de início/fim da fase.
    Só calcula para os status: "Em Desenvolvimento", "Em Homologação" e "Operação Assistida".
    Retorna: "No prazo", "Atrasado", "Em risco", "Em andamento", "Não iniciado" ou None
    
    Lógica:
    - Data: Fim = Data prevista de fim (quando pretendo terminar)
    - Se hoje > Data: Fim = Está atrasado (passou da previsão)
    - Se hoje <= Data: Fim = Está no prazo (ainda não passou da previsão)
    - Se faltam <= 2 dias = Em risco (próximo do prazo)
    - Se não tem Data: Fim = Em andamento (apenas conta dias corridos)
    """
    logger.debug(f"Calculando status da fase atual para projeto: {row.get('Chave')}")
    status = str(row.get("Status", "")).strip().capitalize()
    logger.debug(f"Status atual: {status}")
    
    # Lista de status para os quais calcular o status da fase
    # Usando os nomes após capitalização (.capitalize())
    status_validos = ["Em andamento", "Em homologação", "Operação assistida", "Análise técnica e negócios"]
    
    # Se o status atual não está na lista de status válidos, retorna None
    if status not in status_validos:
        logger.debug(f"Status '{status}' não está na lista de status válidos para cálculo de fase. Status válidos: {status_validos}")
        return None
    
    # Obter datas da fase atual
    inicio = row.get(f"Data: Início {status}")
    fim_previsto = row.get(f"Data: Fim {status}")
    
    logger.debug(f"Data: Início {status}: {inicio}")
    logger.debug(f"Data: Fim previsto {status}: {fim_previsto}")
    
    # Se não tem data de início, não foi iniciado
    if pd.isnull(inicio):
        logger.debug(f"Fase {status} não foi iniciada")
        return "Não iniciado"
    
    # Se tem data de fim prevista, verificar se passou da previsão
    if pd.notnull(fim_previsto):
        logger.debug(f"Fase {status} tem data de fim prevista: {fim_previsto}")
        
        # Se hoje passou da data prevista, está atrasado
        if hoje > fim_previsto:
            logger.debug(f"Fase {status} está atrasada - hoje ({hoje}) > fim previsto ({fim_previsto})")
            return "Atrasado"
        else:
            # Calcular quantos dias faltam para o prazo
            dias_restantes = (fim_previsto - hoje).days
            logger.debug(f"Dias restantes para fim previsto: {dias_restantes}")
            
            if dias_restantes <= 2:
                logger.debug(f"Fase {status} está em risco - faltam {dias_restantes} dias")
                return "Em risco"
            else:
                logger.debug(f"Fase {status} está no prazo - faltam {dias_restantes} dias")
                return "No prazo"
    
    # Se não tem data de fim prevista, apenas contar dias corridos
    if pd.notnull(inicio):
        # Calcular dias decorridos na fase atual
        dias_decorridos = (hoje - inicio).days
        logger.debug(f"Dias decorridos na fase {status}: {dias_decorridos}")
        
        # Sem data de fim prevista, não é possível determinar se está atrasado
        # Apenas retorna "Em andamento" para indicar que está sendo executado
        logger.debug(f"Fase {status} em andamento há {dias_decorridos} dias")
        return "Em andamento"
    
    logger.debug(f"Não foi possível calcular status para fase {status}")
    return None
