import { getSettings } from "@/lib/store";
import ContactForm from "@/components/ContactForm";

export default async function APropos() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">À propos</p>
      <h1 className="font-display mt-1 text-4xl">Ben Melissa, promoteur à Bir El Djir</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-sm leading-relaxed text-creme/80">
          <p>Depuis Bir El Djir, Ben Melissa Promotion conçoit des résidences soignées : halls en marbre local, cages lumineuses, parking et gardiennage. Chaque programme est documenté — photos réelles, plans 2D, maquette 3D et vidéo de chantier.</p>
          <p>Notre promesse : un interlocuteur unique, un prix écrit en DZD, un dossier notarié propre.</p>
          <div className="grid grid-cols-3 gap-3 border border-champagne/20 p-4 text-center">
            {[["48+", "logements livrés"], ["4,2/5", "69 avis Google"], ["24/7", "assistant + urgence"]].map(([n, l]) => (
              <div key={l}><p className="font-display text-2xl text-champagne">{n}</p><p className="text-xs text-pierre">{l}</p></div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl">Contact direct</h2>
          <p className="mt-1 text-sm text-creme/70">{s.adresse} — {s.horaires}</p>
          <p className="mt-1 text-sm"><a href={s.telHref} className="text-champagne-clair">{s.tel}</a> · <a href={`mailto:${s.email}`} className="text-champagne-clair">{s.email}</a></p>
          <div className="mt-4"><ContactForm /></div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href={s.tiktok} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center border border-champagne/40 px-4 text-champagne-clair">TikTok</a>
            <a href={s.facebook} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center border border-champagne/40 px-4 text-champagne-clair">Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
}
