import pandas as pd
import numpy as np
from datetime import date
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class Projeto:
    """Representa um projeto do Espaço de Projetos com todos seus campos."""
    
    # Identificação básica
    chave: str
    titulo: str
    prioridade: str
    status: str
    
    # Solicitante e organização
    grupo_solicitante: Optional[str] = None
    departamento_solicitante: Optional[str] = None
    solicitante: Optional[str] = None
    
    # Responsáveis
    responsavel_atual: Optional[str] = None
    squads: Optional[List[str]] = None  # Campo de múltipla escolha
    
    # Datas importantes
    target_start: Optional[pd.Timestamp] = None
    target_end: Optional[pd.Timestamp] = None
    
    # Datas por fase
    data_inicio_ideacao: Optional[pd.Timestamp] = None
    data_fim_ideacao: Optional[pd.Timestamp] = None
    data_inicio_backlog_priorizado: Optional[pd.Timestamp] = None
    data_fim_backlog_priorizado: Optional[pd.Timestamp] = None
    data_inicio_analise_tecnica: Optional[pd.Timestamp] = None  # Nova fase
    data_fim_analise_tecnica: Optional[pd.Timestamp] = None  # Nova fase
    data_inicio_em_desenvolvimento: Optional[pd.Timestamp] = None
    data_fim_em_desenvolvimento: Optional[pd.Timestamp] = None
    data_inicio_em_homologacao: Optional[pd.Timestamp] = None
    data_fim_em_homologacao: Optional[pd.Timestamp] = None
    data_inicio_operacao_assistida: Optional[pd.Timestamp] = None
    data_fim_operacao_assistida: Optional[pd.Timestamp] = None
    data_inicio_entregue: Optional[pd.Timestamp] = None
    data_fim_entregue: Optional[pd.Timestamp] = None
    data_inicio_cancelado: Optional[pd.Timestamp] = None
    data_fim_cancelado: Optional[pd.Timestamp] = None
    data_inicio_bloqueado: Optional[pd.Timestamp] = None
    data_fim_bloqueado: Optional[pd.Timestamp] = None
    
    # Campos adicionais
    motivo_bloqueio: Optional[str] = None
    motivo_cancelamento: Optional[str] = None  # Novo campo
    motivo_repriorizacao: Optional[str] = None  # Novo campo
    posicao_backlog: Optional[int] = None
    
    # Campos calculados
    status_ideacao: Optional[str] = None
    status_prazo: Optional[str] = None
    
    # Tempos por fase
    tempo_fase_ideacao_dias: Optional[int] = None
    tempo_fase_backlog_priorizado_dias: Optional[int] = None
    tempo_fase_analise_tecnica_dias: Optional[int] = None  # Nova fase
    tempo_fase_em_desenvolvimento_dias: Optional[int] = None
    tempo_fase_em_homologacao_dias: Optional[int] = None
    tempo_fase_operacao_assistida_dias: Optional[int] = None
    tempo_fase_bloqueado_dias: Optional[int] = None
    tempo_fase_entregue_dias: Optional[int] = None
    tempo_fase_cancelado_dias: Optional[int] = None
    
    # Novos campos de dias úteis
    dias_uteis_decorridos_ideacao: Optional[int] = None
    dias_uteis_restantes_ideacao: Optional[int] = None
    total_dias_uteis_ideacao: Optional[int] = None
    progresso_ideacao: Optional[float] = None
    
    dias_uteis_decorridos_analise_tecnica: Optional[int] = None
    dias_uteis_restantes_analise_tecnica: Optional[int] = None
    total_dias_uteis_analise_tecnica: Optional[int] = None
    progresso_analise_tecnica: Optional[float] = None
    
    dias_uteis_decorridos_backlog_priorizado: Optional[int] = None
    dias_uteis_restantes_backlog_priorizado: Optional[int] = None
    total_dias_uteis_backlog_priorizado: Optional[int] = None
    progresso_backlog_priorizado: Optional[float] = None
    
    dias_uteis_decorridos_em_desenvolvimento: Optional[int] = None
    dias_uteis_restantes_em_desenvolvimento: Optional[int] = None
    total_dias_uteis_em_desenvolvimento: Optional[int] = None
    progresso_em_desenvolvimento: Optional[float] = None
    
    dias_uteis_decorridos_em_homologacao: Optional[int] = None
    dias_uteis_restantes_em_homologacao: Optional[int] = None
    total_dias_uteis_em_homologacao: Optional[int] = None
    progresso_em_homologacao: Optional[float] = None
    
    dias_uteis_decorridos_operacao_assistida: Optional[int] = None
    dias_uteis_restantes_operacao_assistida: Optional[int] = None
    total_dias_uteis_operacao_assistida: Optional[int] = None
    progresso_operacao_assistida: Optional[float] = None


