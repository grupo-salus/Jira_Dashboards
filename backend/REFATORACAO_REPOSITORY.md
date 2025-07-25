# 🔄 Refatoração para Padrão Repository

Este documento explica a refatoração realizada para implementar o padrão Repository no sistema Jira Dashboards.

## 📋 Resumo da Refatoração

### ✅ **ANTES** (Operações diretas no banco)
- Services faziam operações SQL diretas
- Código duplicado de gerenciamento de sessões
- Difícil de testar e manter
- Mistura de responsabilidades

### ✅ **DEPOIS** (Padrão Repository)
- Repositories centralizam operações de banco
- Services focam na lógica de negócio
- Código mais limpo e testável
- Separação clara de responsabilidades

## 🏗️ Estrutura Implementada

### 1. **Base Repository** (`repositories/base_repository.py`)
```python
class BaseRepository(Generic[T]):
    """Repository base com operações CRUD genéricas."""
    
    def create(self, **kwargs) -> T
    def get_by_id(self, id: int) -> Optional[T]
    def get_by_field(self, field: str, value: Any) -> Optional[T]
    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]
    def find_by_filters(self, filters: Dict[str, Any]) -> List[T]
    def search(self, search_term: str, search_fields: List[str]) -> List[T]
    def update(self, id: int, **kwargs) -> Optional[T]
    def delete(self, id: int) -> bool
    def count(self, filters: Optional[Dict[str, Any]] = None) -> int
    def exists(self, id: int) -> bool
```

### 2. **Repositories Específicos**

#### **UserRepository** (`repositories/user_repository.py`)
```python
class UserRepository(BaseRepository[User]):
    def get_by_username(self, username: str) -> Optional[User]
    def get_by_email(self, email: str) -> Optional[User]
    def get_by_ldap_sam_account_name(self, sam_account_name: str) -> Optional[User]
    def get_active_users(self, skip: int = 0, limit: int = 100) -> List[User]
    def get_superusers(self, skip: int = 0, limit: int = 100) -> List[User]
    def search_users(self, search_term: str) -> List[User]
    def update_last_login(self, user_id: int) -> Optional[User]
    def username_exists(self, username: str) -> bool
    def email_exists(self, email: str) -> bool
```

#### **ModuleRepository** (`repositories/module_repository.py`)
```python
class ModuleRepository(BaseRepository[Module]):
    def get_by_name(self, name: str) -> Optional[Module]
    def get_by_route_path(self, route_path: str) -> Optional[Module]
    def get_active_modules(self, skip: int = 0, limit: int = 100) -> List[Module]
    def get_modules_by_order(self, skip: int = 0, limit: int = 100) -> List[Module]
    def search_modules(self, search_term: str) -> List[Module]
    def name_exists(self, name: str) -> bool
    def route_exists(self, route_path: str) -> bool
```

#### **UserModuleRepository** (`repositories/user_module_repository.py`)
```python
class UserModuleRepository(BaseRepository[UserModule]):
    def get_by_user_and_module(self, user_id: int, module_id: int) -> Optional[UserModule]
    def get_user_modules(self, user_id: int) -> List[UserModule]
    def get_active_user_modules(self, user_id: int) -> List[UserModule]
    def get_module_users(self, module_id: int) -> List[UserModule]
    def user_has_module_access(self, user_id: int, module_id: int) -> bool
    def user_has_permission(self, user_id: int, module_id: int, permission: str) -> bool
    def remove_user_module(self, user_id: int, module_id: int) -> bool
```

#### **AuditLogRepository** (`repositories/audit_log_repository.py`)
```python
class AuditLogRepository(BaseRepository[AuditLog]):
    def get_logs_by_user(self, user_id: int) -> List[AuditLog]
    def get_logs_by_action(self, action: str) -> List[AuditLog]
    def get_logs_by_date_range(self, start_date: datetime, end_date: datetime) -> List[AuditLog]
    def get_logs_today(self) -> List[AuditLog]
    def get_logs_this_week(self) -> List[AuditLog]
    def get_logs_this_month(self) -> List[AuditLog]
    def get_recent_logs(self, limit: int = 100) -> List[AuditLog]
    def count_logs_by_user(self, user_id: int) -> int
    def count_logs_today(self) -> int
```

## 🔄 Mudanças nos Services

### **AdminService** - Antes vs Depois

#### ❌ **ANTES** (Operações diretas)
```python
def list_users(self, skip: int = 0, limit: int = 100, search: str = None):
    session = self._get_session()
    try:
        query = session.query(User)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    User.username.ilike(search_term),
                    User.display_name.ilike(search_term),
                    User.email.ilike(search_term)
                )
            )
        users = query.offset(skip).limit(limit).all()
        return users
    finally:
        session.close()
```

#### ✅ **DEPOIS** (Usando Repository)
```python
def list_users(self, skip: int = 0, limit: int = 100, search: str = None):
    try:
        if search:
            return self.user_repo.search_users(search, skip=skip, limit=limit)
        else:
            return self.user_repo.get_all(skip=skip, limit=limit)
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {e}")
        raise
```

### **AuthService** - Antes vs Depois

#### ❌ **ANTES** (Operações diretas)
```python
def _get_or_create_user(self, ldap_user_info: Dict[str, Any]):
    session_factory = get_session_factory()
    session = session_factory()
    try:
        user = session.query(User).filter_by(username=username).first()
        if user:
            user.email = ldap_user_info.get('email') or user.email
            user.updated_at = datetime.utcnow()
            session.commit()
        else:
            user = User(**user_data)
            session.add(user)
            session.commit()
        return user
    finally:
        session.close()
```

