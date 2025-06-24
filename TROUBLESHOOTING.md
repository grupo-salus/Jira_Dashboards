# Guia de Solução de Problemas

## Problemas de Conectividade

### Erro: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Sintomas:**

- O frontend não consegue se conectar ao backend
- Erros no console do navegador indicando falha na conexão
- Aplicação funciona apenas via localhost

**Causas Possíveis:**

1. Backend não está rodando
2. Backend está rodando apenas em localhost (127.0.0.1)
3. Firewall bloqueando conexões
4. URL da API incorreta no frontend

**Soluções:**

#### 1. Verificar se o Backend está Rodando

```bash
# Verifique se o processo está rodando na porta 8000
netstat -an | findstr :8000  # Windows
netstat -an | grep :8000     # Linux/Mac
```

#### 2. Iniciar Backend com Host Correto

```bash
# Certifique-se de usar --host 0.0.0.0
cd backend
uvicorn api_main:app --reload --host 0.0.0.0 --port 8000
```

#### 3. Configurar URL da API

Crie um arquivo `.env` na raiz do projeto:

```bash
# Para desenvolvimento local
VITE_API_URL=http://localhost:8000

# Para acesso em rede local (substitua pelo IP da sua máquina)
VITE_API_URL=http://192.168.0.146:8000
```

#### 4. Verificar Firewall

- Windows: Verifique se o Windows Defender não está bloqueando a porta 8000
- Linux: Verifique se o iptables não está bloqueando conexões
- Mac: Verifique as configurações de segurança

### Erro: "CORS policy" ou "Access-Control-Allow-Origin"

**Sintomas:**

- Erros de CORS no console do navegador
- Requisições sendo bloqueadas pelo navegador

**Solução:**
O backend já está configurado com CORS liberado. Se ainda houver problemas:

1. Verifique se o backend está rodando com `--host 0.0.0.0`
2. Reinicie o backend após mudanças de configuração
3. Limpe o cache do navegador

## Problemas de Performance

### Carregamento Lento dos Dados

**Sintomas:**

- Dashboard demora para carregar
- Indicadores de loading ficam visíveis por muito tempo

**Soluções:**

1. Verifique a conexão com o Jira
2. Considere implementar cache no backend
3. Otimize as consultas ao Jira

### Erro de Memória

**Sintomas:**

- Aplicação trava ou fecha inesperadamente
- Mensagens de erro relacionadas a memória

**Soluções:**

1. Reduza o volume de dados carregados
2. Implemente paginação
3. Otimize as consultas

## Problemas de Configuração

### Variáveis de Ambiente Não Carregadas

**Sintomas:**

- Configurações não são aplicadas
- Aplicação usa valores padrão

**Soluções:**

1. Verifique se o arquivo `.env` está na raiz do projeto
2. Reinicie o servidor de desenvolvimento após criar/modificar `.env`
3. Verifique se as variáveis começam com `VITE_`

### Portas Já em Uso

**Sintomas:**

- Erro ao iniciar backend ou frontend
- Mensagem indicando que a porta já está em uso

**Soluções:**

```bash
# Encontrar processo usando a porta
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/Mac

# Matar o processo
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/Mac
```

## Logs e Debug

### Habilitar Logs Detalhados

**Backend:**

```bash
uvicorn api_main:app --reload --host 0.0.0.0 --port 8000 --log-level debug
```

**Frontend:**

- Abra o DevTools do navegador (F12)
- Vá para a aba Console
- Verifique mensagens de erro e warnings

### Testar API Separadamente

```bash
# Teste se a API está respondendo
curl http://localhost:8000/api/espaco_de_projetos/tabela
curl http://192.168.0.146:8000/api/espaco_de_projetos/tabela
```

## Contato e Suporte

Se os problemas persistirem:

1. Verifique os logs do backend e frontend
2. Teste a conectividade de rede
3. Verifique se todas as dependências estão instaladas
4. Consulte a documentação do FastAPI e Vite
