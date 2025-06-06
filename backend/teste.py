import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# ----------- Teste resumo backlog -----------
def testar_resumo_backlog(filtros=None, nome_arquivo="backlog_summary.json"):
    url = f"{BASE_URL}/api/backlog/resumo"
    try:
        response = requests.get(url, params=filtros)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Erro ao requisitar resumo do backlog: {e}")
        return

    data = response.json()
    print(f"\n✅ Resumo do backlog salvo em '{nome_arquivo}'")
    print(f"🔹 Total de cards: {data.get('total')}")
    print(f"🔹 Média de dias no backlog: {data.get('tempo_medio')}")
    print(f"🔹 Chaves do resumo: {list(data.keys())}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ----------- Teste desempenho da sprint -----------
def testar_resumo_sprint(nome_arquivo="sprint_summary.json"):
    url = f"{BASE_URL}/api/sprint/desempenho"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Erro ao requisitar resumo da sprint: {e}")
        return

    data = response.json()
    print(f"\n✅ Resumo da sprint salvo em '{nome_arquivo}'")
    print(f"🔹 Total de cards: {data['resumo_geral'].get('total_cards')}")
    print(f"🔹 Entregues no prazo: {data['resumo_geral'].get('entregues_no_prazo')}")
    print(f"🔹 Fora do prazo: {data['resumo_geral'].get('fora_do_prazo')}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

#@router.get("/api/backlog/por-projetos")
def testar_backlog_por_projetos(nome_arquivo="backlog_tabela.json"):
    url = f"{BASE_URL}/api/backlog/tabela"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Erro ao requisitar backlog por projetos: {e}")
        return
    
    data = response.json()
    print(f"\n✅ Backlog por projetos salvo em '{nome_arquivo}'")
    print(f"🔹 Total geral de cards: {data.get('total_geral_cards')}")
    print(f"🔹 Total de projetos: {data.get('total_projetos')}")
    print(f"🔹 Número de departamentos: {len(data.get('por_departamento', {}))}")

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ----------- Execução dos testes -----------
if __name__ == "__main__":
    # print("📊 Teste 1 - Resumo backlog (sem filtros):")
    # testar_resumo_backlog()

    # print("\n📊 Teste 2 - Resumo backlog (com filtros):")
    # filtros = {
    #     "departamento": "Financeiro",
    #     "prioridade": "Highest",
    #     "status": "Tarefas pendentes"
    # }
    # testar_resumo_backlog(filtros, nome_arquivo="backlog_summary_filtrado.json")

    # print("\n🚀 Teste 3 - Resumo da sprint ativa:")
    # testar_resumo_sprint()

    print("\n🚀 Teste 4 - Backlog por projetos:")
    testar_backlog_por_projetos()
