# Contexto do Projeto — Casulo App

## 1. Visão geral

O **Casulo App** é um webapp para ajudar casais a se organizarem financeiramente durante a preparação para a primeira casa.

O foco inicial da aplicação será:

- planejamento do enxoval;
- organização do orçamento destinado à mudança;
- divisão de responsabilidades financeiras;
- compras individuais;
- compras compartilhadas;
- acompanhamento de produtos;
- monitoramento de preços;
- alertas quando um produto atingir determinado preço.

Apesar de trabalhar com valores financeiros, o Casulo App **não é uma fintech**.

A aplicação não armazenará dinheiro real, não movimentará valores e não executará pagamentos.

Todos os valores registrados no sistema representam informações declaradas pelos próprios usuários para fins de planejamento.

Exemplo:

```text
Tenho R$ 5.000 reservados para a mudança.
```

O Casulo apenas registra essa informação.

Por isso, a interface deverá preferir termos como:

- valor reservado;
- valor planejado;
- valor alocado;
- disponível para planejamento;

em vez de termos que possam sugerir que o dinheiro está depositado dentro da aplicação.

---

## 2. Princípios do produto

O Casulo App deverá seguir alguns princípios desde o início.

### 2.1. Simplicidade antes de complexidade

Não criar infraestrutura para problemas que ainda não existem.

### 2.2. Desenvolvimento incremental

Construir funcionalidades em pequenas etapas funcionais.

### 2.3. Domínio antes do framework

A estrutura do código e do banco deve refletir o problema do produto, e não apenas os frameworks utilizados.

### 2.4. Segurança por padrão

Autenticação e autorização devem existir no servidor e no banco de dados, não somente na interface.

### 2.5. APIs antes de scraping

Sempre que possível, utilizar APIs oficiais para integrações externas.

### 2.6. Baixo acoplamento

Serviços externos devem permanecer isolados do domínio principal.

### 2.7. Documentação de decisões

Decisões arquiteturais relevantes devem ser registradas através de ADRs.

---

## 3. Conceito central: Casulo

O domínio principal será organizado através da entidade **Casulo**.

Um Casulo representa o planejamento compartilhado de uma futura residência.

Conceitualmente:

```text
Casulo
│
├── Integrantes
│   └── Carteiras individuais
│
├── Carteiras compartilhadas
│
├── Itens do enxoval
│
└── Produtos monitorados
```

Inicialmente o produto será pensado principalmente para casais.

Entretanto, a modelagem não deverá impor uma limitação rígida de exatamente dois integrantes quando essa restrição não for necessária.

No modelo relacional, o conceito de Casulo será inicialmente representado pela entidade `household`.

A utilização do termo `household` internamente permite representar o agrupamento dos usuários sem acoplar o banco de dados à quantidade de integrantes.

---

## 4. Usuários e autenticação

A autenticação será fornecida pelo **Supabase Auth**.

O Supabase mantém os usuários autenticados na tabela:

```text
auth.users
```

Essa tabela pertence ao schema interno de autenticação do Supabase.

Não devemos utilizar `auth.users` diretamente como tabela de domínio da aplicação para armazenar informações adicionais do usuário.

Caso sejam necessários dados de perfil, deverá existir uma tabela pública associada ao usuário autenticado.

Conceitualmente:

```text
auth.users
    │
    │ 1:1
    ▼
profiles
```

Possível estrutura:

```text
profiles
--------------------
id
display_name
created_at
updated_at
```

Onde:

```text
profiles.id
```

referencia:

```text
auth.users.id
```

O e-mail continuará pertencendo ao sistema de autenticação e não deverá ser duplicado no domínio sem uma necessidade concreta.

---

## 5. Households

A entidade `households` representa um Casulo.

Estrutura conceitual inicial:

```text
households
--------------------
id
name
created_at
updated_at
```

Um household pode possuir múltiplos integrantes.

Um usuário também poderá, futuramente, participar de mais de um household.

Por isso, a relação entre usuários e households será muitos-para-muitos.

---

## 6. Integrantes do Casulo

