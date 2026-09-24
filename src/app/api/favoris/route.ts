import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, CLIENT_COOKIE } from "@/lib/auth";
import { getClients, saveClients } from "@/lib/store";

async function currentId(): Promise<string | null> {
  const jar = await cookies();
  const t = jar.get(CLIENT_COOKIE)?.value;
  if (!t) return null;
  const p = await verifyToken(t);
  return p?.role === "client" && p.sub ? p.sub : null;
}

export async function GET() {
  const id = await currentId();
  if (!id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  const clients = await getClients();
  const c = clients.find((x) => x.id === id);
  return NextResponse.json({ favoris: c?.favoris ?? [] });
}

export async function POST(req: Request) {
  const id = await currentId();
  if (!id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  const { bienId } = (await req.json().catch(() => ({}))) as { bienId?: string };
  if (!bienId) return NextResponse.json({ error: "bienId requis" }, { status: 400 });
  const clients = await getClients();
  const c = clients.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  if (!c.favoris.includes(bienId)) c.favoris.push(bienId);
  await saveClients(clients);
  return NextResponse.json({ ok: true, favoris: c.favoris });
}

export async function DELETE(req: Request) {
  const id = await currentId();
  if (!id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const bienId = searchParams.get("bienId");
  const clients = await getClients();
  const c = clients.find((x) => x.id === id);
  if (!c) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  c.favoris = c.favoris.filter((f) => f !== bienId);
  await saveClients(clients);
  return NextResponse.json({ ok: true, favoris: c.favoris });
}
