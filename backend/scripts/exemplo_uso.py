#!/usr/bin/env python3
"""
Exemplo de uso dos scripts de teste de autenticação e administração.
Este script demonstra como usar programaticamente as funcionalidades.
"""

import sys
import os
from datetime import datetime

# Adicionar o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import create_tables
from services.auth_service import auth_service
from services.admin_service import admin_service
from repositories import user_repository, audit_log_repository


def exemplo_login_e_admin():
    """Exemplo de como fazer login e atribuir admin programaticamente."""
    print("🔧 EXEMPLO: Login e Atribuição de Admin")
    print("=" * 50)
    
    # 1. Verificar banco de dados
    print("\n1. Verificando banco de dados...")
    try:
        # Tentar buscar usuários para verificar se o banco está funcionando
        test_users = user_repository.get_all(limit=1)
        print("✅ Banco de dados OK")
    except Exception as e:
        print(f"❌ Erro no banco: {e}")
        print("🔄 Inicializando banco...")
        create_tables()
    
    # 2. Simular login (substitua pelas suas credenciais)
    print("\n2. Simulando login...")
    username = "seu_username"  # Substitua pelo seu username
    password = "sua_senha"     # Substitua pela sua senha
    
    print(f"Tentando login com usuário: {username}")
    
    # Descomente as linhas abaixo para testar login real
    # user_info = auth_service.authenticate_user_with_db_check(username, password)
    # if user_info:
    #     print(f"✅ Login realizado: {user_info['display_name']}")
    #     return user_info
    # else:
    #     print("❌ Falha no login")
    #     return None
    
    # Para demonstração, vamos simular um usuário
    print("ℹ️ Login simulado para demonstração")
    return {
        'id': 1,
        'username': username,
        'display_name': 'Usuário Exemplo',
        'email': f'{username}@gruposalus.com.br',
        'is_superuser': False,
        'is_active': True
    }


def exemplo_atribuir_admin(user_info):
    """Exemplo de como atribuir privilégios de admin."""
    print("\n3. Atribuindo privilégios de admin...")
    
    if not user_info:
        print("❌ Usuário não informado")
        return False
    
    if user_info['is_superuser']:
        print("ℹ️ Usuário já é administrador")
        return True
    
    try:
        # Buscar usuário no banco
        user = user_repository.get_by_id(user_info['id'])
        
        if not user:
            print("❌ Usuário não encontrado no banco")
            return False
        
        # Atualizar para admin
        updated_user = user_repository.update(
            user.id,
            is_superuser=True,
            updated_by="exemplo_script"
        )
        
        if not updated_user:
            print("❌ Erro ao atualizar usuário")
            return False
        
        # Registrar no log de auditoria
        audit_data = {
            'user_id': user.id,
            'action': "GRANT_ADMIN",
            'resource_type': "USER",
            'resource_id': user.id,
            'details': "Privilégios de admin concedidos via script de exemplo",
            'ip_address': "127.0.0.1"
        }
        audit_log_repository.create(**audit_data)
        
        print(f"✅ Usuário '{user.username}' agora é administrador!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao atribuir admin: {e}")
        return False


def exemplo_listar_usuarios():
    """Exemplo de como listar usuários."""
    print("\n4. Listando usuários...")
    
    try:
        users = admin_service.list_users(limit=10)
        
        if not users:
            print("ℹ️ Nenhum usuário encontrado")
            return
        
        print(f"📋 Total de usuários: {len(users)}")
        print("-" * 80)
        print(f"{'ID':<5} {'Username':<15} {'Nome':<25} {'Email':<25} {'Admin':<8}")
        print("-" * 80)
        
        for user in users:
            admin_status = "Sim" if user.is_superuser else "Não"
            print(f"{user.id:<5} {user.username:<15} {user.display_name:<25} {user.email:<25} {admin_status:<8}")
            
    except Exception as e:
        print(f"❌ Erro ao listar usuários: {e}")


def exemplo_logs_auditoria():
    """Exemplo de como ver logs de auditoria."""
    print("\n5. Verificando logs de auditoria...")
    
    try:
        logs = admin_service.list_audit_logs(limit=5)
        
        if not logs:
            print("ℹ️ Nenhum log de auditoria encontrado")
            return
        
        print(f"📊 Últimos {len(logs)} logs de auditoria:")
        print("-" * 80)
        print(f"{'Data/Hora':<20} {'Usuário':<15} {'Ação':<15} {'Sucesso':<8}")
        print("-" * 80)
        
        for log in logs:
            username = log.username or "Sistema"
            success = "Sim" if log.success else "Não"
            created_at = log.created_at.strftime("%d/%m/%Y %H:%M")
            print(f"{created_at:<20} {username:<15} {log.action:<15} {success:<8}")
            
    except Exception as e:
        print(f"❌ Erro ao buscar logs: {e}")


def main():
    """Função principal do exemplo."""
    print("🚀 EXEMPLO DE USO - SCRIPTS DE TESTE")
    print("Este exemplo demonstra como usar as funcionalidades programaticamente")
    print("=" * 60)
    
    # Executar exemplos
    user_info = exemplo_login_e_admin()
    
    if user_info:
        exemplo_atribuir_admin(user_info)
        exemplo_listar_usuarios()
        exemplo_logs_auditoria()
    
    print("\n" + "=" * 60)
    print("🎯 EXEMPLO CONCLUÍDO!")
    print("Para usar os scripts reais, execute:")
    print("  python scripts/quick_admin_setup.py")
    print("  python scripts/test_auth_admin.py")
    print("=" * 60)


if __name__ == "__main__":
    main() 