A associação entre usuários e households será representada por:

```text
household_members
--------------------
household_id
user_id
role
created_at
```

Cardinalidade:

```text
profiles
    │
    │ N
    │
    ▼
household_members
    ▲
    │ N
    │
households
```

Ou, conceitualmente:

```text
profiles N:N households
```

através de `household_members`.

A combinação:

```text
household_id + user_id
```

deverá ser única.

Isso evita que o mesmo usuário seja adicionado duas vezes ao mesmo Casulo.

O campo `role` poderá inicialmente possuir valores como:

```text
OWNER
MEMBER
```

A necessidade de mais papéis deverá surgir do domínio antes de adicionarmos complexidade.

---

## 7. Carteiras

As carteiras representam valores declarados pelos usuários para planejamento.

Existirão duas modalidades visíveis:

### 7.1. Carteira pessoal

Representa valores reservados individualmente por um integrante.

### 7.2. Carteira compartilhada

Representa valores destinados ao planejamento conjunto.

Apesar dessas diferenças, não criaremos tabelas separadas para cada modalidade.

Utilizaremos uma única entidade:

```text
wallets
--------------------
id
household_id
owner_user_id
name
type
target_amount
reserved_amount
created_at
updated_at
```

Inicialmente:

```text
type = PERSONAL | SHARED
```

Uma carteira `PERSONAL` possui um proprietário.

Uma carteira `SHARED` pertence ao household e não precisa possuir um único proprietário.

Isso deverá ser protegido por regras de integridade.

Conceitualmente:

```text
PERSONAL
→ owner_user_id obrigatório

SHARED
→ owner_user_id nulo
```

Também deverá existir uma regra garantindo que o proprietário de uma carteira pessoal realmente pertença ao mesmo household.

Essa regra poderá exigir mais do que uma simples foreign key e deverá ser analisada durante a definição das constraints e políticas de acesso.

---

## 8. Valores monetários

Valores monetários não deverão utilizar tipos de ponto flutuante como:

```text
float
double
real
```

pois esses tipos podem introduzir problemas de precisão.

No PostgreSQL, a opção inicial preferida será:

```text
numeric(12,2)
```

ou precisão semelhante.

Exemplos:

```text
target_amount
reserved_amount
target_price
current_price
amount
```

Além disso, valores que não fazem sentido como negativos deverão possuir constraints equivalentes a:

```text
CHECK (amount >= 0)
```

A precisão definitiva será definida junto ao DER.

---

## 9. Itens do enxoval

Os usuários poderão cadastrar itens necessários para a nova casa.

Exemplos:

- geladeira;
- fogão;
- sofá;
- cama;
- mesa;
- panelas;
- televisão;
- máquina de lavar;
- itens de banheiro;
- decoração.

Estrutura conceitual:

```text
items
--------------------
id
household_id
name
description
category
priority
estimated_price
target_price
status
notes
created_at
updated_at
```

O campo `estimated_price` representa quanto os usuários acreditam que o item custará.

O campo `target_price` representa quanto gostariam de pagar.

A distinção evita utilizar o mesmo campo para dois conceitos diferentes.

Categorias inicialmente consideradas:

```text
KITCHEN
LIVING_ROOM
BEDROOM
BATHROOM
LAUNDRY
OFFICE
DECORATION
APPLIANCES
ELECTRONICS
OTHER
```

Os valores definitivos ainda deverão ser avaliados.

Possíveis prioridades:

```text
LOW
MEDIUM
HIGH
ESSENTIAL
```

Possíveis estados:

```text
PLANNED
MONITORING
READY_TO_BUY
PURCHASED
CANCELLED
```

Esses estados também deverão ser revisados antes das migrations.

---

## 10. Divisão dos custos

A responsabilidade de um item não será representada simplesmente por algo como:

```text
is_shared = true
```

A divisão precisa suportar valores arbitrários.

Exemplo:

```text
Geladeira
Preço: R$ 3.500

Carteira A: R$ 1.500
Carteira B: R$ 2.000
```

Outro exemplo:

