# 🚀 TODO - Refatoração Backend

## 📋 **Visão Geral**

Refatoração completa do backend seguindo boas práticas de Python/FastAPI, Clean Code, arquitetura organizada e preparação para autenticação LDAP.

**Arquitetura:**

- **Backend:** API REST pura (FastAPI) - apenas endpoints JSON
- **Frontend:** Aplicação React separada servida via Nginx/IIS
- **Comunicação:** HTTP/HTTPS entre frontend e backend
- **Deploy:** Separado e independente

---

## 🏗️ **1. ESTRUTURA DE ARQUIVOS E PASTAS**

### **1.1 Reorganização da Estrutura Base**

- [ ] Criar nova estrutura de pastas organizada
- [ ] Separar API routes das integrações externas (Jira)
- [ ] Organizar por domínios (auth, jira, users, etc.)
- [ ] Implementar padrão Repository Pattern
- [ ] Separar Services, Controllers, Models e Schemas

### **1.2 Estrutura Proposta**

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── database.py
│   │   └── logging_config.py
│   │   ├── security.py
│   │   ├── exceptions.py
│   │   └── dependencies.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── session.py
│   │   ├── dashboard.py
│   │   ├── module.py
│   │   ├── user_dashboard.py
│   │   └── user_module.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── project.py
│   │   ├── dashboard.py
│   │   ├── module.py
│   │   └── permissions.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── user_repository.py
│   │   ├── project_repository.py
│   │   ├── dashboard_repository.py
│   │   ├── module_repository.py
│   │   ├── user_dashboard_repository.py
│   │   └── user_module_repository.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── jira_service.py
│   │   ├── ldap_service.py
│   │   ├── dashboard_service.py
│   │   ├── module_service.py
│   │   ├── user_permission_service.py
│   │   └── sync_service.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── projects.py
│   │   │   ├── dashboards.py
│   │   │   └── modules.py
│   │   └── dependencies.py
│   └── utils/
│       ├── __init__.py
│       ├── helpers.py
│       └── validators.py
├── migrations/
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── scripts/
│   ├── script1.py

├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_users.py
│   └── test_projects.py
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ **2. BANCO DE DADOS E ORM**

### **2.1 Configuração SQLAlchemy**

- [ ] Configurar SQLAlchemy com SQL Server
- [ ] Implementar Base Model com timestamps
- [ ] Configurar connection pool
- [ ] Implementar retry logic para conexões
- [ ] Configurar logging de queries

### **2.2 Migrações com Alembic**

- [ ] Configurar Alembic
- [ ] Criar migrations iniciais
- [ ] Implementar seed data
- [ ] Configurar rollback strategies
- [ ] Documentar comandos de migração

### **2.3 Models do Banco**

- [ ] Model User (id, username, email, full_name, is_active, created_at, updated_at)
- [ ] Model UserSession (id, user_id, token, expires_at, created_at)
- [ ] Model Project (id, jira_id, title, status, priority, assignee, created_at, updated_at)
- [ ] Model UserProject (id, user_id, project_id, role, created_at)
- [ ] Model Dashboard (id, name, description, route, is_active, created_at, updated_at)
- [ ] Model UserDashboard (id, user_id, dashboard_id, permissions, created_at, updated_at)
- [ ] Model Module (id, name, description, route, dashboard_id, is_active, created_at, updated_at)
- [ ] Model UserModule (id, user_id, module_id, permissions, created_at, updated_at)
- [ ] Model AuditLog (id, user_id, action, table_name, record_id, old_values, new_values, created_at)

---

## 🔐 **3. SISTEMA DE AUTENTICAÇÃO**

### **3.1 Autenticação Local**

- [ ] Implementar hash de senhas (bcrypt)
- [ ] Criar JWT tokens
- [ ] Implementar refresh tokens
- [ ] Configurar CORS
- [ ] Implementar rate limiting

### **3.2 Integração LDAP**

- [ ] Configurar conexão LDAP
- [ ] Implementar autenticação LDAP
- [ ] Sincronização de usuários LDAP (apenas username e senha)
- [ ] Fallback para autenticação local
- [ ] Cache de credenciais LDAP
- [ ] Usuários novos sem acesso por padrão
- [ ] Sistema de permissões independente do AD

### **3.3 Controle de Acesso**

- [ ] Implementar roles e permissions
- [ ] Middleware de autenticação
- [ ] Decorators para proteção de rotas
- [ ] Logs de auditoria
- [ ] Session management
- [ ] Sistema de dashboards por usuário
- [ ] Sistema de módulos por usuário
- [ ] Permissões granulares por dashboard/módulo
- [ ] Tela de gerenciamento de usuários (frontend)
- [ ] Associação múltipla de dashboards por usuário

---

