"""
Repository para operações de relacionamentos usuário-módulo.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from .base_repository import BaseRepository
from models.user_module import UserModule


class UserModuleRepository(BaseRepository[UserModule]):
    """Repository para operações de relacionamentos usuário-módulo."""
    
    def __init__(self):
        super().__init__(UserModule)
    
    def get_by_user_and_module(self, user_id: int, module_id: int) -> Optional[UserModule]:
        """Busca relacionamento por usuário e módulo."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                and_(
                    self.model.user_id == user_id,
                    self.model.module_id == module_id
                )
            ).first()
        finally:
            session.close()
    
    def get_user_modules(self, user_id: int, skip: int = 0, limit: int = 100) -> List[UserModule]:
        """Lista módulos de um usuário."""
        return self.find_by_filters({"user_id": user_id}, skip=skip, limit=limit)
    
    def get_active_user_modules(self, user_id: int, skip: int = 0, limit: int = 100) -> List[UserModule]:
        """Lista módulos ativos de um usuário."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                and_(
                    self.model.user_id == user_id,
                    self.model.is_active == True
                )
            ).offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def get_module_users(self, module_id: int, skip: int = 0, limit: int = 100) -> List[UserModule]:
        """Lista usuários de um módulo."""
        return self.find_by_filters({"module_id": module_id}, skip=skip, limit=limit)
    
    def get_active_module_users(self, module_id: int, skip: int = 0, limit: int = 100) -> List[UserModule]:
        """Lista usuários ativos de um módulo."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                and_(
                    self.model.module_id == module_id,
                    self.model.is_active == True
                )
            ).offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def user_has_module_access(self, user_id: int, module_id: int) -> bool:
        """Verifica se um usuário tem acesso a um módulo."""
        user_module = self.get_by_user_and_module(user_id, module_id)
        return user_module is not None and user_module.is_active
    
    def user_has_permission(self, user_id: int, module_id: int, permission: str) -> bool:
        """Verifica se um usuário tem uma permissão específica em um módulo."""
        user_module = self.get_by_user_and_module(user_id, module_id)
        if not user_module or not user_module.is_active:
            return False
        
        return user_module.has_permission(permission)
    
    def remove_user_module(self, user_id: int, module_id: int) -> bool:
        """Remove um relacionamento usuário-módulo."""
        user_module = self.get_by_user_and_module(user_id, module_id)
        if user_module:
            return self.delete(user_module.id)
        return False 