import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CriarCasuloFormulario from "./formulario";

export default async function CriarCasuloPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/entrar");
  }

  return <CriarCasuloFormulario />;
}