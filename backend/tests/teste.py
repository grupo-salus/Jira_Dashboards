import requests
import json

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


def testar_criar_projeto(nome_arquivo="projeto_criado.json"):
    url = f"{BASE_URL}/api/espaco_de_projetos/criar_projeto"
    projeto = {
        # Campos obrigatórios
        "summary": "TESTE VIA PYTHON CAMPO SUMMARY",
        
        # 1. Informações do Solicitante
        "customfield_10093": "Luis Henrique Gomes da Fonseca",
        "customfield_10247": "luis.fonseca@empresa.com",
        "customfield_10245": {"id": "10467", "label": "TI"},
        "customfield_10250": "Caio Livier",
        
        # 2. Sobre a Solicitação
        "customfield_10481": "TESTE VIA PYTHON CAMPO 10481 OBJETIVO",
        "description": "TESTE VIA PYTHON CAMPO 10476 DESCRIÇÃO",
        "customfield_10476": "TESTE VIA PYTHON CAMPO 10476 ESCopo Inicial ou Solução Proposta",
        "customfield_10477": "TESTE VIA PYTHON CAMPO 10477 Stakeholders Diretos ou Equipes Envolvidas",
        
        # 3. Estratégia e Priorização
        "customfield_10478": {"id": "10698", "label": "Estratégico"},
        "priority": {"id": "2", "label": "Alta"},
        "customfield_10479": "2024-06-30",
        "customfield_10480": {"id": "10702", "label": "Financeiro"},
        "customfield_10248": "TESTE VIA PYTHON CAMPO 10248 BENEFÍCIOS ESPERADOS",
        
        # 4. Viabilidade
        "customfield_10482": "TESTE VIA PYTHON CAMPO 10482 RISCOS CONHECIDOS",
        "customfield_10483": 150000.0,
        "customfield_10484": {"id": "10709", "label": "Sim"},
        
        # 5. Complementar
        "customfield_10485": "TESTE VIA PYTHON CAMPO 10485 OBSERVAÇÕES ADICIONAIS",
        
        # 6. Confirmação de Recebimento
        "customfield_10486": ["10712"]
    }
    
    print("Enviando projeto para o Jira...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(projeto, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(url, json=projeto)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"\n✅ Projeto criado com sucesso!")
            print(f"Projeto Key: {data.get('key', 'N/A')}")
            print(f"Projeto ID: {data.get('id', 'N/A')}")
            
            # Salvar resposta em arquivo
            with open(nome_arquivo, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"Resposta salva em '{nome_arquivo}'")
            
            return data
        else:
            print(f"\n❌ Erro ao criar projeto:")
            print(f"Status: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Erro: {json.dumps(error_data, indent=2, ensure_ascii=False)}")
            except:
                print(f"Erro: {response.text}")
            return None
            
    except requests.RequestException as e:
        print(f"\n❌ Erro de conexão: {e}")
        return None

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

    # print("\nTeste 7 - Opções do campo customizado:")
    # testar_opcoes_campo_customizado()

    print("\nTeste 8 - Criar projeto:")
    testar_criar_projeto()