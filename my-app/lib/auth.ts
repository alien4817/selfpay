import { SignJWT, jwtVerify } from "jose";
import { JwtPayload } from "jose";

// 驗證環境變數是否存在
const authSecret = process.env.AUTH_JWT_SECRET;
if (!authSecret) {
  throw new Error("AUTH_JWT_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(authSecret);

// 定義 Token Payload 的類型
export interface TokenPayload extends JwtPayload {
  userId?: string;
  email?: string;
  [key: string]: any;
}

// 簽發 token
export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
}

// 驗證 token
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    throw new Error(`Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}