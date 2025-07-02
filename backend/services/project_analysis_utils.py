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
    logger.debug(f"Classificando prazo do projeto: {row.get('key')}")
    target_end = row.get("Target end")
    logger.debug(f"Target end: {target_end}")

    # 1. Se existe data de finalização (preferencialmente Data de término, senão Data: Fim Em andamento)
    data_finalizacao = row.get("Data: Fim Em andamento")
    logger.debug(f"Data: Fim Em andamento: {data_finalizacao}")
    if pd.notnull(data_finalizacao):
        if pd.isnull(target_end):
            logger.debug("Target end ausente")
            return None
        if data_finalizacao <= target_end:
            logger.debug(f"Projeto finalizado no prazo: {data_finalizacao} <= {target_end}")
            return "No prazo"
        else:
            logger.debug(f"Projeto finalizado fora do prazo: {data_finalizacao} > {target_end}")
            return "Fora do prazo"

    # 2. Se não existe data de finalização, faz a lógica normal
    if pd.isnull(target_end):
        logger.debug("Target end ausente")
        return None

    dias_restantes = (target_end - hoje).days
    logger.debug(f"Dias restantes: {dias_restantes}")

    if dias_restantes < 0:
        return "Fora do prazo"
    elif dias_restantes <= 2:
        return "Em risco"
    return "No prazo"

def verificar_inicio_atrasado(row: pd.Series) -> str:
    logger.debug("Verificando início atrasado")
    target_start = row.get("Target start")
    inicio_real = row.get("Data: Início Ideação")
    if pd.notnull(target_start) and pd.notnull(inicio_real):
        atrasado = "Sim" if inicio_real > target_start else "Não"
        logger.debug(f"Início atrasado: {atrasado}")
        return atrasado
    logger.debug("Datas ausentes para verificar atraso")
    return None

def verificar_conclusao_atrasada(row: pd.Series, fases: list) -> str:
    logger.debug("Verificando conclusão atrasada")
    target_end = row.get("Target end")
    for fase in reversed(fases):
        fim = row.get(f"Data: Fim {fase}")
        if pd.notnull(fim) and pd.notnull(target_end):
            atrasado = "Sim" if fim > target_end else "Não"
            logger.debug(f"Conclusão atrasada para fase {fase}: {atrasado}")
            return atrasado
    logger.debug("Não foi possível determinar atraso na conclusão")
    return None

def verificar_risco_atual(row: pd.Series) -> str:
    logger.debug("Verificando risco atual")
    target_end = row.get("Target end")
    status = str(row.get("Status", "")).strip().lower()
    if pd.isnull(target_end):
        logger.debug("Target end ausente")
        return None
    dias_restantes = (target_end - hoje).days
    logger.debug(f"Dias restantes: {dias_restantes}")
    fases_iniciais = ["ideação", "backlog priorizado", "em desenvolvimento"]
    if status in fases_iniciais and (dias_restantes <= 2 or hoje > target_end):
        logger.debug("Risco identificado")
        return "Sim"
    logger.debug("Sem risco identificado")
    return "Não"