class ProjetoParser:
    """Responsável por converter dados do Jira em objetos Projeto."""
    
    @staticmethod
    def extrair_texto_rich(field) -> Optional[str]:
        """Extrai texto de campos rich text do Jira."""
        if not field:
            return None
        try:
            return field.get("content", [{}])[0].get("content", [{}])[0].get("text")
        except (IndexError, KeyError, TypeError):
            return None
    
    @staticmethod
    def converter_data(data_str: Optional[str]) -> Optional[pd.Timestamp]:
        """Converte string de data para Timestamp."""
        if not data_str:
            return None
        try:
            return pd.to_datetime(data_str, errors="coerce").tz_localize(None)
        except Exception:
            return None

    @staticmethod
    def extrair_valor_campo(field, default=None):
        """Extrai valor de campo que pode ser None ou dict."""
        if field is None:
            return default
        if isinstance(field, dict):
            return field.get("value", default)
        return field
    
    def parse_issue(self, issue: Dict[str, Any]) -> Projeto:
        """Converte uma issue do Jira em objeto Projeto."""
        fields = issue.get("fields", {})
        
        return Projeto(
            # Identificação básica
            chave=issue.get("key"),
            titulo=fields.get("summary"),
            prioridade=fields.get("priority", {}).get("name"),
            status=fields.get("status", {}).get("name"),
            
            # Solicitante e organização
            grupo_solicitante=self.extrair_valor_campo(fields.get("customfield_10083")),
            departamento_solicitante=self.extrair_valor_campo(fields.get("customfield_10245")),
            solicitante=self.extrair_texto_rich(fields.get("customfield_10093")),
            
            # Responsáveis
            responsavel_atual=self.extrair_valor_campo(fields.get("customfield_10413")),
            squads=[squad['value'] for squad in fields.get("customfield_10377", []) or []],
            
            # Datas importantes
            target_start=self.converter_data(fields.get("customfield_10022")),
            target_end=self.converter_data(fields.get("customfield_10023")),
            
            # Datas por fase
            data_inicio_ideacao=self.converter_data(fields.get("customfield_10345")),
            data_fim_ideacao=self.converter_data(fields.get("customfield_10346")),

            data_inicio_backlog_priorizado=self.converter_data(fields.get("customfield_10347")),
            data_fim_backlog_priorizado=self.converter_data(fields.get("customfield_10348")),

            data_inicio_analise_tecnica=self.converter_data(fields.get("customfield_10410")),
            data_fim_analise_tecnica=self.converter_data(fields.get("customfield_10411")),

            data_inicio_em_desenvolvimento=self.converter_data(fields.get("customfield_10349")),
            data_fim_em_desenvolvimento=self.converter_data(fields.get("customfield_10350")),

            data_inicio_em_homologacao=self.converter_data(fields.get("customfield_10351")),
            data_fim_em_homologacao=self.converter_data(fields.get("customfield_10352")),

            data_inicio_operacao_assistida=self.converter_data(fields.get("customfield_10353")),
            data_fim_operacao_assistida=self.converter_data(fields.get("customfield_10354")),

            data_inicio_entregue=self.converter_data(fields.get("customfield_10355")),
            data_fim_entregue=self.converter_data(fields.get("customfield_10356")),

            data_inicio_cancelado=self.converter_data(fields.get("customfield_10357")),
            data_fim_cancelado=self.converter_data(fields.get("customfield_10358")),
            motivo_cancelamento=self.extrair_valor_campo(fields.get("customfield_10412")),

            data_inicio_bloqueado=self.converter_data(fields.get("customfield_10359")),
            data_fim_bloqueado=self.converter_data(fields.get("customfield_10360")),
            motivo_bloqueio=self.extrair_valor_campo(fields.get("customfield_10344")),
            
            # Campos adicionais
            motivo_repriorizacao=self.extrair_valor_campo(fields.get("customfield_10542"))
        )


