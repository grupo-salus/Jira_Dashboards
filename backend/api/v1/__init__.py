# Routes module 
from fastapi import APIRouter
from .acompanhamento_ti import router as acompanhamento_ti_router
from .espaco_projetos import router as espaco_projetos_router
from .jira import router as jira_router
from .auth import router as auth_router

# Roteador principal que combina todas as rotas
api_router = APIRouter()

# Incluindo todos os roteadores
api_router.include_router(auth_router)
api_router.include_router(acompanhamento_ti_router)
api_router.include_router(espaco_projetos_router)
api_router.include_router(jira_router)

__all__ = ["api_router"] 