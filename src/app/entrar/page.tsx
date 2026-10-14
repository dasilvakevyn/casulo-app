"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function EntrarPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    if (enviando) return;

    setErro("");
    setEnviando(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        setErro(
          "Não foi possível entrar. Confira email, senha e a confirmação da conta."
        );
        return;
      }

      router.replace("/criar-casulo");
      router.refresh();
    } catch {
      setErro(
        "Não foi possível conectar. Confira se o Supabase local está funcionando."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Voltar ao início
        </Link>

        <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Entrar no Casulo
          </h1>

          <p className="mt-4 leading-7 text-muted">
            Acesse sua conta para continuar o planejamento.
          </p>

          <form
            className="mt-8 space-y-5"
            aria-busy={enviando}
            onSubmit={(event) => {
              event.preventDefault();
              void handleEntrar();
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={enviando}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                required
                disabled={enviando}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {erro && (
              <p role="alert" className="text-sm text-red-700">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}