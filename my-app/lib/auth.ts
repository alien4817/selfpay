import { SignJWT, jwtVerify } from "jose";

// 驗證環境變數是否存在
const authSecret = process.env.AUTH_JWT_SECRET;
if (!authSecret) {
  throw new Error("AUTH_JWT_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(authSecret);

// 定義 Token Payload 的類型（不依賴 jose 的 JwtPayload）
export interface TokenPayload {
  userId?: string;
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

// 簽發 token
export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

// 驗證 token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