## 🛠️ **4. SERVIÇOS E REPOSITORIES**

## 🔄 **4.1 SCRIPTS DE SINCRONIZAÇÃO**

### **4.1.1 Estrutura de Scripts**

- [ ] Criar pasta `scripts/` organizada modularmente
- [ ] Separar scripts por funcionalidade (users, projects, etc.)
- [ ] Implementar logging estruturado
- [ ] Configurar retry logic
- [ ] Implementar notificações de erro

### **4.1.2 Scripts de Sincronização LDAP**

- [ ] Script de sincronização diária de usuários
- [ ] Script de atualização de senhas
- [ ] Script de verificação de usuários inativos
- [ ] Script de backup antes da sincronização
- [ ] Configuração para Task Scheduler

### **4.1.3 Scripts de Sincronização Jira**

- [ ] Script de sincronização de projetos
- [ ] Script de atualização de status
- [ ] Script de sincronização de prioridades
- [ ] Configuração de horários de execução

### **4.1.4 Estrutura Proposta de Scripts**

```
scripts/

```

### **4.2 Repository Pattern**

- [ ] Base Repository com CRUD operations
- [ ] User Repository
- [ ] Project Repository
- [ ] Session Repository
- [ ] Dashboard Repository
- [ ] Module Repository
- [ ] UserDashboard Repository
- [ ] UserModule Repository
- [ ] Audit Repository

### **4.3 Services Layer**

- [ ] Auth Service (login, logout, refresh)
- [ ] User Service (CRUD, profile management)
- [ ] Jira Service (integração externa)
- [ ] LDAP Service (autenticação externa)
- [ ] Project Service (business logic)
- [ ] Dashboard Service (CRUD, permissions)
- [ ] Module Service (CRUD, permissions)
- [ ] UserPermission Service (gerenciamento de acesso)
- [ ] Sync Service (sincronização LDAP/Jira)

### **4.4 Business Logic**

- [ ] Validação de dados
- [ ] Transformação de dados
- [ ] Regras de negócio
- [ ] Cache strategies
- [ ] Error handling

---

## 🌐 **5. API ROUTES**

### **5.1 Autenticação**

- [ ] POST /api/v1/auth/login
- [ ] POST /api/v1/auth/logout
- [ ] POST /api/v1/auth/refresh
- [ ] POST /api/v1/auth/ldap-login
- [ ] GET /api/v1/auth/me

### **5.2 Usuários**

- [ ] GET /api/v1/users
- [ ] GET /api/v1/users/{id}
- [ ] POST /api/v1/users
- [ ] PUT /api/v1/users/{id}
- [ ] DELETE /api/v1/users/{id}
- [ ] GET /api/v1/users/{id}/projects
- [ ] GET /api/v1/users/{id}/dashboards
- [ ] POST /api/v1/users/{id}/dashboards
- [ ] DELETE /api/v1/users/{id}/dashboards/{dashboard_id}
- [ ] GET /api/v1/users/{id}/modules
- [ ] POST /api/v1/users/{id}/modules
- [ ] DELETE /api/v1/users/{id}/modules/{module_id}

### **5.3 Dashboards e Módulos**

- [ ] GET /api/v1/dashboards
- [ ] GET /api/v1/dashboards/{id}
- [ ] POST /api/v1/dashboards
- [ ] PUT /api/v1/dashboards/{id}
- [ ] DELETE /api/v1/dashboards/{id}
- [ ] GET /api/v1/modules
- [ ] GET /api/v1/modules/{id}
- [ ] POST /api/v1/modules
- [ ] PUT /api/v1/modules/{id}
- [ ] DELETE /api/v1/modules/{id}

### **5.4 Projetos (Jira)**

- [ ] GET /api/v1/projects
- [ ] GET /api/v1/projects/{id}
- [ ] GET /api/v1/projects/kanban
- [ ] GET /api/v1/projects/dashboard
- [ ] POST /api/v1/projects/sync

---

## 📦 **6. DEPENDÊNCIAS E CONFIGURAÇÃO**

### **6.1 Requirements**

- [ ] FastAPI + Uvicorn
- [ ] SQLAlchemy + pyodbc (SQL Server)
- [ ] Alembic (migrations)
- [ ] Pydantic (schemas)
- [ ] python-jose (JWT)
- [ ] passlib (hash)
- [ ] python-ldap (LDAP)
- [ ] python-multipart (file uploads)
- [ ] redis (cache)
- [ ] pytest (testing)

### **6.2 Configuração**

- [ ] Environment variables
- [ ] Settings management
- [ ] Logging configuration
- [ ] CORS settings (configurado para frontend)
- [ ] Database connection strings
- [ ] Configuração de CORS para domínio do frontend
- [ ] Headers de segurança para API
- [ ] Configuração de rate limiting por IP

