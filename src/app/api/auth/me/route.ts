import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, CLIENT_COOKIE } from "@/lib/auth";
import { getClients } from "@/lib/store";

export async function GET() {
  const jar = await cookies();
  const t = jar.get(CLIENT_COOKIE)?.value;
  if (!t) return NextResponse.json({ client: null });
  const p = await verifyToken(t);
  if (!p || p.role !== "client") return NextResponse.json({ client: null });
  const clients = await getClients();
  const c = clients.find((x) => x.id === p.sub);
  if (!c) return NextResponse.json({ client: null });
  return NextResponse.json({ client: { id: c.id, nom: c.nom, email: c.email, favoris: c.favoris } });
}

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CLIENT_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
