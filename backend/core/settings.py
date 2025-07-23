"""
Configurações simplificadas da aplicação.
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """Configurações essenciais da aplicação."""
    
    # =============================================================================
    # CONFIGURAÇÕES BÁSICAS
    # =============================================================================
    
    # Ambiente
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Secret key para JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # =============================================================================
    # BANCO DE DADOS
    # =============================================================================
    
    # Tipo: sqlite ou sqlserver
    DATABASE_TYPE: str = "sqlite"
    
    # SQLite
    SQLITE_DATABASE_PATH: str = "./jira_dashboards.db"
    
    # SQL Server
    DATABASE_SERVER: str = "localhost"
    DATABASE_NAME: str = "jira_dashboards"
    DATABASE_USER: str = "sa"
    DATABASE_PASSWORD: str = ""
    
    # =============================================================================
    # JIRA
    # =============================================================================
    
    JIRA_URL: str = "https://tigruposalus.atlassian.net"
    JIRA_EMAIL: str = "email@gruposalus.com.br"
    JIRA_API_TOKEN: str = ""
    
    # =============================================================================
    # LDAP
    # =============================================================================
    
    LDAP_ENABLED: bool = True
    LDAP_SERVER: str = "ldap://your-ldap-server.com"
    LDAP_BASE_DN: str = "DC=gruposalus,DC=com,DC=br"
    LDAP_BIND_DN: str = "CN=ServiceAccount,OU=ServiceAccounts,DC=gruposalus,DC=com,DC=br"
    LDAP_BIND_PASSWORD: str = ""
    
    # =============================================================================
    # CORS
    # =============================================================================
    
    CORS_ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # =============================================================================
    # LOGGING
    # =============================================================================
    
    LOG_DIR: str = "./logs"
    LOG_FILE: str = "jira_dashboards.log"
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "text"  # text ou json
    LOG_MAX_SIZE: int = 10  # MB
    LOG_BACKUP_COUNT: int = 5
    
    # Logs específicos
    LOG_SQL: bool = False
    LOG_PERFORMANCE: bool = True
    
    # =============================================================================
    # SERVIDOR
    # =============================================================================
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Instância global
settings = Settings() 