# 🚀 Instruções Rápidas - Scripts de Teste

## 📋 O que você precisa fazer:

### 1. Preparar o ambiente
```bash
cd backend
cp env.example .env
# Editar o arquivo .env com suas configurações LDAP
```

### 2. Executar o script rápido
```bash
python scripts/quick_admin_setup.py
```

### 3. Seguir as instruções na tela
- Digite seu username
- Digite sua senha
- Confirme a atribuição de admin

## ✅ Resultado esperado:
```
✅ Usuário 'seu-username' agora é administrador!
ℹ️ Você pode agora acessar todas as funcionalidades administrativas.
```

## 🔧 Se algo der errado:

### Erro: "Tabela não existe"
```bash
python scripts/test_auth_admin.py
# Escolher opção 2: Inicializar banco de dados
```

### Erro: "Falha na autenticação"
1. Verificar configurações LDAP no `.env`
2. Verificar se o usuário existe no LDAP
3. Verificar credenciais

### Erro: "Erro de conexão com banco"
1. Verificar se o banco está rodando
2. Verificar configurações no `.env`

## 📁 Arquivos criados:
- `test_auth_admin.py` - Script completo interativo
- `quick_admin_setup.py` - Script rápido (recomendado)
- `exemplo_uso.py` - Exemplo de uso programático
- `README_TEST_SCRIPTS.md` - Documentação completa
- `INSTRUCOES_RAPIDAS.md` - Este arquivo

## 🎯 Próximos passos:
1. Execute o script rápido
2. Faça login com suas credenciais
3. Confirme a atribuição de admin
4. Teste as funcionalidades administrativas

## 📞 Precisa de ajuda?
- Verifique os logs: `backend/logs/jira_dashboards.log`
- Use o script interativo: `python scripts/test_auth_admin.py`
- Consulte a documentação completa: `README_TEST_SCRIPTS.md` 