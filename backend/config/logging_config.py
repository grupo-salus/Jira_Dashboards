import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging():
    """
    Configura logging profissional com rotação de arquivos, suporte a variáveis de ambiente
    e log simultâneo no console e em arquivo.
    """
    # Diretório e arquivo de log
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "jira_dashboard.log")

    # Nível de log por ambiente
    log_level = os.getenv("LOG_LEVEL", "DEBUG").upper()
    

    # Formatter padrão
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Handler para terminal (console)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)

    # Handler para arquivo com rotação (5MB por arquivo, até 5 backups)
    file_handler = RotatingFileHandler(
        filename=log_file,
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers.clear()  # Evita duplicidade

    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Reduz ruído de bibliotecas externas
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)

    logging.info(f"Logging iniciado no nível: {log_level}")
    logging.info(f"Logs serão salvos em: {log_file}")
