"""
Serviço de autenticação LDAP.
"""
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from ldap3 import Server, Connection, ALL, NTLM, SIMPLE
from ldap3.core.exceptions import LDAPException

from core.settings import settings
from core.database import get_session_factory
from models import User, AuditLog

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


    def _check_user_account_control(self, account_control: int) -> bool:
        """
        Verifica se a conta do usuário está ativa no AD.
        
        Args:
            account_control: Valor do userAccountControl do AD
            
        Returns:
            True se a conta está ativa, False caso contrário
        """
        if account_control is None:
            return True  # Se não temos a informação, assumimos que está ativo
        
        # Constantes do AD para userAccountControl
        ACCOUNTDISABLE = 0x0002
        LOCKOUT = 0x800000
        
        # Verificar se a conta está desabilitada ou bloqueada
        return not (account_control & (ACCOUNTDISABLE | LOCKOUT))
    
    def _get_or_create_user(self, ldap_user_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Busca ou cria um usuário no banco de dados baseado nas informações do LDAP.
        
        Args:
            ldap_user_info: Informações do usuário vindas do LDAP
            
        Returns:
            Dict com informações do usuário se encontrado/criado, None caso contrário
        """
        session_factory = get_session_factory()
        session = session_factory()
        
        try:
            username = ldap_user_info['username']
            
            # Buscar usuário existente
            user = session.query(User).filter_by(username=username).first()
            
            if user:
                # Atualizar informações do usuário
                user.email = ldap_user_info.get('email') or user.email
                user.display_name = ldap_user_info.get('display_name') or user.display_name
                user.first_name = ldap_user_info.get('first_name') or user.first_name
                user.last_name = ldap_user_info.get('last_name') or user.last_name
                user.department = ldap_user_info.get('department') or user.department
                user.title = ldap_user_info.get('title') or user.title
                user.ldap_dn = ldap_user_info.get('dn') or user.ldap_dn
                user.ldap_sam_account_name = ldap_user_info.get('username') or user.ldap_sam_account_name
                user.updated_at = datetime.utcnow()
                user.updated_by = "ldap_sync"
                
                logger.info(f"Usuário {username} atualizado no banco de dados")
            else:
                # Criar novo usuário
                user = User(
                    username=username,
                    email=ldap_user_info.get('email', f"{username}@gruposalus.com.br"),
                    display_name=ldap_user_info.get('display_name', username),
                    first_name=ldap_user_info.get('first_name'),
                    last_name=ldap_user_info.get('last_name'),
                    department=ldap_user_info.get('department'),
                    title=ldap_user_info.get('title'),
                    ldap_dn=ldap_user_info.get('dn'),
                    ldap_sam_account_name=ldap_user_info.get('username'),
                    is_active=True,
                    is_superuser=False,
                    created_by="ldap_sync"
                )
                session.add(user)
                logger.info(f"Usuário {username} criado no banco de dados")
            
            session.commit()
            
            # Retornar informações do usuário como dict para evitar problemas de sessão
            user_info = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'display_name': user.display_name,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'department': user.department,
                'title': user.title,
                'is_active': user.is_active,
                'is_superuser': user.is_superuser,
                'ldap_dn': user.ldap_dn,
                'last_login': user.last_login,
                'created_at': user.created_at,
                'updated_at': user.updated_at
            }
            
            return user_info
            
        except Exception as e:
            session.rollback()
            logger.error(f"Erro ao buscar/criar usuário no banco: {e}")
            return None
        finally:
            session.close()
    
    def _log_authentication_attempt(self, username: str, success: bool, ip_address: str = None, error_message: str = None):
        """
        Registra tentativa de autenticação no log de auditoria.
        
        Args:
            username: Nome do usuário
            success: Se a autenticação foi bem-sucedida
            ip_address: Endereço IP do usuário
            error_message: Mensagem de erro (se houver)
        """
        session_factory = get_session_factory()
        session = session_factory()
        
        try:
            # Buscar usuário no banco
            user = session.query(User).filter_by(username=username).first()
            user_id = user.id if user else None
            
            audit_log = AuditLog(
                action="login" if success else "login_failed",
                resource_type="user",
                resource_id=str(user_id) if user_id else None,
                user_id=user_id,
                username=username,
                ip_address=ip_address,
                success=success,
                error_message=error_message,
                details={
                    "ldap_enabled": settings.LDAP_ENABLED,
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
            
            session.add(audit_log)
            session.commit()
            
        except Exception as e:
            session.rollback()
            logger.error(f"Erro ao registrar log de auditoria: {e}")
        finally:
            session.close()
    
    def authenticate_user_with_db_check(self, username: str, password: str, ip_address: str = None) -> Optional[Dict[str, Any]]:
        """
        Autentica um usuário no LDAP e verifica se está ativo no banco de dados.
        
        Args:
            username: Nome de usuário (sAMAccountName)
            password: Senha do usuário
            ip_address: Endereço IP do usuário (opcional)
            
        Returns:
            Dict com informações do usuário se autenticado e ativo, None caso contrário
        """
        try:
            # Primeiro, autenticar no LDAP
            ldap_user_info = self.authenticate_user(username, password)
            
            if not ldap_user_info:
                self._log_authentication_attempt(username, False, ip_address, "Falha na autenticação LDAP")
                return None
            
            # Verificar se a conta está ativa no AD
            account_control = ldap_user_info.get('account_control')
            if not self._check_user_account_control(account_control):
                self._log_authentication_attempt(username, False, ip_address, "Conta desabilitada no AD")
                logger.warning(f"Usuário {username} tem conta desabilitada no AD")
                return None
            
            # Buscar ou criar usuário no banco de dados
            db_user_info = self._get_or_create_user(ldap_user_info)
            
            if not db_user_info:
                self._log_authentication_attempt(username, False, ip_address, "Erro ao sincronizar com banco de dados")
                return None
            
            # Verificar se o usuário está ativo no nosso banco
            if not db_user_info['is_active']:
                self._log_authentication_attempt(username, False, ip_address, "Usuário desabilitado no sistema")
                logger.warning(f"Usuário {username} está desabilitado no sistema")
                return None
            
            # Atualizar último login
            session_factory = get_session_factory()
            session = session_factory()
            try:
                # Buscar o usuário novamente na nova sessão
                user_to_update = session.query(User).filter_by(id=db_user_info['id']).first()
                if user_to_update:
                    user_to_update.last_login = datetime.utcnow()
                    session.commit()
                    # Atualizar o dict com o novo last_login
                    db_user_info['last_login'] = user_to_update.last_login
            except Exception as e:
                session.rollback()
                logger.error(f"Erro ao atualizar último login: {e}")
            finally:
                session.close()
            
            # Registrar sucesso no log
            self._log_authentication_attempt(username, True, ip_address)
            
            # Retornar informações completas do usuário
            user_info = db_user_info
            
            logger.info(f"Usuário {username} autenticado com sucesso (LDAP + DB)")
            return user_info
            
        except Exception as e:
            logger.error(f"Erro inesperado durante autenticação completa: {e}")
            self._log_authentication_attempt(username, False, ip_address, str(e))
            return None


# Instância global do serviço
auth_service = AuthService() 