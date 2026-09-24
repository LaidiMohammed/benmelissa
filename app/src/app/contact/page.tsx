import { getSettings } from "@/lib/store";
import ContactForm from "@/components/ContactForm";

export default async function Contact() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">Contact</p>
      <h1 className="font-display mt-1 text-4xl">Parlons de votre projet</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-2 text-sm text-creme/80">
          <p>{s.adresse}</p>
          <p><a href={s.telHref} className="text-xl text-champagne-clair">{s.tel}</a></p>
          <p><a href={`mailto:${s.email}`} className="text-champagne-clair">{s.email}</a></p>
          <p className="text-pierre">{s.horaires} — {s.visites}</p>
          <iframe title="Carte agence" src="https://www.google.com/maps?q=Rue+5+Juillet+Bir+El+Djir+Oran&output=embed" className="mt-4 h-64 w-full border border-champagne/25" loading="lazy" />
          <a href="https://www.google.com/maps?q=Rue+5+Juillet+Bir+El+Djir+Oran" target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center text-sm text-champagne">Ouvrir dans Google Maps</a>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
