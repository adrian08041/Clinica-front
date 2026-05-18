import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { dashboardKeys } from "@/lib/queries/dashboard";
import type { Appointment, AppointmentType, Dentist, Patient } from "@/lib/types";

// ── Backend-shape types (match Java DTOs exactly) ──────────────────────────

export type BackendAppointmentType =
  | "EVALUATION"
  | "CLEANING"
  | "PROCEDURE"
  | "RETURN"
  | "URGENCY";

export interface BackendAppointment {
  id: string;
  patient: Patient | null;
  patientName: string;
  dentist: Dentist | null;
  date: string; // ISO date "YYYY-MM-DD"
  time: string; // "HH:mm"
  duration: number;
  type: BackendAppointmentType;
  procedure: string;
  observations?: string | null;
  patientSince?: string | null;
  status: string;
  createdAt: string;
  deletedAt?: string | null;
}

// ── Request payload types (mirror back DTOs) ───────────────────────────────

export interface AppointmentRequestPayload {
  patientId: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number;
  type: BackendAppointmentType;
  procedure: string;
  observations?: string | null;
  patientSince?: string | null;
  status?: string | null;
}

export interface RescheduleRequestPayload {
  date: string;
  time: string;
}

export interface StatusUpdateRequestPayload {
  status: string;
}

// ── List filters ──────────────────────────────────────────────────────────

export interface AppointmentListParams {
  startDate?: string;
  endDate?: string;
  dentistId?: string;
}

// ── Adapter to front shape ────────────────────────────────────────────────

const TYPE_MAP_TO_FRONT: Record<BackendAppointmentType, AppointmentType> = {
  EVALUATION: "evaluation",
  CLEANING: "cleaning",
  PROCEDURE: "procedure",
  RETURN: "return",
  URGENCY: "urgency",
};

export const TYPE_MAP_TO_BACK: Record<AppointmentType, BackendAppointmentType> = {
  evaluation: "EVALUATION",
  cleaning: "CLEANING",
  procedure: "PROCEDURE",
  return: "RETURN",
  urgency: "URGENCY",
};

/**
 * Adapter: aligns backend Appointment shape with the front `Appointment` type
 * used across agenda components (lowercase type, flat dentistId, etc).
 */
export function toAppointment(raw: BackendAppointment): Appointment {
  return {
    id: raw.id,
    patientName: raw.patientName,
    dentistId: raw.dentist?.id ?? "",
    date: raw.date,
    time: raw.time,
    duration: raw.duration,
    type: TYPE_MAP_TO_FRONT[raw.type],
    procedure: raw.procedure,
    observations: raw.observations ?? undefined,
    patientSince: raw.patientSince ?? undefined,
  };
}

// ── Query keys ────────────────────────────────────────────────────────────

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (params: AppointmentListParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
};

function buildAppointmentsQuery(params: AppointmentListParams) {
  const search = new URLSearchParams();
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.dentistId) search.set("dentistId", params.dentistId);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// ── API ───────────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: (params: AppointmentListParams) =>
    api<BackendAppointment[]>(`/appointments${buildAppointmentsQuery(params)}`),
  byId: (id: string) => api<BackendAppointment>(`/appointments/${id}`),
  create: (payload: AppointmentRequestPayload) =>
    api<BackendAppointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: AppointmentRequestPayload) =>
    api<BackendAppointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  reschedule: (id: string, payload: RescheduleRequestPayload) =>
    api<BackendAppointment>(`/appointments/${id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: string, payload: StatusUpdateRequestPayload) =>
    api<BackendAppointment>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id: string) => api<void>(`/appointments/${id}`, { method: "DELETE" }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useAppointments(params: AppointmentListParams = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: async () => {
      const list = await appointmentsApi.list(params);
      return list.map(toAppointment);
    },
    placeholderData: (previous) => previous,
  });
}

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: id ? appointmentKeys.detail(id) : appointmentKeys.details(),
    queryFn: async () => toAppointment(await appointmentsApi.byId(id as string)),
    enabled: Boolean(id),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AppointmentRequestPayload }) =>
      appointmentsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RescheduleRequestPayload }) =>
      appointmentsApi.reschedule(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StatusUpdateRequestPayload }) =>
      appointmentsApi.updateStatus(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appointmentKeys.all });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
