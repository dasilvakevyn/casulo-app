# ADR-001 — Next.js + TypeScript como base da aplicação

## Status

Aceito.

## Contexto

O Casulo App será inicialmente um webapp full-stack.

A aplicação precisa oferecer:

- interface web moderna;
- autenticação;
- páginas protegidas;
- integração com banco de dados;
- rotas server-side;
- possibilidade de renderização no servidor;
- integração simples com a Vercel;
- boa experiência de desenvolvimento com React.

Também existe interesse em utilizar a mesma linguagem em diferentes partes da aplicação para reduzir troca de contexto entre frontend e backend.

## Decisão

Utilizar:

- **Next.js** como framework principal;
- **React** para a camada de interface;
- **TypeScript** como linguagem principal.

O projeto utilizará os recursos full-stack do Next.js enquanto isso continuar adequado ao escopo do MVP.

Não será criado inicialmente um backend separado apenas por separação arquitetural.

## Motivos

### TypeScript

TypeScript foi escolhido por fornecer:

- tipagem estática;
- melhor suporte de IDE;
- refactors mais seguros;
- maior clareza em contratos de funções e serviços;
- possibilidade de compartilhar tipos entre diferentes camadas;
- integração natural com React e Next.js.

### Next.js

Next.js foi escolhido por fornecer:

- integração direta com React;
- suporte a código client-side e server-side;
- sistema de rotas;
- Server Components;
- Route Handlers;
- integração simples com a Vercel;
- ecossistema amplo;
- boa adequação a aplicações full-stack de pequeno e médio porte.

## Alternativas consideradas

### React com Vite + backend independente

Permitiria separar completamente frontend e backend.

Não foi escolhido inicialmente porque introduziria:

- dois projetos;
- dois processos de deploy;
- contratos HTTP adicionais;
- maior configuração;
- maior complexidade operacional.

Essa separação poderá ser reconsiderada se surgir uma necessidade técnica real.

### Backend com outro framework

Frameworks como NestJS, Fastify ou Express poderiam ser utilizados.

Não existe atualmente uma necessidade concreta que justifique adicionar um backend independente ao MVP.

## Consequências

### Positivas

- uma única base de código;
- uma única linguagem predominante;
- menor complexidade inicial;
- integração simples com Vercel;
- boa produtividade;
- possibilidade de evoluir módulos gradualmente.

### Negativas

- existe risco de acoplamento excessivo ao framework se regras de domínio forem colocadas diretamente em componentes ou rotas;
- funcionalidades server-side precisam ser organizadas cuidadosamente;
- partes da aplicação poderão precisar ser extraídas futuramente caso tenham requisitos operacionais diferentes.

## Diretriz

Regras de negócio importantes não devem depender diretamente de componentes React ou detalhes de roteamento do Next.js.

O framework deve servir à aplicação, e não definir o domínio.
