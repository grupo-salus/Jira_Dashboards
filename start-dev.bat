@echo off
echo Iniciando servicos de desenvolvimento...
echo.

echo 1. Iniciando backend na porta 8000...
start "Backend" cmd /k "cd backend && uvicorn api_main:app --reload --host 0.0.0.0 --port 8000"

echo 2. Aguardando 3 segundos para o backend inicializar...
timeout /t 3 /nobreak > nul

echo 3. Iniciando frontend na porta 5173...
start "Frontend" cmd /k "npm run dev -- --host"

echo.
echo Servicos iniciados!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Para acesso em rede local, use o IP da sua maquina:
echo Frontend: http://192.168.0.146:5173
echo.
pause 