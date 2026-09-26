"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconPhone, IconArrow, IconCheck, IconStar } from "@/components/icons";
import HeroVideo from "@/components/HeroVideo";
import BienCard from "@/components/BienCard";
import { Reveal } from "@/components/Reveal";
import type { Bien, SiteSettings } from "@/lib/types";

const FALLBACK_QUARTIER_IMG: Record<string, string> = {
  "Bir El Djir": "/q-bireldjir.jpg",
  Belgaïd: "/q-belgaid.jpg",
  "Akid Lotfi": "/q-akidlotfi.jpg",
  "Santa Cruz": "/q-santacruz.jpg",
  "Frange Maritime": "/q-frange.jpg",
  Canastel: "/q-canastel.jpg",
  "Es Sénia": "/q-essenia.jpg",
};

function quartierImg(q: string, biens: Bien[], settings: SiteSettings): string {
  // 1) image custom depuis /admin > Réglages > quartierImages
  if (settings.quartierImages?.[q]) return settings.quartierImages[q];
  // 2) sinon 1ère photo du 1er bien de ce quartier (devient réel dès que tu uploades tes photos)
  const first = biens.find((b) => b.localisation === q);
  if (first?.images?.[0]) return first.images[0];
  // 3) fallback placeholder local
  return FALLBACK_QUARTIER_IMG[q] ?? "/band-oran.jpg";
}

