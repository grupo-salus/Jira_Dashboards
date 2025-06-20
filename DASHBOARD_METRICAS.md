# Dashboard de Projetos - Guia de Métricas e KPIs

Este documento explica detalhadamente cada métrica, KPI e gráfico presente no dashboard de projetos, incluindo como são calculados e o que significam para a gestão de projetos.

## 📊 Seção: Métricas Chave

### 1. Total no Board

**O que mede:** Número total de itens presentes no dashboard de projetos.

**Como é calculado:** Conta todos os registros disponíveis nos dados (`filteredData.length`).

**Significado:** Fornece uma visão geral do volume de trabalho sendo acompanhado. É o número base para todas as outras métricas.

---

### 2. Total de Ideação

**O que mede:** Quantidade de projetos que estão em fase de ideação/concepção.

**Como é calculado:** Filtra projetos com status "Backlog" OU "Backlog Priorizado":

```javascript
filteredData.filter(
  (p) => p.Status === "Backlog" || p.Status === "Backlog Priorizado"
).length;
```

**Significado:** Indica quantas ideias estão aguardando para serem transformadas em projetos executáveis. Ajuda a entender o pipeline de inovação.

---

### 3. Total de Projetos

**O que mede:** Quantidade de projetos em execução (excluindo ideias).

**Como é calculado:** `Total no Board - Total de Ideação`

**Significado:** Mostra quantos projetos estão efetivamente em andamento, em execução ou concluídos. Representa o trabalho ativo da equipe.

---

## 🏥 Seção: Saúde Geral dos Projetos e KPIs

### 1. Projetos Atrasados

**O que mede:** Quantidade de projetos ativos que estão fora do prazo planejado.

**Como é calculado:**

1. Filtra projetos ativos (excluindo "Concluído" e "Cancelado")
2. Conta aqueles com "Status de prazo" = "Fora do prazo"

**Significado:** Alerta crítico sobre projetos que estão atrasados em relação ao cronograma. Indica problemas de planejamento ou execução.

---

### 2. Estimativas Estouradas

**O que mede:** Quantidade de projetos que já consumiram mais tempo/esforço do que o inicialmente estimado.

**Como é calculado:**

1. Filtra projetos ativos (excluindo "Concluído" e "Cancelado")
2. Conta aqueles com "Status de esforço" = "Estourou a estimativa"

**Significado:** Indica problemas na estimativa inicial ou mudanças de escopo. Ajuda a melhorar a precisão das estimativas futuras.

---

### 3. Projetos em Risco

**O que mede:** Total de projetos que apresentam algum tipo de risco significativo.

**Como é calculado:** Conta projetos ativos que são "Atrasados" OU têm "Estimativas Estouradas":

```javascript
projetosAtivos.filter(
  (p) =>
    p["Status de prazo"] === "Fora do prazo" ||
    p["Status de esforço"] === "Estourou a estimativa"
).length;
```

**Significado:** Visão consolidada de todos os projetos que precisam de atenção imediata da gestão.

---

### 4. Tempo Médio de Entrega (dias)

**O que mede:** Média de dias que os projetos levaram desde a criação até a conclusão.

**Como é calculado:**

1. Filtra projetos concluídos que têm "Data de criação" e "Data de término"
2. Calcula a diferença em dias para cada projeto
3. Faz a média aritmética de todos os valores

**Significado:** KPI crucial de eficiência. Mostra a velocidade média do ciclo de vida de um projeto na equipe. Valores menores indicam maior eficiência.

---

## 📈 Seção: Gráficos

### 1. Projetos por Status (Gráfico de Pizza)

**O que mostra:** Distribuição percentual de todos os projetos entre os diferentes status do Jira.

**Dados utilizados:** Campo "Status" de todos os projetos.

**Significado:** Identifica rapidamente onde a maioria dos projetos se encontra no fluxo de trabalho. Ajuda a visualizar gargalos ou acúmulos em determinadas fases.

---

### 2. Projetos por Área (Gráfico de Barras Verticais)

**O que mostra:** Quantidade de projetos por departamento solicitante.

**Dados utilizados:** Campo "Departamento Solicitante".

**Significado:** Mostra quais áreas da empresa estão demandando mais projetos. Ajuda no planejamento de recursos e priorização.

---

### 3. Projetos por Prioridade (Gráfico de Barras Verticais)

**O que mostra:** Distribuição de projetos por nível de prioridade.

**Dados utilizados:** Campo "Prioridade".

**Significado:** Indica se a equipe está focada nas prioridades corretas. Ajuda a balancear o trabalho entre urgente e importante.

---

### 4. Carga de Trabalho por Responsável (Gráfico de Barras Horizontais)

