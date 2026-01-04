import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
    return NextResponse.json({ message: "帳號或密碼錯誤" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // ⭐ 只設定一個 cookie，不用 JWT
  res.cookies.set("auth_token", "logged_in", {
    httpOnly: true,
    path: "/",
  });

  return res;
}