class ProjetoAnalisador:
    """Responsável por analisar e calcular métricas dos projetos."""
    
    def __init__(self):
        self.hoje = pd.Timestamp(date.today())
        
        # Lista de feriados nacionais fixos
        self.FERIADOS_FIXOS = [
            (1, 1),    # Confraternização Universal
            (4, 21),   # Tiradentes
            (5, 1),    # Dia do Trabalho
            (9, 7),    # Independência
            (10, 12),  # Nossa Senhora Aparecida
            (11, 2),   # Finados
            (11, 15),  # Proclamação da República
            (12, 25),  # Natal
        ]
    
    def analisar_projeto(self, projeto: Projeto) -> Projeto:
        """Aplica todas as análises em um projeto."""
        projeto = self._calcular_tempos_por_fase(projeto)
        projeto = self._classificar_status_ideacao(projeto)
        projeto = self._classificar_prazo(projeto)
        projeto = self._calcular_posicao_backlog(projeto)
        projeto = self._calcular_todos_dias_uteis(projeto)
        return projeto
    
    def _calcular_tempos_por_fase(self, projeto: Projeto) -> Projeto:
        """Calcula tempos em dias para cada fase."""
        mapeamento_fases = {
            "ideacao": ("data_inicio_ideacao", "data_fim_ideacao", "tempo_fase_ideacao_dias"),
            "backlog_priorizado": ("data_inicio_backlog_priorizado", "data_fim_backlog_priorizado", "tempo_fase_backlog_priorizado_dias"),
            "analise_tecnica_e_negocios": ("data_inicio_analise_tecnica", "data_fim_analise_tecnica", "tempo_fase_analise_tecnica_dias"),
            "em_desenvolvimento": ("data_inicio_em_desenvolvimento", "data_fim_em_desenvolvimento", "tempo_fase_em_desenvolvimento_dias"),
            "em_homologacao": ("data_inicio_em_homologacao", "data_fim_em_homologacao", "tempo_fase_em_homologacao_dias"),
            "operacao_assistida": ("data_inicio_operacao_assistida", "data_fim_operacao_assistida", "tempo_fase_operacao_assistida_dias"),
            "bloqueado": ("data_inicio_bloqueado", "data_fim_bloqueado", "tempo_fase_bloqueado_dias"),
            "entregue": ("data_inicio_entregue", "data_fim_entregue", "tempo_fase_entregue_dias"),
            "cancelado": ("data_inicio_cancelado", "data_fim_cancelado", "tempo_fase_cancelado_dias")
        }
        
        for fase, (inicio_attr, fim_attr, tempo_attr) in mapeamento_fases.items():
            inicio = getattr(projeto, inicio_attr)
            fim = getattr(projeto, fim_attr)
            
            if inicio is not None:
                fim_efetivo = fim if fim is not None else self.hoje
                try:
                    dias = (fim_efetivo - inicio).days
                    if not pd.isna(dias) and dias != float('inf'):
                        setattr(projeto, tempo_attr, dias)
                except Exception:
                    setattr(projeto, tempo_attr, None)
        
        return projeto
    

    
    def _classificar_status_ideacao(self, projeto: Projeto) -> Projeto:
        """Classifica status de ideação baseado nos dias."""
        # Calcular dias na fase de ideação para classificação
        if projeto.data_inicio_ideacao is None:
            projeto.status_ideacao = None
        else:
            fim_efetivo = projeto.data_fim_ideacao if projeto.data_fim_ideacao is not None else self.hoje
            try:
                dias = (fim_efetivo - projeto.data_inicio_ideacao).days
                if pd.isna(dias) or dias == float('inf'):
                    projeto.status_ideacao = None
                elif dias <= 90:
                    projeto.status_ideacao = "Recente"
                elif dias <= 180:
                    projeto.status_ideacao = "Rever"
                elif dias <= 365:
                    projeto.status_ideacao = "Quase obsoleto"
                else:
                    projeto.status_ideacao = "Obsoleto"
            except Exception:
                projeto.status_ideacao = None
        
        return projeto
    
    def _classificar_prazo(self, projeto: Projeto) -> Projeto:
        """Classifica prazo do projeto."""
        if projeto.data_fim_em_desenvolvimento is not None:
            if projeto.target_end is None:
                projeto.status_prazo = None
            else:
                projeto.status_prazo = "No prazo" if projeto.data_fim_em_desenvolvimento <= projeto.target_end else "Atrasado"
        elif projeto.target_end is None:
            projeto.status_prazo = None
        else:
            dias_restantes = (projeto.target_end - self.hoje).days
            if dias_restantes < 0:
                projeto.status_prazo = "Atrasado"
            elif dias_restantes <= 2:
                projeto.status_prazo = "Em risco"
            else:
                projeto.status_prazo = "No prazo"
        
        return projeto
    

    
    def _calcular_posicao_backlog(self, projeto: Projeto) -> Projeto:
        """Calcula posição no backlog."""
        # A posição será calculada posteriormente por responsável
        projeto.posicao_backlog = None
        return projeto
    
    def _obter_feriados_ano(self, ano):
        """Retorna uma lista de datas de feriados nacionais para o ano informado."""
        return [pd.Timestamp(year=ano, month=mes, day=dia) for mes, dia in self.FERIADOS_FIXOS]
    
    def _dias_uteis_entre_datas(self, inicio, fim, feriados=None):
        """Calcula o número de dias úteis entre duas datas, desconsiderando sábados, domingos e feriados."""
        if pd.isnull(inicio) or pd.isnull(fim):
            return None
        if feriados is None:
            # Gera feriados para todos os anos entre inicio e fim
            feriados = []
            for ano in range(inicio.year, fim.year + 1):
                feriados.extend(self._obter_feriados_ano(ano))
        # Converter para string no formato 'YYYY-MM-DD' para numpy
        feriados_str = [d.strftime('%Y-%m-%d') for d in feriados]
        return np.busday_count(inicio.date(), fim.date(), holidays=feriados_str)
    

    
    def _calcular_dias_uteis_fase(self, projeto: Projeto, fase: str) -> dict:
        """Calcula os dias úteis para uma fase específica."""
        inicio_attr = f"data_inicio_{fase}"
        fim_attr = f"data_fim_{fase}"
        
        inicio = getattr(projeto, inicio_attr, None)
        fim = getattr(projeto, fim_attr, None)
        
        if inicio is None:
            return {
                "dias_decorridos": None,
                "dias_restantes": None,
                "total_dias": None,
                "progresso": None
            }
        
        # Calcular dias decorridos (do início até hoje)
        dias_decorridos = self._dias_uteis_entre_datas(inicio, self.hoje)
        if dias_decorridos is None or dias_decorridos < 0:
            dias_decorridos = 0
        
        # Se tem data de fim prevista
        if fim is not None:
            total_dias = self._dias_uteis_entre_datas(inicio, fim)
            if total_dias and total_dias > 0:
                dias_restantes = self._dias_uteis_entre_datas(self.hoje, fim)
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
    
    def _calcular_todos_dias_uteis(self, projeto: Projeto) -> Projeto:
        """Calcula todos os campos de dias úteis para todas as fases do projeto."""
        fases = [
            "ideacao",
            "analise_tecnica_e_negocios", 
            "backlog_priorizado",
            "em_desenvolvimento",
            "em_homologacao",
            "operacao_assistida"
        ]
        
        # Mapear para os campos do projeto
        mapeamento = {
            "ideacao": ("dias_uteis_decorridos_ideacao", "dias_uteis_restantes_ideacao", "total_dias_uteis_ideacao", "progresso_ideacao"),
            "analise_tecnica_e_negocios": ("dias_uteis_decorridos_analise_tecnica", "dias_uteis_restantes_analise_tecnica", "total_dias_uteis_analise_tecnica", "progresso_analise_tecnica"),
            "backlog_priorizado": ("dias_uteis_decorridos_backlog_priorizado", "dias_uteis_restantes_backlog_priorizado", "total_dias_uteis_backlog_priorizado", "progresso_backlog_priorizado"),
            "em_desenvolvimento": ("dias_uteis_decorridos_em_desenvolvimento", "dias_uteis_restantes_em_desenvolvimento", "total_dias_uteis_em_desenvolvimento", "progresso_em_desenvolvimento"),
            "em_homologacao": ("dias_uteis_decorridos_em_homologacao", "dias_uteis_restantes_em_homologacao", "total_dias_uteis_em_homologacao", "progresso_em_homologacao"),
            "operacao_assistida": ("dias_uteis_decorridos_operacao_assistida", "dias_uteis_restantes_operacao_assistida", "total_dias_uteis_operacao_assistida", "progresso_operacao_assistida")
        }
        
        for fase in fases:
            dados_fase = self._calcular_dias_uteis_fase(projeto, fase)
            
            if fase in mapeamento:
                decorridos_attr, restantes_attr, total_attr, progresso_attr = mapeamento[fase]
                setattr(projeto, decorridos_attr, dados_fase["dias_decorridos"])
                setattr(projeto, restantes_attr, dados_fase["dias_restantes"])
                setattr(projeto, total_attr, dados_fase["total_dias"])
                setattr(projeto, progresso_attr, dados_fase["progresso"])
        
        return projeto


