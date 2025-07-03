# Uso das APIs do Jira Dashboard

Este documento explica como usar as APIs implementadas para buscar dados reais do backend.

## Configuração

### Variável de Ambiente

Certifique-se de que a variável `VITE_API_BASE_URL` está configurada no seu arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Se não estiver configurada, o sistema usará `http://localhost:8000` como padrão.

## APIs Disponíveis

### 1. API de Projetos (`projetosApi`)

**Endpoint:** `/api/espaco_de_projetos/tabela`

**Função:** `getTabelaProjetos()`

**Retorna:** Dados do Espaço de Projetos (EP)

```typescript
import { projetosApi } from '@/api/jira';

// Buscar dados de projetos
const response = await projetosApi.getTabelaProjetos();
const projetos = response.tabela_dashboard_ep;
```

### 2. API de TI (`tiApi`)

**Endpoint:** `/api/acompanhamento_ti/tabela`

**Função:** `getTabelaTI()`

**Retorna:** Dados do Acompanhamento TI (BL)

```typescript
import { tiApi } from '@/api/jira';

// Buscar dados de TI
const response = await tiApi.getTabelaTI();
const tiData = response.tabela_dashboard_ti;
```

### 3. API do Jira (`jiraApi`)

**Endpoint:** `/api/jira/opcoes-campo-customizado/{field_id}`

**Função:** `getOpcoesCampoCustomizado(fieldId: string)`

**Retorna:** Opções de campos customizados

```typescript
import { jiraApi } from '@/api/jira';

// Buscar opções de um campo customizado
const response = await jiraApi.getOpcoesCampoCustomizado('field_id');
const opcoes = response.opcoes_campo_customizado;
```

## Hooks React

### useProjetos

Hook para buscar dados de projetos com estados de loading e erro:

```typescript
import { useProjetos } from '@/features/projetos/hooks/useProjetos';

const { data, loading, error, refetch } = useProjetos();

if (loading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <div>Erro: {error}</div>;
}

// Usar data (array de projetos)
```

### useTI

Hook para buscar dados de TI com estados de loading e erro:

```typescript
import { useTI } from '@/features/ti/hooks/useTI';

const { data, loading, error, refetch } = useTI();

if (loading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <div>Erro: {error}</div>;
}

// Usar data (array de dados de TI)
```

## Tipos TypeScript

### Projetos

```typescript
import { ProjetosTableData, ProjetosApiResponse } from '@/features/projetos/types';
import { EspacoDeProjetos } from '@/types/Typesjira';

// ProjetosTableData é um array de EspacoDeProjetos
type ProjetosTableData = EspacoDeProjetos[];
```

### TI

```typescript
import { TITableData, TIApiResponse } from '@/features/ti/types';
import { AcompanhamentoTI } from '@/types/Typesjira';

// TITableData é um array de AcompanhamentoTI
type TITableData = AcompanhamentoTI[];
```

## Tratamento de Erros

Todas as APIs incluem tratamento de erros:

- **Erros de rede:** Capturados automaticamente
- **Erros HTTP:** Verificados via `response.ok`
- **Erros de parsing:** Capturados no bloco try/catch

```typescript
try {
  const response = await projetosApi.getTabelaProjetos();
  // Sucesso
} catch (error) {
  console.error('Erro na API:', error);
  // Tratar erro
}
```

## Exemplo de Uso Completo

```typescript
import { useState, useEffect } from 'react';
import { useProjetos } from '@/features/projetos/hooks/useProjetos';

const ProjetosComponent = () => {
  const { data: projetos, loading, error, refetch } = useProjetos();

  if (loading) {
    return <div>Carregando projetos...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Erro: {error}</p>
        <button onClick={refetch}>Tentar novamente</button>
      </div>
    );
  }

  if (!projetos || projetos.length === 0) {
    return <div>Nenhum projeto encontrado</div>;
  }

  return (
    <div>
      <h1>Projetos ({projetos.length})</h1>
      {projetos.map(projeto => (
        <div key={projeto.ID}>
          <h2>{projeto.Título}</h2>
          <p>Status: {projeto.Status}</p>
        </div>
      ))}
    </div>
  );
};
```

## Sincronização Global

O sistema agora possui sincronização global de dados através do botão de refresh na navbar:

### Contexto de Sincronização

```typescript
import { useDataSync } from '@/shared/context/DataSyncContext';

const { refreshAllData, isRefreshing, lastRefresh } = useDataSync();
```

### Hooks Reativos

Os hooks `useProjetos` e `useTI` agora reagem automaticamente à sincronização global:

```typescript
// O hook automaticamente refaz o fetch quando lastRefresh muda
const { data, loading, error, refetch } = useProjetos();
```

### Botão de Sincronização

O botão de refresh na navbar:
- Mostra animação de loading durante a sincronização
- Desabilita durante o processo
- Atualiza todos os dados da aplicação simultaneamente

### Auto-Refresh (Ideal para TV)

O sistema possui auto-refresh automático a cada 1 hora:

```typescript
const { enableAutoRefresh, isAutoRefreshEnabled } = useDataSync();

// Habilitar auto-refresh
enableAutoRefresh(true);

// Verificar se está ativo
console.log(isAutoRefreshEnabled); // true/false
```

**Funcionalidades:**
- ✅ Atualização automática a cada 1 hora
- ✅ Botão para habilitar/desabilitar
- ✅ Indicador visual de status
- ✅ Ideal para dashboards em TV

### Informação da Última Atualização

Componente `LastUpdateInfo` mostra:
- ⏰ Tempo relativo da última atualização
- 📅 Data e hora exata
- 🔄 Status do auto-refresh
- 🎛️ Botão para controlar auto-refresh

## Migração de Dados Mock (Concluída)

A migração de dados mock para dados reais foi concluída:

✅ **Arquivo mock removido:** `src/features/projetos/pages/mockProjetos.json`  
✅ **Hooks implementados:** `useProjetos` e `useTI`  
✅ **Sincronização global:** Implementada via `DataSyncContext`  
✅ **Componentes atualizados:** Todos usando dados reais da API 