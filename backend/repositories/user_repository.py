"""
Repository para operações de usuários.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from .base_repository import BaseRepository
from models.user import User


class UserRepository(BaseRepository[User]):
    """Repository para operações de usuários."""
    
    def __init__(self):
        super().__init__(User)
    
    def get_by_username(self, username: str) -> Optional[User]:
        """Busca usuário por username."""
        return self.get_by_field("username", username)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """Busca usuário por email."""
        return self.get_by_field("email", email)
    
    def get_by_ldap_sam_account_name(self, sam_account_name: str) -> Optional[User]:
        """Busca usuário por SAM Account Name do LDAP."""
        return self.get_by_field("ldap_sam_account_name", sam_account_name)
    
    def get_active_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Lista usuários ativos."""
        return self.find_by_filters({"is_active": True}, skip=skip, limit=limit)
    
    def get_superusers(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Lista superusuários."""
        return self.find_by_filters({"is_superuser": True}, skip=skip, limit=limit)
    
    def search_users(self, search_term: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Busca usuários por termo de busca."""
        search_fields = ["username", "email", "display_name", "first_name", "last_name", "department"]
        return self.search(search_term, search_fields, skip=skip, limit=limit)
    
    def update_last_login(self, user_id: int) -> Optional[User]:
        """Atualiza o último login do usuário."""
        from datetime import datetime
        return self.update(user_id, last_login=datetime.utcnow())
    
    def get_users_by_department(self, department: str, skip: int = 0, limit: int = 100) -> List[User]:
        """Lista usuários por departamento."""
        return self.find_by_filters({"department": department}, skip=skip, limit=limit)
    
    def username_exists(self, username: str) -> bool:
        """Verifica se um username já existe."""
        return self.get_by_username(username) is not None
    
    def email_exists(self, email: str) -> bool:
        """Verifica se um email já existe."""
        return self.get_by_email(email) is not None 