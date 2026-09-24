"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconChat, IconClose } from "./icons";

const SUGGESTIONS = ["Quels biens sont disponibles ?", "Quel est le prix du F3 à Bir El Djir ?", "Comment visiter ?", "Où êtes-vous situés ?"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "Bonjour, je suis l'assistant Ben Melissa. Une question sur nos biens à Oran ? Je réponds 24h/24." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply ?? "Je reste disponible pour toute question." }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Service momentanément ralenti. Appelez le 0549 73 04 34." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mb-3 flex h-[min(480px,68dvh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden border border-champagne/40 bg-[#131316] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-champagne/20 px-4 py-3">
              <p className="font-display text-lg text-champagne-clair">Assistant Ben Melissa</p>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="flex h-[44px] w-[44px] items-center justify-center"><IconClose /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
              {msgs.map((m, i) => (
                <p key={i} className={m.role === "user" ? "ml-8 bg-champagne px-3 py-2 text-noir" : "mr-8 bg-creme px-3 py-2 text-noir"}>{m.text}</p>
              ))}
              {busy && <p className="mr-8 bg-creme px-3 py-2 text-sm text-noir/60">Réponse en cours…</p>}
            </div>
            <div className="flex flex-wrap gap-1 px-3 pb-1">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="border border-champagne/40 px-2 py-1 text-xs text-champagne-clair">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-champagne/20 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écrivez votre question…" className="min-h-[44px] flex-1 bg-noir px-3 text-creme placeholder:text-pierre" />
              <button type="submit" className="min-h-[44px] bg-champagne px-4 text-noir">OK</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} aria-label="Chat" className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-champagne text-noir shadow-xl transition hover:scale-105">
        {open ? <IconClose /> : <IconChat />}
      </button>
    </div>
  );
}
