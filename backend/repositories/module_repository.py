"""
Repository para operações de módulos.
"""
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from .base_repository import BaseRepository
from models.module import Module


class ModuleRepository(BaseRepository[Module]):
    """Repository para operações de módulos."""
    
    def __init__(self):
        super().__init__(Module)
    
    def get_by_name(self, name: str) -> Optional[Module]:
        """Busca módulo por nome."""
        return self.get_by_field("name", name)
    
    def get_by_route_path(self, route_path: str) -> Optional[Module]:
        """Busca módulo por rota."""
        return self.get_by_field("route_path", route_path)
    
    def get_active_modules(self, skip: int = 0, limit: int = 100) -> List[Module]:
        """Lista módulos ativos."""
        return self.find_by_filters({"is_active": True}, skip=skip, limit=limit)
    
    def get_modules_by_order(self, skip: int = 0, limit: int = 100) -> List[Module]:
        """Lista módulos ordenados por ordem de exibição."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(
                self.model.is_active == True
            ).order_by(self.model.order, self.model.name).offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def search_modules(self, search_term: str, skip: int = 0, limit: int = 100) -> List[Module]:
        """Busca módulos por termo de busca."""
        search_fields = ["name", "display_name", "description"]
        return self.search(search_term, search_fields, skip=skip, limit=limit)
    
    def name_exists(self, name: str) -> bool:
        """Verifica se um nome de módulo já existe."""
        return self.get_by_name(name) is not None
    
    def route_exists(self, route_path: str) -> bool:
        """Verifica se uma rota já existe."""
        return self.get_by_route_path(route_path) is not None 