---

## 🧪 **7. TESTES**

### **7.1 Testes Unitários**

- [ ] Testes de Services
- [ ] Testes de Repositories
- [ ] Testes de Schemas
- [ ] Testes de Utils

### **7.2 Testes de Integração**

- [ ] Testes de API endpoints
- [ ] Testes de autenticação
- [ ] Testes de banco de dados
- [ ] Testes de LDAP

### **7.3 Testes E2E**

- [ ] Fluxo completo de login
- [ ] Fluxo de CRUD de usuários
- [ ] Integração com Jira
- [ ] Performance tests

---

## 📚 **8. DOCUMENTAÇÃO**

### **8.1 API Documentation**

- [ ] Swagger/OpenAPI docs
- [ ] Exemplos de requests/responses
- [ ] Error codes documentation
- [ ] Authentication guide

### **8.2 Code Documentation**

- [ ] Docstrings em todas as funções
- [ ] Type hints
- [ ] README atualizado
- [ ] Setup instructions

---

## 🔄 **9. MIGRAÇÃO E DEPLOY**

## 🏗️ **9.1 ARQUITETURA DE DEPLOY**

### **9.1.1 Separação Backend/Frontend**

- [ ] Backend como API REST pura (sem servir arquivos estáticos)
- [ ] Frontend servido via Nginx/IIS (Windows Server)
- [ ] Comunicação via HTTP/HTTPS entre aplicações
- [ ] Configuração de CORS adequada
- [ ] Proxy reverso para roteamento

### **9.1.2 Configuração de Servidor Web**

- [ ] Nginx para Linux ou IIS para Windows Server
- [ ] Configuração de SSL/HTTPS
- [ ] Configuração de cache para arquivos estáticos
- [ ] Configuração de compressão (gzip)
- [ ] Configuração de headers de segurança

### **9.1.3 Estrutura de Deploy**

```
Servidor Web (Nginx/IIS)
├── Frontend (React build)
│   ├── index.html
│   ├── static/
│   └── assets/
└── Proxy para Backend API
    └── FastAPI (porta 8000)
```

### **9.2 Migração de Dados**

- [ ] Backup do sistema atual
- [ ] Scripts de migração
- [ ] Validação de dados
- [ ] Rollback plan

### **9.3 Deploy**

- [ ] Docker configuration para API
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Monitoring setup
- [ ] Configuração de proxy reverso (Nginx/Apache)
- [ ] Configuração de SSL/HTTPS
- [ ] Load balancer setup (se necessário)
- [ ] Configuração de health checks
- [ ] Configuração de logs centralizados

---

## ⚡ **10. PERFORMANCE E SEGURANÇA**

### **10.1 Performance**

- [ ] Database indexing
- [ ] Query optimization
- [ ] Caching strategies
- [ ] Connection pooling

### **10.2 Segurança**

- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers
- [ ] Configuração de CORS para frontend específico
- [ ] Rate limiting por IP/usuário
- [ ] Validação de origem das requisições
- [ ] Headers de segurança (HSTS, CSP, etc.)
- [ ] Configuração de JWT tokens seguros

---

## 📊 **11. MONITORAMENTO**

### **11.1 Logging**

- [ ] Structured logging
- [ ] Error tracking
- [ ] Performance metrics
- [ ] Audit logs

### **11.2 Health Checks**

- [ ] Database connectivity
- [ ] LDAP connectivity
- [ ] Jira API status
- [ ] System resources

---

## 🎯 **PRIORIDADES**

### **Fase 1 - Fundação (Semana 1)**

1. Estrutura de pastas
2. Configuração SQLAlchemy + Alembic
3. Models básicos
4. Configuração de ambiente

### **Fase 2 - Autenticação (Semana 2)**

1. Sistema de autenticação local
2. Integração LDAP
3. JWT tokens
4. Controle de acesso

### **Fase 3 - API (Semana 3)**

1. Routes de autenticação
2. Routes de usuários
3. Integração com Jira
4. Testes básicos

### **Fase 4 - Refinamento (Semana 4)**

1. Testes completos
2. Documentação
3. Performance optimization
4. Deploy preparation

---

## ✅ **CRITÉRIOS DE ACEITAÇÃO**

- [ ] Código segue padrões PEP 8
- [ ] 90%+ coverage de testes
- [ ] Documentação completa
- [ ] Performance adequada
- [ ] Segurança validada
- [ ] API funcionando independentemente
- [ ] CORS configurado corretamente
- [ ] Deploy automatizado
- [ ] Frontend conseguindo consumir API
- [ ] Configuração de servidor web funcionando

---

**📝 Notas:**

- Seguir princípios SOLID
- Implementar Clean Architecture
- Usar dependency injection
- Manter código testável
- Documentar decisões arquiteturais
