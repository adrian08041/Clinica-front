export type UserRole = "ADMIN" | "RECEPCIONISTA" | "DENTISTA";

export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  initials?: string;
  avatarUrl?: string | null;
}

export const USER_UPDATED_EVENT = "auth:user-updated";

// Cache da leitura do localStorage. Mantém referência estável entre chamadas
// (requisito do useSyncExternalStore) e só é invalidado quando o user muda.
let userCache: StoredUser | null = null;
let cacheReady = false;

function readUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getStoredUser(): StoredUser | null {
  if (!cacheReady) {
    userCache = readUser();
    cacheReady = true;
  }
  return userCache;
}

/** Grava o user no localStorage e notifica os assinantes (header/sidebar). */
export function setStoredUser(user: StoredUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
  userCache = user;
  cacheReady = true;
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

/** Assina mudanças no user logado. Usado com useSyncExternalStore. */
export function subscribeUser(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    cacheReady = false;
    userCache = null;
    callback();
  };
  window.addEventListener(USER_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(USER_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getCurrentRole(): UserRole | null {
  return getStoredUser()?.role ?? null;
}

export function isAdmin(): boolean {
  return getCurrentRole() === "ADMIN";
}
