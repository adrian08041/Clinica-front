import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys } from "@/lib/queries/dashboard";
import type { PageResponse } from "@/lib/types";

export interface TreatmentListParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface TreatmentProcedureRequest {
  /** Preserva o UUID do procedimento ao fazer merge no PUT. */
  id?: string;
  tooth?: string | null;
  name: string;
  value: number;
  paid?: boolean;
  done?: boolean;
}

export interface TreatmentPlanRequest {
  /** Opcional — se enviado, vincula a um paciente cadastrado. */
  patientId?: string | null;
  /** Fallback texto livre quando não há paciente cadastrado. */
  patient?: string | null;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  notes?: string | null;
  procedures: TreatmentProcedureRequest[];
}

export interface TreatmentProcedureResponse {
  id: string;
  tooth: string | null;
  name: string;
  value: number;
  paid: boolean;
  done: boolean;
}

export interface TreatmentPlanResponse {
  id: string;
  patientId: string | null;
  patientName: string | null;
  title: string;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  total: number;
  completed: number;
  totalProcedures: number;
  createdAt: string;
  procedures: TreatmentProcedureResponse[];
}

export const treatmentKeys = {
  all: ["treatments"] as const,
  lists: () => [...treatmentKeys.all, "list"] as const,
  list: (params: TreatmentListParams) => [...treatmentKeys.lists(), params] as const,
  details: () => [...treatmentKeys.all, "detail"] as const,
  detail: (id: string) => [...treatmentKeys.details(), id] as const,
};

function buildTreatmentsQuery(params: TreatmentListParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 10));
  if (params.search) search.set("search", params.search);
  return search.toString();
}

export const treatmentsApi = {
  list: (params: TreatmentListParams) =>
    api<PageResponse<TreatmentPlanResponse>>(`/treatments?${buildTreatmentsQuery(params)}`),
  byId: (id: string) => api<TreatmentPlanResponse>(`/treatments/${id}`),
  create: (payload: TreatmentPlanRequest) =>
    api<TreatmentPlanResponse>("/treatments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: TreatmentPlanRequest) =>
    api<TreatmentPlanResponse>(`/treatments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  approveStep: (id: string) =>
    api<TreatmentPlanResponse>(`/treatments/${id}/approve-step`, { method: "PATCH" }),
  remove: (id: string) => api<void>(`/treatments/${id}`, { method: "DELETE" }),
};

export function useTreatments(params: TreatmentListParams) {
  return useQuery({
    queryKey: treatmentKeys.list(params),
    queryFn: () => treatmentsApi.list(params),
    placeholderData: (previous) => previous,
  });
}

export function useTreatment(id: string | undefined) {
  return useQuery({
    queryKey: id ? treatmentKeys.detail(id) : treatmentKeys.details(),
    queryFn: () => treatmentsApi.byId(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: treatmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treatmentKeys.all });
    },
  });
}

export function useUpdateTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TreatmentPlanRequest }) =>
      treatmentsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: treatmentKeys.lists() });
      qc.invalidateQueries({ queryKey: treatmentKeys.detail(variables.id) });
    },
  });
}

export function useApproveStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: treatmentsApi.approveStep,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: treatmentKeys.lists() });
      qc.invalidateQueries({ queryKey: treatmentKeys.detail(id) });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteTreatment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: treatmentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: treatmentKeys.all });
    },
  });
}
