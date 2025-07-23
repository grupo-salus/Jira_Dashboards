"""
Models do sistema.
"""
# Importar a Base comum primeiro
from .base import Base

# Importar todos os models
from .user import User
from .module import Module
from .user_module import UserModule
from .audit_log import AuditLog

__all__ = [
    "Base",
    "User",
    "Module", 
    "UserModule",
    "AuditLog"
]
