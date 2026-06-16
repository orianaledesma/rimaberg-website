import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin/session";

/**
 * Gate the /admin area behind the shared-password session. Unauthenticated
 * requests are bounced to /admin/login (with a `next` param so we can return
 * them where they were headed). The login page itself stays public.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyToken(token, Date.now());
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Run on every /admin route (the login exclusion is handled above).
  matcher: ["/admin/:path*"],
};
