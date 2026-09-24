import { NextResponse } from "next/server";
import { getClients, saveClients, uid } from "@/lib/store";
import { hashPassword, signClient, CLIENT_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { nom, email, password } = (await req.json().catch(() => ({}))) as { nom?: string; email?: string; password?: string };
  if (!nom || !email || !password || password.length < 6) {
    return NextResponse.json({ error: "Nom, email valide et mot de passe 6+ requis" }, { status: 400 });
  }
  const clients = await getClients();
  if (clients.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
  }
  const client = { id: uid("cl"), nom, email, passHash: await hashPassword(password), favoris: [], date: new Date().toISOString().slice(0, 10) };
  clients.push(client);
  await saveClients(clients);
  const token = await signClient(client.id, client.email);
  const res = NextResponse.json({ ok: true, client: { id: client.id, nom, email } });
  res.cookies.set(CLIENT_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400 });
  return res;
}