```text
Mesa para escritório
Preço: R$ 800

Carteira A: R$ 800
```

Para isso teremos:

```text
item_allocations
--------------------
item_id
wallet_id
amount
created_at
```

A combinação:

```text
item_id + wallet_id
```

deverá ser única.

Assim, uma carteira não terá duas linhas independentes de alocação para o mesmo item.

Caso o valor seja alterado, a alocação existente deverá ser atualizada.

---

## 11. Integridade entre itens e carteiras

Existe uma regra importante que não estava explícita no modelo inicial:

uma carteira utilizada em uma alocação deve pertencer ao **mesmo household do item**.

Não pode existir algo equivalente a:

```text
Item do Household A
        ↓
Wallet do Household B
```

Esse tipo de inconsistência precisa ser impedido pelo domínio e, sempre que possível, também pelo banco.

A implementação definitiva dessa regra será analisada ao definirmos constraints, funções auxiliares e RLS.

---

## 12. Produtos monitorados

Um item poderá possuir um ou mais produtos relacionados em lojas online.

Estrutura conceitual:

```text
product_links
--------------------
id
item_id
provider
url
current_price
last_checked_at
created_at
updated_at
```

Um item poderá possuir vários links.

Exemplo:

```text
Geladeira Samsung
│
├── Mercado Livre
├── Amazon
└── outra loja
```

O campo inicialmente chamado de `store` poderá ser melhor representado como `provider`, pois a integração será baseada na arquitetura de Price Providers.

Entretanto, devemos evitar amarrar permanentemente o registro a nomes internos de classes ou implementações.

Essa decisão deverá ser refinada quando implementarmos o módulo de pricing.

---

## 13. Arquitetura de Price Providers

Cada integração de preços será tratada através de um provider/adaptador independente.

Interface conceitual:

```typescript
interface PriceProvider {
  supports(url: string): boolean;

  getProduct(url: string): Promise<ProductPrice>;
}
```

Estrutura aproximada:

```text
lib/
└── pricing/
    ├── providers/
    │   ├── mercado-livre.ts
    │   ├── amazon.ts
    │   └── ...
    │
    ├── price-service.ts
    └── types.ts
```

Fluxo:

```text
Casulo
   ↓
PriceService
   ↓
PriceProvider
   ↓
API / integração externa
```

O domínio principal não deverá conhecer detalhes específicos de uma determinada loja.

---

## 14. APIs antes de scraping

Sempre que possível:

```text
API oficial > scraping
```

Scraping deverá ser utilizado apenas quando necessário e adequado.

Motivos:

- mudanças de HTML;
- CAPTCHA;
- Cloudflare;
- mecanismos anti-bot;
- rate limiting;
- bloqueios;
- manutenção de seletores;
- preços diferentes por localização;
- preços diferentes para usuários autenticados;
- termos de uso das plataformas.

No MVP devemos implementar inicialmente **um único Price Provider funcional**.

Somente depois de validar essa arquitetura devemos adicionar outras lojas.

---

## 15. Histórico de preços

O histórico das verificações será armazenado separadamente do preço atual.

Estrutura conceitual:

```text
price_history
--------------------
id
product_link_id
price
checked_at
```

Exemplo:

```text
01/08 - R$ 3.499
05/08 - R$ 3.399
12/08 - R$ 3.099
18/08 - R$ 2.899
```

`product_links.current_price` representa apenas um snapshot conveniente do último preço conhecido.

`price_history` será a fonte histórica das consultas.

Essa separação permite:

- gráficos;
- análise de variação;
- histórico de promoções;
- auditoria das verificações.

---

## 16. Alertas de preço

Os usuários poderão configurar alertas para produtos monitorados.

Estrutura conceitual:

```text
price_alerts
--------------------
id
product_link_id
user_id
target_price
enabled
created_at
updated_at
```

Exemplo:

```text
Geladeira Samsung

Preço atual:
R$ 3.299

Preço desejado:
R$ 2.800

Notificar quando:
preço <= R$ 2.800
```

Uma regra importante será garantir que o usuário que cria o alerta pertença ao household relacionado ao produto.

