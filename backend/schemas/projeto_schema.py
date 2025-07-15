from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class ProjetoJiraInput(BaseModel):
    # Campos obrigatórios
    summary: str = Field(..., example="Título do projeto")
    
    # 1. Informações do Solicitante
    customfield_10093: Optional[str] = Field(None, description="Nome completo do solicitante")
    customfield_10247: Optional[str] = Field(None, description="E-mail corporativo")
    customfield_10245: Optional[Dict[str, str]] = Field(None, description="Departamento / Unidade solicitante")
    customfield_10250: Optional[str] = Field(None, description="Diretor responsável pela aprovação")
    
    # 2. Sobre a Solicitação
    customfield_10481: Optional[str] = Field(None, description="Objetivo do Projeto")
    description: Optional[str] = Field(None, description="Descrição do Projeto")
    customfield_10476: Optional[str] = Field(None, description="Escopo Inicial ou Solução Proposta pela Área")
    customfield_10477: Optional[str] = Field(None, description="Stakeholders Diretos ou Equipes Envolvidas")
    
    # 3. Estratégia e Priorização
    customfield_10478: Optional[Dict[str, str]] = Field(None, description="Tipo de Projeto")
    priority: Optional[Dict[str, str]] = Field(None, description="Prioridade da Solicitação")
    customfield_10479: Optional[str] = Field(None, description="Prazo Desejado ou Restrição Temporal")
    customfield_10480: Optional[Dict[str, str]] = Field(None, description="Impacto Esperado")
    customfield_10248: Optional[str] = Field(None, description="Benefícios Esperados")
    customfield_10482: Optional[str] = Field(None, description="Riscos Conhecidos ou Percebidos pela Área")
    
    # 4. Viabilidade
    customfield_10483: Optional[float] = Field(None, description="Estimativa de Custo")
    customfield_10484: Optional[Dict[str, str]] = Field(None, description="Existe orçamento reservado para este projeto?")
    
    # 5. Complementar
    customfield_10485: Optional[str] = Field(None, description="Observações adicionais")

    # 6. Confirmação de Recebimento
    customfield_10486: Optional[str] = Field(None, description="Confirmação de Recebimento")