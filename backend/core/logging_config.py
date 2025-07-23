"""
Configuração de logging estruturado para a aplicação.
"""
import logging
import logging.handlers
import os
import sys
from pathlib import Path
from typing import Dict, Any

from core.settings import settings


def setup_logging() -> None:
    """Configura o sistema de logging da aplicação."""
    
    # Criar diretório de logs se não existir
    log_dir = Path(settings.LOG_DIR)
    log_dir.mkdir(exist_ok=True)
    
    # Configurar formato do log
    if settings.LOG_FORMAT.lower() == "json":
        formatter = create_json_formatter()
    else:
        formatter = create_text_formatter()
    
    # Configurar handler para arquivo
    file_handler = create_file_handler(formatter)
    
    # Configurar handler para console
    console_handler = create_console_handler(formatter)
    
    # Configurar logger raiz
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Remover handlers existentes
    root_logger.handlers.clear()
    
    # Adicionar novos handlers
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    
    # Configurar loggers específicos
    setup_specific_loggers()
    
    # Log inicial
    logger = logging.getLogger(__name__)
    logger.info("Sistema de logging configurado com sucesso")


def create_json_formatter() -> logging.Formatter:
    """Cria um formatador JSON para logs estruturados."""
    
    class JsonFormatter(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            log_entry = {
                "timestamp": self.formatTime(record),
                "level": record.levelname,
                "logger": record.name,
                "message": record.getMessage(),
                "module": record.module,
                "function": record.funcName,
                "line": record.lineno
            }
            
            # Adicionar campos extras se existirem
            if hasattr(record, 'extra_fields'):
                log_entry.update(record.extra_fields)
            
            # Adicionar exceção se existir
            if record.exc_info:
                log_entry["exception"] = self.formatException(record.exc_info)
            
            import json
            return json.dumps(log_entry, ensure_ascii=False)
    
    return JsonFormatter()


def create_text_formatter() -> logging.Formatter:
    """Cria um formatador de texto para logs legíveis."""
    
    format_string = (
        "%(asctime)s - %(name)s - %(levelname)s - "
        "%(module)s:%(funcName)s:%(lineno)d - %(message)s"
    )
    
    return logging.Formatter(format_string)


def create_file_handler(formatter: logging.Formatter) -> logging.Handler:
    """Cria um handler para arquivo com rotação."""
    
    log_file = Path(settings.LOG_DIR) / settings.LOG_FILE
    
    handler = logging.handlers.RotatingFileHandler(
        filename=log_file,
        maxBytes=settings.LOG_MAX_SIZE * 1024 * 1024,  # Converter MB para bytes
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding='utf-8'
    )
    
    handler.setFormatter(formatter)
    handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    return handler


def create_console_handler(formatter: logging.Formatter) -> logging.Handler:
    """Cria um handler para console."""
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    
    # Em desenvolvimento, mostrar todos os logs no console
    if settings.DEBUG:
        handler.setLevel(logging.DEBUG)
    else:
        handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    return handler


def setup_specific_loggers() -> None:
    """Configura loggers específicos para diferentes módulos."""
    
    # Logger para SQL (se habilitado)
    if settings.LOG_SQL:
        sql_logger = logging.getLogger("sqlalchemy.engine")
        sql_logger.setLevel(logging.INFO)
    
    # Logger para performance (se habilitado)
    if settings.LOG_PERFORMANCE:
        perf_logger = logging.getLogger("performance")
        perf_logger.setLevel(logging.INFO)
    
    # Logger para Jira
    jira_logger = logging.getLogger("jira")
    jira_logger.setLevel(logging.INFO)
    
    # Logger para LDAP
    ldap_logger = logging.getLogger("ldap")
    ldap_logger.setLevel(logging.INFO)
    
    # Logger para autenticação
    auth_logger = logging.getLogger("auth")
    auth_logger.setLevel(logging.INFO)
    
    # Logger para API
    api_logger = logging.getLogger("api")
    api_logger.setLevel(logging.INFO)


def get_logger(name: str) -> logging.Logger:
    """Retorna um logger configurado para o módulo especificado."""
    return logging.getLogger(name)


def log_with_context(logger: logging.Logger, level: str, message: str, **context: Any) -> None:
    """Loga uma mensagem com contexto adicional."""
    
    # Criar um LogRecord com campos extras
    record = logger.makeRecord(
        name=logger.name,
        level=getattr(logging, level.upper()),
        fn="",
        lno=0,
        msg=message,
        args=(),
        exc_info=None
    )
    
    # Adicionar campos extras
    record.extra_fields = context
    
    # Logar a mensagem
    logger.handle(record)


# Funções de conveniência para logging de performance
def log_performance(logger: logging.Logger, operation: str, duration: float, **context: Any) -> None:
    """Loga métricas de performance."""
    
    context.update({
        "operation": operation,
        "duration_ms": round(duration * 1000, 2),
        "type": "performance"
    })
    
    log_with_context(logger, "INFO", f"Performance: {operation} took {duration:.3f}s", **context)


def log_api_request(logger: logging.Logger, method: str, path: str, status_code: int, 
                   duration: float, user_id: str = None, **context: Any) -> None:
    """Loga requisições da API."""
    
    context.update({
        "method": method,
        "path": path,
        "status_code": status_code,
        "duration_ms": round(duration * 1000, 2),
        "user_id": user_id,
        "type": "api_request"
    })
    
    log_with_context(logger, "INFO", 
                    f"API Request: {method} {path} - {status_code} ({duration:.3f}s)", 
                    **context)


def log_error(logger: logging.Logger, error: Exception, context: str = "", **extra_context: Any) -> None:
    """Loga erros com contexto."""
    
    extra_context.update({
        "error_type": type(error).__name__,
        "error_message": str(error),
        "context": context,
        "type": "error"
    })
    
    log_with_context(logger, "ERROR", f"Error in {context}: {error}", **extra_context)
