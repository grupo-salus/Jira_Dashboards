"""
Schemas para rotas administrativas.
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator


# =============================================================================
# SCHEMAS DE USUÁRIO
# =============================================================================

class UserBase(BaseModel):
    """Schema base para usuários."""
    username: str
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    employee_number: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    manager: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    """Schema para criação de usuário."""
    pass


class UserUpdate(BaseModel):
    """Schema para atualização de usuário."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    employee_number: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    manager: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


class UserResponse(UserBase):
    """Schema para resposta de usuário."""
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema para lista de usuários."""
    users: List[UserResponse]
    total: int
    skip: int
    limit: int


# =============================================================================
# SCHEMAS DE MÓDULO
# =============================================================================

class ModuleBase(BaseModel):
    """Schema base para módulos."""
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    route: Optional[str] = None
    is_active: bool = True
    order: int = 0


class ModuleCreate(ModuleBase):
    """Schema para criação de módulo."""
    pass


class ModuleUpdate(BaseModel):
    """Schema para atualização de módulo."""
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    route: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class ModuleResponse(ModuleBase):
    """Schema para resposta de módulo."""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ModuleListResponse(BaseModel):
    """Schema para lista de módulos."""
    modules: List[ModuleResponse]
    total: int
    skip: int
    limit: int


# =============================================================================
# SCHEMAS DE PERMISSÕES DE USUÁRIO
# =============================================================================

class UserModuleBase(BaseModel):
    """Schema base para permissões de usuário."""
    module_id: int
    can_read: bool = True
    can_write: bool = False
    can_delete: bool = False
    can_admin: bool = False


class UserModuleCreate(UserModuleBase):
    """Schema para criação de permissão de usuário."""
    pass


class UserModuleResponse(UserModuleBase):
    """Schema para resposta de permissão de usuário."""
    id: int
    user_id: int
    module: ModuleResponse
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserModuleListResponse(BaseModel):
    """Schema para lista de permissões de usuário."""
    user_modules: List[UserModuleResponse]


# =============================================================================
# SCHEMAS DE AUDITORIA
# =============================================================================

class AuditLogBase(BaseModel):
    """Schema base para logs de auditoria."""
    user_id: int
    action: str
    resource_type: str
    resource_id: Optional[int] = None
    details: Optional[dict] = None
    ip_address: Optional[str] = None


class AuditLogResponse(AuditLogBase):
    """Schema para resposta de log de auditoria."""
    id: int
    created_at: datetime
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True


class AuditLogListResponse(BaseModel):
    """Schema para lista de logs de auditoria."""
    audit_logs: List[AuditLogResponse]
    total: int
    skip: int
    limit: int


# =============================================================================
# SCHEMAS DE ESTATÍSTICAS
# =============================================================================

class SystemStats(BaseModel):
    """Schema para estatísticas do sistema."""
    total_users: int
    active_users: int
    total_modules: int
    active_modules: int
    total_audit_logs: int
    logs_today: int
    logs_this_week: int
    logs_this_month: int


class UserStats(BaseModel):
    """Schema para estatísticas de usuário."""
    user_id: int
    username: str
    login_count: int
    last_login: Optional[datetime] = None
    modules_count: int
    actions_count: int
    actions_today: int 