export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-lg text-white">
              C
            </span>
            Casulo
          </a>
          <nav
            className="hidden items-center gap-8 text-sm text-muted md:flex"
            aria-label="Navegação principal"
          >
            <a
              href="#como-funciona"
              className="transition-colors hover:text-foreground"
            >
              Como funciona
            </a>
            <a
              href="#planejamento"
              className="transition-colors hover:text-foreground"
            >
              Planejamento
            </a>
          </nav>
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:border-primary/30 hover:bg-white"
          >
            Entrar
          </button>
        </header>
        <div className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              A primeira casa começa no planejamento
            </span>
            <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Construam juntos o caminho para o primeiro lar.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              Organizem o enxoval, valores reservados e responsabilidades em
              um só lugar, com clareza sobre o que já foi conquistado e o que
              ainda falta.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Criar meu Casulo
              </button>
              <a
                href="#como-funciona"
                className="rounded-full border border-border bg-surface px-6 py-3.5 text-center text-sm font-semibold transition hover:border-primary/30"
              >
                Conhecer o projeto
              </a>
            </div>
            <p className="mt-6 max-w-lg text-sm leading-6 text-muted">
              O Casulo não movimenta dinheiro. Os valores registrados servem
              exclusivamente para organização e planejamento.
            </p>
          </div>
          <div id="planejamento" className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/5 blur-2xl" />
            <div className="rounded-[2rem] border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(61,66,55,0.10)] sm:p-7">
              <div className="flex items-start justify-between gap-6 border-b border-border pb-6">
                <div>
                  <p className="text-sm text-muted">Nosso Casulo</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Primeira casa
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                  Em planejamento
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl bg-surface-muted p-5">
                  <p className="text-sm text-muted">Valor reservado</p>
                  <p className="mt-2 text-2xl font-semibold">R$ 8.450</p>
                  <p className="mt-3 text-xs text-muted">
                    Entre carteiras individuais e compartilhadas
                  </p>
                </article>
                <article className="rounded-2xl bg-primary p-5 text-white">
                  <p className="text-sm text-white/70">Enxoval</p>
                  <p className="mt-2 text-2xl font-semibold">12 de 28</p>
                  <p className="mt-3 text-xs text-white/70">
                    itens já organizados
                  </p>
                </article>
              </div>
              <div className="mt-4 rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Geladeira</p>
                    <p className="mt-1 text-xs text-muted">
                      Eletrodomésticos · Essencial
                    </p>
                  </div>
                  <p className="text-sm font-semibold">R$ 3.500</p>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full w-[68%] rounded-full bg-accent" />
                </div>
                <div className="mt-3 flex justify-between text-xs text-muted">
                  <span>R$ 2.380 alocados</span>
                  <span>68%</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <article className="rounded-2xl border border-border p-5">
                  <p className="text-xs text-muted">Carteira pessoal</p>
                  <p className="mt-2 font-semibold">R$ 3.200</p>
                </article>
                <article className="rounded-2xl border border-border p-5">
                  <p className="text-xs text-muted">
                    Carteira compartilhada
                  </p>
                  <p className="mt-2 font-semibold">R$ 5.250</p>
                </article>
              </div>
            </div>
          </div>
        </div>
        <section
          id="como-funciona"
          className="grid gap-4 border-t border-border py-10 md:grid-cols-3"
        >
          <article>
            <p className="text-sm font-semibold text-primary">01</p>
            <h2 className="mt-3 font-semibold">Organizem o que precisam</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Criem o enxoval e definam prioridades para cada item da nova
              casa.
            </p>
          </article>
          <article>
            <p className="text-sm font-semibold text-primary">02</p>
            <h2 className="mt-3 font-semibold">Planejem juntos</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Distribuam valores entre carteiras individuais e
              compartilhadas.
            </p>
          </article>
          <article>
            <p className="text-sm font-semibold text-primary">03</p>
            <h2 className="mt-3 font-semibold">Acompanhem o progresso</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Visualizem o que já foi reservado, comprado e o que ainda falta.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}