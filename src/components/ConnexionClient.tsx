"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnexionClient() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: fd.get("nom"), email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error ?? "Erreur"); return; }
    router.push("/compte");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="font-display text-4xl">{mode === "login" ? "Connexion" : "Créer un compte"}</h1>
      <div className="mt-4 flex gap-2">
        {(["login", "register"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex min-h-[44px] flex-1 items-center justify-center text-sm ${mode === m ? "bg-champagne text-noir" : "border border-champagne/40 text-champagne-clair"}`}>
            {m === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3 border border-champagne/25 bg-creme p-5 text-noir">
        {mode === "register" && <input name="nom" required placeholder="Nom complet" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />}
        <input name="email" type="email" required placeholder="Email" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
        <input name="password" type="password" required minLength={6} placeholder="Mot de passe (6+)" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
        {err && <p className="bg-noir p-2 text-sm text-red-300">{err}</p>}
        <button className="min-h-[44px] w-full bg-noir text-champagne-clair">Valider</button>
      </form>
    </div>
  );
}
