## 🎨 Padrão de Temas - Documentação Oficial

Este arquivo define as convenções e estrutura para os **temas visuais** utilizados no projeto, garantindo consistência entre componentes e suporte a múltiplas identidades visuais (ex: Salus, Jira, Custom).

---

### 📁 Estrutura dos Arquivos

Todos os temas ficam organizados em:

```
src/
└── shared/
    └── themes/
        ├── salus.ts
        ├── jira.ts
        ├── custom.ts
        └── README_THEMES.md ← (este arquivo)
```

Cada arquivo exporta um objeto com a seguinte estrutura:

```ts
{
  name: "salus",
  light: {
    bg: { ... },
    text: { ... },
    border: { ... },
    brand: { ... },
    state: { ... },
    graphics: { ... },
    font: { ... }
  },
  dark: {
    ...
  }
}
```

---

## 📚 Guia de Tokens Semânticos

Os temas são baseados em **tokens semânticos**, ou seja, nomes que descrevem o papel da cor no layout, não a cor em si. Isso facilita a troca de temas sem alterar a lógica dos componentes.

---

### 🎨 Cores de Fundo (`bg`)

| Token     | Descrição                                                         |
| --------- | ----------------------------------------------------------------- |
| `base`    | Fundo principal da tela (background geral)                        |
| `surface` | Fundo de elementos sobrepostos (cards, modais, tabelas)           |
| `muted`   | Fundo secundário, usado para hover, separadores ou detalhes sutis |

---

### ✍️ Cores de Texto (`text`)

| Token      | Descrição                              |
| ---------- | -------------------------------------- |
| `base`     | Cor padrão do texto                    |
| `title`    | Cor de títulos e cabeçalhos            |
| `subtitle` | Cor de subtítulos ou textos auxiliares |
| `inverse`  | Texto claro sobre fundos escuros       |

---

### ⬛ Bordas e Sombra (`border`, `shadow`)

| Token           | Descrição                              |
| --------------- | -------------------------------------- |
| `border.base`   | Bordas comuns entre elementos          |
| `border.strong` | Bordas reforçadas (divisores, tabelas) |
| `shadow.base`   | Sombra padrão para elevação            |

---

### 🏢 Marca e Identidade Visual (`brand`)

| Token       | Descrição                                |
| ----------- | ---------------------------------------- |
| `primary`   | Cor institucional principal da marca     |
| `accent`    | Cor de destaque para ênfase ou CTA       |
| `highlight` | Cor auxiliar ou de atenção (ex: amarelo) |
| `neutral`   | Cores neutras específicas da identidade  |

---

### ✅ Estados e Feedbacks (`state`)

| Token      | Descrição                        |
| ---------- | -------------------------------- |
| `success`  | Feedback de sucesso (verde)      |
| `warning`  | Feedback de aviso (amarelo)      |
| `error`    | Feedback de erro (vermelho)      |
| `disabled` | Elementos desativados / inativos |

---

### 📊 Gráficos e Visualizações (`graphics`)

| Token                   | Descrição                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| `palette[]`             | Paleta de cores utilizada em fatias de gráficos (pizza, barras...) |
| `axis`, `grid`, `label` | Cores para eixos, linhas e rótulos dos gráficos                    |
| `tooltip.background`    | Fundo do tooltip                                                   |
| `tooltip.text`          | Texto dentro do tooltip                                            |

---

### 🖋️ Tipografia (`font`)

| Token       | Descrição                                                          |
| ----------- | ------------------------------------------------------------------ |
| `primary`   | Fonte primária (branding)                                          |
| `secondary` | Fonte secundária (destaques, headers)                              |
| `text`      | Fonte padrão de conteúdo                                           |
| `accent`    | Fonte para ênfases e chamadas                                      |
| `italic`    | Variante itálica, se aplicável                                     |
| `weights`   | Pesos definidos para fácil acesso (thin, regular, medium, bold...) |

---

## 🧠 Como usar nos componentes

Exemplo (React + Tailwind CSS com classes dinâmicas):

```tsx
<div style={{ backgroundColor: theme.light.bg.surface, color: theme.light.text.base }}>
  {title}
</div>
```

Para gráficos:

```ts
colors: theme.light.graphics.palette
```

Para totalizadores:

```ts
style={{ backgroundColor: theme.light.brand.primary }}
```

---

## 🗂️ Temas disponíveis

* `salus.ts` – Identidade visual da empresa Salus
* `jira.ts` – Baseado no Atlassian Style Guide (Jira, Confluence)
* `custom.ts` – Tema neutro tecnológico para clientes externos

---

## 📌 Observação

Cores **fixas e universais** como prioridades, riscos ou status globais podem ser movidas para um arquivo separado:

```
src/shared/constants/colors.ts
```

Exemplo:

```ts
export const priorityColors = {
  critical: "#EF4444",
  high: "#F97316",
  medium: "#FACC15",
  low: "#4ADE80",
  none: "#D1D5DB"
};
```

---
