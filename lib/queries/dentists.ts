import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Dentist } from "@/lib/types";

export interface DentistPayload {
  name: string;
  specialty: string;
}

export const dentistKeys = {
  all: ["dentists"] as const,
  lists: () => [...dentistKeys.all, "list"] as const,
  details: () => [...dentistKeys.all, "detail"] as const,
  detail: (id: string) => [...dentistKeys.details(), id] as const,
};

export const dentistsApi = {
  list: () => api<Dentist[]>("/dentists"),
  byId: (id: string) => api<Dentist>(`/dentists/${id}`),
  create: (payload: DentistPayload) =>
    api<Dentist>("/dentists", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: DentistPayload) =>
    api<Dentist>(`/dentists/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: string) => api<void>(`/dentists/${id}`, { method: "DELETE" }),
};

export function useDentists() {
  return useQuery({
    queryKey: dentistKeys.lists(),
    queryFn: dentistsApi.list,
    staleTime: 5 * 60_000,
  });
}

export function useDentist(id: string | undefined) {
  return useQuery({
    queryKey: id ? dentistKeys.detail(id) : dentistKeys.details(),
    queryFn: () => dentistsApi.byId(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateDentist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dentistsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dentistKeys.all });
    },
  });
}

export function useUpdateDentist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DentistPayload }) =>
      dentistsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: dentistKeys.lists() });
      qc.invalidateQueries({ queryKey: dentistKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDentist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dentistsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dentistKeys.all });
    },
  });
}
