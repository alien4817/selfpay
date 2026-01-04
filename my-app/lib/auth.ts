import { jwtVerify } from "jose";

const secret = process.env.AUTH_JWT_SECRET ?? "";
const encoder = new TextEncoder();

export async function verifyToken(token: string) {
  if (!secret) {
    return { valid: false, error: "Missing AUTH_JWT_SECRET" };
  }

  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}

export async function getUserFromToken(token: string) {
  const res = await verifyToken(token);
  if (!res.valid) return null;
  return res.payload;
}

export default verifyToken;
