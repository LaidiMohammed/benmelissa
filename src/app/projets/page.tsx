import { getBiens } from "@/lib/store";
import BienCard from "@/components/BienCard";

export default async function Projets({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const biens = await getBiens();
  const quartiers = [...new Set(biens.map((b) => b.localisation))];
  const filtered = biens.filter((b) => {
    if (sp.type && b.type !== sp.type) return false;
    if (sp.statut && b.statut !== sp.statut) return false;
    if (sp.quartier && b.localisation !== sp.quartier) return false;
    if (sp.budget && b.prix > Number(sp.budget) * 1000000) return false;
    if (sp.pieces && b.pieces < Number(sp.pieces)) return false;
    if (sp.q && !`${b.titre} ${b.description} ${b.localisation}`.toLowerCase().includes(String(sp.q).toLowerCase())) return false;
    return true;
  });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-champagne">Catalogue</p>
      <h1 className="font-display mt-1 text-4xl">Nos projets à Oran</h1>
      <form method="get" className="mt-6 grid grid-cols-2 gap-3 border border-champagne/25 bg-creme p-4 text-noir md:flex md:flex-wrap">
        <select name="type" defaultValue={sp.type ?? ""} className="min-h-[48px] bg-white px-3 md:min-h-[44px]">
          <option value="">Tous types</option>
          <option value="appartement">Appartement</option>
          <option value="villa">Villa</option>
          <option value="local">Local</option>
          <option value="programme">Programme</option>
        </select>
        <select name="budget" defaultValue={sp.budget ?? ""} className="min-h-[48px] bg-white px-3 md:min-h-[44px]">
          <option value="">Tous budgets</option>
          <option value="15">Moins de 15 M DZD</option>
          <option value="20">Moins de 20 M DZD</option>
          <option value="30">Moins de 30 M DZD</option>
        </select>
        <select name="pieces" defaultValue={sp.pieces ?? ""} className="min-h-[48px] bg-white px-3 md:min-h-[44px]">
          <option value="">Pièces</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <select name="statut" defaultValue={sp.statut ?? ""} className="min-h-[48px] bg-white px-3 md:min-h-[44px]">
          <option value="">Tous statuts</option>
          <option value="disponible">Disponible</option>
          <option value="reserve">Réservé</option>
          <option value="location">Location</option>
          <option value="vendu">Vendu</option>
        </select>
        <select name="quartier" defaultValue={sp.quartier ?? ""} className="min-h-[48px] bg-white px-3 md:min-h-[44px]">
          <option value="">Tous quartiers</option>
          {quartiers.map((q) => <option key={q} value={q}>{q}</option>)}
        </select>
        <button className="col-span-2 min-h-[48px] bg-noir px-6 text-champagne-clair transition active:scale-[0.99] md:col-span-1 md:min-h-[44px]">Filtrer</button>
      </form>
      <p className="mt-4 text-sm text-pierre">{filtered.length} bien(s) trouvé(s)</p>
      <div className="mt-4 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => <BienCard key={b.id} bien={b} />)}
      </div>
    </div>
  );
}
