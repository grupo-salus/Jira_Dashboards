"""
Serviço de autenticação LDAP.
"""
import logging
from typing import Optional, Dict, Any
from ldap3 import Server, Connection, ALL, NTLM, SIMPLE
from ldap3.core.exceptions import LDAPException

from core.settings import settings

logger = logging.getLogger(__name__)


class AuthService:
    """Serviço de autenticação LDAP."""
    
    def __init__(self):
        self.server = None
        self.connection = None
        
    def _connect_ldap(self) -> bool:
        """Conecta ao servidor LDAP."""
        try:
            if not settings.LDAP_ENABLED:
                logger.warning("LDAP está desabilitado nas configurações")
                return False
                
            # Criar servidor LDAP
            self.server = Server(
                settings.LDAP_SERVER,
                get_info=ALL,
                use_ssl=False,
                port=389
            )
            
            # Conectar com credenciais de bind
            self.connection = Connection(
                self.server,
                user=settings.LDAP_BIND_DN,
                password=settings.LDAP_BIND_PASSWORD,
                authentication=SIMPLE,
                auto_bind=True
            )
            
            if not self.connection.bound:
                logger.error("Falha ao conectar ao LDAP com credenciais de bind")
                return False
                
            logger.info("Conectado ao servidor LDAP com sucesso")
            return True
            
        except LDAPException as e:
            logger.error(f"Erro ao conectar ao LDAP: {e}")
            return False
        except Exception as e:
            logger.error(f"Erro inesperado ao conectar ao LDAP: {e}")
            return False
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Autentica um usuário no LDAP.
        
        Args:
            username: Nome de usuário (sAMAccountName)
            password: Senha do usuário
            
        Returns:
            Dict com informações do usuário se autenticado, None caso contrário
        """
        try:
            if not self._connect_ldap():
                return None
            
            # Buscar usuário no LDAP
            search_filter = f"(&(objectClass=user)(sAMAccountName={username}))"
            
            self.connection.search(
                search_base=settings.LDAP_BASE_DN,
                search_filter=search_filter,
                attributes=[
                    'sn', 'givenName', 'mail', 'telephoneNumber', 
                    'mobile', 'title', 'manager', 'employeeNumber', 
                    'info', 'department', 'sAMAccountName', 'lastLogon', 
                    'Mobile', 'userAccountControl'
                ]
            )
            
            if not self.connection.entries:
                logger.warning(f"Usuário {username} não encontrado no LDAP")
                return None
            
            user_entry = self.connection.entries[0]
            user_dn = user_entry.entry_dn
            
            # Tentar autenticar o usuário
            user_connection = Connection(
                self.server,
                user=user_dn,
                password=password,
                authentication=SIMPLE,
                auto_bind=True
            )
            
            if not user_connection.bound:
                logger.warning(f"Falha na autenticação do usuário {username}")
                return None
            
            # Extrair informações do usuário
            user_info = {
                'username': username,
                'dn': user_dn,
                'display_name': f"{user_entry.givenName.value} {user_entry.sn.value}" if user_entry.givenName and user_entry.sn else username,
                'email': user_entry.mail.value if user_entry.mail else None,
                'department': user_entry.department.value if user_entry.department else None,
                'title': user_entry.title.value if user_entry.title else None,
                'employee_number': user_entry.employeeNumber.value if user_entry.employeeNumber else None,
                'phone': user_entry.telephoneNumber.value if user_entry.telephoneNumber else None,
                'mobile': user_entry.mobile.value if user_entry.mobile else None,
                'manager': user_entry.manager.value if user_entry.manager else None,
                'last_logon': user_entry.lastLogon.value if user_entry.lastLogon else None,
                'account_control': user_entry.userAccountControl.value if user_entry.userAccountControl else None
            }
            
            logger.info(f"Usuário {username} autenticado com sucesso")
            return user_info
            
        except LDAPException as e:
            logger.error(f"Erro LDAP durante autenticação: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado durante autenticação: {e}")
            return None
        finally:
            if self.connection:
                self.connection.unbind()
    
    def search_user(self, username: str) -> Optional[Dict[str, Any]]:
        """
        Busca informações de um usuário no LDAP (sem autenticação).
        
        Args:
            username: Nome de usuário (sAMAccountName)
            
        Returns:
            Dict com informações do usuário se encontrado, None caso contrário
        """
        try:
            if not self._connect_ldap():
                return None
            
            search_filter = f"(&(objectClass=user)(sAMAccountName={username}))"
            
            self.connection.search(
                search_base=settings.LDAP_BASE_DN,
                search_filter=search_filter,
                attributes=[
                    'sn', 'givenName', 'mail', 'telephoneNumber', 
                    'mobile', 'title', 'manager', 'employeeNumber', 
                    'info', 'department', 'sAMAccountName', 'lastLogon', 
                    'Mobile', 'userAccountControl'
                ]
            )
            
            if not self.connection.entries:
                return None
            
            user_entry = self.connection.entries[0]
            
            user_info = {
                'username': username,
                'dn': user_entry.entry_dn,
                'display_name': f"{user_entry.givenName.value} {user_entry.sn.value}" if user_entry.givenName and user_entry.sn else username,
                'email': user_entry.mail.value if user_entry.mail else None,
                'department': user_entry.department.value if user_entry.department else None,
                'title': user_entry.title.value if user_entry.title else None,
                'employee_number': user_entry.employeeNumber.value if user_entry.employeeNumber else None,
                'phone': user_entry.telephoneNumber.value if user_entry.telephoneNumber else None,
                'mobile': user_entry.mobile.value if user_entry.mobile else None,
                'manager': user_entry.manager.value if user_entry.manager else None,
                'last_logon': user_entry.lastLogon.value if user_entry.lastLogon else None,
                'account_control': user_entry.userAccountControl.value if user_entry.userAccountControl else None
            }
            
            return user_info
            
        except LDAPException as e:
            logger.error(f"Erro LDAP durante busca: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado durante busca: {e}")
            return None
        finally:
            if self.connection:
                self.connection.unbind()


# Instância global do serviço
auth_service = AuthService() 