import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { getBiens, saveBiens, slugify, uid } from "@/lib/store";
import { splitLines } from "@/lib/embed";
import type { Bien } from "@/lib/types";

async function guard(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  const p = await verifyToken(t);
  return p?.role === "admin";
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ biens: await getBiens() });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Partial<Bien> & { imagesText?: string; plansText?: string };
  const biens = await getBiens();
  const images = body.imagesText ? splitLines(body.imagesText) : (body.images ?? []);
  const plans = body.plansText ? splitLines(body.plansText) : (body.plans ?? []);
  const id = body.id && body.id.length > 2 ? String(body.id) : uid("bm");
  const titre = String(body.titre ?? "Bien sans titre");
  const bien: Bien = {
    id,
    slug: String(body.slug ?? slugify(titre)),
    titre,
    type: (body.type as Bien["type"]) ?? "appartement",
    statut: (body.statut as Bien["statut"]) ?? "disponible",
    prix: Number(body.prix ?? 0),
    prixSuffixe: body.prixSuffixe ?? "DZD",
    surface: Number(body.surface ?? 0),
    pieces: Number(body.pieces ?? 0),
    chambres: Number(body.chambres ?? 0),
    localisation: String(body.localisation ?? "Oran"),
    arrondissement: body.arrondissement ?? "",
    description: String(body.description ?? ""),
    images,
    plan2d: plans[0] ?? body.plan2d,
    plans,
    mapsUrl: body.mapsUrl,
    url3d: body.url3d,
    videoUrl: body.videoUrl,
    latitude: body.latitude ? Number(body.latitude) : undefined,
    longitude: body.longitude ? Number(body.longitude) : undefined,
    features: Array.isArray(body.features) ? body.features : body.features ? splitLines(String(body.features)) : [],
    dateAjout: body.dateAjout ? String(body.dateAjout) : new Date().toISOString().slice(0, 10),
    vedette: Boolean(body.vedette),
  };
  const idx = biens.findIndex((b) => b.id === id);
  if (idx >= 0) biens[idx] = bien;
  else biens.unshift(bien);
  await saveBiens(biens);
  return NextResponse.json({ ok: true, bien });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const biens = await getBiens();
  await saveBiens(biens.filter((b) => b.id !== id));
  return NextResponse.json({ ok: true });
}
