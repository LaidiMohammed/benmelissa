import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function roleOf(token: string | undefined, secret: string): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.JWT_SECRET ?? "dev-secret-change-me-32-chars-minimum!!";
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const role = await roleOf(req.cookies.get("bmp_token")?.value, secret);
    if (role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url, 307);
    }
  }
  if (pathname.startsWith("/compte")) {
    const role = await roleOf(req.cookies.get("bmp_client")?.value, secret);
    if (role !== "client") {
      const url = req.nextUrl.clone();
      url.pathname = "/connexion";
      return NextResponse.redirect(url, 307);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
