import type { User } from "@repo/types";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin";
}

export function logout(): void {
  removeToken();
  removeUser();
}
