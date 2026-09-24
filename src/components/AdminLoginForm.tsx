"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const [err, setErr] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    if (!res.ok) { setErr("Identifiants invalides"); return; }
    router.push("/admin");
  }
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">Espace promoteur</p>
      <h1 className="font-display mt-1 text-4xl">Connexion sécurisée</h1>
      <form onSubmit={submit} className="mt-5 space-y-3 border border-champagne/25 bg-creme p-5 text-noir">
        <input name="email" type="email" required placeholder="Email admin" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
        <input name="password" type="password" required placeholder="Mot de passe" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
        {err && <p className="bg-noir p-2 text-sm text-red-300">{err}</p>}
        <button className="min-h-[44px] w-full bg-noir text-champagne-clair">Entrer</button>
      </form>
    </div>
  );
}
