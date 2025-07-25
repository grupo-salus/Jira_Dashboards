# 🔐 Autenticação LDAP - Jira Dashboards API

Este documento explica como configurar e usar o sistema de autenticação LDAP integrado à API.

## 🛡️ SEGURANÇA GARANTIDA

**⚠️ IMPORTANTE**: Este sistema é **100% SEGURO** para uso em produção:

- ✅ **APENAS OPERAÇÕES DE LEITURA** no LDAP
- ✅ **NÃO cria, modifica ou exclui** nenhum dado
- ✅ **NÃO interfere** no servidor LDAP de produção
- ✅ **APENAS autentica** usuários existentes
- ✅ **APENAS busca** informações de usuários

## 📋 Pré-requisitos

1. **Dependências Python**:

   ```bash
   pip install ldap3==2.9.1
   ```

2. **Configuração LDAP**:
   - Servidor LDAP acessível
   - Credenciais de bind válidas
   - Permissões para buscar usuários

## ⚙️ Configuração

### 1. Arquivo `.env`

Crie um arquivo `.env` na raiz do backend com as seguintes configurações:

```env
# =============================================================================
# LDAP - SORRIDENTS
# =============================================================================
LDAP_ENABLED=True
LDAP_SERVER=ldap://10.200.128.60:389
LDAP_BASE_DN=dc=sorridents,dc=br
LDAP_BIND_DN=glpi.sync@sorridents.br
LDAP_BIND_PASSWORD=sua_senha_real_aqui
```

### 2. Configurações Importantes

- **LDAP_SERVER**: URL completa do servidor LDAP (incluindo protocolo e porta)
- **LDAP_BASE_DN**: Base DN para busca de usuários
- **LDAP_BIND_DN**: Usuário com permissões para buscar no LDAP
- **LDAP_BIND_PASSWORD**: Senha do usuário de bind

## 🧪 Testando a Conexão

Execute o script de teste para verificar se tudo está funcionando:

```bash
cd backend
python test_auth.py
```

O script irá:

1. ✅ Testar conexão com o servidor LDAP
2. 🔍 Buscar um usuário específico (você digita o username)
3. 🔐 Testar autenticação de usuário (você digita a senha)

**🔒 SEGURANÇA**: O script usa `getpass` para ocultar a senha digitada e **NÃO salva** nenhuma informação.

## 🚀 Endpoints da API

### 1. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
    "username": "usuario",
    "password": "senha"
}
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "username": "usuario",
    "display_name": "Nome Completo",
    "email": "usuario@sorridents.br",
    "department": "TI",
    "title": "Desenvolvedor",
    "employee_number": "12345",
    "phone": "1234-5678",
    "mobile": "99999-9999"
  },
  "token": "dummy_token"
}
```

### 2. Status da Autenticação

```http
GET /api/v1/auth/status
```

**Resposta:**

```json
{
  "authenticated": false,
  "user": null,
  "ldap_enabled": true,
  "ldap_connected": true
}
```

### 3. Buscar Usuário

```http
GET /api/v1/auth/user/{username}
```

### 4. Logout

```http
POST /api/v1/auth/logout
```

## 🔧 Estrutura do Código

### Serviços

- **`services/auth_service.py`**: Serviço principal de autenticação LDAP
  - `authenticate_user()`: Autentica usuário
  - `search_user()`: Busca informações do usuário
  - `_connect_ldap()`: Conecta ao servidor LDAP

### Schemas

- **`schemas/auth.py`**: Modelos Pydantic para validação
  - `LoginRequest`: Dados de login
  - `LoginResponse`: Resposta de login
  - `UserInfo`: Informações do usuário
  - `AuthStatus`: Status da autenticação

### Rotas

- **`api/v1/auth.py`**: Endpoints de autenticação
  - `/login`: Autenticação
  - `/status`: Status da autenticação
  - `/logout`: Logout
  - `/user/{username}`: Buscar usuário

## 🐛 Troubleshooting

### Erro de Conexão LDAP

```
❌ Erro na conexão LDAP: [Errno 10061] No connection could be made
```

**Solução**: Verificar se o servidor LDAP está acessível e a porta está correta.

### Erro de Credenciais

```
❌ Falha ao conectar ao LDAP com credenciais de bind
```

**Solução**: Verificar se as credenciais de bind estão corretas no `.env`.

### Usuário Não Encontrado

```
❌ Usuário usuario não encontrado no LDAP
```

**Solução**: Verificar se o `LDAP_BASE_DN` está correto e o usuário existe.

### Falha na Autenticação

```
❌ Falha na autenticação do usuário usuario
```

**Solução**: Verificar se a senha do usuário está correta.

## 🔒 Segurança

1. **Nunca commite** o arquivo `.env` no Git
2. **Use HTTPS** em produção
3. **Implemente rate limiting** para evitar ataques de força bruta
4. **Use JWT tokens** para sessões (TODO)
5. **Valide todas as entradas** do usuário

## 📝 Próximos Passos

- [ ] Implementar JWT tokens
- [ ] Adicionar rate limiting
- [ ] Implementar refresh tokens
- [ ] Adicionar logs de auditoria
- [ ] Implementar cache de usuários
- [ ] Adicionar middleware de autenticação

## 📞 Suporte

Para dúvidas ou problemas, consulte:

1. Logs da aplicação em `./logs/`
2. Documentação do ldap3: https://ldap3.readthedocs.io/
3. Teste de conectividade: `python test_auth.py`
