/**
 * Client-side auth session — access token in sessionStorage.
 * Swagger: POST /users/login returns { data: { accessToken, user } }.
 * Token is cleared on tab close; use for "already logged in" redirect.
 */

const TOKEN_KEY = "fintect_access_token";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getToken(): string | null {
  if (!isClient()) return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (!isClient()) return;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken(): void {
  if (!isClient()) return;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return typeof token === "string" && token.length > 0;
}
