"""
Rotas de autenticação.
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging

from services.auth_service import auth_service
from schemas.auth import LoginRequest, LoginResponse, UserInfo, AuthStatus

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["autenticação"])
security = HTTPBearer()


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, request: Request):
    """
    Endpoint para autenticação de usuário via LDAP com verificação no banco de dados.
    
    Args:
        login_data: Dados de login (username e password)
        request: Objeto de requisição para obter IP do cliente
        
    Returns:
        LoginResponse com informações do usuário autenticado
    """
    try:
        logger.info(f"Tentativa de login para usuário: {login_data.username}")
        
        # Obter IP do cliente
        client_ip = request.client.host if request.client else None
        
        # Autenticar usuário no LDAP e verificar no banco de dados
        user_info = auth_service.authenticate_user_with_db_check(
            username=login_data.username,
            password=login_data.password,
            ip_address=client_ip
        )
        
        if not user_info:
            logger.warning(f"Falha na autenticação do usuário: {login_data.username}")
            raise HTTPException(
                status_code=401,
                detail="Credenciais inválidas ou usuário desabilitado"
            )
        
        # Converter para schema Pydantic
        user = UserInfo(**user_info)
        
        logger.info(f"Login bem-sucedido para usuário: {login_data.username}")
        
        return LoginResponse(
            success=True,
            message="Login realizado com sucesso",
            user=user,
            token="dummy_token"  # TODO: Implementar JWT
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro durante login: {e}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno do servidor"
        )


@router.get("/status", response_model=AuthStatus)
async def auth_status():
    """
    Endpoint para verificar status da autenticação e conexão LDAP.
    
    Returns:
        AuthStatus com informações sobre autenticação e LDAP
    """
    try:
        # Testar conexão LDAP
        ldap_connected = auth_service._connect_ldap()
        
        return AuthStatus(
            authenticated=False,  # TODO: Implementar verificação de sessão
            user=None,
            ldap_enabled=auth_service._connect_ldap() if hasattr(auth_service, '_connect_ldap') else False,
            ldap_connected=ldap_connected
        )
        
    except Exception as e:
        logger.error(f"Erro ao verificar status de autenticação: {e}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno do servidor"
        )


@router.post("/logout")
async def logout():
    """
    Endpoint para logout do usuário.
    
    Returns:
        Mensagem de confirmação
    """
    try:
        # TODO: Implementar invalidação de token/sessão
        logger.info("Logout realizado")
        
        return {
            "success": True,
            "message": "Logout realizado com sucesso"
        }
        
    except Exception as e:
        logger.error(f"Erro durante logout: {e}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno do servidor"
        )


@router.get("/user/{username}", response_model=UserInfo)
async def get_user_info(username: str):
    """
    Endpoint para buscar informações de um usuário no LDAP.
    
    Args:
        username: Nome de usuário (sAMAccountName)
        
    Returns:
        UserInfo com informações do usuário
    """
    try:
        logger.info(f"Buscando informações do usuário: {username}")
        
        user_info = auth_service.search_user(username)
        
        if not user_info:
            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado"
            )
        
        return UserInfo(**user_info)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar usuário {username}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Erro interno do servidor"
        ) 