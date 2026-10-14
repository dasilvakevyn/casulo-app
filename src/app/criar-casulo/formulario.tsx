"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CriarCasuloFormulario() {
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const [nomeConfirmado, setNomeConfirmado] = useState("");

    function handleContinuar() {
        const nomeLimpo = nome.trim();

        setNomeConfirmado("");

        if (nomeLimpo.length === 0) {
            setErro("Informe um nome para o seu Casulo.");
            return;
        }

        if (nomeLimpo.length > 100) {
            setErro("O nome deve ter no máximo 100 caracteres.");
            return;
        }

        setErro("");
        setNomeConfirmado(nomeLimpo);
    }

    const router = useRouter();
    const [saindo, setSaindo] = useState(false);
    const [erroSaida, setErroSaida] = useState("");

    async function handleSair() {
        if (saindo) return;

        setSaindo(true);
        setErroSaida("");

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signOut({
                scope: "local",
            });

            if (error) {
                setErroSaida("Não foi possível sair. Tente novamente.");
                return;
            }

            router.replace("/entrar");
            router.refresh();
        } catch {
            setErroSaida("Não foi possível conectar para encerrar a sessão.");
        } finally {
            setSaindo(false);
        }
    }

    return (
        <main className="min-h-screen bg-background px-6 py-10 text-foreground">
            <div className="mx-auto max-w-xl">
                <Link
                    href="/"
                    className="text-sm text-primary hover:underline"
                >
                    ← Voltar ao início
                </Link>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        disabled={saindo}
                        onClick={() => void handleSair()}
                        className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium hover:border-primary/30 disabled:opacity-60"
                    >
                        {saindo ? "Saindo..." : "Sair"}
                    </button>
                </div>

                {erroSaida && (
                    <p role="alert" className="mt-3 text-sm text-red-700">
                        {erroSaida}
                    </p>
                )}
                <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-8">
                    <p className="text-sm font-medium text-primary">
                        Um novo começo
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                        Criar meu Casulo
                    </h1>

                    <p className="mt-4 leading-7 text-muted">
                        Vamos organizar o planejamento da sua primeira casa.
                        Começaremos escolhendo um nome para o seu Casulo.
                    </p>

                    <form
                        noValidate
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleContinuar();
                        }}
                    >
                        <div className="mt-8">
                            <label
                                htmlFor="nome-casulo"
                                className="block text-sm font-medium"
                            >
                                Nome do Casulo
                            </label>

                            <input
                                id="nome-casulo"
                                name="nome"
                                type="text"
                                value={nome}
                                onChange={(event) => {
                                    setNome(event.target.value);
                                    setErro("");
                                    setNomeConfirmado("");
                                }}
                                maxLength={100}
                                placeholder="Ex.: Nosso primeiro lar"
                                aria-invalid={Boolean(erro)}
                                aria-describedby={
                                    erro
                                        ? "nome-casulo-ajuda nome-casulo-erro"
                                        : "nome-casulo-ajuda"
                                }
                                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            <p
                                id="nome-casulo-ajuda"
                                className="mt-2 text-sm text-muted"
                            >
                                Escolha um nome de até 100 caracteres.
                            </p>
                        </div>

                        <div className="mt-6 rounded-2xl bg-surface-muted p-5">
                            <p className="text-sm text-muted">Prévia do nome</p>

                            <p className="mt-2 break-words text-xl font-semibold">
                                {nome.trim() || "Seu novo Casulo"}
                            </p>
                        </div>

                        {/* Passo 4: mensagens e botão */}
                        {erro && (
                            <p
                                id="nome-casulo-erro"
                                role="alert"
                                className="mt-4 text-sm text-red-700"
                            >
                                {erro}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                        >
                            Continuar
                        </button>

                        {nomeConfirmado && (
                            <div
                                role="status"
                                className="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary"
                            >
                                Nome confirmado: <strong>{nomeConfirmado}</strong>.
                                Esta é uma demonstração; seu Casulo ainda não foi salvo.
                            </div>
                        )}
                    </form>
                </section>
            </div>
        </main>
    );
}