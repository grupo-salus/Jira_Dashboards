import pandas as pd
from datetime import date
import logging
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class Projeto:
    """Representa um projeto do Espaço de Projetos com todos seus campos."""
    
    # Identificação básica
    id: str
    chave: str
    titulo: str
    tipo: str
    prioridade: str
    status: str
    
    # Campos descritivos
    descricao: Optional[str] = None
    aprovador_diretor: Optional[str] = None
    beneficios_esperados: Optional[str] = None
    
    # Solicitante e organização
    grupo_solicitante: Optional[str] = None
    departamento_solicitante: Optional[str] = None
    solicitante: Optional[str] = None
    telefone_solicitante: Optional[str] = None
    email_solicitante: Optional[str] = None
    
    # Responsáveis
    responsavel: Optional[str] = None
    relator: Optional[str] = None
    squad: Optional[str] = None
    
    # Tempo e estimativas
    estimativa_original_segundos: Optional[int] = None
    tempo_registrado_segundos: Optional[int] = None
    tempo_restante_segundos: Optional[int] = None
    investimento_esperado: Optional[float] = None
    
    # Datas importantes
    data_criacao: Optional[pd.Timestamp] = None
    data_atualizacao: Optional[pd.Timestamp] = None
    target_start: Optional[pd.Timestamp] = None
    target_end: Optional[pd.Timestamp] = None
    data_termino: Optional[pd.Timestamp] = None
    
    # Datas por fase
    data_inicio_backlog: Optional[pd.Timestamp] = None
    data_fim_backlog: Optional[pd.Timestamp] = None
    data_inicio_backlog_priorizado: Optional[pd.Timestamp] = None
    data_fim_backlog_priorizado: Optional[pd.Timestamp] = None
    data_inicio_em_andamento: Optional[pd.Timestamp] = None
    data_fim_em_andamento: Optional[pd.Timestamp] = None
    data_inicio_em_homologacao: Optional[pd.Timestamp] = None
    data_fim_em_homologacao: Optional[pd.Timestamp] = None
    data_inicio_operacao_assistida: Optional[pd.Timestamp] = None
    data_fim_operacao_assistida: Optional[pd.Timestamp] = None
    data_inicio_concluido: Optional[pd.Timestamp] = None
    data_fim_concluido: Optional[pd.Timestamp] = None
    data_inicio_cancelado: Optional[pd.Timestamp] = None
    data_fim_cancelado: Optional[pd.Timestamp] = None
    data_inicio_bloqueado: Optional[pd.Timestamp] = None
    data_fim_bloqueado: Optional[pd.Timestamp] = None
    
    # Campos adicionais
    motivo_bloqueio: Optional[str] = None
    posicao_backlog: Optional[int] = None
    
    # Campos calculados
    dias_na_fase_atual: Optional[int] = None
    status_ideacao: Optional[str] = None
    status_prazo: Optional[str] = None
    risco_atraso_atual: Optional[str] = None
    
    # Tempos por fase
    tempo_fase_backlog_dias: Optional[int] = None
    tempo_fase_bloqueado_dias: Optional[int] = None
    tempo_fase_backlog_priorizado_dias: Optional[int] = None
    tempo_fase_em_andamento_dias: Optional[int] = None
    tempo_fase_em_homologacao_dias: Optional[int] = None
    tempo_fase_operacao_assistida_dias: Optional[int] = None
    tempo_fase_concluido_dias: Optional[int] = None
    tempo_fase_cancelado_dias: Optional[int] = None


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
    
    def parse_issue(self, issue: Dict[str, Any]) -> Projeto:
        """Converte uma issue do Jira em objeto Projeto."""
        fields = issue.get("fields", {})
        
        return Projeto(
            # Identificação básica
            id=issue.get("id"),
            chave=issue.get("key"),
            titulo=fields.get("summary"),
            tipo=fields.get("issuetype", {}).get("name"),
            prioridade=fields.get("priority", {}).get("name"),
            status=fields.get("status", {}).get("name"),
            
            # Campos descritivos
            descricao=self.extrair_texto_rich(fields.get("description")),
            aprovador_diretor=fields.get("customfield_10250"),
            beneficios_esperados=self.extrair_texto_rich(fields.get("customfield_10248")),
            
            # Solicitante e organização
            grupo_solicitante=fields.get("customfield_10083", {}).get("value"),
            departamento_solicitante=fields.get("customfield_10245", {}).get("value"),
            solicitante=self.extrair_texto_rich(fields.get("customfield_10093")),
            telefone_solicitante=fields.get("customfield_10246"),
            email_solicitante=fields.get("customfield_10247"),
            
            # Responsáveis
            responsavel=fields.get("assignee", {}).get("displayName"),
            relator=fields.get("creator", {}).get("displayName"),
            squad=fields.get("customfield_10278", {}).get("value"),
            
            # Tempo e estimativas
            estimativa_original_segundos=fields.get("timetracking", {}).get("originalEstimateSeconds"),
            tempo_registrado_segundos=fields.get("timetracking", {}).get("timeSpentSeconds"),
            tempo_restante_segundos=fields.get("timetracking", {}).get("remainingEstimateSeconds"),
            investimento_esperado=fields.get("customfield_10249"),
            
            # Datas importantes
            data_criacao=self.converter_data(fields.get("created")),
            data_atualizacao=self.converter_data(fields.get("updated")),
            target_start=self.converter_data(fields.get("customfield_10022")),
            target_end=self.converter_data(fields.get("customfield_10023")),
            data_termino=self.converter_data(fields.get("resolutiondate")),
            
            # Datas por fase
            data_inicio_backlog=self.converter_data(fields.get("customfield_10345")),
            data_fim_backlog=self.converter_data(fields.get("customfield_10346")),
            data_inicio_backlog_priorizado=self.converter_data(fields.get("customfield_10347")),
            data_fim_backlog_priorizado=self.converter_data(fields.get("customfield_10348")),
            data_inicio_em_andamento=self.converter_data(fields.get("customfield_10349")),
            data_fim_em_andamento=self.converter_data(fields.get("customfield_10350")),
            data_inicio_em_homologacao=self.converter_data(fields.get("customfield_10351")),
            data_fim_em_homologacao=self.converter_data(fields.get("customfield_10352")),
            data_inicio_operacao_assistida=self.converter_data(fields.get("customfield_10353")),
            data_fim_operacao_assistida=self.converter_data(fields.get("customfield_10354")),
            data_inicio_concluido=self.converter_data(fields.get("customfield_10355")),
            data_fim_concluido=self.converter_data(fields.get("customfield_10356")),
            data_inicio_cancelado=self.converter_data(fields.get("customfield_10357")),
            data_fim_cancelado=self.converter_data(fields.get("customfield_10358")),
            data_inicio_bloqueado=self.converter_data(fields.get("customfield_10359")),
            data_fim_bloqueado=self.converter_data(fields.get("customfield_10360")),
            
            # Campos adicionais
            motivo_bloqueio=fields.get("customfield_10344", {}).get("value")
        )


