"""
Serviço para gerenciamento de JWT tokens.
"""
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt

from core.settings import settings

logger = logging.getLogger(__name__)


class JWTService:
    """Serviço para gerenciamento de JWT tokens."""
    
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
        self.access_token_expire_minutes = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        self.refresh_token_expire_days = settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        """
        Cria um access token JWT.
        
        Args:
            data: Dados a serem incluídos no token
            
        Returns:
            Token JWT codificado
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": int(expire.timestamp()), "type": "access"})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        logger.debug(f"Access token criado para usuário: {data.get('sub', 'unknown')}")
        
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """
        Cria um refresh token JWT.
        
        Args:
            data: Dados a serem incluídos no token
            
        Returns:
            Token JWT codificado
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode.update({"exp": int(expire.timestamp()), "type": "refresh"})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        logger.debug(f"Refresh token criado para usuário: {data.get('sub', 'unknown')}")
        
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verifica e decodifica um token JWT.
        
        Args:
            token: Token JWT a ser verificado
            
        Returns:
            Dados decodificados do token ou None se inválido
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError as e:
            logger.warning(f"Token JWT inválido: {e}")
            return None
    
    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decodifica um token JWT sem verificar expiração.
        
        Args:
            token: Token JWT a ser decodificado
            
        Returns:
            Dados decodificados do token ou None se inválido
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm], options={"verify_exp": False})
            return payload
        except JWTError as e:
            logger.warning(f"Erro ao decodificar token JWT: {e}")
            return None
    
    def get_user_from_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Extrai informações do usuário de um token JWT.
        
        Args:
            token: Token JWT
            
        Returns:
            Informações do usuário ou None se inválido
        """
        payload = self.verify_token(token)
        if payload is None:
            return None
        
        # Verificar se é um access token
        if payload.get("type") != "access":
            logger.warning("Tentativa de usar refresh token como access token")
            return None
        
        return {
            "user_id": payload.get("sub"),
            "username": payload.get("username"),
            "email": payload.get("email"),
            "is_superuser": payload.get("is_superuser", False),
            "exp": payload.get("exp")
        }
    
    def is_token_expired(self, token: str) -> bool:
        """
        Verifica se um token JWT está expirado.
        
        Args:
            token: Token JWT
            
        Returns:
            True se expirado, False caso contrário
        """
        payload = self.decode_token(token)
        if payload is None:
            return True
        
        exp = payload.get("exp")
        if exp is None:
            return True
        
        # Converter timestamp para datetime
        exp_datetime = datetime.fromtimestamp(exp)
        current_datetime = datetime.utcnow()
        
        return current_datetime > exp_datetime
    
    def create_token_pair(self, user_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Cria um par de tokens (access + refresh).
        
        Args:
            user_data: Dados do usuário
            
        Returns:
            Dicionário com access_token e refresh_token
        """
        access_token = self.create_access_token(user_data)
        refresh_token = self.create_refresh_token(user_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }


# Instância global do serviço
jwt_service = JWTService() 