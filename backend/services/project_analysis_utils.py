# backend/services/project_analysis_utils.py
from datetime import date
import pandas as pd
import logging

logger = logging.getLogger(__name__)
hoje = pd.Timestamp(date.today())

def calcular_tempo_por_fase(row: pd.Series, fase: str) -> int:
    inicio = row.get(f"Data: Início {fase}")
    fim = row.get(f"Data: Fim {fase}")
    if pd.notnull(inicio) and pd.notnull(fim):
        try:
            dias = (fim - inicio).days
            # Verificar se o resultado é infinito ou NaN
            if pd.isna(dias) or dias == float('inf') or dias == float('-inf'):
                return None
            return dias
        except Exception:
            return None
    return None

def calcular_dias_na_fase_atual(row: pd.Series) -> int:
    status = str(row.get("Status", "")).strip().capitalize()
    inicio = row.get(f"Data: Início {status}")
    fim = row.get(f"Data: Fim {status}")
    if pd.isnull(inicio):
        return None
    fim_efetivo = fim if pd.notnull(fim) else hoje
    try:
        dias = (fim_efetivo - inicio).days
        # Verificar se o resultado é infinito ou NaN
        if pd.isna(dias) or dias == float('inf') or dias == float('-inf'):
            return None
        return dias
    except Exception:
        return None

def classificar_status_ideacao(dias: int) -> str:
    if dias is None:
        return None
    if dias <= 90:
        return "Recente"
    elif dias <= 180:
        return "Rever"
    elif dias <= 365:
        return "Quase obsoleto"
    return "Obsoleto"

def is_final_status(status: str) -> bool:
    finais = ["concluído", "cancelado", "operação assistida"]
    return status.strip().lower() in finais

def classificar_prazo(row: pd.Series) -> str:
    target_end = row.get("Target end")
    dias_fase = row.get("Dias na fase atual")
    status = str(row.get("Status", "")).strip().lower()
    if is_final_status(status):
        return "Concluído"
    if pd.isnull(target_end) or dias_fase is None:
        return None
    dias_restantes = (target_end - hoje).days
    if dias_restantes < 0:
        return "Fora do prazo"
    elif dias_restantes <= 2:
        return "Em risco"
    return "No prazo"

def verificar_inicio_atrasado(row: pd.Series) -> str:
    target_start = row.get("Target start")
    inicio_real = row.get("Data: Início Ideação")
    if pd.notnull(target_start) and pd.notnull(inicio_real):
        return "Sim" if inicio_real > target_start else "Não"
    return None

def verificar_conclusao_atrasada(row: pd.Series, fases: list) -> str:
    target_end = row.get("Target end")
    for fase in reversed(fases):
        fim = row.get(f"Data: Fim {fase}")
        if pd.notnull(fim) and pd.notnull(target_end):
            return "Sim" if fim > target_end else "Não"
    return None

def verificar_risco_atual(row: pd.Series) -> str:
    target_end = row.get("Target end")
    status = str(row.get("Status", "")).strip().lower()
    if pd.isnull(target_end):
        return None
    dias_restantes = (target_end - hoje).days
    fases_iniciais = ["ideação", "backlog priorizado", "em desenvolvimento"]
    if status in fases_iniciais and (dias_restantes <= 2 or hoje > target_end):
        return "Sim"
    return "Não"
