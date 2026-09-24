"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { LogoBM, IconMenu, IconClose, IconPhone } from "./icons";

const LINKS: [string, string][] = [
  ["Projets", "/projets"],
  ["Quartiers", "/quartiers"],
  ["Services", "/services"],
  ["Guide 3D", "/guide-3d"],
  ["À propos", "/a-propos"],
  ["Contact", "/contact"],
];

export default function Header({ tel, telHref, logoUrl }: { tel: string; telHref: string; logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Bloc navbar fixé en haut, SANS fond : la vidéo passe derrière */}
      <div className="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      {/* Bandeau utilitaire */}
      <div className="hidden md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-pierre">
          <p>Rue 5 Juillet, Bir El Djir — Oran</p>
          <div className="flex items-center gap-5">
            <p>Sam–Jeu · 9h–19h sur RDV</p>
            <a href="https://www.tiktok.com/@benmelissapromo" target="_blank" rel="noreferrer" className="transition hover:text-champagne-clair">TikTok</a>
            <a href="https://www.facebook.com/promotionbenmelissathose" target="_blank" rel="noreferrer" className="transition hover:text-champagne-clair">Facebook</a>
          </div>
        </div>
      </div>

      {/* Barre principale — aucun fond en haut, noire au scroll */}
      <header className={`transition-all duration-500 ${scrolled ? "border-b border-champagne/25 bg-noir/95 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur" : "border-b border-transparent bg-transparent [text-shadow:0_1px_14px_rgba(0,0,0,0.9)]"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="group flex items-center gap-3" aria-label="Ben Melissa Promotion">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Ben Melissa" className="h-11 w-11 object-contain" />
            ) : (
              <LogoBM size={44} />
            )}
            <span className="leading-none">
              <span className="font-display block text-[22px] tracking-wide text-creme transition group-hover:text-champagne-clair">
                Ben <em className="text-champagne">Melissa</em>
              </span>
              <span className="mt-1 block border-t border-champagne/40 pt-1 text-[10px] uppercase tracking-[0.32em] text-pierre">
                Promotion · Oran
              </span>
            </span>
          </Link>

          <nav className="hidden items-baseline gap-6 lg:flex">
            {LINKS.map(([label, href], i) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`group relative py-2 text-[13px] uppercase tracking-[0.18em] transition ${active ? "text-champagne-clair" : "text-creme/70 hover:text-creme"}`}>
                  <span className="mr-1 align-super text-[9px] text-champagne/70">0{i + 1}</span>
                  {label}
                  <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-champagne transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a href={telHref} className="hidden min-h-[44px] items-center gap-2 bg-champagne px-5 text-sm tracking-wide text-noir transition hover:bg-champagne-clair sm:flex">
              <IconPhone size={15} /> {tel}
            </a>
            <button onClick={() => setOpen(true)} className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 lg:hidden" aria-label="Ouvrir le menu">
              <span className="block h-px w-6 bg-creme" />
              <span className="block h-px w-6 bg-champagne" />
              <span className="block h-px w-4 self-end bg-creme" style={{ marginRight: "10px" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-noir"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-display text-xl text-champagne-clair">Ben <em>Melissa</em></p>
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="flex h-[44px] w-[44px] items-center justify-center border border-champagne/40 text-creme">
                <IconClose />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
              {LINKS.map(([label, href], i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                >
                  <Link href={href} onClick={() => setOpen(false)} className="flex min-h-[56px] items-baseline gap-4 border-b border-champagne/15">
                    <span className="text-xs text-champagne">0{i + 1}</span>
                    <span className="font-display text-3xl text-creme">{label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="p-6">
              <a href={telHref} className="flex min-h-[52px] items-center justify-center gap-2 bg-champagne text-noir">
                <IconPhone size={16} /> Appeler le {tel}
              </a>
              <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-pierre">Bir El Djir — Oran</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      {/* Filet de progression du scroll */}
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-champagne" />
    </>
  );
}
