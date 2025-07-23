"""
Model para relacionamento entre usuários e módulos.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from .base import Base


class UserModule(Base):
    """Model para relacionamento entre usuários e módulos."""
    
    __tablename__ = "user_modules"
    
    # Identificação
    id = Column(Integer, primary_key=True, index=True)
    
    # Chaves estrangeiras
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    
    # Permissões
    can_view = Column(Boolean, default=True, nullable=False)
    can_edit = Column(Boolean, default=False, nullable=False)
    can_delete = Column(Boolean, default=False, nullable=False)
    can_export = Column(Boolean, default=False, nullable=False)
    
    # Controle de acesso
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Informações de auditoria
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    granted_by = Column(String(100), nullable=True)  # Quem concedeu a permissão
    revoked_by = Column(String(100), nullable=True)  # Quem revogou a permissão
    notes = Column(Text, nullable=True)  # Observações sobre a permissão
    
    # Relacionamentos
    user = relationship("User", back_populates="user_modules")
    module = relationship("Module", back_populates="user_modules")
    
    def __repr__(self):
        return f"<UserModule(user_id={self.user_id}, module_id={self.module_id})>"
    
    @property
    def has_any_permission(self) -> bool:
        """Verifica se o usuário tem alguma permissão no módulo."""
        return any([
            self.can_view,
            self.can_edit,
            self.can_delete,
            self.can_export
        ])
    
    def has_permission(self, permission: str) -> bool:
        """Verifica se o usuário tem uma permissão específica."""
        if not self.is_active:
            return False
        
        permission_map = {
            'view': self.can_view,
            'edit': self.can_edit,
            'delete': self.can_delete,
            'export': self.can_export
        }
        
        return permission_map.get(permission, False) 