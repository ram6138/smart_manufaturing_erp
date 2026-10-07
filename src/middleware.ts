import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";

const ROLE_ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/settings": ["Admin", "Factory Manager"],
  "/finance": ["Admin", "Factory Manager", "Finance Manager"],
  "/machines": ["Admin", "Factory Manager", "Production Manager", "Maintenance Manager"],
  "/quality": ["Admin", "Factory Manager", "Production Manager", "Quality Manager"],
  "/procurement": ["Admin", "Factory Manager", "Procurement Manager", "Inventory Manager", "Finance Manager"],
  "/workforce": ["Admin", "Factory Manager", "HR Manager", "Production Manager"],
  "/production": ["Admin", "Factory Manager", "Production Manager", "Maintenance Manager", "Quality Manager"],
  "/inventory": ["Admin", "Factory Manager", "Production Manager", "Inventory Manager", "Procurement Manager", "Finance Manager"],
  "/orders": ["Admin", "Factory Manager", "Production Manager", "Inventory Manager", "Procurement Manager", "Finance Manager", "Quality Manager"],
  "/dashboard": [
    "Admin",
    "Factory Manager",
    "Production Manager",
    "Inventory Manager",
    "Maintenance Manager",
    "Quality Manager",
    "Procurement Manager",
    "HR Manager",
    "Finance Manager",
  ],
  "/reports": [
    "Admin",
    "Factory Manager",
    "Production Manager",
    "Inventory Manager",
    "Maintenance Manager",
    "Quality Manager",
    "Procurement Manager",
    "HR Manager",
    "Finance Manager",
  ],
  "/ai-insights": [
    "Admin",
    "Factory Manager",
    "Production Manager",
    "Inventory Manager",
    "Maintenance Manager",
    "Quality Manager",
    "Finance Manager",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  let isAuthenticated = false;
  let userRole = "Admin";

  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed?.token && parsed?.expiresAt) {
        if (new Date(parsed.expiresAt) > new Date()) {
          isAuthenticated = true;
          userRole = parsed.role || "Admin";
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Auth redirection for protected routes
  const matchedRoute = Object.keys(ROLE_ROUTE_PERMISSIONS).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (matchedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Role-Based Access Guard (403 Unauthorized redirect if role is disallowed)
    const allowedRoles = ROLE_ROUTE_PERMISSIONS[matchedRoute];
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // 3. Auth pages check (e.g. /login or /) -> if already logged in, redirect to /dashboard
  if (pathname === "/login" || pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/production/:path*",
    "/orders/:path*",
    "/inventory/:path*",
    "/machines/:path*",
    "/quality/:path*",
    "/procurement/:path*",
    "/workforce/:path*",
    "/finance/:path*",
    "/ai-insights/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/unauthorized",
  ],
};