---

## 17. Jobs de monitoramento

Os preços não precisam ser atualizados em tempo real.

O sistema poderá executar uma rotina periódica.

Fluxo:

```text
Cron / Job
     ↓
Buscar produtos monitorados
     ↓
Identificar PriceProvider
     ↓
Consultar preço
     ↓
Atualizar preço atual
     ↓
Salvar price_history
     ↓
Comparar com price_alerts
     ↓
Criar notificação
```

Para o MVP, a frequência poderá ser de algumas horas ou uma vez por dia.

Não devemos consultar serviços externos com frequência maior sem necessidade.

A frequência também dependerá de:

- limites das APIs;
- custos;
- volume de produtos;
- experiência do usuário.

---

## 18. Notificações

Notificações não fazem parte da primeira fase do MVP, mas o domínio deve permitir sua introdução posteriormente.

Possíveis canais futuros:

- notificações dentro da aplicação;
- e-mail;
- push notification.

O sistema de pricing não deverá depender diretamente de um canal específico.

Conceitualmente:

```text
Price Monitor
     ↓
Evento de preço atingido
     ↓
Notification Service
     ↓
Canal de notificação
```

---

## 19. Modelo inicial consolidado

A primeira versão conceitual refinada do modelo é:

```text
auth.users
│
└── profiles
    ├── id
    ├── display_name
    ├── created_at
    └── updated_at


households
├── id
├── name
├── created_at
└── updated_at


household_members
├── household_id
├── user_id
├── role
└── created_at


wallets
├── id
├── household_id
├── owner_user_id
├── name
├── type
├── target_amount
├── reserved_amount
├── created_at
└── updated_at


items
├── id
├── household_id
├── name
├── description
├── category
├── priority
├── estimated_price
├── target_price
├── status
├── notes
├── created_at
└── updated_at


item_allocations
├── item_id
├── wallet_id
├── amount
└── created_at


product_links
├── id
├── item_id
├── provider
├── url
├── current_price
├── last_checked_at
├── created_at
└── updated_at


price_alerts
├── id
├── product_link_id
├── user_id
├── target_price
├── enabled
├── created_at
└── updated_at


price_history
├── id
├── product_link_id
├── price
└── checked_at
```

Esse modelo ainda **não está aprovado para migrations**.

Ele será refinado através da definição completa do DER.

---

## 20. Cardinalidades iniciais

As principais cardinalidades são:

```text
auth.users
    1
    │
    │
    1
profiles
```

```text
profiles
    N
    │
    │
    N
households

através de household_members
```

```text
households
    1
    │
    │
    N
wallets
```

```text
households
    1
    │
    │
    N
items
```

```text
items
    N
    │
    │
    N
wallets

através de item_allocations
```

```text
items
    1
    │
    │
    N
product_links
```

```text
product_links
    1
    │
    │
    N
price_history
```

```text
product_links
    1
    │
    │
    N
price_alerts
```

---

## 21. Estratégia de identificadores

A estratégia inicial será utilizar UUIDs para entidades principais.

Exemplos:

```text
profiles.id
households.id
wallets.id
items.id
product_links.id
price_alerts.id
price_history.id
```

Isso combina naturalmente com o Supabase, cujo sistema de autenticação já utiliza UUID.

Tabelas associativas poderão utilizar chaves compostas quando fizer sentido.

Exemplos:

```text
household_members
PRIMARY KEY (household_id, user_id)
```

```text
item_allocations
PRIMARY KEY (item_id, wallet_id)
```

Não devemos adicionar um UUID artificial em tabelas associativas sem uma necessidade concreta.

---

## 22. Timestamps

Entidades persistentes deverão normalmente possuir:

```text
created_at
updated_at
```

Eventos históricos ou registros imutáveis poderão possuir apenas o timestamp que representa o evento.

Exemplo:

```text
price_history.checked_at
```

Não existe necessidade óbvia de um `updated_at` em um registro histórico de preço, pois ele idealmente não deverá ser alterado depois de criado.

---

