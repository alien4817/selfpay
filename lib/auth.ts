import jwt from "jsonwebtoken";

const secret = process.env.AUTH_JWT_SECRET!;

export function signAuthToken(payload: { user: string }) {
  return jwt.sign(payload, secret, { expiresIn: "12h" });
}

export function verifyAuthToken(token: string) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}
