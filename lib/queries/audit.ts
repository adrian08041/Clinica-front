import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PageResponse } from "@/lib/types";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";

export interface AuditLogResponse {
  id: string;
  entity: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  userName: string;
  summary: string | null;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogDetailResponse extends AuditLogResponse {
  changes: string;
}

export interface AuditLogListParams {
  entity?: string;
  entityId?: string;
  userId?: string;
  action?: AuditAction | "";
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export const auditKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditKeys.all, "list"] as const,
  list: (params: AuditLogListParams) => [...auditKeys.lists(), params] as const,
  details: () => [...auditKeys.all, "detail"] as const,
  detail: (id: string) => [...auditKeys.details(), id] as const,
};

function buildAuditQuery(params: AuditLogListParams): string {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 0));
  search.set("size", String(params.size ?? 25));
  if (params.entity) search.set("entity", params.entity);
  if (params.entityId) search.set("entityId", params.entityId);
  if (params.userId) search.set("userId", params.userId);
  if (params.action) search.set("action", params.action);
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  return search.toString();
}

export const auditApi = {
  list: (params: AuditLogListParams) =>
    api<PageResponse<AuditLogResponse>>(`/audit-logs?${buildAuditQuery(params)}`),
  byId: (id: string) => api<AuditLogDetailResponse>(`/audit-logs/${id}`),
};

export function useAuditLogs(params: AuditLogListParams) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditApi.list(params),
    placeholderData: (previous) => previous,
  });
}

export function useAuditLog(id: string | undefined) {
  return useQuery({
    queryKey: id ? auditKeys.detail(id) : auditKeys.details(),
    queryFn: () => auditApi.byId(id as string),
    enabled: Boolean(id),
  });
}
