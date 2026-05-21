"use client";

import { useMemo } from "react";
import {
  CalendarCheck,
  CheckCircle,
  DollarSign,
  Users,
  type LucideIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TodayScheduleTable } from "@/components/dashboard/today-schedule-table";
import { GoalsSection } from "@/components/dashboard/goals-section";
import { NewRecordCta } from "@/components/dashboard/new-record-cta";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  mapApiAlerts,
  useAlerts,
  useDashboardSummary,
  useGoals,
  useTodayAgenda,
  useWeeklyChart,
} from "@/lib/queries/dashboard";
import type {
  DashboardStat,
  GoalProgress,
  ScheduleEntry,
  ScheduleStatus,
  WeeklyChartBar,
} from "@/lib/types";

const STAT_ICONS: Record<string, LucideIcon> = {
  CalendarCheck,
  CheckCircle,
  DollarSign,
  Users,
};

const APPOINTMENT_STATUS_MAP: Record<string, ScheduleStatus> = {
  Confirmado: "confirmed",
  Pendente: "pending",
  Cancelado: "cancelled",
};

const WEEKDAY_VARIANTS: WeeklyChartBar["variant"][] = [
  "primary",
  "dark",
  "primary",
  "accent",
  "primary",
  "dark",
  "primary",
];

const WEEKLY_CHART_MAX = 20;

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function formatGrowth(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return "0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function buildStats(
  summary: ReturnType<typeof useDashboardSummary>["data"],
): DashboardStat[] {
  const safe = summary ?? {
    appointmentsToday: 0,
    confirmed: 0,
    revenue: 0,
    newPatients: 0,
    growthPercentages: {},
  };

  return [
    {
      title: "Consultas Hoje",
      value: String(safe.appointmentsToday),
      iconName: "CalendarCheck",
    },
    {
      title: "Confirmadas",
      value: String(safe.confirmed),
      subtitle:
        safe.appointmentsToday > 0
          ? `de ${safe.appointmentsToday}`
          : undefined,
      iconName: "CheckCircle",
    },
    {
      title: "Faturamento do Mês",
      value: BRL_FORMATTER.format(Number(safe.revenue ?? 0)),
      iconName: "DollarSign",
      trend: {
        value: formatGrowth(Number(safe.growthPercentages?.revenue)),
        label: "vs. mês anterior",
      },
    },
    {
      title: "Novos Pacientes",
      value: String(safe.newPatients),
      iconName: "Users",
      trend: {
        value: formatGrowth(Number(safe.growthPercentages?.newPatients)),
        label: "vs. mês anterior",
      },
    },
  ];
}

function buildSchedule(
  agenda: ReturnType<typeof useTodayAgenda>["data"],
): ScheduleEntry[] {
  if (!agenda) return [];
  return agenda.map((appt) => ({
    id: appt.id,
    time: appt.time,
    patientName: appt.patientName,
    patientAvatar: "",
    procedure: appt.procedure ?? "—",
    dentist: appt.dentistName ?? "—",
    status: APPOINTMENT_STATUS_MAP[appt.status] ?? "pending",
  }));
}

function buildGoals(
  goals: ReturnType<typeof useGoals>["data"],
): GoalProgress[] {
  if (!goals) return [];

  const revenueGoal = Number(goals.revenueGoal ?? 0);
  const revenueActual = Number(goals.revenueActual ?? 0);
  const treatmentGoal = Number(goals.treatmentGoal ?? 0);
  const treatmentActual = Number(goals.treatmentActual ?? 0);

  const revenuePercent =
    revenueGoal > 0 ? Math.min(100, (revenueActual / revenueGoal) * 100) : 0;
  const treatmentPercent =
    treatmentGoal > 0
      ? Math.min(100, (treatmentActual / treatmentGoal) * 100)
      : 0;

  return [
    {
      label: "Faturamento",
      current: BRL_FORMATTER.format(revenueActual),
      target: BRL_FORMATTER.format(revenueGoal),
      percentage: Math.round(revenuePercent),
      variant: "brand",
    },
    {
      label: "Tratamentos Concluídos",
      current: String(treatmentActual),
      target: String(treatmentGoal),
      percentage: Math.round(treatmentPercent),
      variant: "warning",
    },
  ];
}