class ProjetoSerializer:
    """Responsável por serializar projetos para formato de API."""
    
    @staticmethod
    def to_dict(projeto: Projeto) -> Dict[str, Any]:
        """Converte projeto para dicionário otimizado para API."""
        return {
            # Identificação básica
            "Chave": projeto.chave,
            "Título": projeto.titulo,
            "Prioridade": projeto.prioridade,
            "Status": projeto.status,
            
            # Solicitante e organização
            "Grupo Solicitante": projeto.grupo_solicitante,
            "Departamento Solicitante": projeto.departamento_solicitante,
            "Solicitante": projeto.solicitante,
            
            # Responsáveis
            "Responsável Atual": projeto.responsavel_atual,
            "Squads": projeto.squads,
            
            # Datas importantes
            "Target start": projeto.target_start.strftime('%Y-%m-%d %H:%M:%S') if projeto.target_start else None,
            "Target end": projeto.target_end.strftime('%Y-%m-%d %H:%M:%S') if projeto.target_end else None,
            
            # Datas por fase
            "Data: Início Ideação": projeto.data_inicio_ideacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_ideacao else None,
            "Data: Fim Ideação": projeto.data_fim_ideacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_ideacao else None,
            "Data: Início Backlog priorizado": projeto.data_inicio_backlog_priorizado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_backlog_priorizado else None,
            "Data: Fim Backlog priorizado": projeto.data_fim_backlog_priorizado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_backlog_priorizado else None,
            "Data: Início Análise técnica e negócios": projeto.data_inicio_analise_tecnica.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_analise_tecnica else None,
            "Data: Fim Análise técnica e negócios": projeto.data_fim_analise_tecnica.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_analise_tecnica else None,
            "Data: Início Em desenvolvimento": projeto.data_inicio_em_desenvolvimento.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_em_desenvolvimento else None,
            "Data: Fim Em desenvolvimento": projeto.data_fim_em_desenvolvimento.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_em_desenvolvimento else None,
            "Data: Início Em homologação": projeto.data_inicio_em_homologacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_em_homologacao else None,
            "Data: Fim Em homologação": projeto.data_fim_em_homologacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_em_homologacao else None,
            "Data: Início Operação assistida": projeto.data_inicio_operacao_assistida.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_operacao_assistida else None,
            "Data: Fim Operação assistida": projeto.data_fim_operacao_assistida.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_operacao_assistida else None,
            "Data: Início Entregue": projeto.data_inicio_entregue.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_entregue else None,
            "Data: Fim Entregue": projeto.data_fim_entregue.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_entregue else None,
            "Data: Início Cancelado": projeto.data_inicio_cancelado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_cancelado else None,
            "Data: Fim Cancelado": projeto.data_fim_cancelado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_cancelado else None,
            "Data: Início Bloqueado": projeto.data_inicio_bloqueado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_bloqueado else None,
            "Data: Fim Bloqueado": projeto.data_fim_bloqueado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_bloqueado else None,
            
            # Campos adicionais
            "Motivo para Bloqueio de Projeto": projeto.motivo_bloqueio,
            "Motivo de Cancelamento": projeto.motivo_cancelamento,
            "Motivo de Repriorização": projeto.motivo_repriorizacao,
            "PosicaoBacklog": projeto.posicao_backlog,
            
            # Campos calculados
            "Status de ideação": projeto.status_ideacao,
            "Status de prazo": projeto.status_prazo,
            
            # Tempos por fase
            "Tempo na fase Ideação (dias)": projeto.tempo_fase_ideacao_dias,
            "Tempo na fase Backlog priorizado (dias)": projeto.tempo_fase_backlog_priorizado_dias,
            "Tempo na fase Análise técnica e negócios (dias)": projeto.tempo_fase_analise_tecnica_dias,
            "Tempo na fase Em desenvolvimento (dias)": projeto.tempo_fase_em_desenvolvimento_dias,
            "Tempo na fase Em homologação (dias)": projeto.tempo_fase_em_homologacao_dias,
            "Tempo na fase Operação assistida (dias)": projeto.tempo_fase_operacao_assistida_dias,
            "Tempo na fase Bloqueado (dias)": projeto.tempo_fase_bloqueado_dias,
            "Tempo na fase Entregue (dias)": projeto.tempo_fase_entregue_dias,
            "Tempo na fase Cancelado (dias)": projeto.tempo_fase_cancelado_dias,
            
            # Novos campos de dias úteis
            "Dias úteis decorridos de Ideacao": projeto.dias_uteis_decorridos_ideacao,
            "Dias úteis restantes de Ideacao": projeto.dias_uteis_restantes_ideacao,
            "Total de dias úteis de Ideacao": projeto.total_dias_uteis_ideacao,
            "Progresso de Ideacao": projeto.progresso_ideacao,
            
            "Dias úteis decorridos de Analise Tecnica": projeto.dias_uteis_decorridos_analise_tecnica,
            "Dias úteis restantes de Analise Tecnica": projeto.dias_uteis_restantes_analise_tecnica,
            "Total de dias úteis de Analise Tecnica": projeto.total_dias_uteis_analise_tecnica,
            "Progresso de Analise Tecnica": projeto.progresso_analise_tecnica,
            
            "Dias úteis decorridos de Backlog Priorizado": projeto.dias_uteis_decorridos_backlog_priorizado,
            "Dias úteis restantes de Backlog Priorizado": projeto.dias_uteis_restantes_backlog_priorizado,
            "Total de dias úteis de Backlog Priorizado": projeto.total_dias_uteis_backlog_priorizado,
            "Progresso de Backlog Priorizado": projeto.progresso_backlog_priorizado,
            
            "Dias úteis decorridos de Em Desenvolvimento": projeto.dias_uteis_decorridos_em_desenvolvimento,
            "Dias úteis restantes de Em Desenvolvimento": projeto.dias_uteis_restantes_em_desenvolvimento,
            "Total de dias úteis de Em Desenvolvimento": projeto.total_dias_uteis_em_desenvolvimento,
            "Progresso de Em Desenvolvimento": projeto.progresso_em_desenvolvimento,
            
            "Dias úteis decorridos de Em Homologacao": projeto.dias_uteis_decorridos_em_homologacao,
            "Dias úteis restantes de Em Homologacao": projeto.dias_uteis_restantes_em_homologacao,
            "Total de dias úteis de Em Homologacao": projeto.total_dias_uteis_em_homologacao,
            "Progresso de Em Homologacao": projeto.progresso_em_homologacao,
            
            "Dias úteis decorridos de Operacao Assistida": projeto.dias_uteis_decorridos_operacao_assistida,
            "Dias úteis restantes de Operacao Assistida": projeto.dias_uteis_restantes_operacao_assistida,
            "Total de dias úteis de Operacao Assistida": projeto.total_dias_uteis_operacao_assistida,
            "Progresso de Operacao Assistida": projeto.progresso_operacao_assistida
        }


