# backend/services/project_analysis_utils.py
from datetime import date
import pandas as pd
import logging
import numpy as np

logger = logging.getLogger(__name__)
hoje = pd.Timestamp(date.today())

# Lista de feriados nacionais fixos (pode ser expandida ou parametrizada)
FERIADOS_FIXOS = [
    (1, 1),    # Confraternização Universal
    (4, 21),   # Tiradentes
    (5, 1),    # Dia do Trabalho
    (9, 7),    # Independência
    (10, 12),  # Nossa Senhora Aparecida
    (11, 2),   # Finados
    (11, 15),  # Proclamação da República
    (12, 25),  # Natal
]

def obter_feriados_ano(ano):
    """
    Retorna uma lista de datas de feriados nacionais para o ano informado.
    (Apenas feriados fixos, sem móveis como Carnaval, Páscoa, etc)
    """
    return [pd.Timestamp(year=ano, month=mes, day=dia) for mes, dia in FERIADOS_FIXOS]


def dias_uteis_entre_datas(inicio, fim, feriados=None):
    """
    Calcula o número de dias úteis entre duas datas, desconsiderando sábados, domingos e feriados.
    O cálculo é inclusivo do início e exclusivo do fim (igual ao padrão numpy.busday_count).
    """
    if pd.isnull(inicio) or pd.isnull(fim):
        return None
    if feriados is None:
        # Gera feriados para todos os anos entre inicio e fim
        anos = range(inicio.year, fim.year + 1)
        feriados = []
        for ano in anos:
            feriados.extend(obter_feriados_ano(ano))
    # Converter para string no formato 'YYYY-MM-DD' para numpy
    feriados_str = [d.strftime('%Y-%m-%d') for d in feriados]
    return np.busday_count(inicio.date(), fim.date(), holidays=feriados_str)

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
    logger.debug(f"testando maunalnte: {row.get('Data: Início Ideação')}")
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
    finais = ["entregue"]
    resultado = status.strip().lower() in finais
    logger.debug(f"Verificando se {status} é status final: {resultado}")
    return resultado

def classificar_prazo(row: pd.Series) -> str:
    logger.debug(f"--------------------------------")
    logger.debug(f"Classificando prazo do projeto: {row.get('Chave')}")
    target_end = row.get("Target end")
    logger.debug(f"Target end: {target_end}")

    # 1. Se existe data de finalização (preferencialmente Data de término, senão Data: Fim Entregue)
    data_entrega = row.get("Data: Fim Entregue")
    logger.debug(f"Data: Fim Entregue: {data_entrega}")
    if pd.notnull(data_entrega): # Se existe data de finalização
        if pd.isnull(target_end):
            logger.debug("Target end ausente")
            return None
        dias_uteis = dias_uteis_entre_datas(data_entrega, target_end)
        if dias_uteis >= 0:
            logger.debug(f"Projeto finalizado no prazo: {data_entrega} <= {target_end}")
            return "No prazo"
        else:
            logger.debug(f"Projeto finalizado atrasado: {data_entrega} > {target_end}")
            return "Atrasado"

    # 2. Se não existe data de finalização, faz a lógica normal
    if pd.isnull(target_end):
        logger.debug("Target end ausente")
        return None

    dias_restantes = dias_uteis_entre_datas(hoje, target_end)
    logger.debug(f"Dias úteis restantes: {dias_restantes}")

    if dias_restantes < 0:
        logger.debug(f"Dias restantes: {dias_restantes}, retornando atrasado")
        return "Atrasado"
    elif dias_restantes <= 2:
        logger.debug(f"Dias restantes: {dias_restantes}, retornando em risco")
        return "Em risco"
    logger.debug(f"Dias restantes: {dias_restantes}, retornando no prazo")
    logger.debug(f"--------------------------------")
    return "No prazo"