export default function HomeClient({ biens, settings }: { biens: Bien[]; settings: SiteSettings }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const hero = settings.heroVideos?.[0];
  const heroMp4 = hero?.mp4 && hero.mp4.length > 4 ? hero.mp4 : null;
  const heroYoutube = hero?.youtube && hero.youtube.length > 8 ? hero.youtube : null;
  // Si le MP4 local manque (404 en prod), bascule auto vers YouTube puis photo.
  const [mp4Failed, setMp4Failed] = useState(false);
  const vedettes = biens.filter((b) => b.vedette).slice(0, 3);

  return (
    <>
      {/* Hero — vidéo ORAN plein cadre depuis le haut de l'écran */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-end overflow-hidden">
        {heroMp4 && !mp4Failed ? (
          /* Vidéo ORAN plein écran desktop (≥768px) ; téléphone = poster HD + Ken Burns */
          <video key={heroMp4} autoPlay muted loop playsInline preload="metadata" poster={hero?.poster ?? "/hero-oran-poster.jpg"} className="absolute inset-0 h-full w-full object-cover object-center">
            <source src={heroMp4} type="video/mp4" media="(min-width: 768px)" onError={() => setMp4Failed(true)} />
          </video>
        ) : heroYoutube ? (
          <HeroVideo youtubeUrl={heroYoutube} poster={hero?.poster ?? "/hero-oran-poster.jpg"} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero?.poster ?? "/hero-oran-poster.jpg"} alt="Résidences Ben Melissa, Oran" className="animate-kenburns absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/35 to-noir/30" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-noir/70 to-transparent" />

        <motion.div style={{ scale: titleScale, y: titleY }} className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-32 md:pt-36">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-champagne" />
            <p className="text-xs uppercase tracking-[0.22em] text-champagne-clair sm:tracking-[0.35em]">N°01 — Promoteur · Bir El Djir, Oran</p>
          </div>
          <h1 className="font-display hero-title mt-4 max-w-4xl text-creme">
            Habiter Oran,
            <br />
            <em className="font-light text-champagne-clair">l’esprit Melissa.</em>
          </h1>
          <p className="mt-5 max-w-xl border-l-2 border-champagne pl-4 text-[15px] leading-relaxed text-creme/85">
            Résidences neuves à Bir El Djir, Akid Lotfi et Santa Cruz. Chaque bien se visite en photos réelles,
            plans 2D, maquette 3D et vidéo de chantier.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/projets" className="group flex min-h-[52px] items-center justify-center gap-3 bg-champagne px-7 text-[15px] text-noir transition active:scale-[0.98] hover:bg-champagne-clair sm:justify-start">
              Voir les projets
              <span className="transition-transform duration-300 group-hover:translate-x-1"><IconArrow size={17} /></span>
            </Link>
            <a href={settings.telHref} className="flex min-h-[52px] items-center justify-center gap-2 border border-creme/50 px-7 text-[15px] text-creme backdrop-blur-sm transition active:scale-[0.98] hover:border-champagne hover:text-champagne-clair sm:justify-start">
              <IconPhone size={16} /> {settings.tel}
            </a>
          </div>

          {/* Bandeau chiffres */}
          <dl className="mt-10 grid grid-cols-3 divide-x divide-creme/15 border-y border-creme/15 py-4">
            {[
              ["48+", "logements livrés"],
              ["4,2/5", "69 avis Google"],
              ["7j/7", "visites sur RDV"],
            ].map(([n, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="font-display text-2xl text-champagne-clair md:text-3xl">{n}</dt>
                <dd className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-creme/60 sm:text-[11px] sm:tracking-[0.2em]">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-b border-champagne/20 bg-[#0d0d0f] py-3.5">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-[13px] uppercase tracking-[0.32em] text-champagne/80">
          {["Bir El Djir", "Akid Lotfi", "Santa Cruz", "Es Sénia", "Canastel", "Plan 2D", "Visite 3D", "QR Chantier"].concat(["Bir El Djir", "Akid Lotfi", "Santa Cruz", "Es Sénia", "Canastel", "Plan 2D", "Visite 3D", "QR Chantier"]).map((w, i) => (
            <span key={i} className="flex items-center gap-10">{w} <span className="text-champagne/40">·</span></span>
          ))}
        </div>
      </div>

      {/* Conciergerie — panneau crème chevauchant */}
      <section className="relative z-10 mx-auto -mt-2 max-w-6xl px-4 pt-10">
        <Reveal>
          <form action="/projets" method="get" className="border border-champagne/40 bg-creme p-5 text-noir shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="font-display text-2xl">Trouvez votre adresse <em className="text-[#8a6d3b]">à Oran</em></p>
              <p className="text-xs uppercase tracking-[0.25em] text-pierre">Réponse sous 24h</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="min-w-40 flex-1 text-xs uppercase tracking-widest text-pierre">Type
                <select name="type" className="mt-1 min-h-[48px] w-full border border-noir/15 bg-white px-3 text-[16px] normal-case text-noir" defaultValue="">
                  <option value="">Tous types</option>
                  <option value="appartement">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="local">Local</option>
                  <option value="programme">Programme neuf</option>
                </select>
              </label>
              <label className="min-w-40 flex-1 text-xs uppercase tracking-widest text-pierre">Budget
                <select name="budget" className="mt-1 min-h-[48px] w-full border border-noir/15 bg-white px-3 text-[16px] normal-case text-noir" defaultValue="">
                  <option value="">Tous budgets</option>
                  <option value="15">Moins de 15 M DZD</option>
                  <option value="20">Moins de 20 M DZD</option>
                  <option value="30">Moins de 30 M DZD</option>
                </select>
              </label>
              <button className="min-h-[48px] w-full self-end bg-noir px-8 text-champagne-clair transition hover:bg-[#1c1c1f] sm:w-auto">Rechercher</button>
            </div>
          </form>
        </Reveal>
      </section>

      {/* Sélection */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-champagne"><span className="font-display text-lg italic">02</span> Sélection du moment</p>
              <h2 className="font-display mt-2 text-4xl md:text-5xl">Les adresses <em className="text-champagne-clair">Melissa</em></h2>
            </div>
            <Link href="/projets" className="group flex min-h-[44px] items-center gap-2 text-sm uppercase tracking-[0.2em] text-champagne">Tout le catalogue <span className="transition-transform group-hover:translate-x-1"><IconArrow size={15} /></span></Link>
          </div>
        </Reveal>
        <div className="projets-grid mt-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {vedettes.map((b) => (
            <div key={b.id} className="w-[86vw] max-w-[360px] md:w-auto md:max-w-none">
              <BienCard bien={b} />
            </div>
          ))}
        </div>
        <div className="rule-diamond mt-10" aria-hidden="true"><span /></div>
      </section>

      {/* Editorial luxe — Oran rue par rue : réalisations Bd des Lions & Belgaïd */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-champagne"><span className="font-display text-lg italic">03</span> Oran, rue par rue — Réalisations</p>
              <h2 className="font-display mt-2 text-4xl leading-tight md:text-5xl">Bd des Lions & Belgaïd, <em className="text-champagne-clair">déjà livrés.</em></h2>
              <p className="mt-3 max-w-xl border-l-2 border-champagne pl-4 text-sm leading-relaxed text-creme/70">10 projets réalisés — photos façade + intérieur, plans 2D, maquette 3D et vidéo drone via QR. Chaque quartier expose son premier bien en image réelle (upload via /admin).</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="border border-champagne/30 px-3 py-1 text-champagne-clair">Plan 2D ✓</span>
              <span className="border border-champagne/30 px-3 py-1 text-champagne-clair">3D ✓</span>
              <span className="bg-champagne px-3 py-1 text-noir">QR chantier</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-creme/15 pt-3 text-[11px] uppercase tracking-[0.2em] text-pierre">
            <span>Maquette 3D — Sketchfab / Matterport</span><span className="text-champagne/40">·</span><span>Plans 2D & QR — LayOut → PNG</span><span className="text-champagne/40">·</span><span>Vidéo & carte — YouTube + Maps</span>
          </div>
        </Reveal>

        <div className="mt-8">
          {/* Mobile: horizontal scroll 16/9 cards */}
          <div className="lg:hidden snap-row no-scrollbar -mx-4 px-4">
            <div className="w-[86vw] max-w-[360px] flex-shrink-0">
              <Link href="/projets?quartier=Belga%C3%AFd" className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg("Belgaïd", biens, settings)} alt="Belgaïd — Les Iris" loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/10 to-transparent" />
                <span className="absolute left-0 top-0 m-3 bg-champagne px-3 py-1 text-[10px] uppercase tracking-widest text-noir">Livré 2024 — 5 projets</span>
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="font-display block text-2xl text-creme">Belgaïd</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">150 log. Les Iris — cœur Ben Melissa</span>
                </span>
              </Link>
            </div>
            <div className="w-[86vw] max-w-[360px] flex-shrink-0">
              <Link href="/projets?quartier=Bir%20El%20Djir" className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg("Bir El Djir", biens, settings)} alt="Bd des Lions" loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <span className="absolute left-3 top-3 bg-noir/80 px-2 py-1 text-[10px] uppercase tracking-widest text-champagne-clair">Bd des Lions</span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span><span className="font-display block text-2xl text-creme">Bir El Djir</span><span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">3 résidences — livrées 2022/23</span></span>
                  <span className="flex h-10 w-10 items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={14} /></span>
                </span>
              </Link>
            </div>
            <div className="w-[86vw] max-w-[360px] flex-shrink-0">
              <Link href="/projets?quartier=Frange%20Maritime" className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg("Frange Maritime", biens, settings)} alt="Frange Maritime" loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span><span className="font-display block text-2xl text-creme">Frange Maritime</span><span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">Tour 14 étages, vue mer</span></span>
                  <span className="flex h-10 w-10 items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={14} /></span>
                </span>
              </Link>
            </div>
          </div>
          {/* Desktop : grille asymetrique Belgaid + stack */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-[1.35fr_0.9fr]">
          {/* Gauche : Belgaïd — grande image + 2 vignettes projets chevauchantes */}
          <Reveal className="relative">
            <Link href="/projets?quartier=Belga%C3%AFd" className="group relative block overflow-hidden border border-champagne/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={quartierImg("Belgaïd", biens, settings)} alt="Belgaïd — Les Iris" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <span className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/10 to-transparent" />
              <span className="absolute left-0 top-0 m-3 bg-champagne px-3 py-1 text-[10px] uppercase tracking-widest text-noir">Livré 2024 — 5 projets</span>
              <span className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-display block text-3xl text-creme">Belgaïd</span>
                <span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">150 log. Les Iris — cœur Ben Melissa</span>
                <span className="mt-2 flex gap-2 text-xs text-creme/70"><span>Belgaïd</span><span className="text-champagne/50">·</span><span>{biens.filter((b) => b.localisation === "Belgaïd").length} biens</span></span>
              </span>
            </Link>
            {/* Vignettes chevauchantes — 2 projets Belgaïd */}
            <div className="pointer-events-none -mt-8 mr-4 flex justify-end gap-3 lg:mr-6">
              {biens.filter((b) => b.localisation === "Belgaïd").slice(0, 2).map((b) => (
                <div key={b.id} className="pointer-events-auto w-[46%] overflow-hidden border border-champagne/30 bg-[#111113] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.images[0] ?? quartierImg("Belgaïd", biens, settings)} alt={b.titre} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-3">
                    <p className="line-clamp-1 font-display text-sm text-creme">{b.titre}</p>
                    <p className="text-xs text-champagne">{b.surface} m² · {b.pieces} pièces</p>
                  </div>
                </div>
              ))}
</div>
      </Reveal>

          {/* Droite : stack Bd des Lions + Frange Maritime */}
          <div className="grid content-start gap-6">
            <Reveal>
              <Link href="/projets?quartier=Bir%20El%20Djir" className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg("Bir El Djir", biens, settings)} alt="Bd des Lions" loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <span className="absolute left-3 top-3 bg-noir/80 px-2 py-1 text-[10px] uppercase tracking-widest text-champagne-clair">Bd des Lions</span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span><span className="font-display block text-2xl text-creme">Bir El Djir</span><span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">3 résidences — livrées 2022/23</span></span>
                  <span className="flex h-10 w-10 items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={14} /></span>
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.06}>
              <Link href="/projets?quartier=Frange%20Maritime" className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg("Frange Maritime", biens, settings)} alt="Frange Maritime" loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <span><span className="font-display block text-2xl text-creme">Frange Maritime</span><span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">Tour 14 étages, vue mer</span></span>
                  <span className="flex h-10 w-10 items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={14} /></span>
                </span>
              </Link>
              <div className="mt-3 flex gap-2">
                {biens.filter((b) => b.localisation === "Frange Maritime").slice(0, 1).map((b) => (
                  <span key={b.id} className="border border-champagne/20 px-2 py-1 text-xs text-champagne-clair">{b.titre} · Plan 2D + Vidéo</span>
                ))}
              </div>
            </Reveal>
          </div>
          </div>
        </div>

        {/* Bottom 3 quartiers - mobile scroll, desktop grid */}
        <div className="mt-6 lg:hidden snap-row no-scrollbar -mx-4 px-4">
          {[
            ["Canastel", "Villas jardin & terrasse", "Canastel"],
            ["Akid Lotfi", "Standing & vue mer", "Akid Lotfi"],
            ["Es Sénia", "Axe université", "Es Sénia"],
          ].map(([q, d, loc]) => (
            <Reveal key={q} className="w-[84vw] max-w-[340px] flex-shrink-0">
              <Link href={`/projets?quartier=${encodeURIComponent(loc)}`} className="group relative block overflow-hidden border border-champagne/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg(loc, biens, settings)} alt={q} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
                <span className="absolute bottom-0 p-4"><span className="font-display block text-xl text-creme">{q}</span><span className="text-xs uppercase tracking-[0.2em] text-champagne-clair/80">{d}</span></span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="hidden lg:grid gap-4 sm:grid-cols-3">
          {[
            ["Canastel", "Villas jardin & terrasse", "Canastel"],
            ["Akid Lotfi", "Standing & vue mer", "Akid Lotfi"],
            ["Es Sénia", "Axe université", "Es Sénia"],
          ].map(([q, d, loc]) => (
            <Reveal key={q} className="group relative block overflow-hidden border border-champagne/20">
              <Link href={`/projets?quartier=${encodeURIComponent(loc)}`} className="relative block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={quartierImg(loc, biens, settings)} alt={q} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir/70 to-transparent" />
                <span className="absolute bottom-0 p-4"><span className="font-display block text-xl text-creme">{q}</span><span className="text-xs uppercase tracking-[0.2em] text-champagne-clair/80">{d}</span></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="rule-diamond mt-10" aria-hidden="true"><span /></div>
      </section>

      {/* Parcours + avis sur crème */}
      <section className="bg-creme text-noir">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8a6d3b]"><span className="font-display text-lg italic">05</span> Parcours d’achat</p>
            <h2 className="font-display mt-2 text-4xl">De la visite aux clés</h2>
            <ol className="mt-6">
              {["Visite 7j/7 sur rendez-vous", "Réservation écrite, prix en DZD", "Notaire & paiement sécurisé", "Remise des clés + SAV"].map((s, i) => (
                <li key={s} className="flex items-center gap-4 border-t border-noir/15 py-4 last:border-b">
                  <span className="font-display w-10 text-2xl italic text-[#8a6d3b]">0{i + 1}</span>
                  <span className="text-[15px]">{s}</span>
                </li>
              ))}
            </ol>
            <Link href="/contact" className="mt-6 inline-flex min-h-[52px] items-center gap-2 bg-noir px-7 text-champagne-clair">Prendre rendez-vous <IconArrow size={16} /></Link>
          </div>
          <div className="border border-noir/15 bg-white p-6 md:col-span-2">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-pierre"><IconStar size={15} /> Avis Google — 4,2/5 · 69 avis</p>
            <blockquote className="font-display mt-4 text-2xl leading-snug">« La meilleure promotion en Algérie. Des commerciaux qui relèvent le niveau. »</blockquote>
            <p className="mt-3 text-sm text-pierre">— avis clients vérifiés, Bir El Djir</p>
            <p className="mt-5 flex items-start gap-2 border-t border-noir/10 pt-4 text-sm"><IconCheck size={16} /> {settings.messageRepondeur}</p>
          </div>
        </div>
      </section>
    </>
  );
}
