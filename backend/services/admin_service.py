"""
Serviço administrativo para gerenciar usuários, módulos e permissões.
"""
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from repositories import user_repository, module_repository, user_module_repository, audit_log_repository
from models import User, Module, UserModule, AuditLog
from schemas.admin import (
    UserCreate, UserUpdate, ModuleCreate, ModuleUpdate, UserModuleCreate
)

logger = logging.getLogger(__name__)


class AdminService:
    """Serviço para operações administrativas."""
    
    def __init__(self):
        self.user_repo = user_repository
        self.module_repo = module_repository
        self.user_module_repo = user_module_repository
        self.audit_repo = audit_log_repository
    
    def _log_audit(self, user_id: int, action: str, resource_type: str, 
                   resource_id: Optional[int] = None, details: Optional[str] = None,
                   ip_address: Optional[str] = None):
        """Registra um log de auditoria."""
        try:
            audit_data = {
                'user_id': user_id,
                'action': action,
                'resource_type': resource_type,
                'resource_id': resource_id,
                'details': details,
                'ip_address': ip_address
            }
            self.audit_repo.create(**audit_data)
            logger.info(f"Audit log: {action} on {resource_type} by user {user_id}")
        except Exception as e:
            logger.error(f"Erro ao registrar audit log: {e}")
    
    # =============================================================================
    # OPERAÇÕES DE USUÁRIO
    # =============================================================================
    
    def list_users(self, skip: int = 0, limit: int = 100, 
                   search: Optional[str] = None, is_active: Optional[bool] = None) -> List[User]:
        """Lista usuários com filtros."""
        try:
            if search:
                return self.user_repo.search_users(search, skip=skip, limit=limit)
            elif is_active is not None:
                filters = {"is_active": is_active}
                return self.user_repo.find_by_filters(filters, skip=skip, limit=limit)
            else:
                return self.user_repo.get_all(skip=skip, limit=limit)
        except Exception as e:
            logger.error(f"Erro ao listar usuários: {e}")
            raise
    
    def get_user(self, user_id: int) -> Optional[User]:
        """Obtém um usuário por ID."""
        try:
            return self.user_repo.get_by_id(user_id)
        except Exception as e:
            logger.error(f"Erro ao buscar usuário {user_id}: {e}")
            raise
    
    def create_user(self, user_data: UserCreate) -> User:
        """Cria um novo usuário."""
        try:
            # Verificar se username já existe
            if self.user_repo.username_exists(user_data.username):
                raise ValueError("Username já existe")
            
            # Verificar se email já existe
            if user_data.email and self.user_repo.email_exists(user_data.email):
                raise ValueError("Email já existe")
            
            # Criar usuário
            user = self.user_repo.create(**user_data.dict())
            
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
            logger.error(f"Erro ao criar usuário: {e}")
            raise
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Atualiza um usuário existente."""
        try:
            # Verificar se usuário existe
            user = self.user_repo.get_by_id(user_id)
            if not user:
                return None
            
            # Verificar se username já existe (se foi alterado)
            if user_data.username and user_data.username != user.username:
                if self.user_repo.username_exists(user_data.username):
                    raise ValueError("Username já existe")
            
            # Verificar se email já existe (se foi alterado)
            if user_data.email and user_data.email != user.email:
                if self.user_repo.email_exists(user_data.email):
                    raise ValueError("Email já existe")
            
            # Atualizar usuário
            update_data = user_data.dict(exclude_unset=True)
            updated_user = self.user_repo.update(user_id, **update_data)
            
            if updated_user:
                # Registrar audit log
                self._log_audit(
                    user_id=user_id,
                    action="UPDATE",
                    resource_type="USER",
                    resource_id=user_id,
                    details=f"Usuário atualizado: {updated_user.username}"
                )
            
            return updated_user
            
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário {user_id}: {e}")
            raise
    
    def delete_user(self, user_id: int) -> bool:
        """Desativa um usuário (soft delete)."""
        try:
            user = self.user_repo.get_by_id(user_id)
            if not user:
                return False
            
            success = self.user_repo.delete(user_id)
            
            if success:
                # Registrar audit log
                self._log_audit(
                    user_id=user_id,
                    action="DELETE",
                    resource_type="USER",
                    resource_id=user_id,
                    details=f"Usuário desativado: {user.username}"
                )
            
            return success
            
        except Exception as e:
            logger.error(f"Erro ao deletar usuário {user_id}: {e}")
            raise
    
    # =============================================================================
    # OPERAÇÕES DE MÓDULO
    # =============================================================================
    
    def list_modules(self, skip: int = 0, limit: int = 100,
                     search: Optional[str] = None, is_active: Optional[bool] = None) -> List[Module]:
        """Lista módulos com filtros."""
        try:
            if search:
                return self.module_repo.search_modules(search, skip=skip, limit=limit)
            elif is_active is not None:
                filters = {"is_active": is_active}
                return self.module_repo.find_by_filters(filters, skip=skip, limit=limit)
            else:
                return self.module_repo.get_modules_by_order(skip=skip, limit=limit)
        except Exception as e:
            logger.error(f"Erro ao listar módulos: {e}")
            raise
    
    def get_module(self, module_id: int) -> Optional[Module]:
        """Obtém um módulo por ID."""
        try:
            return self.module_repo.get_by_id(module_id)
        except Exception as e:
            logger.error(f"Erro ao buscar módulo {module_id}: {e}")
            raise
    
    def create_module(self, module_data: ModuleCreate) -> Module:
        """Cria um novo módulo."""
        try:
            # Verificar se nome já existe
            if self.module_repo.name_exists(module_data.name):
                raise ValueError("Nome do módulo já existe")
            
            # Criar módulo
            module = self.module_repo.create(**module_data.dict())
            
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
            logger.error(f"Erro ao criar módulo: {e}")
            raise
    
    def update_module(self, module_id: int, module_data: ModuleUpdate) -> Optional[Module]:
        """Atualiza um módulo existente."""
        try:
            # Verificar se módulo existe
            module = self.module_repo.get_by_id(module_id)
            if not module:
                return None
            
            # Verificar se nome já existe (se foi alterado)
            if module_data.name and module_data.name != module.name:
                if self.module_repo.name_exists(module_data.name):
                    raise ValueError("Nome do módulo já existe")
            
            # Atualizar módulo
            update_data = module_data.dict(exclude_unset=True)
            updated_module = self.module_repo.update(module_id, **update_data)
            
            if updated_module:
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="UPDATE",
                    resource_type="MODULE",
                    resource_id=module_id,
                    details=f"Módulo atualizado: {updated_module.name}"
                )
            
            return updated_module
            
        except Exception as e:
            logger.error(f"Erro ao atualizar módulo {module_id}: {e}")
            raise
    
    def delete_module(self, module_id: int) -> bool:
        """Desativa um módulo (soft delete)."""
        try:
            module = self.module_repo.get_by_id(module_id)
            if not module:
                return False
            
            success = self.module_repo.delete(module_id)
            
            if success:
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="DELETE",
                    resource_type="MODULE",
                    resource_id=module_id,
                    details=f"Módulo desativado: {module.name}"
                )
            
            return success
            
        except Exception as e:
            logger.error(f"Erro ao deletar módulo {module_id}: {e}")
            raise
    
    # =============================================================================
    # OPERAÇÕES DE PERMISSÕES DE USUÁRIO
    # =============================================================================
    
    def list_user_modules(self, user_id: int) -> List[UserModule]:
        """Lista todos os módulos de um usuário."""
        try:
            return self.user_module_repo.get_user_modules(user_id)
        except Exception as e:
            logger.error(f"Erro ao listar módulos do usuário {user_id}: {e}")
            raise
    
    def assign_module_to_user(self, user_id: int, user_module_data: UserModuleCreate) -> UserModule:
        """Atribui um módulo a um usuário."""
        try:
            # Verificar se usuário existe
            user = self.user_repo.get_by_id(user_id)
            if not user:
                raise ValueError("Usuário não encontrado")
            
            # Verificar se módulo existe
            module = self.module_repo.get_by_id(user_module_data.module_id)
            if not module:
                raise ValueError("Módulo não encontrado")
            
            # Verificar se permissão já existe
            existing_permission = self.user_module_repo.get_by_user_and_module(
                user_id, user_module_data.module_id
            )
            
            if existing_permission:
                # Atualizar permissão existente
                update_data = user_module_data.dict(exclude={'module_id'})
                updated_permission = self.user_module_repo.update(existing_permission.id, **update_data)
                
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="UPDATE",
                    resource_type="USER_MODULE",
                    resource_id=existing_permission.id,
                    details=f"Permissão atualizada para usuário {user.username} no módulo {module.name}"
                )
                
                return updated_permission
            else:
                # Criar nova permissão
                user_module = self.user_module_repo.create(
                    user_id=user_id,
                    **user_module_data.dict()
                )
                
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
            logger.error(f"Erro ao atribuir módulo ao usuário {user_id}: {e}")
            raise
    
    def remove_module_from_user(self, user_id: int, module_id: int) -> bool:
        """Remove um módulo de um usuário."""
        try:
            success = self.user_module_repo.remove_user_module(user_id, module_id)
            
            if success:
                # Registrar audit log
                self._log_audit(
                    user_id=1,  # Sistema
                    action="DELETE",
                    resource_type="USER_MODULE",
                    details=f"Permissão removida do usuário {user_id} no módulo {module_id}"
                )
            
            return success
            
        except Exception as e:
            logger.error(f"Erro ao remover módulo do usuário {user_id}: {e}")
            raise
    
    # =============================================================================
    # OPERAÇÕES DE AUDITORIA
    # =============================================================================
    
    def list_audit_logs(self, skip: int = 0, limit: int = 100,
                        user_id: Optional[int] = None, action: Optional[str] = None,
                        start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[AuditLog]:
        """Lista logs de auditoria com filtros."""
        try:
            if user_id:
                return self.audit_repo.get_logs_by_user(user_id, skip=skip, limit=limit)
            elif action:
                return self.audit_repo.get_logs_by_action(action, skip=skip, limit=limit)
            elif start_date and end_date:
                start_dt = datetime.fromisoformat(start_date)
                end_dt = datetime.fromisoformat(end_date)
                return self.audit_repo.get_logs_by_date_range(start_dt, end_dt, skip=skip, limit=limit)
            else:
                return self.audit_repo.get_recent_logs(limit=limit)
        except Exception as e:
            logger.error(f"Erro ao listar logs de auditoria: {e}")
            raise
    
    def get_audit_log(self, log_id: int) -> Optional[AuditLog]:
        """Obtém um log de auditoria por ID."""
        try:
            return self.audit_repo.get_by_id(log_id)
        except Exception as e:
            logger.error(f"Erro ao buscar log de auditoria {log_id}: {e}")
            raise


# Instância global do serviço
admin_service = AdminService() 