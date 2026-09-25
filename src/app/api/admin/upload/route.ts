import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

async function guard(): Promise<boolean> {
  const jar = await cookies();
  const t = jar.get(ADMIN_COOKIE)?.value;
  if (!t) return false;
  const p = await verifyToken(t);
  return p?.role === "admin";
}

export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const form = await req.formData();
  const files = form.getAll("files");
  const quartier = form.get("quartier") ? String(form.get("quartier")) : "";
  const kind = form.get("kind") ? String(form.get("kind")) : "projet"; // projet | plan | quartier
  if (files.length === 0) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const out: string[] = [];
  for (const f of files) {
    if (!(f instanceof File)) continue;
    const buf = Buffer.from(await f.arrayBuffer());
    const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "upload.jpg";
    const ext = path.extname(safe) || ".jpg";
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`;
    let dir: string;
    if (kind === "quartier" && quartier) dir = path.join(process.cwd(), "public", "q");
    else if (kind === "plan") dir = path.join(process.cwd(), "public", "plans");
    else dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, base), buf);
    const url = kind === "quartier" ? `/q/${base}` : kind === "plan" ? `/plans/${base}` : `/uploads/${base}`;
    out.push(url);
  }
  return NextResponse.json({ ok: true, urls: out });
}
