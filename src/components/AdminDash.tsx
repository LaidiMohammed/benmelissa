"use client";
import { useEffect, useState } from "react";
import type { Bien, Lead, SiteSettings } from "@/lib/types";
import { formatPrix } from "@/lib/embed";

const EMPTY: Partial<Bien> = { type: "appartement", statut: "disponible", prixSuffixe: "DZD" };

export default function AdminDash() {
  const [biens, setBiens] = useState<Bien[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [tab, setTab] = useState<"biens" | "leads" | "reglages">("biens");
  const [form, setForm] = useState<Partial<Bien> & { imagesText?: string; plansText?: string }>(EMPTY as never);
  const [msg, setMsg] = useState("");

  async function load() {
    const [b, l, s] = await Promise.all([
      fetch("/api/admin/biens").then((r) => r.json()),
      fetch("/api/admin/leads").then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ]);
    if (b.biens) setBiens(b.biens);
    if (l.leads) setLeads(l.leads);
    if (s.settings) setSettings(s.settings);
  }
  useEffect(() => { load(); }, []);

  function set(k: string, v: string | number | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/biens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMsg("Bien enregistré."); setForm(EMPTY as never); load(); } else setMsg(data.error ?? "Erreur");
  }

  async function del(id: string) {
    if (!confirm("Supprimer ce bien ?")) return;
    await fetch(`/api/admin/biens?id=${id}`, { method: "DELETE" });
    load();
  }

  async function etape(id: string, etape: string) {
    await fetch("/api/admin/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, etape }) });
    load();
  }

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj: Record<string, string> = {};
    fd.forEach((v, k) => { obj[k] = String(v); });
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) });
    if (res.ok) setMsg("Réglages enregistrés.");
  }

  const stats = [
    ["Biens", biens.length],
    ["Disponibles", biens.filter((b) => b.statut === "disponible").length],
    ["Leads nouveaux", leads.filter((l) => l.etape === "nouveau").length],
    ["Valeur totale (M DZD)", Math.round(biens.reduce((a, b) => a + b.prix, 0) / 1000000)],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Dashboard promoteur</h1>
        <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }} className="flex min-h-[44px] items-center border border-champagne/40 px-4 text-sm">Déconnexion</button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="border border-champagne/20 p-4"><p className="font-display text-3xl text-champagne">{v}</p><p className="text-xs uppercase tracking-widest text-pierre">{l}</p></div>
        ))}
      </div>
      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {(["biens", "leads", "reglages"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex min-h-[48px] flex-shrink-0 items-center px-5 text-sm transition active:scale-[0.98] ${tab === t ? "bg-champagne text-noir" : "border border-champagne/40 text-champagne-clair"}`}>{t === "biens" ? "Portefeuille + ajout" : t === "leads" ? `Tunnel leads (${leads.length})` : "Réglages site"}</button>
        ))}
      </div>
      {msg && <p className="mt-3 bg-creme p-3 text-sm text-noir">{msg}</p>}

      {tab === "biens" && (
        <>
          <form onSubmit={save} className="mt-4 grid gap-3 border border-champagne/25 bg-creme p-4 text-noir md:grid-cols-2">
            <p className="text-xs uppercase tracking-widest text-pierre md:col-span-2">Ajouter / éditer — collez simplement les liens, le site fait le reste (<a href="/guide-3d" className="underline">guide 3D</a>)</p>
            <input value={form.id ?? ""} onChange={(e) => set("id", e.target.value)} placeholder="ID (vide = nouveau)" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input value={form.titre ?? ""} onChange={(e) => set("titre", e.target.value)} placeholder="Titre *" required className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <select value={form.type ?? "appartement"} onChange={(e) => set("type", e.target.value)} className="min-h-[44px] bg-white px-3">
              <option value="appartement">Appartement</option><option value="villa">Villa</option><option value="local">Local</option><option value="programme">Programme</option>
            </select>
            <select value={form.statut ?? "disponible"} onChange={(e) => set("statut", e.target.value)} className="min-h-[44px] bg-white px-3">
              <option value="disponible">Disponible</option><option value="reserve">Réservé</option><option value="vendu">Vendu</option><option value="location">Location</option>
            </select>
            <input type="number" value={form.prix ?? ""} onChange={(e) => set("prix", Number(e.target.value))} placeholder="Prix DZD *" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input value={form.prixSuffixe ?? "DZD"} onChange={(e) => set("prixSuffixe", e.target.value)} placeholder="Suffixe prix" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input type="number" value={form.surface ?? ""} onChange={(e) => set("surface", Number(e.target.value))} placeholder="Surface m²" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input type="number" value={form.pieces ?? ""} onChange={(e) => set("pieces", Number(e.target.value))} placeholder="Pièces" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input type="number" value={form.chambres ?? ""} onChange={(e) => set("chambres", Number(e.target.value))} placeholder="Chambres" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input value={form.localisation ?? ""} onChange={(e) => set("localisation", e.target.value)} placeholder="Quartier (Bir El Djir…)" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="Slug (auto si vide)" className="min-h-[44px] border border-noir/20 bg-white px-3" />
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Description FR" rows={3} className="border border-noir/20 bg-white px-3 py-2 md:col-span-2" />
            <textarea value={(form as { imagesText?: string }).imagesText ?? ""} onChange={(e) => set("imagesText", e.target.value)} placeholder="Images : 1 URL par ligne" rows={3} className="border border-noir/20 bg-white px-3 py-2" />
            <textarea value={(form as { plansText?: string }).plansText ?? ""} onChange={(e) => set("plansText", e.target.value)} placeholder="Plans 2D : 1 URL image par ligne (PDF = bouton auto)" rows={3} className="border border-noir/20 bg-white px-3 py-2" />
            <input value={form.mapsUrl ?? ""} onChange={(e) => set("mapsUrl", e.target.value)} placeholder="Lien Google Maps (partager / place / iframe)" className="min-h-[44px] border border-noir/20 bg-white px-3 md:col-span-2" />
            <input value={form.url3d ?? ""} onChange={(e) => set("url3d", e.target.value)} placeholder="Lien 3D (Sketchfab / Matterport)" className="min-h-[44px] border border-noir/20 bg-white px-3 md:col-span-2" />
            <input value={form.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value)} placeholder="Vidéo (YouTube watch/shorts ou TikTok)" className="min-h-[44px] border border-noir/20 bg-white px-3 md:col-span-2" />
            <label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.vedette)} onChange={(e) => set("vedette", e.target.checked)} className="h-5 w-5" /> Vedette (accueil)</label>
            <button className="min-h-[44px] bg-noir text-champagne-clair">Enregistrer le bien</button>
          </form>
          <div className="mt-6 grid items-stretch gap-6 md:grid-cols-3">
            {biens.map((b) => (
              <article key={b.id} className="bien-card border border-champagne/20 bg-[#111113]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.images[0] ?? "/hero-oran-poster.jpg"} alt={b.titre} className="bien-card-img" loading="lazy" />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-display text-lg">{b.titre}</h3>
                  <p className="text-sm text-champagne">{formatPrix(b.prix, b.prixSuffixe)}</p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <button onClick={() => setForm({ ...b, imagesText: b.images.join("\n"), plansText: (b.plans ?? []).join("\n") })} className="flex min-h-[44px] flex-1 items-center justify-center border border-champagne/50 text-sm">Éditer</button>
                    <button onClick={() => del(b.id)} className="flex min-h-[44px] flex-1 items-center justify-center border border-red-400/60 text-sm text-red-300">Supprimer</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "leads" && (
        <div className="mt-4 space-y-3">
          {leads.length === 0 && <p className="text-pierre">Aucun lead pour l’instant.</p>}
          {leads.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-3 border border-champagne/20 p-4 text-sm">
              <div className="min-w-52 flex-1"><p className="text-champagne-clair">{l.nom} — {l.telephone}</p><p className="text-creme/70">{l.message}</p></div>
              <select value={l.etape} onChange={(e) => etape(l.id, e.target.value)} className="min-h-[44px] bg-noir px-3 text-creme">
                {["nouveau", "contacte", "visite", "negociation", "signe", "perdu"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === "reglages" && settings && (
        <form onSubmit={saveSettings} className="mt-4 grid gap-3 border border-champagne/25 bg-creme p-4 text-noir md:grid-cols-2">
          {[["adresse", "Adresse"], ["tel", "Téléphone affiché"], ["telHref", "Lien tel (tel:+213…)"], ["email", "Email"], ["horaires", "Horaires"], ["visites", "Visites"], ["messageRepondeur", "Message répondeur"], ["facebook", "Facebook URL"], ["instagram", "Instagram URL"], ["tiktok", "TikTok URL"], ["logoUrl", "Logo URL (vide = monogramme BM)"]].map(([k, label]) => (
            <label key={k} className="text-xs uppercase tracking-widest text-pierre">{label}
              <input name={k} defaultValue={(settings as unknown as Record<string, string>)[k] ?? ""} className="mt-1 min-h-[44px] w-full border border-noir/20 bg-white px-3 normal-case" />
            </label>
          ))}
          <label className="text-xs uppercase tracking-widest text-pierre md:col-span-2">Vidéo hero YouTube (URL watch — prioritaire, ex. drone Oran)
            <input name="heroYoutube" defaultValue={settings.heroVideos?.[0]?.youtube ?? ""} className="mt-1 min-h-[44px] w-full border border-noir/20 bg-white px-3 normal-case" />
          </label>
          <label className="text-xs uppercase tracking-widest text-pierre md:col-span-2">Vidéo hero (MP4 directe, repli si YouTube vide — vide = photo Ken Burns)
            <input name="heroMp4" defaultValue={settings.heroVideos?.[0]?.mp4 ?? ""} className="mt-1 min-h-[44px] w-full border border-noir/20 bg-white px-3 normal-case" />
          </label>
          <button className="min-h-[44px] bg-noir text-champagne-clair md:col-span-2">Enregistrer les réglages</button>
        </form>
      )}
    </div>
  );
}
