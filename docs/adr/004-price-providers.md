# ADR-004 — Integrações de preços através de Price Providers

## Status

Aceito.

## Contexto

O Casulo App deverá futuramente consultar preços de produtos em diferentes lojas online.

Cada loja poderá possuir características diferentes:

- API própria;
- autenticação;
- formato de resposta;
- limites de requisição;
- estrutura de URL;
- disponibilidade de dados;
- mecanismos anti-bot;
- necessidade eventual de scraping.

Colocar regras específicas de cada loja diretamente no domínio principal criaria alto acoplamento.

## Decisão

Utilizar uma arquitetura baseada em **Price Providers**.

Cada integração externa será encapsulada por um provider responsável por entender uma determinada fonte de preços.

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

O serviço principal de preços selecionará o provider apropriado.

Fluxo conceitual:

```text
PriceService
     ↓
seleciona provider
     ↓
PriceProvider
     ↓
API / integração externa
```

## Motivos

Cada loja é uma integração externa independente.

Encapsular essas integrações permite:

- reduzir acoplamento;
- substituir uma integração sem alterar o domínio;
- testar providers isoladamente;
- adicionar novas lojas gradualmente;
- tratar erros específicos de cada integração;
- impedir que detalhes externos contaminem o restante da aplicação.

## APIs antes de scraping

A estratégia padrão será:

```text
API oficial > scraping
```

Scraping só deverá ser utilizado quando necessário e adequado.

Motivos:

- mudanças frequentes de HTML;
- CAPTCHA;
- mecanismos anti-bot;
- Cloudflare;
- manutenção de seletores;
- rate limiting;
- preços personalizados;
- questões relacionadas aos termos de uso.

## Estratégia para o MVP

O MVP não tentará suportar várias lojas simultaneamente.

Primeiro deverá existir um único provider funcional.

Somente depois de validar:

- contrato;
- tratamento de erros;
- armazenamento do histórico;
- job de monitoramento;
- integração com alertas;

deveremos adicionar outros providers.

## Alternativas consideradas

### Lógica específica dentro do PriceService

Não foi escolhida porque o serviço ficaria progressivamente maior e acoplado a cada loja.

### Um scraper genérico

Não foi escolhido porque sites diferentes possuem estruturas e comportamentos diferentes.

Uma abstração genérica demais seria frágil e difícil de manter.

## Consequências

### Positivas

- baixo acoplamento;
- facilidade de testes;
- integração incremental;
- maior isolamento de falhas externas;
- possibilidade de substituir APIs ou estratégias por provider.

### Negativas

- adiciona uma camada de abstração;
- exige definição clara do contrato comum;
- nem todos os providers necessariamente retornarão exatamente os mesmos dados.

## Diretriz

O domínio deve conhecer conceitos como produto e preço.

Ele não deve conhecer detalhes específicos de Mercado Livre, Amazon ou qualquer outra loja.