**O que mostra:** Número de projetos atribuídos a cada responsável.

**Dados utilizados:** Campo "Responsável".

**Significado:** Ajuda a gerenciar a distribuição de tarefas, identificar sobrecarga de trabalho e balancear a alocação de recursos humanos.

---

### 5. Ideações por Tempo de Espera (Gráfico de Barras Horizontais)

**O que mostra:** Projetos em ideação agrupados por faixas de tempo desde a criação.

**Faixas de tempo:**

- 0-7 dias: Ideias recentes
- 8-30 dias: Ideias em análise
- Mais de 30 dias: Ideias antigas

**Dados utilizados:**

- Status "Backlog" ou "Backlog Priorizado"
- Campo "Dias desde criação"

**Significado:** Revela quão rapidamente as ideias estão avançando ou se estão estagnando no pipeline. Ajuda a decidir sobre revisão ou descarte de ideias antigas.

---

### 6. Projetos Abertos por Semana (Gráfico de Linha)

**O que mostra:** Tendência de novos projetos criados ao longo do tempo.

**Dados utilizados:** Campo "Data de criação" agrupado por semana.

**Significado:** Identifica tendências de entrada de demanda, períodos de maior carga de trabalho (sazonalidades) e ajuda no planejamento de capacidade futura.

---

### 7. Investimento por Área (Gráfico de Barras Horizontais)

**O que mostra:** Soma do investimento esperado por departamento solicitante.

**Dados utilizados:**

- Campo "Departamento Solicitante"
- Campo "Investimento Esperado" (convertido de string para número)

**Significado:** Mostra visualmente para onde os recursos financeiros estão sendo direcionados. Auxilia na tomada de decisão estratégica e justificação de orçamentos.

---

### 8. Análise de Demandas por Categoria (Gráfico de Barras Horizontais)

**O que mostra:** Contagem de projetos agrupados por categoria.

**Dados utilizados:** Campo "Categoria".

**Significado:** Oferece uma visão clara do tipo de trabalho que a equipe mais realiza. Permite balancear entre atividades de manutenção (run) e desenvolvimento/inovação (grow).

---

## ⚠️ Seção: Ideias Obsoletas

### Alertas de Ideias Obsoletas

**O que mostra:** Lista de projetos que podem precisar de revisão ou arquivamento.

**Critérios:**

- "Status de ideação" = "Obsoleto"
- "Dias desde criação" > 30

**Significado:** Serve como lembrete direto para a gestão revisar ideias que estão paradas há muito tempo. Apresenta uma lista concisa com título e chave para fácil identificação.

---

## 🔧 Como os Dados são Processados

### Filtros em Cascata

O dashboard implementa um sistema de filtros em cascata que permite:

- Filtrar por área, projeto, solicitante, prioridade, status, grupo solicitante e categoria
- Os filtros se aplicam em cascata, limpando opções dependentes
- Todos os gráficos e métricas respondem aos filtros aplicados

### Responsividade

- Todos os componentes se adaptam ao tamanho da tela
- Sistema de tamanhos configurável (pequeno, médio, grande, muito grande)
- Gráficos responsivos que se ajustam ao container

### Tema Claro/Escuro

- Todos os componentes suportam modo claro e escuro
- Cores adaptativas para melhor legibilidade
- Transições suaves entre temas

---

## 📋 Como Usar o Dashboard

### Para Gestores de Projeto:

1. **Monitore os KPIs de saúde** diariamente para identificar problemas
2. **Use os gráficos de tendência** para planejamento de capacidade
3. **Analise a distribuição de carga** para balancear o trabalho da equipe

### Para Líderes de Equipe:

1. **Acompanhe o tempo médio de entrega** para medir eficiência
2. **Monitore projetos em risco** para intervenção precoce
3. **Use os filtros** para análises específicas por área ou categoria

### Para Stakeholders:

1. **Visualize o investimento por área** para decisões estratégicas
2. **Acompanhe a evolução semanal** de novos projetos
3. **Identifique gargalos** através dos gráficos de status

---

## 🎯 Objetivos das Métricas

### Eficiência Operacional:

- Reduzir tempo médio de entrega
- Diminuir projetos atrasados
- Melhorar precisão das estimativas

### Gestão de Recursos:

- Balancear carga de trabalho
- Otimizar alocação de recursos
- Priorizar investimentos

### Qualidade do Processo:

- Identificar gargalos no fluxo
- Melhorar pipeline de ideias
- Manter projetos em dia

Este dashboard foi projetado para fornecer insights acionáveis que ajudem na tomada de decisões estratégicas e operacionais relacionadas à gestão de projetos de TI.
