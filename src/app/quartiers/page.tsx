import Link from "next/link";
import { getBiens, getSettings } from "@/lib/store";
import BienCard from "@/components/BienCard";
import { IconArrow } from "@/components/icons";

const QUARTIERS_META: [string, string, string][] = [
  ["Belgaïd", "150 log. Les Iris, 4 blocs, 35 parkings — cœur de Ben Melissa.", "/q-bireldjir.jpg"],
  ["Bir El Djir", "Boulevard des Lions, axe université. Résidences Melissa.", "/q-bireldjir.jpg"],
  ["Frange Maritime", "Tour 14 étages, 48 log. + 4 duplex, vue mer.", "/q-santacruz.jpg"],
  ["Canastel", "Villas jardin 120m², proche plage.", "/band-oran.jpg"],
  ["Akid Lotfi", "Standing et vue mer, résidences sécurisées.", "/q-akidlotfi.jpg"],
  ["Santa Cruz", "Programme neuf 2027 au pied du Murdjadjo.", "/q-santacruz.jpg"],
  ["Es Sénia", "Proche aéroport et université, locatif étudiant.", "/band-oran.jpg"],
];

export default async function Quartiers() {
  const [biens, settings] = await Promise.all([getBiens(), getSettings()]);
  function imgFor(q: string): string {
    if (settings.quartierImages?.[q]) return settings.quartierImages[q]!;
    const first = biens.find((b) => b.localisation === q);
    if (first?.images?.[0]) return first.images[0];
    const meta = QUARTIERS_META.find(([n]) => n === q);
    return meta?.[2] ?? "/band-oran.jpg";
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-champagne" />
        <p className="text-xs uppercase tracking-[0.3em] text-champagne">N°02 — Quartiers</p>
      </div>
      <h1 className="font-display mt-3 max-w-2xl text-5xl md:text-6xl">Oran, <em className="text-champagne-clair">rue par rue.</em></h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {QUARTIERS_META.map(([t, d]) => (
          <div key={t} className="overflow-hidden border border-champagne/20">
            <Link href={`/projets?quartier=${encodeURIComponent(t)}`} className="group relative block overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgFor(t)} alt={t} loading="lazy" className="aspect-[16/8] w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-noir/85 via-noir/20 to-transparent" />
              <span className="absolute bottom-0 flex w-full items-end justify-between p-5">
                <span className="font-display text-3xl text-creme">{t}</span>
                <span className="flex h-[44px] w-[44px] items-center justify-center border border-champagne/60 text-champagne-clair transition group-hover:bg-champagne group-hover:text-noir"><IconArrow size={16} /></span>
              </span>
            </Link>
            <p className="bg-[#111113] p-4 text-sm text-creme/70">{d}</p>
            <div className="grid gap-4 bg-[#111113] p-4 pt-0">
              {biens.filter((b) => b.localisation === t).slice(0, 1).map((b) => <BienCard key={b.id} bien={b} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
