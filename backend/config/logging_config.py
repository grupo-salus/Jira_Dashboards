import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging():
    """
    Configura logging profissional com rotação de arquivos.
    - Apenas erros aparecem no terminal.
    - Todos os logs (DEBUG, INFO, etc.) vão para o arquivo.
    """
    # Diretório e arquivo de log
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "jira_dashboard.log")

    # Nível de log global (usado para o arquivo)
    log_level = os.getenv("LOG_LEVEL", "DEBUG").upper()

    # Formatter padrão
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Handler para terminal: apenas erros
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.ERROR)
    console_handler.setFormatter(formatter)

    # Handler para arquivo com rotação
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
    root_logger.handlers.clear()

    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Reduz ruído de bibliotecas externas no terminal
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)

    # Apenas para o arquivo
    logging.debug(f"Logging iniciado no nível: {log_level}")
    logging.debug(f"Logs serão salvos em: {log_file}")
