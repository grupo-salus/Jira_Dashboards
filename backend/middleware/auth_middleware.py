"""
Middleware de autenticação para verificar JWT tokens.
"""
import logging
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from services.jwt_service import jwt_service
from core.database import get_session_factory
from models import User

logger = logging.getLogger(__name__)

# Configurar HTTPBearer
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[User]:
    """
    Obtém o usuário atual baseado no token JWT.
    
    Args:
        credentials: Credenciais de autorização
        
    Returns:
        Objeto User se autenticado, None caso contrário
    """
    try:
        token = credentials.credentials
        user_data = jwt_service.get_user_from_token(token)
        
        if user_data is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Buscar usuário no banco de dados
        session_factory = get_session_factory()
        session = session_factory()
        
        try:
            user = session.query(User).filter_by(id=user_data["user_id"]).first()
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuário não encontrado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return user
            
        finally:
            session.close()
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter usuário atual: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erro de autenticação",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Obtém o usuário atual ativo.
    
    Args:
        current_user: Usuário atual
        
    Returns:
        Usuário ativo
        
    Raises:
        HTTPException: Se usuário não estiver ativo
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário inativo"
        )
    return current_user


async def get_current_superuser(current_user: User = Depends(get_current_active_user)) -> User:
    """
    Obtém o usuário atual superuser.
    
    Args:
        current_user: Usuário atual ativo
        
    Returns:
        Usuário superuser
        
    Raises:
        HTTPException: Se usuário não for superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissão insuficiente"
        )
    return current_user


def require_permissions(*required_permissions: str):
    """
    Decorator para verificar permissões específicas.
    
    Args:
        *required_permissions: Permissões necessárias
        
    Returns:
        Função decorator
    """
    def decorator(func):
        async def wrapper(current_user: User = Depends(get_current_active_user), *args, **kwargs):
            # Verificar se usuário tem todas as permissões necessárias
            for permission in required_permissions:
                if not hasattr(current_user, f"has_{permission}_permission"):
                    logger.warning(f"Permissão '{permission}' não definida para usuário {current_user.username}")
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Permissão '{permission}' não encontrada"
                    )
                
                permission_method = getattr(current_user, f"has_{permission}_permission")
                if not permission_method():
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Permissão '{permission}' necessária"
                    )
            
            return await func(current_user, *args, **kwargs)
        return wrapper
    return decorator 