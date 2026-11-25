// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const adminPattern = /^\/[a-z]{2}\/admin/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (adminPattern.test(pathname) && !pathname.includes("/admin/login")) {
    const sessionToken = request.cookies.get("sfg_admin_token")?.value;

    if (!sessionToken) {
      const segments = pathname.split("/");
      const locale = ["gu", "hi", "en"].includes(segments[1]) ? segments[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|products|demo|favicon.ico|.*\\..*).*)",
  ],
};
