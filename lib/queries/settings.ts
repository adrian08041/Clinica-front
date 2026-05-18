import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// ---------- Types ----------

export interface ClinicResponse {
  id: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  email: string;
  website: string | null;
  logoUrl: string | null;
}

export interface ClinicPayload {
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  email: string;
  website?: string | null;
  logoUrl?: string | null;
}

export interface ClinicHourEntry {
  label: string;
  active: boolean;
  start: string | null;
  end: string | null;
}

export interface HoursResponse {
  dias: ClinicHourEntry[];
  duracaoConsulta: string;
  intervalo: string;
}

export interface HoursPayload {
  dias: ClinicHourEntry[];
  duracaoConsulta: string;
  intervalo: string;
}

export interface InsuranceResponse {
  id: string;
  name: string;
  code: string | null;
  type: string | null;
  discount: string | null;
  status: string;
}

export interface InsurancePayload {
  name: string;
  code?: string | null;
  type?: string | null;
  discount?: string | null;
  status?: string | null;
}

export interface LogoUploadResponse {
  logoUrl: string;
}

// ---------- Keys ----------

export const settingsKeys = {
  all: ["settings"] as const,
  clinic: () => [...settingsKeys.all, "clinic"] as const,
  hours: () => [...settingsKeys.all, "hours"] as const,
  insurances: {
    all: () => [...settingsKeys.all, "insurances"] as const,
    list: () => [...settingsKeys.all, "insurances", "list"] as const,
  },
};

// ---------- API ----------

async function uploadLogoRequest(file: File): Promise<LogoUploadResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/settings/clinic/logo`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Erro ao enviar o logo";
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // ignore
    }
    throw { message, status: response.status };
  }

  return (await response.json()) as LogoUploadResponse;
}

export const settingsApi = {
  getClinic: () => api<ClinicResponse>("/settings/clinic"),
  updateClinic: (payload: ClinicPayload) =>
    api<ClinicResponse>("/settings/clinic", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  uploadLogo: (file: File) => uploadLogoRequest(file),

  getHours: () => api<HoursResponse>("/settings/hours"),
  updateHours: (payload: HoursPayload) =>
    api<HoursResponse>("/settings/hours", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  listInsurances: () => api<InsuranceResponse[]>("/settings/insurances"),
  createInsurance: (payload: InsurancePayload) =>
    api<InsuranceResponse>("/settings/insurances", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateInsurance: (id: string, payload: InsurancePayload) =>
    api<InsuranceResponse>(`/settings/insurances/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteInsurance: (id: string) =>
    api<void>(`/settings/insurances/${id}`, { method: "DELETE" }),
};

// ---------- Hooks ----------

export function useClinic() {
  return useQuery({
    queryKey: settingsKeys.clinic(),
    queryFn: settingsApi.getClinic,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateClinic,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.clinic() });
    },
  });
}

export function useUploadLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.uploadLogo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.clinic() });
    },
  });
}

export function useHours() {
  return useQuery({
    queryKey: settingsKeys.hours(),
    queryFn: settingsApi.getHours,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateHours,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.hours() });
    },
  });
}

export function useInsurances() {
  return useQuery({
    queryKey: settingsKeys.insurances.list(),
    queryFn: settingsApi.listInsurances,
    staleTime: 5 * 60_000,
  });
}

export function useCreateInsurance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.createInsurance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.insurances.all() });
    },
  });
}

export function useUpdateInsurance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InsurancePayload }) =>
      settingsApi.updateInsurance(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.insurances.all() });
    },
  });
}

export function useDeleteInsurance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.deleteInsurance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingsKeys.insurances.all() });
    },
  });
}
