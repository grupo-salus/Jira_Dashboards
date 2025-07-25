import pandas as pd
from datetime import date
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


class EspacoProjetosService:
    """
    Serviço específico para processamento de dados do Espaço de Projetos.
    Unifica a lógica de parsing e análise de projetos em uma única classe.
    """
    
    def __init__(self):
        self.hoje = pd.Timestamp(date.today())
        self.fases = [
            "Backlog", "Bloqueado", "Backlog priorizado", "Em andamento",
            "Em homologação", "Operação assistida", "Concluído", "Cancelado"
        ]
    
    def processar_issues(self, issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Processa issues do Jira e retorna dados prontos para API.
        Retorna diretamente uma lista de dicionários otimizada para JSON.
        """
        logger.info(f"Processando {len(issues)} issues do Espaço de Projetos")
        
        if not issues:
            return []
        
        # Converter para DataFrame para processamento
        df = self._parse_issues_to_dataframe(issues)
        
        # Aplicar enriquecimentos
        df = self._enriquecer_dados(df)
        
        # Converter para formato otimizado para API
        return self._dataframe_to_api_format(df)
    
    def _parse_issues_to_dataframe(self, issues: List[Dict[str, Any]]) -> pd.DataFrame:
        """Converte issues do Jira em DataFrame."""
        rows = []
        
        for issue in issues:
            fields = issue.get("fields", {})
            if not fields:
                continue
                
            row = self._extrair_campos_issue(issue, fields)
            rows.append(row)
        
        df = pd.DataFrame(rows)
        self._converter_datas(df)
        return df
    
    def _extrair_campos_issue(self, issue: Dict[str, Any], fields: Dict[str, Any]) -> Dict[str, Any]:
        """Extrai campos relevantes de uma issue."""
        return {
            "ID": issue.get("id"),
            "Tipo": fields.get("issuetype", {}).get("name"),
            "Chave": issue.get("key"),
            "Título": fields.get("summary"),
            "Prioridade": fields.get("priority", {}).get("name"),
            "Status": fields.get("status", {}).get("name"),
            
            # Campos descritivos
            "Descrição": self._extrair_texto_rich(fields.get("description")),
            "Aprovador por (diretor)": fields.get("customfield_10250"),
            "Benefícios Esperados": self._extrair_texto_rich(fields.get("customfield_10248")),
            
            # Solicitante e organização
            "Grupo Solicitante": fields.get("customfield_10083", {}).get("value"),
            "Departamento Solicitante": fields.get("customfield_10245", {}).get("value"),
            "Solicitante": self._extrair_texto_rich(fields.get("customfield_10093")),
            "Telefone do Solicitante": fields.get("customfield_10246"),
            "Email do Solicitante": fields.get("customfield_10247"),
            
            # Responsáveis
            "Responsável": fields.get("assignee", {}).get("displayName"),
            "Relator": fields.get("creator", {}).get("displayName"),
            "Squad": fields.get("customfield_10278", {}).get("value"),
            
            # Tempo e estimativas
            "Estimativa original (segundos)": fields.get("timetracking", {}).get("originalEstimateSeconds"),
            "Tempo registrado (segundos)": fields.get("timetracking", {}).get("timeSpentSeconds"),
            "Tempo restante (segundos)": fields.get("timetracking", {}).get("remainingEstimateSeconds"),
            "Investimento Esperado": fields.get("customfield_10249"),
            
            # Datas importantes
            "Data de criação": fields.get("created"),
            "Data de atualização": fields.get("updated"),
            "Target start": fields.get("customfield_10022"),
            "Target end": fields.get("customfield_10023"),
            "Data de término": fields.get("resolutiondate"),
            
            # Datas por fase
            "Data: Início Backlog": fields.get("customfield_10345"),
            "Data: Fim Backlog": fields.get("customfield_10346"),
            "Data: Início Backlog priorizado": fields.get("customfield_10347"),
            "Data: Fim Backlog priorizado": fields.get("customfield_10348"),
            "Data: Início Em andamento": fields.get("customfield_10349"),
            "Data: Fim Em andamento": fields.get("customfield_10350"),
            "Data: Início Em homologação": fields.get("customfield_10351"),
            "Data: Fim Em homologação": fields.get("customfield_10352"),
            "Data: Início Operação assistida": fields.get("customfield_10353"),
            "Data: Fim Operação assistida": fields.get("customfield_10354"),
            "Data: Início Concluído": fields.get("customfield_10355"),
            "Data: Fim Concluído": fields.get("customfield_10356"),
            "Data: Início Cancelado": fields.get("customfield_10357"),
            "Data: Fim Cancelado": fields.get("customfield_10358"),
            "Data: Início Bloqueado": fields.get("customfield_10359"),
            "Data: Fim Bloqueado": fields.get("customfield_10360"),
            "Motivo para Bloqueio de Projeto": fields.get("customfield_10344", {}).get("value")
        }
    
    def _extrair_texto_rich(self, field) -> str:
        """Extrai texto de campos rich text do Jira."""
        if not field:
            return None
        try:
            return field.get("content", [{}])[0].get("content", [{}])[0].get("text")
        except (IndexError, KeyError, TypeError):
            return None
    
    def _converter_datas(self, df: pd.DataFrame) -> None:
        """Converte colunas de data para datetime."""
        date_cols = [
            "Data de criação", "Data de atualização", "Target start", "Target end", "Data de término",
            "Data: Início Backlog", "Data: Fim Backlog", 
            "Data: Início Backlog priorizado", "Data: Fim Backlog priorizado", 
            "Data: Início Em andamento", "Data: Fim Em andamento", 
            "Data: Início Em homologação", "Data: Fim Em homologação", 
            "Data: Início Operação assistida", "Data: Fim Operação assistida", 
            "Data: Início Concluído", "Data: Fim Concluído", 
            "Data: Início Cancelado", "Data: Fim Cancelado", 
            "Data: Início Bloqueado", "Data: Fim Bloqueado"
        ]
        
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors="coerce").dt.tz_localize(None)
    
    def _enriquecer_dados(self, df: pd.DataFrame) -> pd.DataFrame:
        """Aplica enriquecimentos aos dados."""
        # Calcular tempos por fase
        for fase in self.fases:
            col_name = f"Tempo na fase {fase} (dias)"
            df[col_name] = df.apply(lambda row: self._calcular_tempo_por_fase(row, fase), axis=1)
        
        # Calcular dias na fase atual
        df["Dias na fase atual"] = df.apply(self._calcular_dias_na_fase_atual, axis=1)
        
        # Classificações
        df["Status de ideação"] = df["Dias na fase atual"].apply(self._classificar_status_ideacao)
        df["Status de prazo"] = df.apply(self._classificar_prazo, axis=1)
        df["Risco de atraso atual?"] = df.apply(self._verificar_risco_atual, axis=1)
        
        # Posição no backlog
        df["PosicaoBacklog"] = None
        backlog_mask = (df["Status"] == "Backlog priorizado") | (df["Data: Início Backlog priorizado"].notna())
        df.loc[backlog_mask, "PosicaoBacklog"] = 1  # Simplificado
        
        return df
    
    def _calcular_tempo_por_fase(self, row: pd.Series, fase: str) -> int:
        """Calcula tempo em dias para uma fase específica."""
        inicio = row.get(f"Data: Início {fase}")
        fim = row.get(f"Data: Fim {fase}")
        
        if pd.isna(inicio):
            return None
        
        fim_efetivo = fim if pd.notna(fim) else self.hoje
        
        try:
            dias = (fim_efetivo - inicio).days
            return dias if not pd.isna(dias) and dias != float('inf') else None
        except Exception:
            return None
    
    def _calcular_dias_na_fase_atual(self, row: pd.Series) -> int:
        """Calcula dias na fase atual."""
        status = str(row.get("Status", "")).strip()
        inicio = row.get(f"Data: Início {status}")
        
        if pd.isna(inicio):
            return None
        
        fim_efetivo = row.get(f"Data: Fim {status}") if pd.notna(row.get(f"Data: Fim {status}")) else self.hoje
        
        try:
            dias = (fim_efetivo - inicio).days
            return dias if not pd.isna(dias) and dias != float('inf') else None
        except Exception:
            return None
    
    def _classificar_status_ideacao(self, dias: int) -> str:
        """Classifica status de ideação baseado nos dias."""
        if dias is None:
            return None
        if dias <= 90:
            return "Recente"
        elif dias <= 180:
            return "Rever"
        elif dias <= 365:
            return "Quase obsoleto"
        return "Obsoleto"
    
    def _classificar_prazo(self, row: pd.Series) -> str:
        """Classifica prazo do projeto."""
        target_end = row.get("Target end")
        data_finalizacao = row.get("Data: Fim Em andamento")
        
        if pd.notna(data_finalizacao):
            if pd.isna(target_end):
                return None
            return "No prazo" if data_finalizacao <= target_end else "Atrasado"
        
        if pd.isna(target_end):
            return None
        
        dias_restantes = (target_end - self.hoje).days
        
        if dias_restantes < 0:
            return "Atrasado"
        elif dias_restantes <= 2:
            return "Em risco"
        return "No prazo"
    
    def _verificar_risco_atual(self, row: pd.Series) -> str:
        """Verifica risco atual do projeto."""
        target_end = row.get("Target end")
        status = str(row.get("Status", "")).strip().lower()
        
        if pd.isna(target_end):
            return None
        
        dias_restantes = (target_end - self.hoje).days
        fases_iniciais = ["ideação", "backlog priorizado", "em desenvolvimento"]
        
        if status in fases_iniciais and (dias_restantes <= 2 or self.hoje > target_end):
            return "Sim"
        return "Não"
    
    def _dataframe_to_api_format(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Converte DataFrame para formato otimizado para API."""
        result = []
        
        for _, row in df.iterrows():
            item = {}
            for col in df.columns:
                value = row[col]
                
                # Tratar valores especiais
                if pd.isna(value) or value == float('inf') or value == float('-inf'):
                    item[col] = None
                elif isinstance(value, pd.Timestamp):
                    item[col] = value.strftime('%Y-%m-%d %H:%M:%S')
                else:
                    item[col] = value
            
            result.append(item)
        
        return result 