## 23. Estratégia de exclusão

Não utilizaremos soft delete automaticamente em todas as tabelas.

Adicionar algo como:

```text
deleted_at
```

em cada entidade sem necessidade introduziria complexidade em:

- queries;
- índices;
- RLS;
- constraints;
- unicidade;
- manutenção.

A estratégia inicial será usar exclusão física quando apropriado.

Casos que necessitarem histórico ou recuperação poderão adotar outra estratégia posteriormente.

As ações de cascata deverão ser escolhidas explicitamente para cada relacionamento.

Por exemplo:

```text
household
   ↓
items
   ↓
product_links
   ↓
price_history
```

A exclusão de um household poderá implicar a remoção desses dados dependentes.

Entretanto, a exclusão de um usuário autenticado exige mais cuidado e será analisada separadamente.

---

## 24. Índices

Foreign keys utilizadas frequentemente em joins e políticas RLS provavelmente precisarão de índices.

Exemplos:

```text
household_members.user_id
wallets.household_id
wallets.owner_user_id
items.household_id
product_links.item_id
price_alerts.product_link_id
price_alerts.user_id
price_history.product_link_id
```

O PostgreSQL não cria automaticamente índices em todas as foreign keys.

Os índices definitivos serão definidos junto às migrations com base nas consultas previstas.

Não criaremos índices indiscriminadamente.

---

## 25. Row Level Security

O Casulo será uma aplicação multiusuário.

Conhecer o UUID de uma entidade não pode ser suficiente para acessá-la.

Exemplo:

```text
GET /casulos/<uuid>
```

só poderá retornar informações se o usuário autenticado fizer parte daquele household.

A regra central será algo equivalente a:

```text
Usuário pode acessar recurso

SE

auth.uid() pertence ao household do recurso.
```

Exemplo para uma carteira:

```text
wallet
   ↓
household_id
   ↓
household_members
   ↓
user_id = auth.uid()
```

As políticas RLS precisarão existir para:

- households;
- household_members;
- wallets;
- items;
- item_allocations;
- product_links;
- price_alerts;
- price_history.

Não devemos repetir lógica complexa de associação de household de forma desnecessária em todas as políticas.

Funções auxiliares de autorização poderão ser consideradas, desde que sejam simples, seguras e devidamente documentadas.

---

## 26. Segurança

Durante a implementação devemos sempre considerar:

### Autenticação

Confirmar a identidade do usuário.

### Autorização

Confirmar se o usuário pode acessar ou alterar determinado recurso.

### Row Level Security

Garantir isolamento de dados também no PostgreSQL.

### Secrets

Chaves privadas e credenciais nunca devem ser enviadas para o cliente ou versionadas no Git.

### Validação de entrada

Dados recebidos pelo servidor não devem ser considerados confiáveis.

### Integrações externas

URLs e respostas de providers deverão ser validadas.

### Dependências

Bibliotecas só devem ser adicionadas quando trouxerem benefício real.

---

## 27. Stack tecnológica

### Linguagem

**TypeScript**

### Framework

**Next.js**

### Frontend

**React**

### CSS

**Tailwind CSS**

Componentes poderão futuramente utilizar:

**shadcn/ui**

### Banco

**PostgreSQL**

### Backend / BaaS

**Supabase**

Inicialmente para:

- PostgreSQL;
- autenticação;
- sessão;
- Row Level Security;
- eventualmente Storage;
- eventualmente Edge Functions.

### Deploy

**Vercel**

### Testes

Inicialmente:

- Vitest;
- Playwright.

---

## 28. Arquitetura inicial

O MVP será inicialmente uma aplicação full-stack única.

Não utilizaremos microserviços neste momento.

Conceitualmente:

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

O código deverá possuir módulos bem separados para permitir futuras extrações caso alguma parte da aplicação realmente precise evoluir para um serviço independente.

---

## 29. Estrutura inicial planejada

Estrutura aproximada:

