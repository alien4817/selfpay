import { NextResponse } from "next/server";
import { signAuthToken } from "../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body ?? {};

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = signAuthToken({ user: username });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12
    });
    return res;
  }

  return NextResponse.json({ ok: false, message: "帳號或密碼錯誤" }, { status: 401 });
}
