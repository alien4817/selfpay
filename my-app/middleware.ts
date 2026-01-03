import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 只保護 /admin 路徑
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 只檢查 cookie 是否存在（不驗 JWT）
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
