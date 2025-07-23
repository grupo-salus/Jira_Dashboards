# Scripts de Teste - Autenticação e Administração

Este diretório contém scripts para testar o sistema de autenticação e administração do Jira Dashboards.

## 📁 Arquivos Disponíveis

### 1. `test_auth_admin.py` - Script Completo Interativo
Script completo com menu interativo para testar todas as funcionalidades.

### 2. `quick_admin_setup.py` - Script Rápido
Script automatizado para login e atribuição rápida de privilégios de admin.

## 🚀 Como Usar

### Pré-requisitos

1. **Configurar variáveis de ambiente:**
   ```bash
   # Copiar arquivo de exemplo
   cp env.example .env
   
   # Editar o arquivo .env com suas configurações
   # Especialmente as configurações de LDAP
   ```

2. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar LDAP (se necessário):**
   - Editar `backend/core/settings.py` ou arquivo `.env`
   - Configurar servidor LDAP, base DN, etc.

### Opção 1: Script Rápido (Recomendado para uso inicial)

Execute o script rápido para fazer login e atribuir admin de forma automatizada:

```bash
cd backend
python scripts/quick_admin_setup.py
```

**O que o script faz:**
1. ✅ Verifica conexão com banco de dados
2. ✅ Inicializa banco se necessário
3. ✅ Solicita credenciais de login
4. ✅ Faz autenticação via LDAP
5. ✅ Verifica se já é admin
6. ✅ Atribui privilégios de admin se necessário

### Opção 2: Script Completo Interativo

Execute o script completo para explorar todas as funcionalidades:

```bash
cd backend
python scripts/test_auth_admin.py
```

**Funcionalidades disponíveis:**
- 🔍 Testar conexão com banco de dados
- 🗄️ Inicializar banco de dados
- 🔐 Fazer login
- 👥 Listar usuários
- 👑 Tornar usuário admin
- ⚙️ Testar funções administrativas
- 📋 Mostrar módulos do usuário
- 📊 Mostrar logs de auditoria
- ℹ️ Mostrar informações do usuário

## 📋 Etapas Detalhadas

### Etapa 1: Preparação do Ambiente

1. **Verificar configurações:**
   ```bash
   # Verificar se o arquivo .env existe
   ls -la backend/.env
   
   # Verificar configurações LDAP
   cat backend/.env | grep LDAP
   ```

2. **Testar conexão com banco:**
   ```bash
   cd backend
   python scripts/test_auth_admin.py
   # Escolher opção 1: Testar conexão com banco de dados
   ```

### Etapa 2: Inicialização do Banco

Se o banco não estiver inicializado:

```bash
cd backend
python scripts/test_auth_admin.py
# Escolher opção 2: Inicializar banco de dados
```

### Etapa 3: Login e Atribuição de Admin

**Método Rápido:**
```bash
cd backend
python scripts/quick_admin_setup.py
```

**Método Interativo:**
```bash
cd backend
python scripts/test_auth_admin.py
# Escolher opção 3: Fazer login
# Escolher opção 5: Tornar usuário atual admin
```

## 🔧 Configurações Importantes

### Configurações LDAP

No arquivo `.env` ou `settings.py`:

```env
# LDAP Configuration
LDAP_ENABLED=true
LDAP_SERVER=ldap://seu-servidor-ldap.com
LDAP_BASE_DN=DC=gruposalus,DC=com,DC=br
LDAP_BIND_DN=CN=ServiceAccount,OU=ServiceAccounts,DC=gruposalus,DC=com,DC=br
LDAP_BIND_PASSWORD=sua-senha
```

### Configurações de Banco

```env
# Database Configuration
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./jira_dashboards.db

# Ou para SQL Server:
# DATABASE_TYPE=sqlserver
# DATABASE_SERVER=localhost
# DATABASE_NAME=jira_dashboards
# DATABASE_USER=sa
# DATABASE_PASSWORD=sua-senha
```

## 🐛 Solução de Problemas

### Erro: "Tabela não existe"
```bash
# Inicializar banco de dados
python scripts/test_auth_admin.py
# Escolher opção 2
```

### Erro: "Falha na autenticação LDAP"
1. Verificar configurações LDAP no `.env`
2. Testar conectividade com servidor LDAP
3. Verificar credenciais de bind
4. Verificar se o usuário existe no LDAP

### Erro: "Usuário não encontrado no banco"
1. Fazer login primeiro para criar o usuário
2. Verificar se o LDAP está funcionando
3. Verificar logs de erro

### Erro: "Erro de conexão com banco"
1. Verificar configurações de banco
2. Verificar se o banco está rodando
3. Verificar permissões de acesso

## 📊 Logs e Auditoria

Os scripts registram todas as ações no log de auditoria:

- **Login bem-sucedido:** `action="login"`
- **Login falhou:** `action="login_failed"`
- **Atribuição de admin:** `action="GRANT_ADMIN"`

Para ver os logs:
```bash
python scripts/test_auth_admin.py
# Escolher opção 8: Mostrar logs de auditoria
```

## 🔒 Segurança

### Boas Práticas

1. **Alterar senhas padrão** no arquivo `.env`
2. **Usar variáveis de ambiente** em produção
3. **Limitar acesso** aos scripts de admin
4. **Monitorar logs** de auditoria
5. **Revisar permissões** regularmente

### Logs de Auditoria

Todos os scripts registram:
- ✅ Quem executou a ação
- ✅ Quando foi executada
- ✅ Qual ação foi realizada
- ✅ Se foi bem-sucedida
- ✅ Detalhes adicionais

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs:** `backend/logs/jira_dashboards.log`
2. **Testar conexões:** Use o script interativo
3. **Verificar configurações:** Arquivo `.env`
4. **Consultar documentação:** Este README

## 🎯 Exemplo de Uso Completo

```bash
# 1. Navegar para o diretório
cd backend

# 2. Executar script rápido
python scripts/quick_admin_setup.py

# 3. Seguir as instruções na tela
# - Digitar username
# - Digitar senha
# - Confirmar atribuição de admin

# 4. Verificar resultado
python scripts/test_auth_admin.py
# Escolher opção 9: Mostrar informações do usuário atual
```

**Resultado esperado:**
```
✅ Usuário 'seu-username' agora é administrador!
ℹ️ Você pode agora acessar todas as funcionalidades administrativas.
``` 