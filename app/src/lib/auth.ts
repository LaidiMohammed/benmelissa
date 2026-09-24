import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = () => {
  const s = process.env.JWT_SECRET ?? "dev-secret-change-me-32-chars-minimum!!";
  return new TextEncoder().encode(s);
};

export async function signAdmin(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}

export async function signClient(id: string, email: string): Promise<string> {
  return new SignJWT({ sub: id, email, role: "client" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<{ role?: string; email?: string; sub?: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { role?: string; email?: string; sub?: string };
  } catch {
    return null;
  }
}

// Piège .env documenté : Next.js étend les $ dans les fichiers .env,
// un hash bcrypt ($2b$…) arrive TRONQUÉ. On stocke donc
// ADMIN_PASSWORD_HASH_B64 (base64, aucun $) et on décode à l'exécution.
export function getAdminHash(): string {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64 ?? "";
  if (!b64) return "";
  try {
    return Buffer.from(b64.trim(), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

export async function checkAdminPassword(plain: string): Promise<boolean> {
  const hash = getAdminHash();
  if (!hash) return false;
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export const ADMIN_COOKIE = "bmp_token";
export const CLIENT_COOKIE = "bmp_client";
