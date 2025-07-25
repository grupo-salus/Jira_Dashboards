"""
Base Repository com operações CRUD genéricas.
"""
from typing import TypeVar, Generic, Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime

from core.database import get_session_factory
from models.base import Base

T = TypeVar('T', bound=Base)


class BaseRepository(Generic[T]):
    """Repository base com operações CRUD genéricas."""
    
    def __init__(self, model: Type[T]):
        self.model = model
        self.session_factory = get_session_factory()
    
    def _get_session(self) -> Session:
        """Obtém uma sessão do banco de dados."""
        return self.session_factory()
    
    def create(self, **kwargs) -> T:
        """Cria um novo registro."""
        session = self._get_session()
        try:
            # Remover campos que não são colunas do modelo
            clean_kwargs = {k: v for k, v in kwargs.items() if not k.startswith('_')}
            instance = self.model(**clean_kwargs)
            session.add(instance)
            session.commit()
            session.refresh(instance)
            return instance
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def get_by_id(self, id: int) -> Optional[T]:
        """Busca um registro por ID."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(self.model.id == id).first()
        finally:
            session.close()
    
    def get_by_field(self, field: str, value: Any) -> Optional[T]:
        """Busca um registro por um campo específico."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(getattr(self.model, field) == value).first()
        finally:
            session.close()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Lista todos os registros com paginação."""
        session = self._get_session()
        try:
            return session.query(self.model).offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def find_by_filters(self, filters: Dict[str, Any], skip: int = 0, limit: int = 100) -> List[T]:
        """Busca registros com filtros específicos."""
        session = self._get_session()
        try:
            query = session.query(self.model)
            
            for field, value in filters.items():
                if hasattr(self.model, field):
                    if isinstance(value, dict):
                        # Suporte para operadores como ilike, contains, etc.
                        for operator, operator_value in value.items():
                            if operator == 'ilike':
                                query = query.filter(getattr(self.model, field).ilike(f"%{operator_value}%"))
                            elif operator == 'contains':
                                query = query.filter(getattr(self.model, field).contains(operator_value))
                            elif operator == 'in':
                                query = query.filter(getattr(self.model, field).in_(operator_value))
                    else:
                        query = query.filter(getattr(self.model, field) == value)
            
            return query.offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def search(self, search_term: str, search_fields: List[str], skip: int = 0, limit: int = 100) -> List[T]:
        """Busca registros com termo de busca em múltiplos campos."""
        session = self._get_session()
        try:
            query = session.query(self.model)
            
            search_conditions = []
            for field in search_fields:
                if hasattr(self.model, field):
                    search_conditions.append(getattr(self.model, field).ilike(f"%{search_term}%"))
            
            if search_conditions:
                query = query.filter(or_(*search_conditions))
            
            return query.offset(skip).limit(limit).all()
        finally:
            session.close()
    
    def update(self, id: int, **kwargs) -> Optional[T]:
        """Atualiza um registro existente."""
        session = self._get_session()
        try:
            instance = session.query(self.model).filter(self.model.id == id).first()
            if not instance:
                return None
            
            # Atualizar campos fornecidos
            for field, value in kwargs.items():
                if hasattr(instance, field):
                    setattr(instance, field, value)
            
            # Atualizar timestamp se o modelo tiver updated_at
            if hasattr(instance, 'updated_at'):
                instance.updated_at = datetime.utcnow()
            
            session.commit()
            session.refresh(instance)
            return instance
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def delete(self, id: int) -> bool:
        """Remove um registro (soft delete se suportado)."""
        session = self._get_session()
        try:
            instance = session.query(self.model).filter(self.model.id == id).first()
            if not instance:
                return False
            
            # Soft delete se o modelo tiver is_active
            if hasattr(instance, 'is_active'):
                instance.is_active = False
                if hasattr(instance, 'updated_at'):
                    instance.updated_at = datetime.utcnow()
                session.commit()
            else:
                # Hard delete
                session.delete(instance)
                session.commit()
            
            return True
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def hard_delete(self, id: int) -> bool:
        """Remove um registro permanentemente."""
        session = self._get_session()
        try:
            instance = session.query(self.model).filter(self.model.id == id).first()
            if not instance:
                return False
            
            session.delete(instance)
            session.commit()
            return True
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Conta o número de registros."""
        session = self._get_session()
        try:
            query = session.query(self.model)
            
            if filters:
                for field, value in filters.items():
                    if hasattr(self.model, field):
                        query = query.filter(getattr(self.model, field) == value)
            
            return query.count()
        finally:
            session.close()
    
    def exists(self, id: int) -> bool:
        """Verifica se um registro existe."""
        session = self._get_session()
        try:
            return session.query(self.model).filter(self.model.id == id).first() is not None
        finally:
            session.close() 