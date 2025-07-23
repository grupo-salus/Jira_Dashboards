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


class LoginResponse(BaseModel):
    """Schema para resposta de login."""
    success: bool
    message: str
    user: Optional[UserInfo] = None
    token: Optional[str] = None


class AuthStatus(BaseModel):
    """Schema para status de autenticação."""
    authenticated: bool
    user: Optional[UserInfo] = None
    ldap_enabled: bool
    ldap_connected: bool 