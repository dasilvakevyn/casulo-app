# ADR-005 — Monólito modular para o MVP

## Status

Aceito.

## Contexto

O Casulo App possuirá diferentes áreas funcionais:

- autenticação;
- households;
- carteiras;
- itens;
- alocações;
- pricing;
- alertas;
- notificações.

Esses módulos poderão futuramente possuir requisitos diferentes.

Por exemplo, o monitoramento de preços poderá eventualmente precisar de processamento assíncrono ou infraestrutura independente.

Uma possibilidade seria iniciar o projeto diretamente com microserviços.

## Decisão

O MVP será desenvolvido como um **monólito modular**.

A aplicação permanecerá inicialmente:

- em um único repositório;
- em uma única aplicação Next.js;
- com módulos internos bem separados.

Não serão criados microserviços sem uma necessidade técnica concreta.

## Motivos

O projeto está em fase inicial e ainda não possui:

- carga significativa;
- equipes independentes;
- requisitos diferentes de escalabilidade;
- necessidade de deploy independente entre módulos;
- gargalos operacionais conhecidos.

Criar serviços separados agora adicionaria complexidade sem resolver um problema existente.

## Organização

A aplicação deverá manter separação lógica entre módulos.

Estrutura conceitual:

```text
app/
components/

lib/
├── auth/
├── database/
├── pricing/
│   └── providers/
└── notifications/
```

A estrutura real poderá evoluir durante o desenvolvimento.

O princípio importante é evitar que toda a lógica fique misturada apenas porque está no mesmo deploy.

## Alternativas consideradas

### Microserviços desde o início

Não foi escolhido devido ao custo adicional de:

- comunicação entre serviços;
- autenticação entre serviços;
- observabilidade;
- deploys independentes;
- contratos de API;
- gerenciamento de falhas distribuídas;
- infraestrutura adicional.

### Backend e frontend separados

Também seria possível manter dois serviços sem utilizar microserviços completos.

Ainda assim, essa separação não resolve nenhuma necessidade atual do MVP.

## Extração futura

Um módulo poderá ser extraído futuramente caso existam razões concretas.

Exemplos:

- volume de processamento muito diferente;
- necessidade de escalabilidade independente;
- execução prolongada de jobs;
- requisito de runtime diferente;
- deploy independente;
- isolamento de falhas;
- responsabilidade claramente separada.

A extração deverá ocorrer como resposta a uma necessidade observada.

## Consequências

### Positivas

- menor complexidade operacional;
- desenvolvimento mais rápido;
- debugging mais simples;
- um único deploy inicialmente;
- transações locais mais simples;
- menor quantidade de infraestrutura.

### Negativas

- exige disciplina para manter limites entre módulos;
- existe risco de criar um monólito altamente acoplado;
- uma futura extração poderá exigir trabalho de refatoração.

## Diretriz

O objetivo não é criar apenas um monólito.

O objetivo é criar um **monólito modular**, mantendo limites internos claros para preservar a possibilidade de evolução futura sem pagar antecipadamente o custo de sistemas distribuídos.
