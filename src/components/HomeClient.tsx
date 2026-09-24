"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconPhone, IconArrow, IconCheck, IconStar } from "@/components/icons";
import HeroVideo from "@/components/HeroVideo";
import BienCard from "@/components/BienCard";
import { Reveal } from "@/components/Reveal";
import type { Bien, SiteSettings } from "@/lib/types";

const QUARTIER_IMG: Record<string, string> = {
  "Bir El Djir": "/q-bireldjir.jpg",
  "Akid Lotfi": "/q-akidlotfi.jpg",
  "Santa Cruz": "/q-santacruz.jpg",
  "Es Sénia": "/band-oran.jpg",
};

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
              <button className="min-h-[48px] self-end bg-noir px-8 text-champagne-clair transition hover:bg-[#1c1c1f]">Rechercher</button>
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
        <div className="snap-row no-scrollbar mt-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {vedettes.map((b) => (
            <div key={b.id} className="w-[86vw] max-w-[360px] md:w-auto md:max-w-none">
              <BienCard bien={b} />
            </div>
          ))}
        </div>
        <div className="rule-diamond mt-10" aria-hidden="true"><span /></div>
      </section>

      {/* Bandeau image Oran — savoir-faire */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/band-oran.jpg" alt="Architecture méditerranéenne, Oran" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-noir/78" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-champagne"><span className="font-display text-lg italic">03</span> Le savoir-faire</p>
            <h2 className="font-display mt-2 max-w-2xl text-4xl leading-tight md:text-5xl">Chaque projet se <em className="text-champagne-clair">visite avant de se visiter.</em></h2>
          </Reveal>
          <div className="mt-10 space-y-0 border-t border-creme/20">
            {[
              ["Maquette 3D", "Sketchfab / Matterport", "Un lien collé dans l'admin, la visite 3D s'ouvre sur la fiche. Idéal pour nos clients à l'étranger.", "/guide-3d"],
              ["Plans 2D & QR chantier", "LayOut → PNG", "Galerie + loupe plein écran. Sur site, le QR ouvre la fiche sur votre téléphone.", "/projets?tab=plan"],
              ["Vidéo & carte", "YouTube + Google Maps", "Le film du chantier et l'itinéraire depuis un simple lien, sans toucher au code.", "/guide-3d"],
            ].map(([t, tag, d, href], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <Link href={href} className="group grid gap-2 border-b border-creme/20 py-6 transition hover:bg-creme/5 md:grid-cols-[60px_1fr_1.4fr_40px] md:items-center md:gap-6 md:px-4">
                  <span className="font-display text-xl italic text-champagne">0{i + 1}</span>
                  <span><span className="font-display block text-2xl text-creme">{t}</span><span className="text-[11px] uppercase tracking-[0.25em] text-champagne/80">{tag}</span></span>
                  <span className="text-sm leading-relaxed text-creme/70">{d}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5"><IconArrow size={18} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quartiers en images */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-champagne"><span className="font-display text-lg italic">04</span> Quartiers</p>
          <h2 className="font-display mt-2 text-4xl md:text-5xl">Oran, <em className="text-champagne-clair">rue par rue</em></h2>
        </Reveal>
        <div className="snap-row no-scrollbar mt-8 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0">
          {[
            ["Bir El Djir", "Boulevard des Lions — résidences Melissa"],
            ["Akid Lotfi", "Standing & vue mer"],
            ["Santa Cruz", "Programme neuf 2027"],
            ["Es Sénia", "Axe université — locatif"],
          ].map(([q, d], i) => (
            <Reveal key={q} delay={i * 0.06} className="w-[84vw] max-w-[340px] sm:w-auto sm:max-w-none">
              <Link href={`/projets?quartier=${encodeURIComponent(q)}`} className="group relative block h-full overflow-hidden border border-champagne/20 active:border-champagne">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={QUARTIER_IMG[q] ?? "/band-oran.jpg"} alt={q} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-noir via-noir/25 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span><span className="font-display block text-3xl text-creme">{q}</span><span className="text-xs uppercase tracking-[0.22em] text-champagne-clair/90">{d}</span></span>
                  <span className="flex h-[44px] w-[44px] items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={16} /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
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
