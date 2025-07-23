"""
Aplicação principal FastAPI simplificada.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.settings import settings
from core.database import create_tables
from core.logging_config import setup_logging


# Criar aplicação FastAPI
app = FastAPI(
    title="Jira Dashboards API",
    version="1.0.0",
    description="API para Dashboards do Jira"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Evento de inicialização."""
    # Configurar logging
    setup_logging()
    
    # Criar tabelas do banco
    create_tables()


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
