import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getClients } from "@/lib/store";
import { signClient, CLIENT_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const clients = await getClients();
  const client = clients.find((c) => c.email.toLowerCase() === (email ?? "").toLowerCase());
  if (!client || !password || !(await bcrypt.compare(password, client.passHash))) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }
  const token = await signClient(client.id, client.email);
  const res = NextResponse.json({ ok: true, client: { id: client.id, nom: client.nom, email: client.email } });
  res.cookies.set(CLIENT_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400 });
  return res;
}
