"""
Model para logs de auditoria do sistema.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON

from .base import Base


class AuditLog(Base):
    """Model para logs de auditoria do sistema."""
    
    __tablename__ = "audit_logs"
    
    # Identificação
    id = Column(Integer, primary_key=True, index=True)
    
    # Informações da ação
    action = Column(String(100), nullable=False)  # login, logout, create, update, delete, etc.
    resource_type = Column(String(100), nullable=False)  # user, module, user_module, etc.
    resource_id = Column(String(100), nullable=True)  # ID do recurso afetado
    
    # Informações do usuário
    user_id = Column(Integer, nullable=True)
    username = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv4 ou IPv6
    user_agent = Column(Text, nullable=True)
    
    # Detalhes da ação
    details = Column(JSON, nullable=True)  # Dados adicionais em formato JSON
    old_values = Column(JSON, nullable=True)  # Valores anteriores (para updates)
    new_values = Column(JSON, nullable=True)  # Novos valores (para updates)
    
    # Status
    success = Column(Boolean, default=True, nullable=False)
    error_message = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<AuditLog(id={self.id}, action='{self.action}', user='{self.username}')>"
    
    @property
    def is_successful(self) -> bool:
        """Verifica se a ação foi bem-sucedida."""
        return self.success
    
    @property
    def has_changes(self) -> bool:
        """Verifica se houve mudanças nos valores."""
        return bool(self.old_values or self.new_values) 