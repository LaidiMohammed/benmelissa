import { NextResponse } from "next/server";
import { checkAdminPassword, signAdmin, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@benmelissa.dz";
  if (!email || !password || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }
  const ok = await checkAdminPassword(password);
  if (!ok) return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  const token = await signAdmin(adminEmail);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 3600,
  });
  return res;
}
