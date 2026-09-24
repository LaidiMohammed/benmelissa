"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { normalizeMaps, normalizeYoutube, normalize3d, normalizeTiktok, resolveTiktok, formatPrix } from "@/lib/embed";
import { IconPhone, IconClose, IconPin, IconBed, IconArea } from "@/components/icons";
import FavButton from "@/components/FavButton";
import type { Bien, SiteSettings } from "@/lib/types";
import { useEffect } from "react";

type Tab = "photos" | "plan" | "3d" | "video";

export default function FicheClient({ bien, settings, initialTab }: { bien: Bien; settings: SiteSettings; initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [tiktokHtml, setTiktokHtml] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const maps = bien.mapsUrl ? normalizeMaps(bien.mapsUrl, bien.latitude, bien.longitude) : null;
  const yt = bien.videoUrl ? normalizeYoutube(bien.videoUrl) : null;
  const d3 = bien.url3d ? normalize3d(bien.url3d) : null;
  const tk = bien.videoUrl && !yt ? normalizeTiktok(bien.videoUrl) : null;
  const plans = [...(bien.plans ?? []), ...(bien.plan2d && !bien.plans?.includes(bien.plan2d) ? [bien.plan2d] : [])];
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (tk) resolveTiktok(tk.embedUrl).then((r) => { if (r.html) setTiktokHtml(r.html); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function rdv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: fd.get("nom"), telephone: fd.get("telephone"), email: fd.get("email"), message: `Demande de visite : ${bien.titre}`, bienId: bien.id }),
    });
    setSent(true);
  }

  const tabs: [Tab, string][] = [["photos", "Photos"], ["plan", "Plan 2D"], ["3d", "Maquette 3D"], ["video", "Vidéo"]];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-pierre"><IconPin size={13} /> {bien.localisation}{bien.arrondissement ? ` — ${bien.arrondissement}` : ""}</p>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display max-w-2xl text-3xl md:text-5xl">{bien.titre}</h1>
        <FavButton bienId={bien.id} />
      </div>
      <p className="font-display mt-2 text-2xl text-champagne">{formatPrix(bien.prix, bien.prixSuffixe)}</p>
      <p className="mt-1 flex flex-wrap gap-4 text-sm text-creme/70">
        <span className="flex items-center gap-1"><IconArea size={15} /> {bien.surface} m²</span>
        <span className="flex items-center gap-1"><IconBed size={15} /> {bien.pieces} pièces · {bien.chambres} ch.</span>
      </p>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto border-b border-champagne/20 px-4 md:mx-0 md:flex-wrap md:px-0">
        {tabs.map(([id, label]) => (
          <a key={id} href={`?tab=${id}`} onClick={(e) => { e.preventDefault(); setTab(id); window.history.replaceState(null, "", `?tab=${id}`); }}
            className={`flex min-h-[48px] flex-shrink-0 items-center px-5 text-sm transition active:scale-[0.98] md:min-h-[44px] ${tab === id ? "bg-champagne text-noir" : "text-creme/70 hover:text-champagne-clair"}`}>{label}</a>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="py-6">
          {tab === "photos" && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bien.images.map((src) => (
                <button key={src} onClick={() => setLightbox(src)} className="group overflow-hidden border border-champagne/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={bien.titre} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                </button>
              ))}
              {bien.images.length === 0 && <p className="text-pierre">Photos à venir.</p>}
            </div>
          )}
          {tab === "plan" && (
            <div>
              {plans.length === 0 && <p className="text-pierre">Plans à venir.</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                {plans.map((p) => /\.pdf(\?|$)/i.test(p) ? (
                  <a key={p} href={p} target="_blank" rel="noreferrer" className="flex min-h-[64px] items-center justify-center border border-champagne/40 px-4 text-champagne-clair">Ouvrir le plan PDF</a>
                ) : (
                  <button key={p} onClick={() => setLightbox(p)} className="overflow-hidden border border-champagne/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="Plan 2D" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {tab === "3d" && (
            <div>
              {d3 ? (
                <iframe src={d3.embedUrl} title="Maquette 3D" className="h-[60vh] w-full border border-champagne/25 bg-black" allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen />
              ) : (
                <p className="border border-champagne/20 p-6 text-sm text-creme/70">Maquette 3D à venir. L’admin colle simplement un lien Sketchfab ou Matterport dans le champ « Lien 3D ».</p>
              )}
            </div>
          )}
          {tab === "video" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                {yt ? (
                  <iframe src={yt.embedUrl} title="Vidéo" className="aspect-video w-full border border-champagne/25" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                ) : tiktokHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: tiktokHtml }} />
                ) : tk ? (
                  <a href={tk.watchUrl} target="_blank" rel="noreferrer" className="flex min-h-[120px] items-center justify-center border border-champagne/40 px-4 text-champagne-clair">Voir sur TikTok</a>
                ) : (
                  <p className="border border-champagne/20 p-6 text-sm text-creme/70">Vidéo à venir. L’admin colle un lien YouTube ou TikTok.</p>
                )}
              </div>
              <div>
                {maps && (
                  <>
                    <iframe src={maps.embedUrl} title="Carte" className="h-64 w-full border border-champagne/25" loading="lazy" />
                    <a href={maps.watchUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-[44px] items-center text-sm text-champagne">Ouvrir dans Google Maps</a>
                  </>
                )}
                <div className="mt-4 flex items-center gap-4 border border-champagne/20 bg-creme p-4 text-noir">
                  {pageUrl && <QRCodeSVG value={pageUrl} size={96} />}
                  <p className="text-sm">QR chantier : scannez pour ouvrir cette fiche sur téléphone.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Description</h2>
          <p className="mt-2 text-sm leading-relaxed text-creme/80">{bien.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {bien.features.map((f) => <li key={f} className="border border-champagne/30 px-3 py-1 text-xs text-champagne-clair">{f}</li>)}
          </ul>
        </div>
        <form onSubmit={rdv} className="border border-champagne/25 bg-creme p-5 text-noir">
          <h2 className="font-display text-2xl">Demander une visite</h2>
          {sent ? (
            <p className="mt-3 bg-noir p-4 text-sm text-champagne-clair">{settings.messageRepondeur}</p>
          ) : (
            <div className="mt-3 space-y-3">
              <input name="nom" required placeholder="Nom complet" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
              <input name="telephone" required placeholder="Téléphone" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
              <input name="email" type="email" placeholder="Email (optionnel)" className="min-h-[44px] w-full border border-noir/20 bg-white px-3" />
              <button className="min-h-[44px] w-full bg-noir text-champagne-clair">Confirmer la demande</button>
            </div>
          )}
        </form>
      </div>

      {/* Barre d'appel collante mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-champagne/30 bg-noir/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        <a href={settings.telHref} className="flex min-h-[44px] flex-1 items-center justify-center gap-2 bg-champagne text-noir"><IconPhone size={16} /> Appeler</a>
        <a href="#visite" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }} className="flex min-h-[44px] flex-1 items-center justify-center border border-champagne/60 text-champagne-clair">Visite</a>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button aria-label="Fermer" className="absolute right-4 top-4 flex h-[44px] w-[44px] items-center justify-center text-creme"><IconClose /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Zoom" className="max-h-[90vh] max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
