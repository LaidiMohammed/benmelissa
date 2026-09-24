import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { getLeads, saveLeads } from "@/lib/store";

async function guard(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  const p = await verifyToken(t);
  return p?.role === "admin";
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ leads: await getLeads() });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id, etape } = (await req.json().catch(() => ({}))) as { id?: string; etape?: string };
  const leads = await getLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  lead.etape = (etape as typeof lead.etape) ?? lead.etape;
  await saveLeads(leads);
  return NextResponse.json({ ok: true, lead });
}
