# JiraDashoards

Este repositório contém dashboards para acompanhamento do backlog e do quadro Kanban do squad Salus. Os dashboards facilitam a visualização do progresso das tarefas, priorização e gestão do fluxo de trabalho, promovendo maior transparência e eficiência para a equipe.

## Estrutura do Projeto

```
.
├── .gitignore
├── README.md
└── backend/
    ├── config/
    │   └── __init__.py
    ├── controllers/          # (Planejado para futuros controladores de API)
    ├── main.py
    ├── services/
    │   ├── __init__.py
    │   ├── jira_parser.py
    │   └── jira_service.py
    └── utils/                # (Planejado para futuras funções utilitárias)
```

## Explicação dos Arquivos e Pastas

- **`.gitignore`**: Especifica arquivos e pastas intencionalmente não rastreados pelo Git. Isso inclui arquivos de ambiente virtual (ex: `venv/`), caches do Python (`__pycache__/`), arquivos de configuração de IDEs (ex: `.vscode/`, `.idea/`) e arquivos `.env` que contêm segredos.

- **`README.md`**: Este arquivo. Fornece uma visão geral do projeto, instruções de configuração e uso.

- **`backend/`**: Diretório principal que contém toda a lógica da aplicação backend.
  - **`backend/config/`**: Destinado a armazenar arquivos de configuração da aplicação.
    - **`backend/config/__init__.py`**: Arquivo vazio que marca o diretório `config` como um pacote Python, permitindo que seus módulos sejam importados.
  - **`backend/controllers/`**: Atualmente vazio. Planejado para conter os controladores de API (por exemplo, usando Flask ou FastAPI) se o projeto for exposto como um serviço web no futuro.
  - **`backend/main.py`**: Ponto de entrada principal da aplicação. Ele orquestra as chamadas ao `JiraService` para buscar dados, usa o `jira_parser` para transformar esses dados e, em seguida, exporta os DataFrames resultantes para um arquivo Excel.
  - **`backend/services/`**: Contém a lógica de negócio e os módulos que interagem com serviços externos, como a API do Jira.
    - **`backend/services/__init__.py`**: Marca o diretório `services` como um pacote Python.
    - **`backend/services/jira_service.py`**: Define a classe `JiraService`. Esta classe é responsável por se conectar à API do Jira (usando credenciais carregadas de variáveis de ambiente via `python-dotenv`) e buscar as issues do backlog e da sprint ativa do quadro Kanban especificado.
    - **`backend/services/jira_parser.py`**: Contém a lógica para processar e transformar os dados brutos (JSON) retornados pela API do Jira. A função principal, `parse_issues_to_dataframe`, converte a lista de issues em um DataFrame do Pandas para facilitar a análise e a exportação.
  - **`backend/utils/`**: Atualmente vazio. Planejado para conter funções utilitárias que podem ser reutilizadas em diferentes partes do backend.

## Dependências Principais

Este projeto depende das seguintes bibliotecas Python, que precisam ser instaladas no seu ambiente (por exemplo, usando `pip install <biblioteca>`):

- `requests`: Para realizar as chamadas HTTP à API do Jira.
- `python-dotenv`: Para carregar variáveis de ambiente de um arquivo `.env` (onde as credenciais e configurações do Jira são armazenadas de forma segura).
- `pandas`: Para manipulação de dados e criação de DataFrames, que são usados para organizar os dados das issues do Jira.
- `openpyxl`: Motor utilizado pelo Pandas para escrever os DataFrames em arquivos Excel (`.xlsx`).
