import { Reveal } from "@/components/Reveal";

export default function Services() {
  const items = [
    ["Vente dans le neuf", "Programmes Melissa à Bir El Djir et Santa Cruz, paiement échelonné, dossier notarié suivi."],
    ["Revente et estimation", "Estimation offerte sous 48h, photos réelles, mise en valeur et diffusion TikTok + portails."],
    ["Gestion locative", "Baux, loyers en DZD, entretien et reporting mensuel pour vos F2–F4 à Oran."],
    ["Accompagnement 3D", "Plans 2D, maquette Sketchfab/Matterport et vidéo YouTube pour chaque bien vitrine."],
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">Services</p>
      <h1 className="font-display mt-1 text-4xl">Un promoteur, quatre métiers</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {items.map(([t, d]) => (
          <Reveal key={t}><div className="h-full border border-champagne/20 p-6"><h2 className="font-display text-2xl text-champagne-clair">{t}</h2><p className="mt-2 text-sm text-creme/70">{d}</p></div></Reveal>
        ))}
      </div>
    </div>
  );
}
