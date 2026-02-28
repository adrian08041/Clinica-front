# 🦷 Sistema Clínica Odonto - Frontend

Bem-vindo ao repositório frontend do **Projeto Clínica Odonto**!
Este projeto tem como objetivo principal implementar a Landing Page e a interface administrativa (página de clientes) para uma clínica odontológica, desenvolvido como trabalho acadêmico da faculdade.

---

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Padrões e Contribuição](#-padrões-e-contribuição)

---

## 🎯 Sobre o Projeto

A aplicação foi prototipada no Figma e implementada com foco em **Acessibilidade (a11y)**, **Performance** e **Código Limpo**. O sistema se chama **OdontoFlow** e funcionará como um painel administrativo voltado para clínicas e dentistas.

Atualmente, o escopo inclui:

- **Landing Page Institucional**: Composta por seções como _Hero_, _Serviços_ e formulário de contato.
- **OdontoFlow (Painel Administrativo)**: O núcleo do sistema SaaS, composto pelas seguintes funcionalidades principais:
  - **Login:** Acesso restrito para a gestão da clínica.
  - **Dashboard:** Visão panorâmica com métricas (Consultas, Faturamento, Novos Pacientes e alertas urgentes).
  - **Agenda:** Controle cruzado de pacientes, procedimentos executados e o status com cada dentista responsável.
  - **Pacientes:** Listagem com filtro avançado e perfil individual detalhando a anamnese.
  - **Tratamentos (Prontuário):** Gestão progressiva dos planos odontológicos (ex: Ortodontia Preventiva), vinculando procedimentos aos pagamentos e débitos em aberto.
  - **Financeiro:** Controle macro de Entradas (parcelamentos, pendências de pacientes) vs Saídas.
  - **Configurações:** Setup de informações e customização da clínica.

- _Nota:_ No atual estágio do projeto, **todos os dados são mockados** no próprio frontend (sem conexão com API externa ou banco de dados), garantindo a entrega visual e regras de validação.

---

## 🛠 Tecnologias Utilizadas

A Stack obrigatória do projeto foi definida para utilizar as ferramentas mais modernas do mercado de React:

- **[Next.js 14+](https://nextjs.org/)** (App Router & Server/Client Components)
- **[TypeScript](https://www.typescriptlang.org/)** (Strict Mode)
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização Utilitária Responsiva)
- **[Shadcn UI](https://ui.shadcn.com/)** (Componentes Acessíveis Baseados em Radix UI)
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** (Para validação de dados, como no formulário de contato)
- **[Lucide React](https://lucide.dev/)** (Ícones padrão)

---

## 📂 Estrutura do Projeto (Architecture)

A separação de pastas do projeto segue o padrão modular para facilitar a manutenção pela equipe:

```text
├── app/                  # Entry points e roteamento do Next.js (App Router)
├── components/           # Componentes visuais do sistema
│   ├── home/             # Seções específicas da Landing Page (ex: hero-section)
│   └── ui/               # Componentes genéricos e reaproveitáveis (botões, inputs, etc)
├── lib/                  # Códigos utilitários, mocks e schemas
│   ├── mock-data.ts      # Dados fictícios para serviços, depoimentos, etc.
│   ├── schemas/          # Validações Zod (ex: contact-schema.ts)
│   ├── types/            # Tipagens globais do TypeScript
│   └── utils.ts          # Funções auxiliares (como a mesclagem de classes Tailwind)
└── public/               # Imagens estáticas, SVGs e fontes
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Ter o **Node.js** (versão 20 ou superior) instalado em sua máquina.
- Clonar o repositório na sua máquina via Git.

### Passo a Passo

1. Instale as dependências:

```bash
npm install
```

2. (Opcional) Crie o seu arquivo de variáveis de ambiente. Copie o arquivo `.env.example`:

```bash
cp .env.example .env.local
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse o projeto no seu navegador web clicando no link: [http://localhost:3000](http://localhost:3000)

---

## 🤝 Padrões e Contribuição

Para que a equipe mantenha o código alinhado e organizado até a apresentação final, documentamos todas as regras de Commits, Branches e Boas Práticas em um arquivo dedicado.

**👉 Leia atentamente as regras antes de codar:**
[**Acessar Diretrizes e Padrões do Projeto (PADROES_DO_PROJETO.md)**](./PADROES_DO_PROJETO.md)

---

_Projeto acadêmico em desenvolvimento por alunos._
