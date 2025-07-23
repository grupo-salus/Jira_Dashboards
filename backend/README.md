# Jira Dashboards API - Backend

API FastAPI para os dashboards do Jira, fornecendo dados dos projetos "Acompanhamento T.I" e "Espaço de Projetos".

## 🏗️ Estrutura do Projeto

```
backend/
├── api/
│   └── v1/
│       ├── __init__.py                 # Roteador principal da API
│       ├── acompanhamento_ti.py        # Rotas do projeto Acompanhamento T.I
│       ├── espaco_projetos.py          # Rotas do projeto Espaço de Projetos
│       └── jira.py                     # Rotas gerais do Jira
├── core/
│   ├── __init__.py
│   ├── app_setup.py                    # Configuração da aplicação
│   ├── database.py                     # Configuração do banco de dados
│   ├── logging_config.py               # Configuração de logging
│   └── settings.py                     # Configurações da aplicação
├── models/                             # Modelos do banco de dados
├── repositories/                       # Repositórios de dados
├── schemas/                            # Schemas Pydantic
├── scripts/                            # Scripts utilitários
├── services/
│   ├── __init__.py
│   ├── jira_parser.py                  # Parser de dados do Jira
│   ├── jira_service.py                 # Serviço de integração com Jira
│   └── project_analysis_utils.py       # Utilitários de análise de projetos
├── tests/                              # Testes
├── utils/                              # Utilitários
├── main.py                             # Aplicação principal
├── requirements.txt                    # Dependências
└── env.example                         # Exemplo de variáveis de ambiente
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

```env
# Jira
JIRA_URL=https://tigruposalus.atlassian.net
JIRA_EMAIL=seu-email@gruposalus.com.br
JIRA_API_TOKEN=seu-api-token

# Banco de dados (opcional)
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./jira_dashboards.db
```

### 3. Executar a Aplicação

#### Opção 1: Execução Direta
```bash
python main.py
```

#### Opção 2: Com Uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Acessar a API

- **API**: http://localhost:8000
- **Documentação**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📋 Endpoints Disponíveis

### Rotas Principais
- `GET /` - Informações da API
- `GET /health` - Health check
- `GET /docs` - Documentação Swagger
- `GET /redoc` - Documentação ReDoc

### Rotas da API

#### Acompanhamento T.I
- `GET /api/acompanhamento_ti/tabela` - Dados do projeto Acompanhamento T.I (BL)

#### Espaço de Projetos
- `GET /api/espaco_de_projetos/tabela` - Dados do projeto Espaço de Projetos (EP)

#### Jira
- `GET /api/jira/opcoes-campo-customizado/{field_id}` - Opções de campos customizados

## 🧪 Testes

### Teste Básico
```bash
python test_simple.py
```

### Teste Completo
```bash
python test_app_module.py
```

## 🔧 Configurações

### Logging
- **Diretório de logs**: `./logs/`
- **Arquivo de log**: `jira_dashboards.log`
- **Nível**: INFO
- **Formato**: Texto ou JSON
- **Rotação**: 10MB, 5 backups

### Banco de Dados
- **SQLite** (padrão): Para desenvolvimento
- **SQL Server**: Para produção

### CORS
- **Origins permitidas**: `http://localhost:3000`, `http://localhost:5173`

## 📊 Dados Retornados

### Acompanhamento T.I
- Issues do projeto BL
- Campos de tempo e esforço
- Responsáveis e equipes
- Datas importantes
- Métricas temporais

### Espaço de Projetos
- Issues do projeto EP
- Análise de fases
- Posição no backlog
- Classificação de prazo e risco
- Investimento esperado

## 🛠️ Desenvolvimento

### Estrutura de Importações
- **Importações absolutas**: Para facilitar execução direta
- **Módulos organizados**: Separação clara de responsabilidades

### Logging
- **Logs estruturados**: Com contexto e métricas
- **Performance**: Logs de duração de operações
- **API Requests**: Logs de requisições com status e duração

### Tratamento de Erros
- **Logs detalhados**: Para debugging
- **Respostas consistentes**: Formato padronizado
- **Validação**: Com Pydantic

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de importação**: Verifique se está no diretório `backend/`
2. **Configurações Jira**: Verifique se as variáveis de ambiente estão corretas
3. **Dependências**: Execute `pip install -r requirements.txt`
4. **Porta em uso**: Use uma porta diferente com `--port 8001`

### Logs
- Verifique o arquivo `./logs/jira_dashboards.log`
- Em desenvolvimento, logs também aparecem no console

## 📝 Próximos Passos

- [ ] Implementar autenticação
- [ ] Adicionar cache de dados
- [ ] Implementar rate limiting
- [ ] Adicionar testes unitários
- [ ] Configurar CI/CD
- [ ] Documentação da API 