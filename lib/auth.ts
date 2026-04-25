import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function createToken(byteLength = 24): string {
  return randomBytes(byteLength).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyToken(token: string | null | undefined, tokenHash: string): boolean {
  if (!token) {
    return false;
  }

  const candidate = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(tokenHash, "hex");

  if (candidate.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(candidate, expected);
}

export function assertCreatePassword(password: string | null | undefined): boolean {
  const configured = process.env.ADMIN_CREATE_PASSWORD;
  if (!configured || configured === "change-me") {
    return true;
  }

  return password === configured;
}
