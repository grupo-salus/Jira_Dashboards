from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Verificar se a pasta dist existe
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    # Middleware para lidar com rotas do SPA
    @app.middleware("http")
    async def spa_middleware(request: Request, call_next):
        # Se a requisição é para uma rota da API, deixa passar
        if request.url.path.startswith("/api/"):
            return await call_next(request)
        
        # Se a requisição é para assets, deixa passar
        if request.url.path.startswith("/assets/"):
            return await call_next(request)
        
        # Se a requisição é para a documentação do FastAPI, deixa passar
        if request.url.path.startswith("/docs") or request.url.path.startswith("/openapi.json"):
            return await call_next(request)
        
        # Para todas as outras rotas, serve o index.html (SPA routing)
        index_path = os.path.join(dist_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        
        # Se não encontrar o index.html, continua com o fluxo normal
        return await call_next(request)
    
    # Rota para servir o index.html na raiz
    @app.get("/")
    async def serve_index():
        index_path = os.path.join(dist_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not built"}
    
    # Rota para servir o index.html em qualquer rota não-API
    @app.get("/{full_path:path}")
    async def serve_spa_routes(full_path: str):
        # Se a rota não começa com /api/, /docs, ou /openapi.json, serve o index.html
        if not (full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json")):
            index_path = os.path.join(dist_path, "index.html")
            if os.path.exists(index_path):
                return FileResponse(index_path)
        return {"detail": "Not Found"}

else:
    logger.warning(f"Pasta dist não encontrada em: {dist_path}")
    logger.warning("O frontend não será servido. Execute 'npm run build' primeiro.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
