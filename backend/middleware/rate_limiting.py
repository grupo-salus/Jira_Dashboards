"""
Middleware de rate limiting para proteger a API.
"""
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response

from core.settings import settings

logger = logging.getLogger(__name__)

# Configurar limiter
limiter = Limiter(key_func=get_remote_address)


def get_client_ip(request: Request) -> str:
    """
    Obtém o IP real do cliente, considerando proxies.
    
    Args:
        request: Requisição FastAPI
        
    Returns:
        IP do cliente
    """
    # Verificar headers de proxy
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # IP padrão
    return request.client.host if request.client else "unknown"


def rate_limit_by_ip(request: Request) -> str:
    """
    Função para obter chave de rate limiting baseada no IP.
    
    Args:
        request: Requisição FastAPI
        
    Returns:
        Chave para rate limiting
    """
    return get_client_ip(request)


def rate_limit_by_user(request: Request) -> str:
    """
    Função para obter chave de rate limiting baseada no usuário.
    
    Args:
        request: Requisição FastAPI
        
    Returns:
        Chave para rate limiting
    """
    # Tentar obter usuário do token JWT
    try:
        from services.jwt_service import jwt_service
        
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            user_data = jwt_service.get_user_from_token(token)
            if user_data:
                return f"user:{user_data['user_id']}"
    except Exception as e:
        logger.debug(f"Erro ao obter usuário para rate limiting: {e}")
    
    # Fallback para IP
    return get_client_ip(request)


# Decorators de rate limiting
def rate_limit_default():
    """Rate limiting padrão para endpoints gerais."""
    return limiter.limit(settings.RATE_LIMIT_DEFAULT)


def rate_limit_auth():
    """Rate limiting para endpoints de autenticação."""
    return limiter.limit(settings.RATE_LIMIT_AUTH)


def rate_limit_strict():
    """Rate limiting mais restritivo para endpoints sensíveis."""
    return limiter.limit(settings.RATE_LIMIT_STRICT)


def rate_limit_by_user_limit():
    """Rate limiting baseado no usuário."""
    return limiter.limit(settings.RATE_LIMIT_DEFAULT, key_func=rate_limit_by_user)


def rate_limit_auth_by_user():
    """Rate limiting de autenticação baseado no usuário."""
    return limiter.limit(settings.RATE_LIMIT_AUTH, key_func=rate_limit_by_user)


async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Handler personalizado para quando o rate limit é excedido.
    
    Args:
        request: Requisição FastAPI
        exc: Exceção de rate limit excedido
        
    Returns:
        Resposta de erro
    """
    client_ip = get_client_ip(request)
    logger.warning(f"Rate limit excedido para IP: {client_ip}")
    
    import json
    content = {
        "error": "Rate limit exceeded",
        "message": "Too many requests. Please try again later.",
        "retry_after": exc.retry_after
    }
    
    return Response(
        content=json.dumps(content),
        status_code=429,
        media_type="application/json"
    )


def setup_rate_limiting(app):
    """
    Configura rate limiting na aplicação.
    
    Args:
        app: Aplicação FastAPI
    """
    # Configurar limiter na aplicação
    app.state.limiter = limiter
    
    # Configurar handler de erro
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    
    logger.info("Rate limiting configurado com sucesso") 