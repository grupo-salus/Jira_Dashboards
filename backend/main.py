"""
Aplicação principal FastAPI - Ponto de entrada.
"""
import uvicorn

from core.app_setup import app
from core.settings import settings


if __name__ == "__main__":
    uvicorn.run(
        app, 
        host=settings.HOST, 
        port=settings.PORT,
        reload=settings.DEBUG
    )
