import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys } from "@/lib/queries/dashboard";
import type { PageResponse } from "@/lib/types";

export type FinanceStatus = "Pendente" | "Pago" | "Atrasado";
export type FinanceTransactionType = "receita" | "despesa";

export interface FinanceReceivableDTO {
  id: string;
  patientId: string | null;
  patientName: string;
  description: string;
  value: number;
  due: string;
  status: FinanceStatus;
  type: FinanceTransactionType | null;
  method: string | null;
  category: string | null;
  installments: string | null;
  notes: string | null;
  createdAt: string;
}

export interface FinanceStatsDTO {
  revenue: number;
  toReceive: number;
  overdue: number;
  avgTicket: number;
  revenueGrowth: number;
}

export interface RevenueHistoryDTO {
  labels: string[];
  values: number[];
}

export interface PaymentMethodDTO {
  label: string;
  value: number;
  color: string;
}

export interface ReceivablesListParams {
  status?: FinanceStatus | "";
  patientId?: string;
  page?: number;
  size?: number;
}

export interface NewTransactionPayload {
  type: FinanceTransactionType;
  patientId?: string | null;
  patient?: string | null;
  description: string;
  amount: number;
  dueDate: string;
  method?: string | null;
  category?: string | null;
  installments?: string | null;
  notes?: string | null;
}

export const financeKeys = {
  all: ["finance"] as const,
  lists: () => [...financeKeys.all, "list"] as const,
  list: (params: ReceivablesListParams) => [...financeKeys.lists(), params] as const,
  stats: () => [...financeKeys.all, "stats"] as const,
  revenueHistory: (months: number) => [...financeKeys.all, "revenue-history", months] as const,
  paymentMethods: () => [...financeKeys.all, "payment-methods"] as const,
};

function buildReceivablesQuery(params: ReceivablesListParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 10));
  if (params.status) search.set("status", params.status);
  if (params.patientId) search.set("patientId", params.patientId);
  return search.toString();
}

export const financeApi = {
  listReceivables: (params: ReceivablesListParams) =>
    api<PageResponse<FinanceReceivableDTO>>(`/finance/receivables?${buildReceivablesQuery(params)}`),
  stats: () => api<FinanceStatsDTO>("/finance/stats"),
  revenueHistory: (months: number) =>
    api<RevenueHistoryDTO>(`/finance/revenue-history?months=${months}`),
  paymentMethods: () => api<PaymentMethodDTO[]>("/finance/payment-methods"),
  createTransaction: (payload: NewTransactionPayload) =>
    api<FinanceReceivableDTO>("/finance/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: string, status: FinanceStatus) =>
    api<FinanceReceivableDTO>(`/finance/transactions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteTransaction: (id: string) =>
    api<void>(`/finance/transactions/${id}`, { method: "DELETE" }),
};

export function useReceivables(params: ReceivablesListParams) {
  return useQuery({
    queryKey: financeKeys.list(params),
    queryFn: () => financeApi.listReceivables(params),
    placeholderData: (previous) => previous,
  });
}

export function useFinanceStats() {
  return useQuery({
    queryKey: financeKeys.stats(),
    queryFn: financeApi.stats,
  });
}

export function useRevenueHistory(months: number = 6) {
  return useQuery({
    queryKey: financeKeys.revenueHistory(months),
    queryFn: () => financeApi.revenueHistory(months),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: financeKeys.paymentMethods(),
    queryFn: financeApi.paymentMethods,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateTransactionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FinanceStatus }) =>
      financeApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: financeApi.deleteTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: financeKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function nextStatus(status: FinanceStatus): FinanceStatus {
  return status === "Pago" ? "Pendente" : "Pago";
}
