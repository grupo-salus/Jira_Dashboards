import requests
import json
from services.jira_service import JiraService

BASE_URL = "http://127.0.0.1:8001"

# ----------- Teste resumo backlog -----------
def testar_resumo_backlog(filtros=None, nome_arquivo="backlog_summary.json"):
    url = f"{BASE_URL}/api/backlog/resumo"
    try:
        response = requests.get(url, params=filtros)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar resumo do backlog: {e}")
        return

    data = response.json()
    print(f"\nResumo do backlog salvo em '{nome_arquivo}'")
    print(f"Total de cards: {data.get('total')}")
    print(f"Media de dias no backlog: {data.get('tempo_medio')}")
    print(f"Chaves do resumo: {list(data.keys())}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ----------- Teste desempenho da sprint -----------
def testar_resumo_sprint(nome_arquivo="sprint_summary.json"):
    url = f"{BASE_URL}/api/sprint/desempenho"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar resumo da sprint: {e}")
        return

    data = response.json()
    print(f"\nResumo da sprint salvo em '{nome_arquivo}'")
    print(f"Total de cards: {data['resumo_geral'].get('total_cards')}")
    print(f"Entregues no prazo: {data['resumo_geral'].get('entregues_no_prazo')}")
    print(f"Atrasado: {data['resumo_geral'].get('fora_do_prazo')}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

#@router.get("/api/backlog/por-projetos")
def testar_backlog_por_projetos(nome_arquivo="backlog_tabela.json"):
    url = f"{BASE_URL}/api/backlog/tabela"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar backlog por projetos: {e}")
        return
    
    data = response.json()
    print(f"\nBacklog por projetos salvo em '{nome_arquivo}'")
    print(f"Total geral de cards: {data.get('total_geral_cards')}")
    print(f"Total de projetos: {data.get('total_projetos')}")
    print(f"Numero de departamentos: {len(data.get('por_departamento', {}))}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def testar_acompanhamento_ti(nome_arquivo="acompanhamento_ti_tabela.json"):
    url = f"{BASE_URL}/api/acompanhamento_ti/tabela"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar acompanhamento TI: {e}")
        return
    
    data = response.json()
    print(f"\nAcompanhamento TI salvo em '{nome_arquivo}'")


    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def testar_espacos_de_projetos(nome_arquivo="espacos_de_projetos.json"):
    url = f"{BASE_URL}/api/espaco_de_projetos/tabela"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar acompanhamento TI: {e}")
        return
    
    data = response.json()
    print(f"\nAcompanhamento TI salvo em '{nome_arquivo}'")


    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


def testar_opcoes_campo_customizado(nome_arquivo="opcoes_campo_customizado.json"):
    url = f"{BASE_URL}/api/jira/opcoes-campo-customizado/customfield_10245"
    try:
        response = requests.get(url)
        print(response.json())
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Erro ao requisitar opções do campo customizado: {e}")
        return

# ----------- Execução dos testes -----------
if __name__ == "__main__":
    # print("Teste 1 - Resumo backlog (sem filtros):")
    # testar_resumo_backlog()

    # print("\nTeste 2 - Resumo backlog (com filtros):")
    # filtros = {
    #     "departamento": "Financeiro",
    #     "prioridade": "Estratégico",
    #     "status": "Tarefas pendentes"
    # }
    # testar_resumo_backlog(filtros, nome_arquivo="backlog_summary_filtrado.json")

    # print("\nTeste 3 - Resumo da sprint ativa:")
    # testar_resumo_sprint()

    # print("\nTeste 4 - Backlog por projetos:")
    # testar_backlog_por_projetos()

    # print("\nTeste 5 - Acompanhamento TI:")
    # testar_acompanhamento_ti()

    
    #print("\nTeste 6 - Espacos de projetos:")
    #testar_espacos_de_projetos()

    print("\nTeste 7 - Opções do campo customizado:")
    testar_opcoes_campo_customizado()