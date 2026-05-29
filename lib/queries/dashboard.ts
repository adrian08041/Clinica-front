import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardAlert } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types mirroring backend DTOs (com.odontoflow.dto.response.*)
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  appointmentsToday: number;
  confirmed: number;
  revenue: number;
  newPatients: number;
  growthPercentages: {
    revenue?: number;
    newPatients?: number;
  };
}

export interface DashboardAppointmentResponse {
  id: string;
  patientName: string;
  dentistName: string | null;
  date: string;
  time: string;
  duration: number | null;
  procedure: string | null;
  status: string;
}

export interface DashboardGoals {
  revenueGoal: number;
  revenueActual: number;
  treatmentGoal: number;
  treatmentActual: number;
}

export interface DashboardAlertApi {
  id: string;
  type: string;
  severity: string;
  title: string;
  count: number;
  actionUrl: string;
}

export interface WeeklyChartApi {
  labels: string[];
  data: number[];
}

// ---------------------------------------------------------------------------
// Query key factory
// ---------------------------------------------------------------------------

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  todayAgenda: () => [...dashboardKeys.all, "today-agenda"] as const,
  goals: () => [...dashboardKeys.all, "goals"] as const,
  alerts: () => [...dashboardKeys.all, "alerts"] as const,
  weeklyChart: () => [...dashboardKeys.all, "weekly-chart"] as const,
};

// ---------------------------------------------------------------------------
// API object
// ---------------------------------------------------------------------------

export const dashboardApi = {
  summary: () => api<DashboardSummary>("/dashboard/summary"),
  todayAgenda: () => api<DashboardAppointmentResponse[]>("/dashboard/today-agenda"),
  goals: () => api<DashboardGoals>("/dashboard/goals"),
  alerts: () => api<DashboardAlertApi[]>("/dashboard/alerts"),
  weeklyChart: () => api<WeeklyChartApi>("/dashboard/weekly-chart"),
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

const STALE_TIME = 60_000;

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardApi.summary,
    staleTime: STALE_TIME,
  });
}

export function useTodayAgenda() {
  return useQuery({
    queryKey: dashboardKeys.todayAgenda(),
    queryFn: dashboardApi.todayAgenda,
    staleTime: STALE_TIME,
  });
}

export function useGoals() {
  return useQuery({
    queryKey: dashboardKeys.goals(),
    queryFn: dashboardApi.goals,
    staleTime: STALE_TIME,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: dashboardApi.alerts,
    staleTime: STALE_TIME,
  });
}

export function useWeeklyChart() {
  return useQuery({
    queryKey: dashboardKeys.weeklyChart(),
    queryFn: dashboardApi.weeklyChart,
    staleTime: STALE_TIME,
  });
}

// ---------------------------------------------------------------------------
// Mapping helpers (backend → frontend UI types)
// ---------------------------------------------------------------------------

const ALERT_VARIANT_MAP: Record<string, DashboardAlert["variant"]> = {
  warning: "warning",
  danger: "danger",
  success: "success",
  info: "warning",
};

const ALERT_ICON_MAP: Record<string, string> = {
  unconfirmed_patients: "AlertCircle",
  overdue_payments: "CreditCard",
  birthday: "Gift",
  pending_returns: "AlertCircle",
  overdue_treatments: "AlertCircle",
};

export function mapApiAlerts(alerts: DashboardAlertApi[] | undefined): DashboardAlert[] {
  if (!alerts) return [];
  return alerts.map((alert) => ({
    id: alert.id,
    message: alert.title,
    variant: ALERT_VARIANT_MAP[alert.severity] ?? "warning",
    iconName: ALERT_ICON_MAP[alert.type] ?? "AlertCircle",
    actionUrl: alert.actionUrl,
  }));
}
