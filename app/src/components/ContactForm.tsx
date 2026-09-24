"use client";
import { useState } from "react";

export default function ContactForm({ bienId, dark = false }: { bienId?: string; dark?: boolean }) {
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: fd.get("nom"), email: fd.get("email"), telephone: fd.get("telephone"), message: fd.get("message"), bienId }),
    });
    if (res.ok) setSent(true);
  }
  if (sent) return <p className={`p-4 text-sm ${dark ? "bg-noir text-champagne-clair" : "bg-creme text-noir"}`}>Message envoyé. L’équipe Ben Melissa vous répond sous 24h.</p>;
  return (
    <form onSubmit={submit} className={`space-y-3 border p-5 ${dark ? "border-champagne/25 bg-creme text-noir" : "border-champagne/25 bg-creme text-noir"}`}>
      <input name="nom" required placeholder="Nom complet" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="telephone" required placeholder="Téléphone" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
        <input name="email" type="email" placeholder="Email" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
      </div>
      <textarea name="message" required rows={4} placeholder="Votre message…" className="w-full border border-noir/20 bg-white px-3 py-2" />
      <button className="min-h-[44px] w-full bg-noir text-champagne-clair">Envoyer</button>
    </form>
  );
}
