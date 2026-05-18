import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PageResponse, Patient } from "@/lib/types";

export interface PatientListParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  insurance?: string;
  status?: string;
}

export interface PatientPayload {
  name: string;
  cpf: string;
  phone: string;
  insurance?: string | null;
  email?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  address?: string | null;
}

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: PatientListParams) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  insurances: () => [...patientKeys.all, "insurances"] as const,
};

function buildPatientsQuery(params: PatientListParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 20));
  search.set("sort", params.sort ?? "name,asc");
  if (params.search) search.set("search", params.search);
  if (params.insurance) search.set("insurance", params.insurance);
  if (params.status) search.set("status", params.status);
  return search.toString();
}

export const patientsApi = {
  list: (params: PatientListParams) =>
    api<PageResponse<Patient>>(`/patients?${buildPatientsQuery(params)}`),
  byId: (id: string) => api<Patient>(`/patients/${id}`),
  insurances: () => api<string[]>("/patients/insurances"),
  create: (payload: PatientPayload) =>
    api<Patient>("/patients", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: PatientPayload) =>
    api<Patient>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: string) => api<void>(`/patients/${id}`, { method: "DELETE" }),
};

export function usePatients(params: PatientListParams) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsApi.list(params),
    placeholderData: (previous) => previous,
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: id ? patientKeys.detail(id) : patientKeys.details(),
    queryFn: () => patientsApi.byId(id as string),
    enabled: Boolean(id),
  });
}

export function useInsurances() {
  return useQuery({
    queryKey: patientKeys.insurances(),
    queryFn: patientsApi.insurances,
    staleTime: 5 * 60_000,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatientPayload }) =>
      patientsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: patientKeys.lists() });
      qc.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: patientKeys.insurances() });
    },
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
