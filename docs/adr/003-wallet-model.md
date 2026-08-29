# ADR-003 — Carteiras individuais e compartilhadas como uma única entidade

## Status

Aceito.

## Contexto

O Casulo App possui dois conceitos visíveis de carteira:

- carteira individual;
- carteira compartilhada.

Uma carteira individual representa valores reservados por um integrante.

Uma carteira compartilhada representa valores destinados ao planejamento conjunto do household.

Uma alternativa seria utilizar tabelas diferentes para cada modalidade.

Isso, porém, criaria duplicação de estrutura e lógica.

## Decisão

Representar ambas através de uma única entidade:

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

Regras conceituais:

```text
PERSONAL
→ owner_user_id obrigatório
```

```text
SHARED
→ owner_user_id nulo
```

Todas as carteiras pertencem a um household.

## Motivos

As duas modalidades compartilham praticamente os mesmos comportamentos:

- possuem nome;
- pertencem a um Casulo;
- possuem valor reservado;
- podem participar de alocações;
- podem contribuir para itens.

Separá-las em duas tabelas criaria:

- estruturas duplicadas;
- consultas mais complexas;
- lógica duplicada;
- maior custo de manutenção.

## Alternativas consideradas

### Tabelas separadas

Exemplo:

```text
personal_wallets
shared_wallets
```

Não foi escolhido porque a diferença entre elas não justifica entidades persistentes completamente separadas.

### Campo `is_shared`

Seria mais simples inicialmente:

```text
is_shared boolean
```

Não foi escolhido porque `type` expressa melhor o conceito e permite futuras modalidades sem combinação confusa de flags booleanas.

## Regras de integridade

Uma carteira pessoal deve possuir proprietário.

Uma carteira compartilhada não deve possuir um único proprietário.

Também deve existir garantia de que o proprietário da carteira pessoal pertence ao mesmo household.

Exemplo inválido:

```text
Wallet
household_id = A
owner_user_id = usuário do Household B
```

A estratégia definitiva para garantir essa integridade será definida junto ao DER e às migrations.

## Consequências

### Positivas

- modelo mais simples;
- consultas uniformes;
- alocações podem referenciar qualquer tipo de carteira;
- menor duplicação;
- mais flexibilidade para evolução futura.

### Negativas

- algumas regras dependem do valor de `type`;
- será necessário criar constraints adequadas;
- consultas podem precisar distinguir carteiras pessoais de compartilhadas.

## Diretriz

Diferenças entre tipos de carteira devem ser representadas por regras de domínio e constraints, não por duplicação desnecessária de tabelas.
