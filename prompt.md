# Implementação da Página de login

## Objetivo
Implemente a interface da página de login conforme o design no Figma:
https://www.figma.com/design/E4h9Ru6vLWbM8Zj4JLuV7o/Projeto-clinica-odonto?node-id=7-1030&m=dev

---

## Stack Obrigatória

| Tecnologia | Finalidade |
|---|---|
| Next.js 14+ (App Router) | Framework principal com Server Components |
| TypeScript (strict mode) | Tipagem estática em todo o projeto |
| Tailwind CSS | Estilização utilitária |
| Shadcn UI | Componentes de UI acessíveis |
| Lucide React | Ícones SVG |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas e tipagem inferida |

---

## Arquitetura e Estrutura de Arquivos
```
app/
└── page.tsx                  # Entry point — apenas composição de seções

components/
└── home/
    ├── hero-section.tsx
    ├── services-section.tsx
    ├── testimonials-section.tsx
    ├── contact-form.tsx
    └── ...                   # uma seção = um componente

lib/
├── mock-data.ts              # Todos os dados mockados centralizados
├── schemas/
│   └── contact-schema.ts     # Schemas Zod exportados
└── types/
    └── index.ts              # Interfaces e types globais
```

---

## Regras de Implementação

### Dados
- **Todos os dados devem ser mockados** — nenhuma chamada a banco de dados, API externa ou variável de ambiente sensível.
- Centralize os mocks em `lib/mock-data.ts`, exportando constantes tipadas. Exemplo:
```ts
// lib/mock-data.ts
import type { Service, Testimonial } from "@/lib/types";

export const SERVICES: Service[] = [
  { id: "1", title: "Clareamento", description: "...", icon: "Smile" },
  // ...
];
```

### Componentes
- `app/page.tsx` deve ser um **Server Component** limpo, responsável apenas por importar e compor as seções.
- Cada seção da página vive em seu próprio arquivo dentro de `components/home/`.
- Use `"use client"` **somente** nos componentes que precisam de interatividade (formulários, estados, eventos).
- Prefira **componentes de servidor** sempre que possível para melhor performance.

### Tipagem
- Habilite `"strict": true` no `tsconfig.json`.
- Defina todas as interfaces em `lib/types/index.ts`.
- **Nunca use `any`** — prefira `unknown` com narrowing ou tipos explícitos.
- Infira tipos do Zod com `z.infer<typeof schema>` para evitar duplicação.

### Formulário de Contato
- Use **React Hook Form** + **Zod** com `zodResolver`.
- Defina o schema em `lib/schemas/contact-schema.ts`.
- Exiba mensagens de erro acessíveis (atributo `aria-describedby`).
- O submit deve simular um envio com `console.log` ou `toast` — sem requisições reais.
```ts
// lib/schemas/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

### Estilização
- Siga fielmente o design system do Figma (cores, espaçamentos, tipografia).
- Use **variáveis CSS do Shadcn** para tokens de cor (`--primary`, `--background`, etc.).
- Layout responsivo com breakpoints Tailwind: `sm`, `md`, `lg`, `xl`.
- Evite classes inline longas — extraia padrões repetidos com `cn()` do `lib/utils`.

### Acessibilidade (a11y)
- Imagens decorativas: `alt=""`. Imagens informativas: `alt` descritivo.
- Hierarquia de headings correta (`h1` → `h2` → `h3`).
- Elementos interativos com `focus-visible` visível.
- Use as primitivas do Shadcn (que já implementam ARIA corretamente).

### Performance
- Imagens via `next/image` com `width`, `height` e `priority` no hero.
- Fontes via `next/font` com `display: swap`.
- Evite `useEffect` desnecessários — prefira derivar estado.

---

## Critérios de Conclusão

- [ ] Pixel-perfect em relação ao Figma no breakpoint desktop e mobile
- [ ] Nenhum erro de TypeScript (`npx tsc --noEmit` passa)
- [ ] Formulário valida e exibe erros inline corretamente
- [ ] Sem chamadas externas de dados (apenas mocks)
- [ ] Componentes organizados conforme estrutura definida
- [ ] Responsivo em `375px`, `768px` e `1280px`