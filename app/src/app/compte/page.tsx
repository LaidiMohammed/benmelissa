import { cookies } from "next/headers";
import { verifyToken, CLIENT_COOKIE } from "@/lib/auth";
import { getBiens, getClients } from "@/lib/store";
import BienCard from "@/components/BienCard";
import LogoutButton from "@/components/LogoutButton";

export default async function Compte() {
  const jar = await cookies();
  const p = await verifyToken(jar.get(CLIENT_COOKIE)?.value ?? "");
  const clients = await getClients();
  const me = clients.find((c) => c.id === p?.sub);
  const biens = await getBiens();
  const favs = biens.filter((b) => me?.favoris.includes(b.id));
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Mon compte</h1>
      <p className="mt-1 text-sm text-pierre">{me?.nom} — {me?.email}</p>
      <h2 className="font-display mt-6 text-2xl">Mes favoris ({favs.length})</h2>
      {favs.length === 0 ? (
        <p className="mt-2 text-sm text-creme/70">Touchez le cœur sur une fiche bien pour la retrouver ici.</p>
      ) : (
        <div className="mt-4 grid items-stretch gap-6 md:grid-cols-3">
          {favs.map((b) => <BienCard key={b.id} bien={b} />)}
        </div>
      )}
      <LogoutButton />
    </div>
  );
}
