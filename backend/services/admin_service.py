"""
Serviço administrativo para gerenciar usuários, módulos e permissões.
"""
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func

from core.database import get_session_factory
from models import User, Module, UserModule, AuditLog
from schemas.admin import (
    UserCreate, UserUpdate, ModuleCreate, ModuleUpdate, UserModuleCreate
)

logger = logging.getLogger(__name__)


class AdminService:
    """Serviço para operações administrativas."""
    
    def __init__(self):
        self.session_factory = get_session_factory()
    
    def _get_session(self) -> Session:
        """Obtém uma sessão do banco de dados."""
        return self.session_factory()
    
    def _log_audit(self, user_id: int, action: str, resource_type: str, 
                   resource_id: Optional[int] = None, details: Optional[str] = None,
                   ip_address: Optional[str] = None):
        """Registra um log de auditoria."""
        try:
            session = self._get_session()
            audit_log = AuditLog(
                user_id=user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                details=details,
                ip_address=ip_address
            )
            session.add(audit_log)
            session.commit()
            logger.info(f"Audit log: {action} on {resource_type} by user {user_id}")
        except Exception as e:
            logger.error(f"Erro ao registrar audit log: {e}")
            session.rollback()
        finally:
            session.close()
    
    # =============================================================================
    # OPERAÇÕES DE USUÁRIO
    # =============================================================================
    
    def list_users(self, skip: int = 0, limit: int = 100, 
                   search: Optional[str] = None, is_active: Optional[bool] = None) -> List[User]:
        """Lista usuários com filtros."""
        session = self._get_session()
        try:
            query = session.query(User)
            
            # Aplicar filtros
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        User.username.ilike(search_term),
                        User.display_name.ilike(search_term),
                        User.email.ilike(search_term),
                        User.department.ilike(search_term)
                    )
                )
            
            if is_active is not None:
                query = query.filter(User.is_active == is_active)
            
            # Aplicar paginação
            users = query.offset(skip).limit(limit).all()
            return users
            
        finally:
            session.close()
    
    def get_user(self, user_id: int) -> Optional[User]:
        """Obtém um usuário por ID."""
        session = self._get_session()
        try:
            return session.query(User).filter(User.id == user_id).first()
        finally:
            session.close()
    
    def create_user(self, user_data: UserCreate) -> User:
        """Cria um novo usuário."""
        session = self._get_session()
        try:
            # Verificar se username já existe
            existing_user = session.query(User).filter(User.username == user_data.username).first()
            if existing_user:
                raise ValueError("Username já existe")
            
            # Criar usuário
            user = User(**user_data.dict())
            session.add(user)
            session.commit()
            session.refresh(user)
            
            # Registrar audit log
            self._log_audit(
                user_id=user.id,
                action="CREATE",
                resource_type="USER",
                resource_id=user.id,
                details=f"Usuário criado: {user.username}"
            )
            
            return user
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Atualiza um usuário existente."""
        session = self._get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return None
            
            # Atualizar campos fornecidos
            update_data = user_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(user, field, value)
            
            user.updated_at = datetime.utcnow()
            session.commit()
            session.refresh(user)
            
            # Registrar audit log
            self._log_audit(
                user_id=user_id,
                action="UPDATE",
                resource_type="USER",
                resource_id=user_id,
                details=f"Usuário atualizado: {user.username}"
            )
            
            return user
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def delete_user(self, user_id: int) -> bool:
        """Desativa um usuário (soft delete)."""
        session = self._get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            session.commit()
            
            # Registrar audit log
            self._log_audit(
                user_id=user_id,
                action="DELETE",
                resource_type="USER",
                resource_id=user_id,
                details=f"Usuário desativado: {user.username}"
            )
            
            return True
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    # =============================================================================
    # OPERAÇÕES DE MÓDULO
    # =============================================================================
    
    def list_modules(self, skip: int = 0, limit: int = 100,
                     search: Optional[str] = None, is_active: Optional[bool] = None) -> List[Module]:
        """Lista módulos com filtros."""
        session = self._get_session()
        try:
            query = session.query(Module)
            
            # Aplicar filtros
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        Module.name.ilike(search_term),
                        Module.description.ilike(search_term)
                    )
                )
            
            if is_active is not None:
                query = query.filter(Module.is_active == is_active)
            
            # Ordenar por ordem
            query = query.order_by(Module.order, Module.name)
            
            # Aplicar paginação
            modules = query.offset(skip).limit(limit).all()
            return modules
            
        finally:
            session.close()
    
    def get_module(self, module_id: int) -> Optional[Module]:
        """Obtém um módulo por ID."""
        session = self._get_session()
        try:
            return session.query(Module).filter(Module.id == module_id).first()
        finally:
            session.close()
    
    def create_module(self, module_data: ModuleCreate) -> Module:
        """Cria um novo módulo."""
        session = self._get_session()
        try:
            # Verificar se nome já existe
            existing_module = session.query(Module).filter(Module.name == module_data.name).first()
            if existing_module:
                raise ValueError("Nome do módulo já existe")
            
            # Criar módulo
            module = Module(**module_data.dict())
            session.add(module)
            session.commit()
            session.refresh(module)
            
            # Registrar audit log
            self._log_audit(
                user_id=1,  # Sistema
                action="CREATE",
                resource_type="MODULE",
                resource_id=module.id,
                details=f"Módulo criado: {module.name}"
            )
            
            return module
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def update_module(self, module_id: int, module_data: ModuleUpdate) -> Optional[Module]:
        """Atualiza um módulo existente."""
        session = self._get_session()
        try:
            module = session.query(Module).filter(Module.id == module_id).first()
            if not module:
                return None
            
            # Atualizar campos fornecidos
            update_data = module_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(module, field, value)
            
            module.updated_at = datetime.utcnow()
            session.commit()
            session.refresh(module)
            
            # Registrar audit log
            self._log_audit(
                user_id=1,  # Sistema
                action="UPDATE",
                resource_type="MODULE",
                resource_id=module_id,
                details=f"Módulo atualizado: {module.name}"
            )
            
            return module
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def delete_module(self, module_id: int) -> bool:
        """Desativa um módulo (soft delete)."""
        session = self._get_session()
        try:
            module = session.query(Module).filter(Module.id == module_id).first()
            if not module:
                return False
            
            module.is_active = False
            module.updated_at = datetime.utcnow()
            session.commit()
            
            # Registrar audit log
            self._log_audit(
                user_id=1,  # Sistema
                action="DELETE",
                resource_type="MODULE",
                resource_id=module_id,
                details=f"Módulo desativado: {module.name}"
            )
            
            return True
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    # =============================================================================
    # OPERAÇÕES DE PERMISSÕES DE USUÁRIO
    # =============================================================================
    
    def list_user_modules(self, user_id: int) -> List[UserModule]:
        """Lista todos os módulos de um usuário."""
        session = self._get_session()
        try:
            return session.query(UserModule).filter(UserModule.user_id == user_id).all()
        finally:
            session.close()
    
    def assign_module_to_user(self, user_id: int, user_module_data: UserModuleCreate) -> UserModule:
        """Atribui um módulo a um usuário."""
        session = self._get_session()
        try:
            # Verificar se usuário existe
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise ValueError("Usuário não encontrado")
            
            # Verificar se módulo existe
            module = session.query(Module).filter(Module.id == user_module_data.module_id).first()
            if not module:
                raise ValueError("Módulo não encontrado")
            
            # Verificar se permissão já existe
            existing_permission = session.query(UserModule).filter(
                and_(
                    UserModule.user_id == user_id,
                    UserModule.module_id == user_module_data.module_id
                )
            ).first()
            
            if existing_permission:
                # Atualizar permissão existente
                for field, value in user_module_data.dict(exclude={'module_id'}).items():
                    setattr(existing_permission, field, value)
                existing_permission.updated_at = datetime.utcnow()
                session.commit()
                session.refresh(existing_permission)
                
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="UPDATE",
                    resource_type="USER_MODULE",
                    resource_id=existing_permission.id,
                    details=f"Permissão atualizada para usuário {user.username} no módulo {module.name}"
                )
                
                return existing_permission
            else:
                # Criar nova permissão
                user_module = UserModule(
                    user_id=user_id,
                    **user_module_data.dict()
                )
                session.add(user_module)
                session.commit()
                session.refresh(user_module)
                
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="CREATE",
                    resource_type="USER_MODULE",
                    resource_id=user_module.id,
                    details=f"Permissão criada para usuário {user.username} no módulo {module.name}"
                )
                
                return user_module
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    def remove_module_from_user(self, user_id: int, module_id: int) -> bool:
        """Remove um módulo de um usuário."""
        session = self._get_session()
        try:
            user_module = session.query(UserModule).filter(
                and_(
                    UserModule.user_id == user_id,
                    UserModule.module_id == module_id
                )
            ).first()
            
            if not user_module:
                return False
            
            session.delete(user_module)
            session.commit()
            
            # Registrar audit log
            self._log_audit(
                user_id=1,  # Sistema
                action="DELETE",
                resource_type="USER_MODULE",
                resource_id=user_module.id,
                details=f"Permissão removida do usuário {user_id} no módulo {module_id}"
            )
            
            return True
            
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()
    
    # =============================================================================
    # OPERAÇÕES DE AUDITORIA
    # =============================================================================
    
    def list_audit_logs(self, skip: int = 0, limit: int = 100,
                        user_id: Optional[int] = None, action: Optional[str] = None,
                        start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[AuditLog]:
        """Lista logs de auditoria com filtros."""
        session = self._get_session()
        try:
            query = session.query(AuditLog)
            
            # Aplicar filtros
            if user_id:
                query = query.filter(AuditLog.user_id == user_id)
            
            if action:
                query = query.filter(AuditLog.action == action)
            
            if start_date:
                try:
                    start_datetime = datetime.fromisoformat(start_date)
                    query = query.filter(AuditLog.created_at >= start_datetime)
                except ValueError:
                    pass
            
            if end_date:
                try:
                    end_datetime = datetime.fromisoformat(end_date)
                    query = query.filter(AuditLog.created_at <= end_datetime)
                except ValueError:
                    pass
            
            # Ordenar por data de criação (mais recente primeiro)
            query = query.order_by(AuditLog.created_at.desc())
            
            # Aplicar paginação
            audit_logs = query.offset(skip).limit(limit).all()
            return audit_logs
            
        finally:
            session.close()
    
    def get_audit_log(self, log_id: int) -> Optional[AuditLog]:
        """Obtém um log de auditoria por ID."""
        session = self._get_session()
        try:
            return session.query(AuditLog).filter(AuditLog.id == log_id).first()
        finally:
            session.close()


# Instância global do serviço
admin_service = AdminService() 