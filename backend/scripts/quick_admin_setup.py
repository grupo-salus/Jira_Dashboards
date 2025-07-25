#!/usr/bin/env python3
"""
Script rápido para login e atribuição de privilégios de admin.
Este script faz o processo completo de forma automatizada.
"""

import sys
import os
import getpass
from datetime import datetime

# Adicionar o diretório raiz ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import create_tables
from services.auth_service import auth_service
from repositories import user_repository, audit_log_repository


def print_step(step: int, total: int, message: str):
    """Imprime uma etapa do processo."""
    print(f"\n[{step}/{total}] {message}")
    print("-" * 50)


def print_success(message: str):
    """Imprime uma mensagem de sucesso."""
    print(f"✅ {message}")


def print_error(message: str):
    """Imprime uma mensagem de erro."""
    print(f"❌ {message}")


def print_info(message: str):
    """Imprime uma mensagem informativa."""
    print(f"ℹ️  {message}")


def main():
    """Função principal do script."""
    print("🚀 SCRIPT RÁPIDO - LOGIN E ATRIBUIÇÃO DE ADMIN")
    print("=" * 60)
    
    try:
        # Etapa 1: Verificar banco de dados
        print_step(1, 4, "Verificando banco de dados...")
        
        try:
            # Tentar buscar um usuário para verificar se o banco está funcionando
            test_users = user_repository.get_all(limit=1)
            print_success("Conexão com banco estabelecida")
            
            # Verificar se tabelas existem tentando buscar dados
            try:
                user_repository.count()
                print_success("Tabela users existe")
            except:
                print_error("Tabela users não existe")
                print_info("Inicializando banco de dados...")
                create_tables()
            
        except Exception as e:
            print_error(f"Erro no banco: {e}")
            print_info("Tentando inicializar banco...")
            create_tables()
        
        # Etapa 2: Login do usuário
        print_step(2, 4, "Realizando login...")
        
        username = input("Digite seu username: ").strip()
        password = getpass.getpass("Digite sua senha: ")
        
        if not username or not password:
            print_error("Username e senha são obrigatórios")
            return
        
        # Tentar autenticação
        user_info = auth_service.authenticate_user_with_db_check(username, password)
        
        if not user_info:
            print_error("Falha na autenticação. Verifique suas credenciais.")
            return
        
        print_success(f"Login realizado com sucesso!")
        print_info(f"Usuário: {user_info['display_name']} ({user_info['username']})")
        print_info(f"Email: {user_info['email']}")
        print_info(f"Superuser: {'Sim' if user_info['is_superuser'] else 'Não'}")
        
        # Etapa 3: Verificar se já é admin
        print_step(3, 4, "Verificando privilégios de admin...")
        
        if user_info['is_superuser']:
            print_success("Usuário já é administrador!")
            print_info("Nenhuma ação necessária.")
            return
        
        # Etapa 4: Atribuir privilégios de admin
        print_step(4, 4, "Atribuindo privilégios de admin...")
        
        user = user_repository.get_by_id(user_info['id'])
        
        if not user:
            print_error("Usuário não encontrado no banco")
            return
        
        # Confirmar ação
        print(f"\nVocê está prestes a tornar o usuário '{user.username}' um administrador.")
        confirm = input("Deseja continuar? (s/N): ").strip().lower()
        
        if confirm not in ['s', 'sim', 'y', 'yes']:
            print_info("Operação cancelada")
            return
        
        # Atualizar usuário
        updated_user = user_repository.update(
            user.id, 
            is_superuser=True, 
            updated_by="quick_admin_setup"
        )
        
        if not updated_user:
            print_error("Erro ao atualizar usuário")
            return
        
        # Registrar no log de auditoria
        audit_data = {
            'user_id': user.id,
            'action': "GRANT_ADMIN",
            'resource_type': "USER",
            'resource_id': user.id,
            'details': "Privilégios de admin concedidos via script rápido",
            'ip_address': "127.0.0.1"
        }
        audit_log_repository.create(**audit_data)
        
        print_success(f"Usuário '{user.username}' agora é administrador!")
        print_info("Você pode agora acessar todas as funcionalidades administrativas.")
        
    except Exception as e:
        print_error(f"Erro inesperado: {e}")
        return
    
    print("\n" + "=" * 60)
    print("🎉 PROCESSO CONCLUÍDO COM SUCESSO!")
    print("=" * 60)


if __name__ == "__main__":
    main() 