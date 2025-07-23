"""
Model para usuários do sistema.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship

from .base import Base


class User(Base):
    """Model para usuários do sistema."""
    
    __tablename__ = "users"
    
    # Identificação
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    
    # Informações do LDAP
    ldap_dn = Column(String(500), nullable=True)  # Distinguished Name do LDAP
    ldap_sam_account_name = Column(String(100), nullable=True)  # SAM Account Name
    
    # Informações pessoais
    display_name = Column(String(255), nullable=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    title = Column(String(100), nullable=True)
    
    # Controle de acesso
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Informações de auditoria
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_by = Column(String(100), nullable=True)  # Quem criou o registro
    updated_by = Column(String(100), nullable=True)  # Quem atualizou por último
    
    # Relacionamentos
    user_modules = relationship("UserModule", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
    
    @property
    def full_name(self) -> str:
        """Retorna o nome completo do usuário."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.display_name:
            return self.display_name
        else:
            return self.username
    
    def is_authenticated(self) -> bool:
        """Verifica se o usuário está autenticado e ativo."""
        return self.is_active
    
    def has_module_access(self, module_name: str) -> bool:
        """Verifica se o usuário tem acesso a um módulo específico."""
        if not self.is_active:
            return False
        
        return any(
            user_module.module.name == module_name and user_module.is_active
            for user_module in self.user_modules
        ) 