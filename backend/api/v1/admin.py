"""
Rotas administrativas para gerenciar usuários, módulos e permissões.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, Request
from sqlalchemy.orm import Session

from middleware.auth_middleware import get_current_superuser
from middleware.rate_limiting import rate_limit_strict
from core.database import get_session_factory
from models import User, Module, UserModule, AuditLog
from schemas.admin import (
    UserCreate, UserUpdate, UserResponse, UserListResponse,
    ModuleCreate, ModuleUpdate, ModuleResponse, ModuleListResponse,
    UserModuleCreate, UserModuleResponse, UserModuleListResponse,
    AuditLogResponse, AuditLogListResponse
)
from services.admin_service import admin_service

router = APIRouter(prefix="/admin", tags=["Administração"])


# =============================================================================
# ROTAS DE USUÁRIOS
# =============================================================================

@router.get("/users", response_model=UserListResponse)
@rate_limit_strict()
async def list_users(
    request: Request,
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros"),
    search: Optional[str] = Query(None, description="Termo de busca"),
    is_active: Optional[bool] = Query(None, description="Filtrar por status ativo"),
    current_user: User = Depends(get_current_superuser)
):
    """
    Lista todos os usuários com paginação e filtros.
    """
    try:
        users = admin_service.list_users(
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active
        )
        
        return UserListResponse(
            users=users,
            total=len(users),
            skip=skip,
            limit=limit
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}", response_model=UserResponse)
@rate_limit_strict()
async def get_user(
    request: Request,
    user_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Obtém detalhes de um usuário específico.
    """
    try:
        user = admin_service.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return UserResponse.from_orm(user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/users", response_model=UserResponse)
@rate_limit_strict()
async def create_user(
    request: Request,
    user_data: UserCreate,
    current_user: User = Depends(get_current_superuser)
):
    """
    Cria um novo usuário.
    """
    try:
        user = admin_service.create_user(user_data)
        return UserResponse.from_orm(user)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/users/{user_id}", response_model=UserResponse)
@rate_limit_strict()
async def update_user(
    request: Request,
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_superuser)
):
    """
    Atualiza um usuário existente.
    """
    try:
        user = admin_service.update_user(user_id, user_data)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return UserResponse.from_orm(user)
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}")
@rate_limit_strict()
async def delete_user(
    request: Request,
    user_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Desativa um usuário (soft delete).
    """
    try:
        success = admin_service.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        return {"message": "Usuário desativado com sucesso"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# ROTAS DE MÓDULOS
# =============================================================================

@router.get("/modules", response_model=ModuleListResponse)
@rate_limit_strict()
async def list_modules(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_superuser)
):
    """
    Lista todos os módulos com paginação e filtros.
    """
    try:
        modules = admin_service.list_modules(
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active
        )
        
        return ModuleListResponse(
            modules=modules,
            total=len(modules),
            skip=skip,
            limit=limit
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/modules/{module_id}", response_model=ModuleResponse)
@rate_limit_strict()
async def get_module(
    request: Request,
    module_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Obtém detalhes de um módulo específico.
    """
    try:
        module = admin_service.get_module(module_id)
        if not module:
            raise HTTPException(status_code=404, detail="Módulo não encontrado")
        
        return ModuleResponse.from_orm(module)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/modules", response_model=ModuleResponse)
@rate_limit_strict()
async def create_module(
    request: Request,
    module_data: ModuleCreate,
    current_user: User = Depends(get_current_superuser)
):
    """
    Cria um novo módulo.
    """
    try:
        module = admin_service.create_module(module_data)
        return ModuleResponse.from_orm(module)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/modules/{module_id}", response_model=ModuleResponse)
@rate_limit_strict()
async def update_module(
    request: Request,
    module_id: int,
    module_data: ModuleUpdate,
    current_user: User = Depends(get_current_superuser)
):
    """
    Atualiza um módulo existente.
    """
    try:
        module = admin_service.update_module(module_id, module_data)
        if not module:
            raise HTTPException(status_code=404, detail="Módulo não encontrado")
        
        return ModuleResponse.from_orm(module)
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/modules/{module_id}")
@rate_limit_strict()
async def delete_module(
    request: Request,
    module_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Desativa um módulo (soft delete).
    """
    try:
        success = admin_service.delete_module(module_id)
        if not success:
            raise HTTPException(status_code=404, detail="Módulo não encontrado")
        
        return {"message": "Módulo desativado com sucesso"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# ROTAS DE PERMISSÕES DE USUÁRIO
# =============================================================================

@router.get("/users/{user_id}/modules", response_model=UserModuleListResponse)
@rate_limit_strict()
async def list_user_modules(
    request: Request,
    user_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Lista todos os módulos de um usuário.
    """
    try:
        user_modules = admin_service.list_user_modules(user_id)
        return UserModuleListResponse(user_modules=user_modules)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/users/{user_id}/modules", response_model=UserModuleResponse)
@rate_limit_strict()
async def assign_module_to_user(
    request: Request,
    user_id: int,
    user_module_data: UserModuleCreate,
    current_user: User = Depends(get_current_superuser)
):
    """
    Atribui um módulo a um usuário.
    """
    try:
        user_module = admin_service.assign_module_to_user(user_id, user_module_data)
        return UserModuleResponse.from_orm(user_module)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}/modules/{module_id}")
@rate_limit_strict()
async def remove_module_from_user(
    request: Request,
    user_id: int,
    module_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Remove um módulo de um usuário.
    """
    try:
        success = admin_service.remove_module_from_user(user_id, module_id)
        if not success:
            raise HTTPException(status_code=404, detail="Permissão não encontrada")
        
        return {"message": "Permissão removida com sucesso"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# ROTAS DE AUDITORIA
# =============================================================================

@router.get("/audit-logs", response_model=AuditLogListResponse)
@rate_limit_strict()
async def list_audit_logs(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user: User = Depends(get_current_superuser)
):
    """
    Lista logs de auditoria com filtros.
    """
    try:
        audit_logs = admin_service.list_audit_logs(
            skip=skip,
            limit=limit,
            user_id=user_id,
            action=action,
            start_date=start_date,
            end_date=end_date
        )
        
        return AuditLogListResponse(
            audit_logs=audit_logs,
            total=len(audit_logs),
            skip=skip,
            limit=limit
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audit-logs/{log_id}", response_model=AuditLogResponse)
@rate_limit_strict()
async def get_audit_log(
    request: Request,
    log_id: int,
    current_user: User = Depends(get_current_superuser)
):
    """
    Obtém detalhes de um log de auditoria específico.
    """
    try:
        audit_log = admin_service.get_audit_log(log_id)
        if not audit_log:
            raise HTTPException(status_code=404, detail="Log não encontrado")
        
        return AuditLogResponse.from_orm(audit_log)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 