def calcular_status_fase_atual(row: pd.Series) -> str:
    """
    Calcula o status da fase atual do projeto baseado no status atual e nas datas de início/fim da fase.
    Só calcula para os status: "Em Desenvolvimento", "Em Homologação" e "Operação Assistida".
    Retorna: "No prazo", "Atrasado", "Em risco", "Em desenvolvimento", "Não iniciado", "Repriorizado" ou None
    """
    logger.debug(f"Calculando status da fase atual para projeto: {row.get('Chave')}")
    status = str(row.get("Status", "")).strip().capitalize()
    logger.debug(f"Status atual: {status}")
    
    status_validos = ["Em desenvolvimento", "Em homologação", "Operação assistida", "Análise técnica e negócios", "Backlog priorizado"]
    if status not in status_validos:
        logger.debug(f"Status '{status}' não está na lista de status válidos para cálculo de fase. Status válidos: {status_validos}")
        return None
    
    # Verificar se o projeto foi repropriado
    motivo_repriorizacao = row.get("Motivo de Repriorização")
    posicao_backlog = row.get("PosicaoBacklog")
    
    # Se tem motivo de repropriação e não é o primeiro no backlog, retorna "Repriorizado"
    if motivo_repriorizacao and posicao_backlog is not None and posicao_backlog != 1:
        logger.debug(f"Projeto {row.get('Chave')} foi repropriado - posição {posicao_backlog}, motivo: {motivo_repriorizacao}")
        return "Repriorizado"
    
    inicio = row.get(f"Data: Início {status}")
    fim_previsto = row.get(f"Data: Fim {status}")
    logger.debug(f"Data: Início {status}: {inicio}")
    logger.debug(f"Data: Fim previsto {status}: {fim_previsto}")
    
    if pd.isnull(inicio):
        logger.debug(f"Fase {status} não foi iniciada")
        return "Não iniciado"
    
    if pd.notnull(fim_previsto):
        logger.debug(f"Fase {status} tem data de fim prevista: {fim_previsto}")
        dias_restantes = dias_uteis_entre_datas(hoje, fim_previsto)
        logger.debug(f"Dias úteis restantes para fim previsto: {dias_restantes}")
        if dias_restantes < 0:
            logger.debug(f"Fase {status} está atrasada - hoje ({hoje}) > fim previsto ({fim_previsto})")
            return "Atrasado"
        elif dias_restantes <= 2:
            logger.debug(f"Fase {status} está em risco - faltam {dias_restantes} dias úteis")
            return "Em risco"
        else:
            logger.debug(f"Fase {status} está no prazo - faltam {dias_restantes} dias úteis")
            return "No prazo"
    
    if pd.notnull(inicio):
        dias_decorridos = dias_uteis_entre_datas(inicio, hoje)
        logger.debug(f"Dias úteis decorridos na fase {status}: {dias_decorridos}")
        logger.debug(f"Fase {status} em desenvolvimento há {dias_decorridos} dias úteis")
        return "Em desenvolvimento"
    
    logger.debug(f"Não foi possível calcular status para fase {status}")
    return None

def calcular_dias_uteis_fase(row: pd.Series, fase: str) -> dict:
    """
    Calcula os dias úteis para uma fase específica.
    Retorna um dicionário com: dias_decorridos, dias_restantes, total_dias, progresso
    """
    inicio = row.get(f"Data: Início {fase}")
    fim = row.get(f"Data: Fim {fase}")
    
    if pd.isnull(inicio):
        return {
            "dias_decorridos": None,
            "dias_restantes": None,
            "total_dias": None,
            "progresso": None
        }
    
    # Calcular dias decorridos (do início até hoje)
    dias_decorridos = dias_uteis_entre_datas(inicio, hoje)
    if dias_decorridos is None or dias_decorridos < 0:
        dias_decorridos = 0
    
    # Se tem data de fim prevista
    if pd.notnull(fim):
        total_dias = dias_uteis_entre_datas(inicio, fim)
        if total_dias and total_dias > 0:
            dias_restantes = dias_uteis_entre_datas(hoje, fim)
            if dias_restantes is None or dias_restantes < 0:
                dias_restantes = 0
            progresso = min((dias_decorridos / total_dias) * 100, 100)
        else:
            total_dias = None
            dias_restantes = None
            progresso = None
    else:
        total_dias = None
        dias_restantes = None
        progresso = None
    
    return {
        "dias_decorridos": dias_decorridos,
        "dias_restantes": dias_restantes,
        "total_dias": total_dias,
        "progresso": progresso
    }


def calcular_todos_dias_uteis(row: pd.Series) -> dict:
    """
    Calcula todos os campos de dias úteis para todas as fases do projeto.
    """
    fases = [
        "Ideação",
        "Análise técnica e negócios", 
        "Backlog priorizado",
        "Em desenvolvimento",
        "Em homologação",
        "Operação assistida"
    ]
    
    resultado = {}
    
    for fase in fases:
        dados_fase = calcular_dias_uteis_fase(row, fase)
        resultado[f"Dias úteis decorridos {fase}"] = dados_fase["dias_decorridos"]
        resultado[f"Dias úteis restantes {fase}"] = dados_fase["dias_restantes"]
        resultado[f"Total dias úteis {fase}"] = dados_fase["total_dias"]
        resultado[f"Progresso {fase}"] = dados_fase["progresso"]
    
    return resultado
