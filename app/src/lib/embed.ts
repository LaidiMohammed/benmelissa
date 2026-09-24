// Moteur auto-import : l'utilisateur colle un lien brut dans l'admin,
// le site l'affiche automatiquement, sans code.
export interface EmbedResult {
  kind: "maps" | "youtube" | "sketchfab" | "matterport" | "tiktok" | "pdf" | "image" | "iframe" | "none";
  embedUrl: string;
  watchUrl: string;
  html?: string;
}

function extractIframeSrc(input: string): string | null {
  const m = input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

export function normalizeMaps(input: string, lat?: number, lng?: number): EmbedResult {
  const iframeSrc = extractIframeSrc(input);
  const raw = (iframeSrc ?? input).trim();
  let embedUrl = raw;
  if (/google\.[^/]+\/maps/.test(raw) && !/output=embed/.test(raw) && !/\/embed/.test(raw)) {
    embedUrl = raw + (raw.includes("?") ? "&" : "?") + "output=embed";
  }
  if ((!raw || raw.length < 8) && typeof lat === "number" && typeof lng === "number") {
    embedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  }
  const watchUrl = iframeSrc ? raw : raw.length > 8 ? raw : `https://www.google.com/maps?q=${lat ?? 35.7322},${lng ?? -0.5871}`;
  return { kind: "maps", embedUrl, watchUrl };
}

export function normalizeYoutube(input: string): EmbedResult | null {
  const raw = (extractIframeSrc(input) ?? input).trim();
  const m =
    raw.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/) ??
    raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (!m) return null;
  const id = m[1];
  return {
    kind: "youtube",
    embedUrl: `https://www.youtube.com/embed/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

export function normalize3d(input: string): EmbedResult | null {
  const raw = (extractIframeSrc(input) ?? input).trim();
  if (!raw) return null;
  if (/sketchfab\.com\/3d-models\//.test(raw)) {
    const idm = raw.match(/-([0-9a-f]{32})(?:\/|$)/i);
    if (idm) {
      return {
        kind: "sketchfab",
        embedUrl: `https://sketchfab.com/models/${idm[1]}/embed?autostart=1&ui_theme=dark`,
        watchUrl: raw.split("?")[0],
      };
    }
  }
  if (/sketchfab\.com\/models\/.*\/embed/.test(raw)) {
    return { kind: "sketchfab", embedUrl: raw, watchUrl: raw };
  }
  if (/my\.matterport\.com\/show/.test(raw)) {
    const sep = raw.includes("?") ? "&" : "?";
    return { kind: "matterport", embedUrl: `${raw}${sep}mls=1`, watchUrl: raw };
  }
  if (/^https?:\/\//.test(raw) && (raw.includes("matterport") || raw.includes("sketchfab"))) {
    return { kind: "iframe", embedUrl: raw, watchUrl: raw };
  }
  return null;
}

export function normalizeTiktok(input: string): EmbedResult | null {
  const raw = input.trim();
  if (!/tiktok\.com/.test(raw)) return null;
  // On stocke l'URL brute ; résolution oEmbed côté serveur avec cache.
  return { kind: "tiktok", embedUrl: raw, watchUrl: raw.split("?")[0] };
}

export function normalizePlan(url: string): EmbedResult {
  const raw = url.trim();
  if (/\.pdf(\?|$)/i.test(raw)) return { kind: "pdf", embedUrl: raw, watchUrl: raw };
  if (/\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(raw) || /^https?:\/\//.test(raw)) {
    return { kind: "image", embedUrl: raw, watchUrl: raw };
  }
  return { kind: "none", embedUrl: raw, watchUrl: raw };
}

export function splitLines(input: string): string[] {
  return input
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Cache mémoire serveur pour oEmbed TikTok (clé = URL brute).
const tiktokCache = new Map<string, { html: string; at: number }>();

export async function resolveTiktok(url: string): Promise<{ html: string | null; watchUrl: string }> {
  const watchUrl = url.split("?")[0];
  const cached = tiktokCache.get(url);
  if (cached && Date.now() - cached.at < 1000 * 60 * 60 * 6) return { html: cached.html, watchUrl };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    clearTimeout(t);
    if (!res.ok) return { html: null, watchUrl };
    const data = (await res.json()) as { html?: string };
    if (data.html) {
      tiktokCache.set(url, { html: data.html, at: Date.now() });
      return { html: data.html, watchUrl };
    }
    return { html: null, watchUrl };
  } catch {
    return { html: null, watchUrl };
  }
}

export function formatPrix(prix: number, suffixe?: string): string {
  const n = new Intl.NumberFormat("fr-DZ").format(prix);
  return suffixe ? `${n} ${suffixe}` : `${n} DZD`;
}
