import Link from "next/link";
import { getBiens } from "@/lib/store";
import BienCard from "@/components/BienCard";
import { IconArrow } from "@/components/icons";

const QUARTIERS: [string, string, string][] = [
  ["Bir El Djir", "Boulevard des Lions, axe université. Résidences Melissa, commerces au pied, Es Sénia à 10 min.", "/q-bireldjir.jpg"],
  ["Akid Lotfi", "Standing et vue mer, résidences sécurisées, front de mer à 5 min.", "/q-akidlotfi.jpg"],
  ["Santa Cruz", "Programme neuf 2027 au pied du mont Murdjadjo, calme et panorama.", "/q-santacruz.jpg"],
  ["Es Sénia", "Proche aéroport et université, idéal locatif étudiant.", "/band-oran.jpg"],
];

export default async function Quartiers() {
  const biens = await getBiens();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-4">
        <span className="h-px w-12 bg-champagne" />
        <p className="text-xs uppercase tracking-[0.3em] text-champagne">N°02 — Quartiers</p>
      </div>
      <h1 className="font-display mt-3 max-w-2xl text-5xl md:text-6xl">Oran, <em className="text-champagne-clair">rue par rue.</em></h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {QUARTIERS.map(([t, d, img]) => (
          <div key={t} className="overflow-hidden border border-champagne/20">
            <Link href={`/projets?quartier=${encodeURIComponent(t)}`} className="group relative block overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={t} loading="lazy" className="aspect-[16/8] w-full object-cover transition duration-700 group-hover:scale-105" />
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
