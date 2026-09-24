"use client";
import Link from "next/link";
import type { Bien } from "@/lib/types";
import { formatPrix } from "@/lib/embed";
import { IconBed, IconArea, IconPin } from "./icons";
import FavButton from "./FavButton";

const STATUT_LABEL: Record<string, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
  location: "Location",
};

export default function BienCard({ bien }: { bien: Bien }) {
  const img = bien.images[0] ?? "/hero-oran-poster.jpg";
  return (
    <article className="bien-card group overflow-hidden border border-champagne/20 bg-[#111113] transition duration-300 hover:-translate-y-1 hover:border-champagne/60 hover:shadow-[0_20px_60px_-20px_rgba(201,168,106,0.4)]">
      <Link href={`/projets/${bien.slug}`} className="relative block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={bien.titre} loading="lazy" className="bien-card-img transition duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 bg-noir/85 px-3 py-1 text-xs uppercase tracking-widest text-champagne-clair">
          {STATUT_LABEL[bien.statut] ?? bien.statut}
        </span>
        <span className="absolute right-3 top-3" onClick={(e) => e.preventDefault()}>
          <FavButton bienId={bien.id} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-pierre">
          <IconPin size={13} /> {bien.localisation}
        </p>
        <Link href={`/projets/${bien.slug}`}>
          <h3 className="mt-1 line-clamp-1 font-display text-xl text-creme transition group-hover:text-champagne-clair">{bien.titre}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 min-h-[2.6em] text-sm text-creme/60">{bien.description}</p>
        <p className="mt-2 flex items-center gap-4 text-sm text-creme/80">
          <span className="flex items-center gap-1"><IconArea size={15} /> {bien.surface} m²</span>
          <span className="flex items-center gap-1"><IconBed size={15} /> {bien.pieces} pièces</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-display text-lg text-champagne">{formatPrix(bien.prix, bien.prixSuffixe)}</p>
          <Link href={`/projets/${bien.slug}`} className="flex min-h-[44px] items-center border border-champagne/50 px-4 text-sm text-champagne-clair transition hover:bg-champagne hover:text-noir">
            Découvrir
          </Link>
        </div>
      </div>
    </article>
  );
}