class ProjetoAnalisador:
    """Responsável por analisar e calcular métricas dos projetos."""
    
    def __init__(self):
        self.hoje = pd.Timestamp(date.today())
        self.fases = [
            "backlog", "bloqueado", "backlog_priorizado", "em_andamento",
            "em_homologacao", "operacao_assistida", "concluido", "cancelado"
        ]
    
    def analisar_projeto(self, projeto: Projeto) -> Projeto:
        """Aplica todas as análises em um projeto."""
        projeto = self._calcular_tempos_por_fase(projeto)
        projeto = self._calcular_dias_na_fase_atual(projeto)
        projeto = self._classificar_status_ideacao(projeto)
        projeto = self._classificar_prazo(projeto)
        projeto = self._verificar_risco_atual(projeto)
        projeto = self._calcular_posicao_backlog(projeto)
        return projeto
    
    def _calcular_tempos_por_fase(self, projeto: Projeto) -> Projeto:
        """Calcula tempos em dias para cada fase."""
        mapeamento_fases = {
            "backlog": ("data_inicio_backlog", "data_fim_backlog", "tempo_fase_backlog_dias"),
            "bloqueado": ("data_inicio_bloqueado", "data_fim_bloqueado", "tempo_fase_bloqueado_dias"),
            "backlog_priorizado": ("data_inicio_backlog_priorizado", "data_fim_backlog_priorizado", "tempo_fase_backlog_priorizado_dias"),
            "em_andamento": ("data_inicio_em_andamento", "data_fim_em_andamento", "tempo_fase_em_andamento_dias"),
            "em_homologacao": ("data_inicio_em_homologacao", "data_fim_em_homologacao", "tempo_fase_em_homologacao_dias"),
            "operacao_assistida": ("data_inicio_operacao_assistida", "data_fim_operacao_assistida", "tempo_fase_operacao_assistida_dias"),
            "concluido": ("data_inicio_concluido", "data_fim_concluido", "tempo_fase_concluido_dias"),
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
    
    def _calcular_dias_na_fase_atual(self, projeto: Projeto) -> Projeto:
        """Calcula dias na fase atual."""
        status = projeto.status.lower().replace(" ", "_")
        inicio_attr = f"data_inicio_{status}"
        fim_attr = f"data_fim_{status}"
        
        inicio = getattr(projeto, inicio_attr, None)
        if inicio is not None:
            fim = getattr(projeto, fim_attr, None)
            fim_efetivo = fim if fim is not None else self.hoje
            
            try:
                dias = (fim_efetivo - inicio).days
                if not pd.isna(dias) and dias != float('inf'):
                    projeto.dias_na_fase_atual = dias
            except Exception:
                projeto.dias_na_fase_atual = None
        
        return projeto
    
    def _classificar_status_ideacao(self, projeto: Projeto) -> Projeto:
        """Classifica status de ideação baseado nos dias."""
        if projeto.dias_na_fase_atual is None:
            projeto.status_ideacao = None
        elif projeto.dias_na_fase_atual <= 90:
            projeto.status_ideacao = "Recente"
        elif projeto.dias_na_fase_atual <= 180:
            projeto.status_ideacao = "Rever"
        elif projeto.dias_na_fase_atual <= 365:
            projeto.status_ideacao = "Quase obsoleto"
        else:
            projeto.status_ideacao = "Obsoleto"
        
        return projeto
    
    def _classificar_prazo(self, projeto: Projeto) -> Projeto:
        """Classifica prazo do projeto."""
        if projeto.data_fim_em_andamento is not None:
            if projeto.target_end is None:
                projeto.status_prazo = None
            else:
                projeto.status_prazo = "No prazo" if projeto.data_fim_em_andamento <= projeto.target_end else "Atrasado"
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
    
    def _verificar_risco_atual(self, projeto: Projeto) -> Projeto:
        """Verifica risco atual do projeto."""
        if projeto.target_end is None:
            projeto.risco_atraso_atual = None
        else:
            dias_restantes = (projeto.target_end - self.hoje).days
            fases_iniciais = ["ideação", "backlog priorizado", "em desenvolvimento"]
            
            if projeto.status.lower() in fases_iniciais and (dias_restantes <= 2 or self.hoje > projeto.target_end):
                projeto.risco_atraso_atual = "Sim"
            else:
                projeto.risco_atraso_atual = "Não"
        
        return projeto
    
    def _calcular_posicao_backlog(self, projeto: Projeto) -> Projeto:
        """Calcula posição no backlog."""
        if (projeto.status == "Backlog priorizado" or 
            projeto.data_inicio_backlog_priorizado is not None):
            projeto.posicao_backlog = 1  # Simplificado
        else:
            projeto.posicao_backlog = None
        
        return projeto


class ProjetoSerializer:
    """Responsável por serializar projetos para formato de API."""
    
    @staticmethod
    def to_dict(projeto: Projeto) -> Dict[str, Any]:
        """Converte projeto para dicionário otimizado para API."""
        return {
            # Identificação básica
            "ID": projeto.id,
            "Chave": projeto.chave,
            "Título": projeto.titulo,
            "Tipo": projeto.tipo,
            "Prioridade": projeto.prioridade,
            "Status": projeto.status,
            
            # Campos descritivos
            "Descrição": projeto.descricao,
            "Aprovador por (diretor)": projeto.aprovador_diretor,
            "Benefícios Esperados": projeto.beneficios_esperados,
            
            # Solicitante e organização
            "Grupo Solicitante": projeto.grupo_solicitante,
            "Departamento Solicitante": projeto.departamento_solicitante,
            "Solicitante": projeto.solicitante,
            "Telefone do Solicitante": projeto.telefone_solicitante,
            "Email do Solicitante": projeto.email_solicitante,
            
            # Responsáveis
            "Responsável": projeto.responsavel,
            "Relator": projeto.relator,
            "Squad": projeto.squad,
            
            # Tempo e estimativas
            "Estimativa original (segundos)": projeto.estimativa_original_segundos,
            "Tempo registrado (segundos)": projeto.tempo_registrado_segundos,
            "Tempo restante (segundos)": projeto.tempo_restante_segundos,
            "Investimento Esperado": projeto.investimento_esperado,
            
            # Datas importantes
            "Data de criação": projeto.data_criacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_criacao else None,
            "Data de atualização": projeto.data_atualizacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_atualizacao else None,
            "Target start": projeto.target_start.strftime('%Y-%m-%d %H:%M:%S') if projeto.target_start else None,
            "Target end": projeto.target_end.strftime('%Y-%m-%d %H:%M:%S') if projeto.target_end else None,
            "Data de término": projeto.data_termino.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_termino else None,
            
            # Datas por fase
            "Data: Início Backlog": projeto.data_inicio_backlog.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_backlog else None,
            "Data: Fim Backlog": projeto.data_fim_backlog.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_backlog else None,
            "Data: Início Backlog priorizado": projeto.data_inicio_backlog_priorizado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_backlog_priorizado else None,
            "Data: Fim Backlog priorizado": projeto.data_fim_backlog_priorizado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_backlog_priorizado else None,
            "Data: Início Em andamento": projeto.data_inicio_em_andamento.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_em_andamento else None,
            "Data: Fim Em andamento": projeto.data_fim_em_andamento.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_em_andamento else None,
            "Data: Início Em homologação": projeto.data_inicio_em_homologacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_em_homologacao else None,
            "Data: Fim Em homologação": projeto.data_fim_em_homologacao.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_em_homologacao else None,
            "Data: Início Operação assistida": projeto.data_inicio_operacao_assistida.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_operacao_assistida else None,
            "Data: Fim Operação assistida": projeto.data_fim_operacao_assistida.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_operacao_assistida else None,
            "Data: Início Concluído": projeto.data_inicio_concluido.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_concluido else None,
            "Data: Fim Concluído": projeto.data_fim_concluido.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_concluido else None,
            "Data: Início Cancelado": projeto.data_inicio_cancelado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_cancelado else None,
            "Data: Fim Cancelado": projeto.data_fim_cancelado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_cancelado else None,
            "Data: Início Bloqueado": projeto.data_inicio_bloqueado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_inicio_bloqueado else None,
            "Data: Fim Bloqueado": projeto.data_fim_bloqueado.strftime('%Y-%m-%d %H:%M:%S') if projeto.data_fim_bloqueado else None,
            
            # Campos adicionais
            "Motivo para Bloqueio de Projeto": projeto.motivo_bloqueio,
            "PosicaoBacklog": projeto.posicao_backlog,
            
            # Campos calculados
            "Dias na fase atual": projeto.dias_na_fase_atual,
            "Status de ideação": projeto.status_ideacao,
            "Status de prazo": projeto.status_prazo,
            "Risco de atraso atual?": projeto.risco_atraso_atual,
            
            # Tempos por fase
            "Tempo na fase Backlog (dias)": projeto.tempo_fase_backlog_dias,
            "Tempo na fase Bloqueado (dias)": projeto.tempo_fase_bloqueado_dias,
            "Tempo na fase Backlog priorizado (dias)": projeto.tempo_fase_backlog_priorizado_dias,
            "Tempo na fase Em andamento (dias)": projeto.tempo_fase_em_andamento_dias,
            "Tempo na fase Em homologação (dias)": projeto.tempo_fase_em_homologacao_dias,
            "Tempo na fase Operação assistida (dias)": projeto.tempo_fase_operacao_assistida_dias,
            "Tempo na fase Concluído (dias)": projeto.tempo_fase_concluido_dias,
            "Tempo na fase Cancelado (dias)": projeto.tempo_fase_cancelado_dias
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
        
        logger.info(f"Processamento concluído: {len(projetos)} projetos")
        return projetos 