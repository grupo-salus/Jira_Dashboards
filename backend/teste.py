import requests
import json

BASE_URL = "http://127.0.0.1:8000"
ENDPOINT = "/api/backlog/resumo"

def testar_resumo_backlog(filtros=None, nome_arquivo="backlog_summary.json"):
    """
    Faz uma requisição GET para o endpoint /api/backlog/resumo com ou sem filtros
    e salva a resposta em um arquivo JSON.
    """
    url = f"{BASE_URL}{ENDPOINT}"
    try:
        response = requests.get(url, params=filtros)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Erro ao requisitar resumo do backlog: {e}")
        return

    data = response.json()

    print(f"\n✅ Teste concluído com sucesso. Resumo salvo em '{nome_arquivo}'")
    print(f"🔹 Total de cards: {data.get('total')}")
    print(f"🔹 Média de dias no backlog: {data.get('tempo_medio')}")
    print(f"🔹 Chaves do resumo: {list(data.keys())}")

    # Salva o JSON em arquivo
    with open(nome_arquivo, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    print("📊 Teste 1 - Sem filtros:")
    testar_resumo_backlog()

    print("\n📊 Teste 2 - Com filtros:")
    filtros = {
        "departamento": "Financeiro",
        "prioridade": "Highest",
        "status": "Tarefas pendentes"
    }
    testar_resumo_backlog(filtros, nome_arquivo="backlog_summary_filtrado.json")
