# Jira Dashboards

Sistema de dashboards para visualização e análise de dados do Jira, desenvolvido com React/TypeScript no frontend e Python/FastAPI no backend.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- Python 3.8 ou superior
- Git

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Jira_Dashboards.git
cd Jira_Dashboards
```

### 2. Configuração do Backend

```bash
# Navegue para a pasta backend
cd backend

# Instale as dependências Python
pip install -r requirements.txt

# Ou se preferir usar um ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### 3. Configuração do Frontend

```bash
# Volte para a pasta raiz do projeto
cd ..

# Instale as dependências Node.js
npm install

# Build do projeto para produção
npm run build
```

## 🏃‍♂️ Executando o Projeto

### Modo Produção

1. **Inicie o backend:**

```bash
cd backend
uvicorn api_main:app --reload --host 0.0.0.0 --port 8001
```

2. **Acesse a aplicação:**
   - O frontend será servido automaticamente pelo backend na rota principal
   - Acesse: `http://localhost:8001`

### Modo Desenvolvimento

Para desenvolvimento, você pode rodar o frontend separadamente:

```bash
npm run dev
```

Isso iniciará o servidor de desenvolvimento do Vite na porta padrão (geralmente 3000).

## 🛠️ Configuração como Serviço Windows

### Usando NSSM (Non-Sucking Service Manager)

Para configurar o backend como um serviço Windows que inicia automaticamente:

#### 1. Instale o NSSM

Baixe o NSSM de: https://nssm.cc/download

#### 2. Crie o serviço

```bash
# Abra o PowerShell como Administrador
nssm install JiraBackend

# Configure o caminho do executável
nssm set JiraBackend Application "C:\Users\luis.gfonseca\Documents\aplicações\Jira_Dashboards\venv\Scripts\python.exe"

# Configure o diretório de trabalho
nssm set JiraBackend AppDirectory "C:\Users\luis.gfonseca\Documents\aplicações\Jira_Dashboards\backend"

# Configure os argumentos
nssm set JiraBackend AppParameters "-m uvicorn api_main:app --host 0.0.0.0 --port 8001"

# Configure o diretório de saída (stdout)
nssm set JiraBackend AppStdout "C:\Logs\jira_backend_output.log"

# Configure o diretório de erro (stderr)
nssm set JiraBackend AppStderr "C:\Logs\jira_backend_error.log"

# Configure o tipo de inicialização (Automático)
nssm set JiraBackend Start SERVICE_AUTO_START

# Inicie o serviço
nssm start JiraBackend
```

#### 3. Comandos úteis do NSSM

```bash
# Verificar status do serviço
nssm status JiraBackend

# Parar o serviço
nssm stop JiraBackend

# Reiniciar o serviço
nssm restart JiraBackend

# Remover o serviço
nssm remove JiraBackend confirm

# Editar configurações do serviço
nssm set JiraBackend [parâmetro] [valor]

# Ver configurações do serviço
nssm dump JiraBackend
```

## 📁 Estrutura do Projeto

```
Jira_Dashboards/
├── backend/                 # Backend Python/FastAPI
│   ├── api_main.py         # Arquivo principal da API
│   ├── services/           # Serviços de integração com Jira
│   ├── dashboards/         # Lógica dos dashboards
│   └── requirements.txt    # Dependências Python
├── src/                    # Frontend React/TypeScript
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── api/               # Cliente da API
│   └── types/             # Definições de tipos TypeScript
├── package.json           # Dependências Node.js
└── README.md             # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `env.example`:

```bash
cp env.example .env
```

Configure as seguintes variáveis:

```env
JIRA_URL=sua_url_do_jira
JIRA_USERNAME=seu_usuario
JIRA_API_TOKEN=seu_token_api
```

## 📊 Dashboards Disponíveis

- **Dashboard de Projetos**: Visualização geral dos projetos
- **Dashboard de Sprint**: Acompanhamento de sprints
- **Dashboard de TI**: Métricas específicas de TI

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de porta em uso:**

   - Verifique se a porta 8001 está livre
   - Use `netstat -ano | findstr :8001` para verificar

2. **Erro de dependências:**

   - Delete `node_modules` e `package-lock.json`
   - Execute `npm install` novamente

3. **Erro de ambiente virtual:**
   - Certifique-se de que o ambiente virtual está ativado
   - Reinstale as dependências: `pip install -r requirements.txt`

### Logs

- **Backend (produção):** `C:\Logs\jira_backend_output.log`
- **Backend (erros):** `C:\Logs\jira_backend_error.log`
- **Frontend (desenvolvimento):** Console do navegador

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através de:

- Email: seu-email@exemplo.com
- Issues do GitHub: [Criar Issue](https://github.com/seu-usuario/Jira_Dashboards/issues)
