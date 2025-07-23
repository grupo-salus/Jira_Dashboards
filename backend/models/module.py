"""
Model para módulos/dashboards do sistema.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship

from .base import Base


class Module(Base):
    """Model para módulos/dashboards do sistema."""
    
    __tablename__ = "modules"
    
    # Identificação
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    display_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Configurações
    is_active = Column(Boolean, default=True, nullable=False)
    requires_authentication = Column(Boolean, default=True, nullable=False)
    
    # Informações de rota
    route_path = Column(String(255), nullable=False)  # Ex: /projetos, /sprint, /ti
    icon = Column(String(100), nullable=True)  # Ícone do módulo
    order = Column(Integer, default=0, nullable=False)  # Ordem de exibição
    
    # Informações de auditoria
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_by = Column(String(100), nullable=True)
    updated_by = Column(String(100), nullable=True)
    
    # Relacionamentos
    user_modules = relationship("UserModule", back_populates="module", cascade="all, delete-orphan", lazy="dynamic")
    
    def __repr__(self):
        return f"<Module(id={self.id}, name='{self.name}', display_name='{self.display_name}')>"
    
    @property
    def is_accessible(self) -> bool:
        """Verifica se o módulo está acessível."""
        return self.is_active 