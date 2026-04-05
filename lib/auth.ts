import { cookies } from "next/headers";
import { createHmac } from "crypto";

const AUTH_COOKIE = "auth_token";

function sign(value: string): string {
  const secret = process.env.AUTH_SECRET!;
  const signature = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${signature}`;
}

function verify(token: string): boolean {
  const secret = process.env.AUTH_SECRET!;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  const expected = createHmac("sha256", secret).update(value).digest("hex");
  return signature === expected;
}

export function setAuthCookie() {
  const token = sign("authenticated");
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

export function isAuthenticated(): boolean {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return false;
  return verify(token);
}

export function removeAuthCookie() {
  cookies().set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
