"""
Schemas para autenticação.
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Schema para requisição de login."""
    username: str
    password: str


class UserInfo(BaseModel):
    """Schema para informações do usuário."""
    username: str
    display_name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    employee_number: Optional[str] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    manager: Optional[str] = None
    last_logon: Optional[str] = None
    account_control: Optional[int] = None


class TokenResponse(BaseModel):
    """Schema para resposta de tokens JWT."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """Schema para requisição de refresh token."""
    refresh_token: str


class TokenData(BaseModel):
    """Schema para dados do token."""
    user_id: Optional[int] = None
    username: Optional[str] = None
    email: Optional[str] = None
    is_superuser: bool = False


class LoginResponse(BaseModel):
    """Schema para resposta de login."""
    success: bool
    message: str
    user: Optional[UserInfo] = None
    tokens: Optional[TokenResponse] = None


class AuthStatus(BaseModel):
    """Schema para status de autenticação."""
    authenticated: bool
    user: Optional[UserInfo] = None
    ldap_enabled: bool
    ldap_connected: bool 