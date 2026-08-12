import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const resultCalculate = request.cookies.get("resultCalculate")?.value;

  // =========================
  // Admin
  // =========================
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    const isLoginAdmin = request.cookies.get("isLogin")?.value === "true";

    if (!isLoginAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // =========================
  // Main Content
  // =========================
  if (pathname.startsWith("/mainContent") && !resultCalculate) {
    return NextResponse.redirect(new URL("/calculateCalories", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/mainContent/:path*", "/admin/:path*"],
};
