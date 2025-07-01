from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from config.logging_config import setup_logging
from routes import api_router

# Configura o logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Jira Dashboards API",
    description="API para dashboards do Jira",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo todas as rotas da API
app.include_router(api_router)

# Servir frontend da pasta dist
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