```text
casulo-app/
│
├── app/
│   ├── dashboard/
│   ├── wallets/
│   ├── items/
│   └── alerts/
│
├── components/
│
├── lib/
│   ├── auth/
│   ├── database/
│   ├── pricing/
│   │   └── providers/
│   └── notifications/
│
├── supabase/
│   └── migrations/
│
├── tests/
│
├── docs/
│   ├── PROJECT_CONTEXT.md
│   └── adr/
│
├── README.md
└── package.json
```

Essa estrutura não é definitiva.

A organização poderá ser alterada durante a implementação caso exista uma estrutura mais adequada ao domínio ou às convenções do Next.js.

Mudanças relevantes deverão ser justificadas.

---

## 30. ADRs planejados

Architecture Decision Records serão mantidos em:

```text
docs/adr/
```

Decisões já identificadas:

```text
001-nextjs-typescript.md
002-supabase-postgresql.md
003-wallet-model.md
004-price-providers.md
005-modular-monolith-mvp.md
```

### ADR-001

Next.js + TypeScript como base da aplicação.

### ADR-002

Supabase + PostgreSQL como infraestrutura inicial.

### ADR-003

Carteiras individuais e compartilhadas são representadas pela mesma entidade `wallet`.

### ADR-004

Integrações externas de preços serão implementadas através de Price Providers.

### ADR-005

O MVP será desenvolvido como um monólito modular/full-stack único.

Sempre que uma decisão arquitetural importante possuir alternativas relevantes e consequências de longo prazo, deverá ser considerada a criação de um ADR.

---

## 31. Roadmap

### Fase 1 — Fundação

- criar projeto Next.js;
- TypeScript;
- Tailwind CSS;
- lint;
- formatter;
- estrutura inicial;
- configuração de ambiente;
- integração com Supabase;
- testes básicos;
- CI.

### Fase 2 — Autenticação e Casulo

- cadastro;
- login;
- logout;
- criação de Casulo;
- integrantes;
- autorização;
- RLS.

### Fase 3 — Carteiras

- carteira individual;
- carteira compartilhada;
- valor reservado;
- valor alocado;
- disponibilidade para planejamento.

### Fase 4 — Enxoval

- itens;
- categorias;
- prioridades;
- status;
- alocações;
- divisão de custos;
- item comprado.

### Fase 5 — Dashboard

Indicadores como:

- orçamento total planejado;
- valor reservado;
- valor restante;
- itens planejados;
- itens comprados;
- itens pendentes;
- contribuição por carteira.

### Fase 6 — Monitoramento de preços

- links de produto;
- primeiro Price Provider;
- consulta periódica;
- histórico;
- preço-alvo;
- alerta.

### Fase 7 — Evoluções

Possibilidades:

- novos providers;
- notificações por e-mail;
- notificações web;
- gráficos;
- PWA;
- app mobile;
- compartilhamento de listas;
- funcionalidades adicionais de planejamento de mudança.

---

## 32. Fora do escopo inicial

Não fazem parte do MVP:

- custódia de dinheiro;
- movimentação financeira;
- Pix;
- pagamentos;
- cartões;
- contas digitais;
- investimentos;
- empréstimos;
- integração bancária;
- Open Finance;
- aplicativo mobile nativo;
- dezenas de Price Providers;
- scraping genérico de qualquer ecommerce.

Essas exclusões são intencionais para manter o MVP focado.

---

## 33. Estado atual

O projeto encontra-se na fase inicial de planejamento e fundação.

Antes de escrever migrations, o próximo objetivo é finalizar e aprovar o modelo de domínio e o DER.

Precisamos revisar detalhadamente:

- integração entre `auth.users` e `profiles`;
- `households`;
- `household_members`;
- `wallets`;
- `items`;
- `item_allocations`;
- `product_links`;
- `price_alerts`;
- `price_history`;
- cardinalidades;
- primary keys;
- foreign keys;
- constraints;
- índices;
- timestamps;
- representação de valores monetários;
- estratégia de exclusão;
- regras de integridade;
- impacto das políticas de Row Level Security.

Somente depois da aprovação desse modelo deverão ser criadas as primeiras migrations do PostgreSQL/Supabase.
