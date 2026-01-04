import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  
  if (!authToken || authToken !== "logged_in") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// 只對非登入頁面和 API 路由執行 middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};