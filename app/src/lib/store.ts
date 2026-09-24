import { promises as fs } from "fs";
import path from "path";
import type { Bien, Lead, Client, SiteSettings } from "./types";
import { SEED_BIENS, SEED_SETTINGS, SEED_LEADS, SEED_CLIENTS } from "./seed";

// Stockage JSON dans data/ + fallback mémoire (hôtes serverless en lecture seule).
const DATA_DIR = path.join(process.cwd(), "data");

const mem: { biens: Bien[] | null; leads: Lead[] | null; clients: Client[] | null; settings: SiteSettings | null } = {
  biens: null,
  leads: null,
  clients: null,
  settings: null,
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Hôte en lecture seule : on ignore, le fallback mémoire prend le relais.
  }
}

function normalizeBien(b: Partial<Bien>, i: number): Bien {
  return {
    id: String(b.id ?? `bien-${i}`),
    slug: String(b.slug ?? `bien-${i}`),
    titre: String(b.titre ?? "Bien sans titre"),
    type: (b.type as Bien["type"]) ?? "appartement",
    statut: (b.statut as Bien["statut"]) ?? "disponible",
    prix: Number(b.prix ?? 0),
    prixSuffixe: b.prixSuffixe ?? "DZD",
    surface: Number(b.surface ?? 0),
    pieces: Number(b.pieces ?? 0),
    chambres: Number(b.chambres ?? 0),
    localisation: String(b.localisation ?? "Oran"),
    arrondissement: b.arrondissement ?? "",
    description: String(b.description ?? ""),
    images: Array.isArray(b.images) ? b.images.filter(Boolean).map(String) : [],
    plan2d: b.plan2d ? String(b.plan2d) : undefined,
    plans: Array.isArray(b.plans) ? b.plans.filter(Boolean).map(String) : [],
    mapsUrl: b.mapsUrl ? String(b.mapsUrl) : undefined,
    url3d: b.url3d ? String(b.url3d) : undefined,
    videoUrl: b.videoUrl ? String(b.videoUrl) : undefined,
    latitude: typeof b.latitude === "number" ? b.latitude : undefined,
    longitude: typeof b.longitude === "number" ? b.longitude : undefined,
    features: Array.isArray(b.features) ? b.features.map(String) : [],
    dateAjout: String(b.dateAjout ?? new Date().toISOString().slice(0, 10)),
    vedette: Boolean(b.vedette),
  };
}

// Migration auto : fusionne les médias seed manquants sans écraser les ajouts admin.
function mergeSeedBiens(stored: Bien[]): Bien[] {
  const byId = new Map(stored.map((b) => [b.id, b]));
  for (const seed of SEED_BIENS) {
    const cur = byId.get(seed.id);
    if (!cur) {
      byId.set(seed.id, seed);
    } else {
      if ((!cur.images || cur.images.length === 0) && seed.images.length > 0) cur.images = seed.images;
      if ((!cur.plans || cur.plans.length === 0) && seed.plans && seed.plans.length > 0) cur.plans = seed.plans;
    }
  }
  return [...byId.values()].map(normalizeBien);
}

export async function getBiens(): Promise<Bien[]> {
  const stored = await readJson<Bien[]>("biens.json", []);
  const base = stored.length > 0 ? stored.map(normalizeBien) : [...SEED_BIENS];
  const merged = mergeSeedBiens(base);
  mem.biens = merged;
  return merged;
}

export async function saveBiens(biens: Bien[]): Promise<void> {
  mem.biens = biens;
  await writeJson("biens.json", biens);
}

export async function getLeads(): Promise<Lead[]> {
  const stored = await readJson<Lead[]>("leads.json", SEED_LEADS);
  mem.leads = stored;
  return stored;
}

export async function saveLeads(leads: Lead[]): Promise<void> {
  mem.leads = leads;
  await writeJson("leads.json", leads);
}

export async function getClients(): Promise<Client[]> {
  const stored = await readJson<Client[]>("clients.json", SEED_CLIENTS);
  mem.clients = stored;
  return stored;
}

export async function saveClients(clients: Client[]): Promise<void> {
  mem.clients = clients;
  await writeJson("clients.json", clients);
}

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readJson<Partial<SiteSettings>>("settings.json", {});
  const merged: SiteSettings = { ...SEED_SETTINGS, ...stored };
  mem.settings = merged;
  return merged;
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  mem.settings = s;
  await writeJson("settings.json", s);
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