class EspacoProjetosService:
    """
    Serviço principal para processamento de dados do Espaço de Projetos.
    Orquestra o fluxo de parsing, análise e serialização.
    """
    
    def __init__(self):
        self.parser = ProjetoParser()
        self.analisador = ProjetoAnalisador()
        self.serializer = ProjetoSerializer()
    
    def processar_issues(self, issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Processa issues do Jira e retorna dados prontos para API.
        Retorna diretamente uma lista de dicionários otimizada para JSON.
        """
        logger.info(f"Processando {len(issues)} issues do Espaço de Projetos")
        
        if not issues:
            return []
        
        projetos = []
        
        for issue in issues:
            # Parse: Converter issue em objeto Projeto
            projeto = self.parser.parse_issue(issue)
            
            # Análise: Aplicar cálculos e classificações
            projeto = self.analisador.analisar_projeto(projeto)
            
            # Serialização: Converter para formato de API
            projeto_dict = self.serializer.to_dict(projeto)
            projetos.append(projeto_dict)
        
        # Calcular posição no backlog por responsável
        projetos = self._calcular_posicao_backlog_por_responsavel(projetos)
        
        # Preparar dados para exportação JSON
        projetos = self._preparar_dados_para_json(projetos)
        
        logger.info(f"Processamento concluído: {len(projetos)} projetos")
        return projetos
    
    def _calcular_posicao_backlog_por_responsavel(self, projetos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Calcula posição no backlog por responsável atual.
        Cada responsável terá sua própria numeração (1, 2, 3, etc.).
        """
        logger.info("Calculando posição no backlog por responsável")
        
        # Filtrar apenas projetos com status 'Backlog Priorizado'
        backlog_priorizado = [p for p in projetos if p.get("Status") == "Backlog priorizado"]
        
        logger.debug(f"Encontrados {len(backlog_priorizado)} projetos com status 'Backlog priorizado'")
        
        # Agrupar por responsável atual e numerar cada grupo separadamente
        responsaveis = {}
        for projeto in backlog_priorizado:
            responsavel = projeto.get("Responsável Atual")
            if responsavel:
                if responsavel not in responsaveis:
                    responsaveis[responsavel] = []
                responsaveis[responsavel].append(projeto)
        
        # Numerar as posições por responsável
        for responsavel, projetos_responsavel in responsaveis.items():
            logger.debug(f"Responsável '{responsavel}': {len(projetos_responsavel)} projetos no backlog priorizado")
            for pos, projeto in enumerate(projetos_responsavel, start=1):
                projeto["PosicaoBacklog"] = pos
        
        logger.info(f"Posição no backlog calculada para {len(backlog_priorizado)} projetos")
        return projetos
    
    def _preparar_dados_para_json(self, projetos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Prepara os dados para exportação JSON, tratando valores NaN, inf e convertendo tipos.
        """
        logger.info("Preparando dados para exportação JSON")
        
        for projeto in projetos:
            for chave, valor in projeto.items():
                # Tratar valores infinitos e NaN
                if isinstance(valor, float):
                    if pd.isna(valor) or valor == float('inf') or valor == float('-inf'):
                        projeto[chave] = None
                # Tratar valores None que podem causar problemas no JSON
                elif valor is None:
                    projeto[chave] = None
        
        logger.info("Dados preparados para exportação JSON")
        return projetos 