import pandas as pd
import logging
from datetime import date

logger = logging.getLogger(__name__)

def is_final_status(status: str) -> bool:
    """
    Verifica se o status indica que o projeto já foi finalizado ou cancelado.
    """
    final_statuses = ["operação assistida", "concluído", "cancelado"]
    resultado = status.strip().lower() in final_statuses
    logger.debug(f"[is_final_status] Status '{status}' considerado finalizado? {resultado}")
    return resultado

def get_final_reference_date(row: pd.Series) -> date:
    """
    Retorna a melhor data disponível para um projeto finalizado.
    """
    chave = row.get("Chave", "N/D")
    if pd.notnull(row.get("Data de término")):
        logger.debug(f"[get_final_reference_date] ({chave}) Usando 'Data de término': {row['Data de término']}")
        return row["Data de término"].date()
    elif pd.notnull(row.get("Data de atualização")):
        logger.debug(f"[get_final_reference_date] ({chave}) Sem 'Data de término'. Usando 'Data de atualização': {row['Data de atualização']}")
        return row["Data de atualização"].date()
    else:
        logger.warning(f"[get_final_reference_date] ({chave}) Sem data de término nem atualização. Usando hoje.")
        return date.today()

def get_reference_date(row: pd.Series) -> date:
    """
    Determina qual data usar como referência para cálculo de tempo.
    """
    status = str(row.get("Status", "")).strip().lower()
    chave = row.get("Chave", "N/D")
    if is_final_status(status):
        logger.info(f"[get_reference_date] ({chave}) Status '{status}' finalizado. Buscando data final.")
        return get_final_reference_date(row)
    logger.debug(f"[get_reference_date] ({chave}) Status '{status}' em andamento. Usando hoje.")
    return date.today()

def classificar_status_ideacao(dias: int) -> str:
    """
    Classifica o tempo de ideação com base nos dias desde a criação.
    """
    if dias is None:
        return None
    if dias <= 90:
        status = "Recente"
    elif dias <= 180:
        status = "Rever"
    elif dias <= 365:
        status = "Quase obsoleto"
    else:
        status = "Obsoleto"
    logger.debug(f"[classificar_status_ideacao] Dias desde criação: {dias} => {status}")
    return status

def calcular_pct_tempo(row: pd.Series) -> float:
    """
    Calcula a porcentagem do tempo planejado que já passou.
    """
    total = row.get("Dias planejados")
    decorrido = row.get("Dias desde o início")
    chave = row.get("Chave", "N/D")

    if total and decorrido is not None and total > 0:
        pct = round((decorrido / total) * 100, 1)
        logger.debug(f"[calcular_pct_tempo] ({chave}) {decorrido}/{total} dias => {pct}%")
        return pct
    logger.warning(f"[calcular_pct_tempo] ({chave}) Dados insuficientes: planejado={total}, decorrido={decorrido}")
    return None

def classificar_status_prazo(row: pd.Series, hoje: date) -> str:
    """
    Classifica se o projeto está 'No prazo', 'Em risco' ou 'Fora do prazo'.
    """
    target_start = row.get("Target start")
    target_end = row.get("Target end")
    pct = row.get("% do tempo decorrido", 0)
    status = str(row.get("Status", "")).strip().lower()
    chave = row.get("Chave", "N/D")

    if pd.isnull(target_start) or pd.isnull(target_end):
        logger.warning(f"[classificar_status_prazo] ({chave}) Datas alvo ausentes.")
        return None

    if pct > 100:
        logger.info(f"[classificar_status_prazo] ({chave}) {pct}% => Fora do prazo")
        return "Fora do prazo"

    dias_restantes = (target_end - pd.Timestamp(hoje)).days

    if not is_final_status(status) and dias_restantes <= 2:
        logger.info(f"[classificar_status_prazo] ({chave}) {dias_restantes} dias restantes => Em risco")
        return "Em risco"

    logger.debug(f"[classificar_status_prazo] ({chave}) {dias_restantes} dias restantes => No prazo")
    return "No prazo"


def calcular_pct_estimativa(row: pd.Series) -> float:
    """
    Calcula a porcentagem do esforço consumido comparado à estimativa.
    """
    tempo = row.get("Tempo registrado (segundos)")
    estimativa = row.get("Estimativa original (segundos)")
    chave = row.get("Chave", "N/D")

    if tempo and estimativa and estimativa > 0:
        pct = round((tempo / estimativa) * 100, 1)
        logger.debug(f"[calcular_pct_estimativa] ({chave}) {tempo}/{estimativa} seg => {pct}%")
        return pct
    logger.warning(f"[calcular_pct_estimativa] ({chave}) Dados insuficientes: tempo={tempo}, estimativa={estimativa}")
    return None

def classificar_status_esforco(pct: float) -> str:
    """
    Classifica o status de esforço com base no percentual da estimativa usada.
    """
    if pct is None:
        return None
    if pct <= 75:
        status = "Dentro do estimado"
    elif pct <= 99:
        status = "Próximo do limite"
    elif pct == 100:
        status = "Dentro do estimado"
    else:
        status = "Estourou a estimativa"

    logger.debug(f"[classificar_status_esforco] % estimativa usada = {pct}% => {status}")
    return status
