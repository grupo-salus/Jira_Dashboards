"""
Script para inicializar o banco de dados com dados padrão.
"""
import sys
import os
from datetime import datetime

# Adicionar o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_session_factory, create_tables
from models import User, Module, UserModule, AuditLog
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
    
    session_factory = get_session_factory()
    session = session_factory()
    
    try:
        for module_data in default_modules:
            # Verificar se o módulo já existe
            existing_module = session.query(Module).filter_by(name=module_data["name"]).first()
            
            if not existing_module:
                module = Module(
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
                session.add(module)
                print(f"✅ Módulo '{module_data['name']}' criado")
            else:
                print(f"ℹ️  Módulo '{module_data['name']}' já existe")
        
        session.commit()
        print("✅ Módulos padrão criados com sucesso!")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Erro ao criar módulos: {e}")
        raise
    finally:
        session.close()


def create_superuser():
    """Cria um usuário superuser padrão."""
    
    session_factory = get_session_factory()
    session = session_factory()
    
    try:
        # Verificar se já existe um superuser
        existing_superuser = session.query(User).filter_by(is_superuser=True).first()
        
        if existing_superuser:
            print(f"ℹ️  Superuser já existe: {existing_superuser.username}")
            return existing_superuser
        
        # Criar superuser padrão
        superuser = User(
            username="admin",
            email="admin@gruposalus.com.br",
            display_name="Administrador do Sistema",
            first_name="Administrador",
            last_name="Sistema",
            is_active=True,
            is_superuser=True,
            created_by="system"
        )
        
        session.add(superuser)
        session.commit()
        
        print("✅ Superuser 'admin' criado com sucesso!")
        return superuser
        
    except Exception as e:
        session.rollback()
        print(f"❌ Erro ao criar superuser: {e}")
        raise
    finally:
        session.close()


def assign_modules_to_superuser(superuser: User):
    """Atribui todos os módulos ao superuser."""
    
    session_factory = get_session_factory()
    session = session_factory()
    
    try:
        # Buscar todos os módulos ativos
        modules = session.query(Module).filter_by(is_active=True).all()
        
        for module in modules:
            # Verificar se já existe a atribuição
            existing_assignment = session.query(UserModule).filter_by(
                user_id=superuser.id,
                module_id=module.id
            ).first()
            
            if not existing_assignment:
                user_module = UserModule(
                    user_id=superuser.id,
                    module_id=module.id,
                    can_view=True,
                    can_edit=True,
                    can_delete=True,
                    can_export=True,
                    is_active=True,
                    granted_by="system"
                )
                session.add(user_module)
                print(f"✅ Permissões concedidas para módulo '{module.name}'")
            else:
                print(f"ℹ️  Permissões já existem para módulo '{module.name}'")
        
        session.commit()
        print("✅ Permissões atribuídas ao superuser!")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Erro ao atribuir permissões: {e}")
        raise
    finally:
        session.close()


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