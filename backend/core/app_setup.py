"""
Configuração da aplicação FastAPI.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.settings import settings
from core.database import create_tables
from core.logging_config import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events para a aplicação."""
    # Startup
    setup_logging()
    create_tables()
    yield
    # Shutdown (se necessário)


def create_app() -> FastAPI:
    """Cria e configura a aplicação FastAPI."""
    
    # Criar aplicação FastAPI
    app = FastAPI(
        title="Jira Dashboards API",
        version="1.0.0",
        description="API para Dashboards do Jira",
        debug=settings.DEBUG,
        lifespan=lifespan
    )

    # Configurar CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Configurar rotas básicas
    @app.get("/")
    async def root():
        """Rota raiz."""
        return {"message": "Jira Dashboards API"}

    @app.get("/health")
    async def health():
        """Health check."""
        return {"status": "ok"}

    # Importar e incluir as rotas da API
    from api.v1 import api_router

    # Incluir o roteador principal da API
    app.include_router(api_router)

    return app


# Instância global da aplicação
app = create_app()
