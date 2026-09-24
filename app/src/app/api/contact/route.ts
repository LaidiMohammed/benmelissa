import { NextResponse } from "next/server";
import { getLeads, saveLeads, uid } from "@/lib/store";

export async function POST(req: Request) {
  const { nom, email, telephone, message, bienId } = (await req.json().catch(() => ({}))) as {
    nom?: string; email?: string; telephone?: string; message?: string; bienId?: string;
  };
  if (!nom || !telephone || !message) {
    return NextResponse.json({ error: "Nom, téléphone et message requis" }, { status: 400 });
  }
  const leads = await getLeads();
  const lead = {
    id: uid("lead"),
    nom,
    email: email ?? "",
    telephone,
    message,
    bienId,
    etape: "nouveau" as const,
    date: new Date().toISOString().slice(0, 10),
  };
  leads.unshift(lead);
  await saveLeads(leads);
  return NextResponse.json({ ok: true });
}
