import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/store";

async function guard(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  const p = await verifyToken(t);
  return p?.role === "admin";
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json({ settings: await getSettings() });
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const cur = await getSettings();
  const { heroMp4, heroYoutube, ...rest } = body as Record<string, string>;
  const next = { ...cur, ...rest };
  if (typeof heroMp4 === "string" || typeof heroYoutube === "string") {
    next.heroVideos = [
      {
        ville: cur.heroVideos?.[0]?.ville ?? "Oran",
        mp4: typeof heroMp4 === "string" ? heroMp4 : (cur.heroVideos?.[0]?.mp4 ?? ""),
        poster: cur.heroVideos?.[0]?.poster ?? "/hero-oran-poster.jpg",
        youtube: typeof heroYoutube === "string" ? heroYoutube : (cur.heroVideos?.[0]?.youtube ?? ""),
      },
    ];
  }
  await saveSettings(next);
  return NextResponse.json({ ok: true, settings: next });
}
