"""
Configuração simplificada de banco de dados.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from core.settings import settings

# Base para os models
Base = declarative_base()


def get_database_url() -> str:
    """Retorna a URL de conexão baseada no tipo de banco."""
    
    if settings.DATABASE_TYPE == "sqlite":
        return f"sqlite:///{settings.SQLITE_DATABASE_PATH}"
    
    elif settings.DATABASE_TYPE == "sqlserver":
        if not settings.DATABASE_PASSWORD:
            raise ValueError("DATABASE_PASSWORD é obrigatório para SQL Server")
        
        return f"mssql+pyodbc://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_SERVER}/{settings.DATABASE_NAME}?driver=ODBC+Driver+17+for+SQL+Server"
    
    else:
        raise ValueError(f"Tipo de banco não suportado: {settings.DATABASE_TYPE}")


def get_engine():
    """Retorna o engine do SQLAlchemy."""
    
    database_url = get_database_url()
    
    if settings.DATABASE_TYPE == "sqlite":
        return create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool
        )
    
    else:  # SQL Server
        return create_engine(
            database_url,
            pool_size=10,
            max_overflow=20
        )


def get_session_factory():
    """Retorna a factory de sessões."""
    engine = get_engine()
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    """Cria todas as tabelas definidas nos models."""
    engine = get_engine()
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Remove todas as tabelas (cuidado em produção!)."""
    engine = get_engine()
    Base.metadata.drop_all(bind=engine) 