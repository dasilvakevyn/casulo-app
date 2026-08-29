# ADR-002 — Supabase + PostgreSQL como infraestrutura inicial

## Status

Aceito.

## Contexto

O Casulo App precisa inicialmente de:

- banco de dados relacional;
- autenticação;
- gerenciamento de sessão;
- autorização;
- isolamento de dados entre usuários;
- possibilidade de armazenar dados estruturados com integridade relacional.

O domínio possui relações importantes entre:

- usuários;
- Casulos;
- integrantes;
- carteiras;
- itens;
- alocações;
- produtos;
- alertas;
- histórico de preços.

Por isso, um banco relacional é adequado ao problema.

## Decisão

Utilizar:

- **PostgreSQL** como banco de dados;
- **Supabase** como infraestrutura inicial para PostgreSQL e autenticação.

Inicialmente o Supabase poderá fornecer:

- PostgreSQL;
- Supabase Auth;
- gerenciamento de sessão;
- Row Level Security;
- APIs geradas sobre o banco quando apropriado;
- Storage futuramente, caso necessário;
- Edge Functions futuramente, caso necessário.

## Motivos

### PostgreSQL

PostgreSQL foi escolhido por oferecer:

- modelo relacional robusto;
- foreign keys;
- constraints;
- transações;
- índices;
- tipos adequados para valores monetários;
- suporte a Row Level Security;
- maturidade;
- ampla adoção.

### Supabase

Supabase foi escolhido porque reduz a quantidade de infraestrutura necessária no início.

Também possui integração natural entre:

- autenticação;
- PostgreSQL;
- Row Level Security.

Isso é particularmente importante porque o Casulo App será multiusuário e deverá impedir acesso entre households diferentes.

## Alternativas consideradas

### Banco NoSQL

Não foi escolhido porque o domínio possui relações claras e regras de integridade importantes.

A ausência de constraints relacionais aumentaria a quantidade de validações necessárias na aplicação.

### PostgreSQL gerenciado sem Supabase

É uma alternativa válida.

Entretanto, exigiria implementar ou integrar separadamente:

- autenticação;
- sessão;
- autorização;
- integração entre identidade e banco.

Para o MVP, Supabase reduz esse custo inicial.

### Backend próprio com autenticação própria

Também seria possível, porém aumentaria significativamente a superfície de segurança e manutenção.

## Consequências

### Positivas

- banco relacional robusto;
- autenticação integrada;
- suporte nativo a RLS;
- menor quantidade de infraestrutura;
- desenvolvimento inicial mais rápido;
- boa capacidade de evolução.

### Negativas

- existe dependência de funcionalidades específicas do Supabase;
- políticas RLS exigem cuidado e testes;
- APIs automáticas não devem substituir regras de domínio bem definidas;
- algumas funcionalidades futuras podem exigir componentes fora do Supabase.

## Diretriz

O domínio não deve depender desnecessariamente de APIs proprietárias do Supabase.

PostgreSQL será tratado como a base persistente principal.

Sempre que possível, regras fundamentais de integridade deverão ser expressas através de recursos padrão do PostgreSQL.
