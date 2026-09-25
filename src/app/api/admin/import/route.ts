import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { getBiens, saveBiens, slugify, uid } from "@/lib/store";
import { splitLines } from "@/lib/embed";
import { SEED_BIENS } from "@/lib/seed";
import type { Bien } from "@/lib/types";

async function guard(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  const p = await verifyToken(t);
  return p?.role === "admin";
}

function normalizeImported(raw: Record<string, unknown>, i: number): Bien {
  const images = raw.imagesText ? splitLines(String(raw.imagesText)) : Array.isArray(raw.images) ? (raw.images as string[]) : raw.image ? [String(raw.image)] : [];
  const plans = raw.plansText ? splitLines(String(raw.plansText)) : Array.isArray(raw.plans) ? (raw.plans as string[]) : raw.plan2d ? [String(raw.plan2d)] : [];
  const titre = String(raw.titre ?? raw.title ?? raw.nom ?? `Bien ${i + 1}`);
  const id = raw.id && String(raw.id).length > 2 ? String(raw.id) : uid("bm");
  return {
    id,
    slug: String(raw.slug ?? slugify(titre)),
    titre,
    type: (raw.type as Bien["type"]) ?? "appartement",
    statut: (raw.statut as Bien["statut"]) ?? "disponible",
    prix: Number(raw.prix ?? raw.price ?? 0),
    prixSuffixe: String(raw.prixSuffixe ?? raw.suffixe ?? "DZD"),
    surface: Number(raw.surface ?? 0),
    pieces: Number(raw.pieces ?? 0),
    chambres: Number(raw.chambres ?? 0),
    localisation: String(raw.localisation ?? raw.quartier ?? raw.ville ?? "Oran"),
    arrondissement: raw.arrondissement ? String(raw.arrondissement) : "",
    description: String(raw.description ?? raw.desc ?? ""),
    images: images.filter(Boolean).map(String),
    plan2d: plans[0],
    plans: plans.filter(Boolean).map(String),
    mapsUrl: raw.mapsUrl ? String(raw.mapsUrl) : undefined,
    url3d: raw.url3d ? String(raw.url3d) : undefined,
    videoUrl: raw.videoUrl ? String(raw.videoUrl) : undefined,
    latitude: raw.latitude ? Number(raw.latitude) : undefined,
    longitude: raw.longitude ? Number(raw.longitude) : undefined,
    features: Array.isArray(raw.features) ? (raw.features as string[]).map(String) : raw.features ? splitLines(String(raw.features)) : [],
    dateAjout: raw.dateAjout ? String(raw.dateAjout) : new Date().toISOString().slice(0, 10),
    vedette: Boolean(raw.vedette),
  };
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as {
    biens?: unknown[];
    csv?: string;
    mode?: "merge" | "replace" | "reseed";
  };

  // Reseed : écrase tout par SEED_BIENS (utile après passage démo → réel)
  if (body.mode === "reseed") {
    await saveBiens([...SEED_BIENS]);
    return NextResponse.json({ ok: true, count: SEED_BIENS.length, mode: "reseed" });
  }

  let incoming: Record<string, unknown>[] = [];
  if (Array.isArray(body.biens) && body.biens.length > 0) {
    incoming = body.biens as Record<string, unknown>[];
  } else if (typeof body.csv === "string" && body.csv.trim().length > 0) {
    // Très simple CSV : header ligne 1, séparateur ; ou ,
    const lines = body.csv.trim().split(/\r?\n/);
    const sep = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ""));
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
      const obj: Record<string, unknown> = {};
      headers.forEach((h, idx) => { obj[h] = cols[idx] ?? ""; });
      // Convertit images/plans en tableaux si cellule contient | ou \n
      if (typeof obj.images === "string" && obj.images.includes("|")) obj.images = (obj.images as string).split("|");
      if (typeof obj.plans === "string" && obj.plans.includes("|")) obj.plans = (obj.plans as string).split("|");
      if (typeof obj.features === "string" && obj.features.includes("|")) obj.features = (obj.features as string).split("|");
      incoming.push(obj);
    }
  } else {
    return NextResponse.json({ error: "Envoyez { biens: Bien[] } ou { csv: string } ou { mode: 'reseed' }" }, { status: 400 });
  }

  const normalized = incoming.map((r, i) => normalizeImported(r, i));
  const existing = await getBiens();
  const mode = body.mode ?? "merge";

  if (mode === "replace") {
    await saveBiens(normalized);
    return NextResponse.json({ ok: true, count: normalized.length, mode });
  }

  // merge : upsert par id/slug
  const byId = new Map(existing.map((b) => [b.id, b]));
  const bySlug = new Map(existing.map((b) => [b.slug, b]));
  for (const b of normalized) {
    if (byId.has(b.id)) byId.set(b.id, b);
    else if (bySlug.has(b.slug)) {
      const old = bySlug.get(b.slug)!;
      byId.set(old.id, { ...b, id: old.id });
    } else byId.set(b.id, b);
  }
  const merged = [...byId.values()];
  await saveBiens(merged);
  return NextResponse.json({ ok: true, count: merged.length, imported: normalized.length, mode });
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  // Export JSON brut pour backup
  const biens = await getBiens();
  return NextResponse.json({ biens, count: biens.length });
}
