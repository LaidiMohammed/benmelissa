"use client";
import { useState } from "react";
import { IconHeart } from "./icons";

export default function FavButton({ bienId }: { bienId: string }) {
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch("/api/favoris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bienId }),
      });
      if (res.status === 401) {
        window.location.href = "/connexion";
        return;
      }
      if (res.ok) setOk(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label="Ajouter aux favoris"
      className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-noir/80 text-champagne-clair transition hover:bg-champagne hover:text-noir"
    >
      <IconHeart filled={ok} />
    </button>
  );
}
