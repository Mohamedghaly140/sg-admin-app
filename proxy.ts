import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/account-disabled"];
const ADMIN_ONLY_ROUTES = ["/", "/analytics", "/staff-users"];

type Role = "USER" | "MANAGER" | "ADMIN";
type SessionClaimsWithRole = {
  publicMetadata?: {
    role?: Role;
  };
};

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((route) => matchesRoute(pathname, route))) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims as SessionClaimsWithRole | null | undefined)
    ?.publicMetadata?.role;

  // Anything that isn't staff (MANAGER/ADMIN) — including USER, undefined,
  // or a malformed value — gets the access-denied screen everywhere.
  if (role !== "MANAGER" && role !== "ADMIN") {
    if (pathname !== "/access-denied") {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }
    return NextResponse.next();
  }

  // MANAGERs are redirected off ADMIN-only routes.
  const isAdminOnly = ADMIN_ONLY_ROUTES.some((route) => matchesRoute(pathname, route));
  if (isAdminOnly && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/orders", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
