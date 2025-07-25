"""
Script para inicializar o banco de dados com dados padrão.
"""
import sys
import os
from datetime import datetime

# Adicionar o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import create_tables
from repositories import user_repository, module_repository, user_module_repository
from core.settings import settings


def create_default_modules():
    """Cria os módulos padrão do sistema."""
    
    default_modules = [
        {
            "name": "projetos",
            "display_name": "Dashboard de Projetos",
            "description": "Visualização e acompanhamento de projetos",
            "route_path": "/projetos",
            "icon": "project",
            "order": 1
        },
        {
            "name": "sprint",
            "display_name": "Dashboard de Sprint",
            "description": "Acompanhamento de sprints e entregas",
            "route_path": "/sprint",
            "icon": "sprint",
            "order": 2
        },
        {
            "name": "ti",
            "display_name": "Dashboard de TI",
            "description": "Acompanhamento de demandas de TI",
            "route_path": "/ti",
            "icon": "computer",
            "order": 3
        }
    ]
    
    try:
        for module_data in default_modules:
            # Verificar se o módulo já existe
            existing_module = module_repository.get_by_name(module_data["name"])
            
            if not existing_module:
                module = module_repository.create(
                    name=module_data["name"],
                    display_name=module_data["display_name"],
                    description=module_data["description"],
                    route_path=module_data["route_path"],
                    icon=module_data["icon"],
                    order=module_data["order"],
                    is_active=True,
                    requires_authentication=True,
                    created_by="system"
                )
                print(f"✅ Módulo '{module_data['name']}' criado")
            else:
                print(f"ℹ️  Módulo '{module_data['name']}' já existe")
        
        print("✅ Módulos padrão criados com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao criar módulos: {e}")
        raise


def create_superuser():
    """Cria um usuário superuser padrão."""
    
    try:
        # Verificar se já existe um superuser
        existing_superuser = user_repository.get_superusers(limit=1)
        
        if existing_superuser:
            print(f"ℹ️  Superuser já existe: {existing_superuser[0].username}")
            return existing_superuser[0]
        
        # Criar superuser padrão
        superuser = user_repository.create(
            username="admin",
            email="admin@gruposalus.com.br",
            display_name="Administrador do Sistema",
            first_name="Administrador",
            last_name="Sistema",
            is_active=True,
            is_superuser=True,
            created_by="system"
        )
        
        print("✅ Superuser 'admin' criado com sucesso!")
        return superuser
        
    except Exception as e:
        print(f"❌ Erro ao criar superuser: {e}")
        raise


def assign_modules_to_superuser(superuser):
    """Atribui todos os módulos ao superuser."""
    
    try:
        # Buscar todos os módulos ativos
        modules = module_repository.get_active_modules()
        
        for module in modules:
            # Verificar se já existe a atribuição
            existing_assignment = user_module_repository.get_by_user_and_module(
                superuser.id, module.id
            )
            
            if not existing_assignment:
                user_module = user_module_repository.create(
                    user_id=superuser.id,
                    module_id=module.id,
                    can_view=True,
                    can_edit=True,
                    can_delete=True,
                    can_export=True,
                    is_active=True,
                    granted_by="system"
                )
                print(f"✅ Permissões concedidas para módulo '{module.name}'")
            else:
                print(f"ℹ️  Permissões já existem para módulo '{module.name}'")
        
        print("✅ Permissões atribuídas ao superuser!")
        
    except Exception as e:
        print(f"❌ Erro ao atribuir permissões: {e}")
        raise


def main():
    """Função principal para inicializar o banco."""
    
    print("🚀 Inicializando banco de dados...")
    
    try:
        # Criar tabelas
        print("📋 Criando tabelas...")
        create_tables()
        print("✅ Tabelas criadas com sucesso!")
        
        # Criar módulos padrão
        print("📦 Criando módulos padrão...")
        create_default_modules()
        
        # Criar superuser
        print("👤 Criando superuser...")
        superuser = create_superuser()
        
        # Atribuir módulos ao superuser
        print("🔐 Atribuindo permissões...")
        assign_modules_to_superuser(superuser)
        
        print("🎉 Banco de dados inicializado com sucesso!")
        print("\n📝 Informações importantes:")
        print(f"   • Superuser: admin")
        print(f"   • Email: admin@gruposalus.com.br")
        print(f"   • Módulos criados: projetos, sprint, ti")
        print(f"   • Banco: {settings.SQLITE_DATABASE_PATH}")
        
    except Exception as e:
        print(f"❌ Erro durante inicialização: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 