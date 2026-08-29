# Casulo App

O **Casulo App** é um webapp para ajudar casais a planejarem financeiramente a preparação para a primeira casa.

A aplicação busca centralizar o planejamento do enxoval, a organização dos valores reservados, a divisão de responsabilidades entre os integrantes e, futuramente, o acompanhamento de preços de produtos em lojas online.

> O Casulo App não é uma fintech e não movimenta dinheiro real. Todos os valores registrados na aplicação representam informações declaradas pelos próprios usuários para fins de planejamento.

## Objetivos

O projeto pretende permitir que os usuários possam:

- criar um planejamento compartilhado para a nova casa;
- registrar valores reservados individualmente e em conjunto;
- organizar itens necessários para o enxoval;
- definir prioridades e preços desejados;
- dividir o custo dos itens entre diferentes carteiras;
- acompanhar o progresso das compras;
- monitorar produtos em lojas online;
- registrar histórico de preços;
- receber alertas quando um produto atingir determinado valor.

## Conceito de Casulo

O **Casulo** representa o planejamento compartilhado entre os integrantes.

```text
Casulo
│
├── Integrantes
│   └── Carteiras individuais
│
├── Carteira compartilhada
│
├── Itens do enxoval
│
└── Produtos monitorados
```

A modelagem será preparada para múltiplos integrantes, evitando limitações rígidas a exatamente dois usuários sempre que isso não for necessário.

## Stack

A stack inicial definida para o MVP é:

- **TypeScript**
- **Next.js**
- **React**
- **Tailwind CSS**
- **PostgreSQL**
- **Supabase**
- **Vercel**
- **Vitest**
- **Playwright**

O MVP será desenvolvido inicialmente como uma aplicação full-stack única, seguindo uma abordagem de **monólito modular**.

## Princípios técnicos

O desenvolvimento do projeto seguirá alguns princípios:

- simplicidade antes de complexidade;
- desenvolvimento incremental;
- domínio antes do framework;
- segurança por padrão;
- autorização no backend e no banco;
- APIs oficiais antes de scraping;
- baixo acoplamento com serviços externos;
- documentação das decisões arquiteturais;
- testes automatizados;
- evitar dependências desnecessárias.

## Arquitetura

A arquitetura inicial será baseada em Next.js integrado ao Supabase:

```text
                     Casulo App
                         │
                         ▼
                ┌─────────────────┐
                │     Next.js     │
                │   React + TS    │
                └────────┬────────┘
                         │
                 ┌───────▼────────┐
                 │    Supabase    │
                 │                │
                 │ PostgreSQL     │
                 │ Auth           │
                 │ RLS            │
                 └───────┬────────┘
                         │
              ┌──────────▼──────────┐
              │ Monitor de preços   │
              │ Jobs agendados      │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │  Price Providers    │
              │                     │
              │ APIs / integrações  │
              └─────────────────────┘
```

Integrações externas de preços deverão ser isoladas através de **Price Providers**, evitando que regras específicas de cada loja se espalhem pelo domínio da aplicação.

## Roadmap inicial

### 1. Fundação

- Next.js;
- TypeScript;
- Tailwind CSS;
- linting e formatação;
- estrutura inicial;
- Supabase;
- testes;
- CI.

### 2. Autenticação e Casulo

- cadastro;
- login;
- criação de Casulo;
- integrantes;
- autorização;
- Row Level Security.

### 3. Carteiras

- carteiras individuais;
- carteira compartilhada;
- valores reservados;
- valores alocados.

### 4. Enxoval

- itens;
- categorias;
- prioridades;
- status;
- divisão dos custos;
- registro de compras.

### 5. Dashboard

- orçamento planejado;
- valores reservados;
- valores restantes;
- itens comprados;
- itens pendentes;
- participação das carteiras.

### 6. Monitoramento de preços

- produtos;
- Price Providers;
- histórico de preços;
- preço desejado;
- jobs periódicos;
- alertas.

## Documentação

A documentação técnica do projeto será mantida em:

```text
docs/
```

Decisões arquiteturais importantes serão registradas como **Architecture Decision Records (ADRs)** em:

```text
docs/adr/
```

## Status

🚧 **Em desenvolvimento**

O projeto encontra-se atualmente na fase de definição do domínio, arquitetura e fundação técnica.

