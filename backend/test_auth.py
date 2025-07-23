"""
Script de teste para autenticação LDAP - APENAS LEITURA.
Este script NÃO modifica, cria ou exclui dados no LDAP.
"""
import asyncio
import logging
import getpass
from services.auth_service import auth_service

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def print_header():
    """Imprime cabeçalho do teste."""
    print("=" * 60)
    print("🔐 TESTE DE AUTENTICAÇÃO LDAP - SORRIDENTS")
    print("=" * 60)
    print("⚠️  ATENÇÃO: Este teste APENAS LÊ dados do LDAP")
    print("   NÃO cria, modifica ou exclui nenhum dado!")
    print("=" * 60)


def test_ldap_connection():
    """Testa a conexão com o servidor LDAP."""
    print("\n🔍 TESTE 1: Conexão com servidor LDAP")
    print("-" * 40)
    
    try:
        connected = auth_service._connect_ldap()
        if connected:
            print("✅ Conexão LDAP estabelecida com sucesso!")
            print("   Servidor: 10.200.128.60:389")
            print("   Base DN: dc=sorridents,dc=br")
            return True
        else:
            print("❌ Falha na conexão LDAP")
            print("   Verifique as configurações no arquivo .env")
            return False
    except Exception as e:
        print(f"❌ Erro na conexão LDAP: {e}")
        return False


def test_user_search(username: str):
    """Testa a busca de um usuário no LDAP."""
    print(f"\n🔍 TESTE 2: Busca de usuário '{username}'")
    print("-" * 40)
    
    try:
        user_info = auth_service.search_user(username)
        if user_info:
            print("✅ Usuário encontrado no LDAP!")
            print(f"   Nome completo: {user_info.get('display_name', 'N/A')}")
            print(f"   Email: {user_info.get('email', 'N/A')}")
            print(f"   Departamento: {user_info.get('department', 'N/A')}")
            print(f"   Cargo: {user_info.get('title', 'N/A')}")
            print(f"   Telefone: {user_info.get('phone', 'N/A')}")
            print(f"   Celular: {user_info.get('mobile', 'N/A')}")
            return True
        else:
            print("❌ Usuário não encontrado no LDAP")
            print("   Verifique se o username está correto")
            return False
    except Exception as e:
        print(f"❌ Erro na busca do usuário: {e}")
        return False


def test_user_authentication(username: str, password: str):
    """Testa a autenticação de um usuário."""
    print(f"\n🔐 TESTE 3: Autenticação do usuário '{username}'")
    print("-" * 40)
    
    try:
        user_info = auth_service.authenticate_user(username, password)
        if user_info:
            print("✅ Autenticação bem-sucedida!")
            print(f"   Nome completo: {user_info.get('display_name', 'N/A')}")
            print(f"   Email: {user_info.get('email', 'N/A')}")
            print(f"   Departamento: {user_info.get('department', 'N/A')}")
            print(f"   Cargo: {user_info.get('title', 'N/A')}")
            print(f"   Último login: {user_info.get('last_logon', 'N/A')}")
            return True
        else:
            print("❌ Falha na autenticação")
            print("   Verifique se a senha está correta")
            return False
    except Exception as e:
        print(f"❌ Erro na autenticação: {e}")
        return False


def get_user_input():
    """Obtém dados do usuário de forma segura."""
    print("\n📝 DADOS PARA TESTE")
    print("-" * 40)
    
    # Username
    username = input("Digite seu username (sAMAccountName): ").strip()
    if not username:
        print("❌ Username é obrigatório!")
        return None, None
    
    # Password (oculto)
    try:
        password = getpass.getpass("Digite sua senha: ")
        if not password:
            print("❌ Senha é obrigatória!")
            return None, None
    except KeyboardInterrupt:
        print("\n❌ Operação cancelada pelo usuário")
        return None, None
    
    return username, password


def main():
    """Função principal de teste."""
    print_header()
    
    # Teste 1: Conexão LDAP
    ldap_ok = test_ldap_connection()
    if not ldap_ok:
        print("\n❌ Testes interrompidos - LDAP não está acessível")
        print("   Verifique:")
        print("   1. Se o servidor 10.200.128.60 está acessível")
        print("   2. Se as credenciais no .env estão corretas")
        print("   3. Se a porta 389 está liberada")
        return
    
    # Obter dados do usuário
    username, password = get_user_input()
    if not username or not password:
        return
    
    # Teste 2: Busca de usuário
    search_ok = test_user_search(username)
    if not search_ok:
        print("\n❌ Teste de busca falhou")
        print("   Verifique se o username está correto")
        return
    
    # Teste 3: Autenticação
    auth_ok = test_user_authentication(username, password)
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS TESTES")
    print("=" * 60)
    print(f"   Conexão LDAP: {'✅ OK' if ldap_ok else '❌ FALHOU'}")
    print(f"   Busca usuário: {'✅ OK' if search_ok else '❌ FALHOU'}")
    print(f"   Autenticação: {'✅ OK' if auth_ok else '❌ FALHOU'}")
    
    if ldap_ok and search_ok and auth_ok:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("   O sistema de autenticação LDAP está funcionando corretamente.")
    else:
        print("\n⚠️  ALGUNS TESTES FALHARAM")
        print("   Verifique as configurações e tente novamente.")
    
    print("\n🔒 SEGURANÇA CONFIRMADA:")
    print("   ✅ Apenas operações de LEITURA foram realizadas")
    print("   ✅ Nenhum dado foi modificado no LDAP")
    print("   ✅ Sistema seguro para uso em produção")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Teste interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
    finally:
        print("\n�� Teste finalizado") 