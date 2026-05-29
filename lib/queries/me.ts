import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleUnauthorized, API_URL } from "@/lib/api";
import { getStoredUser, setStoredUser } from "@/lib/utils/auth";

// ---------- Types ----------

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl: string | null;
}

export interface UpdateMePayload {
  name: string;
  email: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// PUT /me reemite o token (JWT carrega name/email)
interface AuthLikeResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatarUrl: string | null;
}

// ---------- Keys ----------

export const meKeys = {
  all: ["me"] as const,
};

// ---------- localStorage sync ----------

function syncStoredUser(data: { id: string; name: string; email: string; role: string; initials: string; avatarUrl: string | null }) {
  if (typeof window === "undefined") return;
  const current = getStoredUser() ?? {};
  setStoredUser({
    ...current,
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as never,
    initials: data.initials,
    avatarUrl: data.avatarUrl,
  });
}

async function avatarMultipart(method: "POST", file: File): Promise<MeResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/me/avatar`, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized("/me/avatar");
    }
    let message = "Erro ao enviar a foto";
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // ignore
    }
    throw { message, status: response.status };
  }

  return (await response.json()) as MeResponse;
}

// ---------- API ----------

export const meApi = {
  get: () => api<MeResponse>("/me"),
  update: (payload: UpdateMePayload) =>
    api<AuthLikeResponse>("/me", { method: "PUT", body: JSON.stringify(payload) }),
  updatePassword: (payload: UpdatePasswordPayload) =>
    api<{ message: string }>("/me/password", { method: "PUT", body: JSON.stringify(payload) }),
  uploadAvatar: (file: File) => avatarMultipart("POST", file),
  deleteAvatar: () => api<MeResponse>("/me/avatar", { method: "DELETE" }),
};

// ---------- Hooks ----------

export function useMe() {
  return useQuery({
    queryKey: meKeys.all,
    queryFn: meApi.get,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: meApi.update,
    onSuccess: (data) => {
      // PUT /me reemite o token — substitui token + user no localStorage.
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      syncStoredUser(data);
      qc.invalidateQueries({ queryKey: meKeys.all });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: meApi.updatePassword,
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: meApi.uploadAvatar,
    onSuccess: (data) => {
      syncStoredUser(data);
      qc.invalidateQueries({ queryKey: meKeys.all });
    },
  });
}

export function useDeleteAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: meApi.deleteAvatar,
    onSuccess: (data) => {
      syncStoredUser(data);
      qc.invalidateQueries({ queryKey: meKeys.all });
    },
  });
}
