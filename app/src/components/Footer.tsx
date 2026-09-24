import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const s = settings;
  return (
    <footer className="border-t border-champagne/20 bg-noir">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl text-champagne-clair">Ben Melissa Promotion</p>
          <p className="mt-2 text-sm text-creme/70">{s?.adresse ?? "Rue 5 Juillet, Bir El Djir, Oran"}</p>
          <p className="mt-1 text-sm text-creme/70">{s?.horaires ?? "Sam–Jeu 9h–19h sur rendez-vous"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-pierre">Contact</p>
          <a href={s?.telHref ?? "tel:+213549730434"} className="mt-2 block min-h-[44px] text-champagne-clair">{s?.tel ?? "0549 73 04 34"}</a>
          <a href={`mailto:${s?.email ?? "contact@benmelissa.dz"}`} className="block min-h-[44px] text-sm text-creme/80">{s?.email ?? "contact@benmelissa.dz"}</a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-pierre">Réseaux</p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <a href={s?.tiktok ?? "https://www.tiktok.com/@benmelissapromo"} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center text-creme/80 hover:text-champagne-clair">TikTok — @benmelissapromo</a>
            <a href={s?.facebook ?? "https://www.facebook.com/promotionbenmelissathose"} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center text-creme/80 hover:text-champagne-clair">Facebook — Ben Melissa</a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-pierre">Navigation</p>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            {[["Projets", "/projets"], ["Guide 3D", "/guide-3d"], ["À propos", "/a-propos"], ["Contact", "/contact"], ["Espace promoteur", "/admin/login"]].map(([l, h]) => (
              <Link key={h} href={h} className="flex min-h-[44px] items-center text-creme/80 hover:text-champagne-clair">{l}</Link>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-champagne/10 px-4 py-4 text-center text-xs text-pierre">© 2026 Ben Melissa Promotion — Bir El Djir, Oran. Tous droits réservés.</p>
    </footer>
  );
}