#### ✅ **DEPOIS** (Usando Repository)
```python
def _get_or_create_user(self, ldap_user_info: Dict[str, Any]):
    try:
        user = self.user_repo.get_by_username(username)
        if user:
            update_data = {
                'email': ldap_user_info.get('email') or user.email,
                'updated_by': "ldap_sync"
            }
            user = self.user_repo.update(user.id, **update_data)
        else:
            user = self.user_repo.create(**user_data)
        return user
    except Exception as e:
        logger.error(f"Erro ao buscar/criar usuário: {e}")
        return None
```

## 🔄 Mudanças nos Scripts

### **Scripts Refatorados**
- `scripts/init_database.py`
- `scripts/quick_admin_setup.py`
- `scripts/exemplo_uso.py`

### **Exemplo de Mudança**

#### ❌ **ANTES**
```python
session_factory = get_session_factory()
session = session_factory()
try:
    user = session.query(User).filter_by(id=user_id).first()
    user.is_superuser = True
    session.commit()
finally:
    session.close()
```

#### ✅ **DEPOIS**
```python
updated_user = user_repository.update(
    user_id, 
    is_superuser=True, 
    updated_by="script"
)
```

## 🎯 Benefícios da Refatoração

### 1. **Separação de Responsabilidades**
- **Repositories**: Operações de banco de dados
- **Services**: Lógica de negócio
- **Controllers/Routes**: Controle de requisições

### 2. **Reutilização de Código**
- Operações CRUD genéricas no BaseRepository
- Métodos específicos nos repositories especializados
- Redução de código duplicado

### 3. **Facilidade de Teste**
- Repositories podem ser mockados facilmente
- Services podem ser testados isoladamente
- Testes mais rápidos e confiáveis

### 4. **Manutenibilidade**
- Mudanças no banco afetam apenas repositories
- Lógica de negócio isolada nos services
- Código mais limpo e organizado

### 5. **Flexibilidade**
- Fácil troca de banco de dados
- Implementação de cache nos repositories
- Adição de novos métodos específicos

## 📁 Estrutura de Arquivos

```
backend/
├── repositories/
│   ├── __init__.py                    # Exporta todos os repositories
│   ├── base_repository.py             # Repository base genérico
│   ├── user_repository.py             # Repository de usuários
│   ├── module_repository.py           # Repository de módulos
│   ├── user_module_repository.py      # Repository de permissões
│   └── audit_log_repository.py        # Repository de logs
├── services/
│   ├── admin_service.py               # Refatorado para usar repositories
│   ├── auth_service.py                # Refatorado para usar repositories
│   └── ...
├── middleware/
│   └── auth_middleware.py             # Refatorado para usar repositories
└── scripts/
    ├── init_database.py               # Refatorado para usar repositories
    ├── quick_admin_setup.py           # Refatorado para usar repositories
    └── exemplo_uso.py                 # Refatorado para usar repositories
```

## 🚀 Como Usar

### **Instanciando Repositories**
```python
from repositories import user_repository, module_repository

# Usar instâncias globais
users = user_repository.get_all()

# Ou criar instâncias locais
from repositories.user_repository import UserRepository
user_repo = UserRepository()
users = user_repo.get_all()
```

### **Operações Básicas**
```python
# Criar
user = user_repository.create(username="john", email="john@example.com")

# Buscar
user = user_repository.get_by_id(1)
user = user_repository.get_by_username("john")

# Atualizar
updated_user = user_repository.update(1, is_active=False)

# Deletar
success = user_repository.delete(1)

# Buscar com filtros
active_users = user_repository.find_by_filters({"is_active": True})

# Buscar com termo de busca
users = user_repository.search("john", ["username", "email"])
```

### **Operações Específicas**
```python
# Verificar se username existe
if user_repository.username_exists("john"):
    print("Username já existe")

# Atualizar último login
user_repository.update_last_login(user_id)

# Verificar permissões
if user_module_repository.user_has_permission(user_id, module_id, "edit"):
    print("Usuário tem permissão de edição")
```

## 🔧 Próximos Passos

### 1. **Implementar Cache**
```python
class CachedUserRepository(UserRepository):
    def __init__(self, cache_service):
        super().__init__()
        self.cache = cache_service
    
    def get_by_id(self, id: int) -> Optional[User]:
        cache_key = f"user:{id}"
        user = self.cache.get(cache_key)
        if not user:
            user = super().get_by_id(id)
            if user:
                self.cache.set(cache_key, user, ttl=300)
        return user
```

### 2. **Implementar Paginação Avançada**
```python
class PaginatedResult:
    def __init__(self, items: List[T], total: int, page: int, size: int):
        self.items = items
        self.total = total
        self.page = page
        self.size = size
        self.pages = (total + size - 1) // size
```

### 3. **Implementar Soft Delete Avançado**
```python
def soft_delete(self, id: int, deleted_by: str = None) -> bool:
    return self.update(id, 
        is_active=False, 
        deleted_at=datetime.utcnow(),
        deleted_by=deleted_by
    )
```

### 4. **Implementar Auditoria Automática**
```python
def create_with_audit(self, **kwargs) -> T:
    instance = self.create(**kwargs)
    self.audit_service.log_create(instance)
    return instance
```

## ✅ Conclusão

A refatoração para o padrão Repository foi concluída com sucesso, trazendo:

- ✅ **Código mais limpo e organizado**
- ✅ **Melhor separação de responsabilidades**
- ✅ **Facilidade de manutenção e teste**
- ✅ **Reutilização de código**
- ✅ **Flexibilidade para mudanças futuras**

O sistema agora segue as melhores práticas de arquitetura de software, facilitando a manutenção e evolução do código. 