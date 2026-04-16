import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyAuth(token);

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (pathname.startsWith("/student") && payload.role !== "STUDENT") {
      if (payload.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/exam/:path*", "/api/:path*"],
};
