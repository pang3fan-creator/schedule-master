import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n/request";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

const isApiRoute = createRouteMatcher(["/(api|trpc)(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  // Apply intl middleware and get response
  const response = intlMiddleware(req);

  // Set x-locale header for RootLayout to use for lang attribute
  // Extract locale from pathname (e.g., /es/privacy -> es)
  const pathname = req.nextUrl.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;
  response.headers.set("x-locale", locale);

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt|json)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
