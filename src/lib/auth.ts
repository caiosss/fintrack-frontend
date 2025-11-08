export function getToken(): string | null {
  if (typeof window === "undefined") return null; // SSR-safe
  return sessionStorage.getItem("token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("token");
}