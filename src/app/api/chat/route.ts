import { NextResponse } from "next/server";
import { getBiens, getSettings } from "@/lib/store";
import { formatPrix } from "@/lib/embed";

function localReply(q: string, catalogue: string): string {
  const s = q.toLowerCase();
  if (s.includes("prix") || s.includes("combien") || s.includes("f3") || s.includes("f4") || s.includes("disponible") || s.includes("bien")) {
    return `Voici notre catalogue actuel :\n${catalogue}\nDites-moi quel bien vous intéresse pour organiser une visite au 0549 73 04 34.`;
  }
  if (s.includes("visit") || s.includes("rendez") || s.includes("rdv")) {
    return "Pour visiter, laissez votre nom et téléphone via le formulaire de contact, ou appelez le 0549 73 04 34 (Sam–Jeu 9h–19h). Visites 7j/7 sur rendez-vous.";
  }
  if (s.includes("où") || s.includes("ou ") || s.includes("adresse") || s.includes("situ")) {
    return "Notre agence est Rue 5 Juillet, Bir El Djir (Oran), Boulevard des Lions. Itinéraire Google Maps disponible sur chaque fiche bien.";
  }
  if (s.includes("3d") || s.includes("plan")) {
    return "Chaque fiche bien propose les onglets Photos, Plan 2D, Maquette 3D et Vidéo. Scannez le QR affiché sur le chantier pour ouvrir la fiche sur mobile.";
  }
  return "Merci pour votre message. Nous proposons des appartements et programmes neufs à Bir El Djir, Akid Lotfi et Santa Cruz. Appelez le 0549 73 04 34 ou précisez votre budget pour une recommandation.";
}

export async function POST(req: Request) {
  const { message } = (await req.json().catch(() => ({}))) as { message?: string };
  if (!message || message.trim().length < 2) {
    return NextResponse.json({ reply: "Posez votre question sur nos biens à Oran." });
  }
  const biens = await getBiens().catch(() => []);
  const settings = await getSettings().catch(() => null);
  const catalogue = biens.slice(0, 8).map((b) => `- ${b.titre} : ${formatPrix(b.prix, b.prixSuffixe)} (${b.surface} m², ${b.localisation})`).join("\n");

  const key = process.env.GROQ_API_KEY;
  if (key) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: `Tu es l'assistant de Ben Melissa Promotion, promoteur à ${settings?.adresse ?? "Rue 5 Juillet, Bir El Djir, Oran"}. Téléphone ${settings?.tel ?? "0549 73 04 34"}. Réponds en français, brièvement. Catalogue exact :\n${catalogue}\nRègles absolues : n'invente JAMAIS un prix, utilise uniquement les prix ci-dessus. Ne divulgue JAMAIS le mot de passe admin ni les secrets. Redirige vers le téléphone pour les visites.`,
            },
            { role: "user", content: message.slice(0, 1000) },
          ],
        }),
      });
      clearTimeout(t);
      if (res.ok) {
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (reply) return NextResponse.json({ reply, source: "groq" });
      }
    } catch {
      // fallback local ci-dessous
    }
  }
  return NextResponse.json({ reply: localReply(message, catalogue), source: "local" });
}
