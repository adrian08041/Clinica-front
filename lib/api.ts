const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ApiError {
  message: string;
  status: number;
}

export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export function handleUnauthorized(endpoint: string): void {
  if (typeof window === "undefined") return;
  if (endpoint.startsWith("/auth/")) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

function parseJsonResponse<T>(responseText: string, status: number): T {
  const trimmedResponseText = responseText.trim();

  if (!trimmedResponseText) {
    return undefined as T;
  }

  try {
    return JSON.parse(trimmedResponseText) as T;
  } catch {
    throw {
      message: "Resposta inválida do servidor",
      status,
    } satisfies ApiError;
  }
}

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized(endpoint);
    }

    const error: ApiError = {
      message: "Erro ao conectar com o servidor",
      status: response.status,
    };

    try {
      const body = await response.json();
      error.message = body.message || body.error || error.message;
    } catch {
    }

    throw error;
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const responseText = await response.text();
  return parseJsonResponse<T>(responseText, response.status);
}
