#!/bin/bash

echo "Iniciando serviços de desenvolvimento..."
echo

echo "1. Iniciando backend na porta 8000..."
cd backend && uvicorn api_main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "2. Aguardando 3 segundos para o backend inicializar..."
sleep 3

echo "3. Iniciando frontend na porta 5173..."
npm run dev -- --host &
FRONTEND_PID=$!

echo
echo "Serviços iniciados!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo
echo "Para acesso em rede local, use o IP da sua máquina:"
echo "Frontend: http://192.168.0.146:5173"
echo
echo "Pressione Ctrl+C para parar os serviços..."

# Função para limpar processos ao sair
cleanup() {
    echo "Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Captura Ctrl+C
trap cleanup SIGINT

# Aguarda indefinidamente
wait 