function buildWeeklyBars(
  chart: ReturnType<typeof useWeeklyChart>["data"],
): WeeklyChartBar[] {
  if (!chart) return [];
  return chart.labels.map((label, index) => {
    const count = Number(chart.data?.[index] ?? 0);
    const percentage = Math.min(100, (count / WEEKLY_CHART_MAX) * 100);
    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      percentage,
      variant: WEEKDAY_VARIANTS[index] ?? "primary",
    };
  });
}

function computeWeeklyAverage(chart: ReturnType<typeof useWeeklyChart>["data"]) {
  if (!chart || chart.data.length === 0) return "0";
  const sum = chart.data.reduce((acc, v) => acc + Number(v ?? 0), 0);
  const avg = sum / chart.data.length;
  return avg.toFixed(1).replace(".", ",");
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-background-hover ${className}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-16" />
        </div>
        <SkeletonBlock className="size-11 rounded-xl" />
      </div>
      <SkeletonBlock className="mt-4 h-4 w-32" />
    </div>
  );
}

export default function Dashboard() {
  const summaryQuery = useDashboardSummary();
  const agendaQuery = useTodayAgenda();
  const goalsQuery = useGoals();
  const alertsQuery = useAlerts();
  const chartQuery = useWeeklyChart();

  const stats = useMemo(() => buildStats(summaryQuery.data), [summaryQuery.data]);
  const schedule = useMemo(
    () => buildSchedule(agendaQuery.data),
    [agendaQuery.data],
  );
  const goals = useMemo(() => buildGoals(goalsQuery.data), [goalsQuery.data]);
  const alerts = useMemo(
    () => mapApiAlerts(alertsQuery.data),
    [alertsQuery.data],
  );
  const weeklyBars = useMemo(
    () => buildWeeklyBars(chartQuery.data),
    [chartQuery.data],
  );
  const weeklyAverage = useMemo(
    () => computeWeeklyAverage(chartQuery.data),
    [chartQuery.data],
  );

  const goalsTitle = `Metas de ${MONTH_NAMES[new Date().getMonth()]}`;

  const dashboardQueries = [
    summaryQuery,
    agendaQuery,
    goalsQuery,
    alertsQuery,
    chartQuery,
  ];
  const hasError = dashboardQueries.some((q) => q.isError);
  const firstError = dashboardQueries.find((q) => q.isError)?.error;
  const isRetrying = dashboardQueries.some((q) => q.isFetching);
  const retryAll = () => {
    dashboardQueries.forEach((q) => void q.refetch());
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[1267px] mx-auto min-w-0">
      {hasError ? (
        <QueryErrorBanner
          error={firstError}
          onRetry={retryAll}
          isRetrying={isRetrying}
        />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryQuery.isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))
          : stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={STAT_ICONS[stat.iconName]}
                trend={stat.trend}
              />
            ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 md:gap-8 w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-8 flex-1 min-w-0">
          {agendaQuery.isLoading ? (
            <SkeletonBlock className="h-[300px] w-full rounded-xl" />
          ) : (
            <TodayScheduleTable entries={schedule} />
          )}

          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8 md:h-[204px]">
            {goalsQuery.isLoading ? (
              <SkeletonBlock className="h-[204px] flex-1 rounded-xl" />
            ) : (
              <GoalsSection title={goalsTitle} goals={goals} />
            )}
            <NewRecordCta />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 w-full xl:min-w-[380px] xl:w-[380px] shrink-0 min-w-0">
          {alertsQuery.isLoading ? (
            <SkeletonBlock className="h-[409px] w-full rounded-xl" />
          ) : (
            <AlertsPanel alerts={alerts} />
          )}
          {chartQuery.isLoading ? (
            <SkeletonBlock className="h-[410px] w-full rounded-xl" />
          ) : (
            <WeeklyChart
              title="Consultas na Semana"
              subtitle={`Média de ${weeklyAverage} por dia`}
              bars={weeklyBars}
            />
          )}
        </div>
      </div>
    </div>
  );
}
