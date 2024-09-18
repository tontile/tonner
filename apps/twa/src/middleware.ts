import { updateSession } from "@tonner/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(
    request,
    I18nMiddleware(request),
  );
  const url = request.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostname = request.headers.get("host")!;

  const pathnameLocale = url.pathname.split("/", 2)?.[1];

  // Remove the locale from the pathname
  const pathnameWithoutLocale = url.pathname.slice(pathnameLocale.length + 1);

  const pathnameWithSearchParams = `${pathnameWithoutLocale.endsWith("/") ? pathnameWithoutLocale.slice(0, -1) : pathnameWithoutLocale}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  let newUrl = new URL("/", request.url);

  //if subdomain exists
  const customSubDomain = hostname
    .split(`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    console.log(`Subdomain ${customSubDomain} detected`);
    newUrl = new URL(
      `/${pathnameLocale}/${customSubDomain.slice(0, -1)}${pathnameWithSearchParams}`,
      request.url,
    );
    console.info(`Rewriting URL from ${url.href} to ${newUrl.href}`);
    return NextResponse.rewrite(newUrl, {
      headers: {
        ...request.headers,
        "X-Next-Locale": pathnameLocale,
      },
    });
  }

  if (
    url.pathname === `/${pathnameLocale}/` &&
    url.host === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.info(`Redirecting URL from ${url.href} to ${url.origin}/create`);
    return NextResponse.redirect(`${url.origin}/create`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
