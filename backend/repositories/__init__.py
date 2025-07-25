"""
Repositories do sistema.
"""
from .base_repository import BaseRepository
from .user_repository import UserRepository
from .module_repository import ModuleRepository
from .user_module_repository import UserModuleRepository
from .audit_log_repository import AuditLogRepository

# Instâncias globais dos repositories
user_repository = UserRepository()
module_repository = ModuleRepository()
user_module_repository = UserModuleRepository()
audit_log_repository = AuditLogRepository()

__all__ = [
    "BaseRepository",
    "UserRepository",
    "ModuleRepository", 
    "UserModuleRepository",
    "AuditLogRepository",
    "user_repository",
    "module_repository",
    "user_module_repository",
    "audit_log_repository"
]
