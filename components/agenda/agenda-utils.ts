import { AgendaView } from "@/lib/types";

export const APPOINTMENT_COLORS: Record<string, string> = {
  evaluation: "bg-appointment-evaluation",
  cleaning: "bg-appointment-cleaning",
  procedure: "bg-appointment-procedure",
  return: "bg-appointment-return",
  urgency: "bg-appointment-urgency",
};

export const APPOINTMENT_LABELS: Record<string, string> = {
  evaluation: "EVALUATION",
  cleaning: "CLEANING",
  procedure: "PROCEDURE",
  return: "RETURN",
  urgency: "URGENCY",
};

export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

export const DAY_NAMES_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const MONTH_NAMES_FULL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getWeekDays(baseDate: Date) {
  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  const days = [];
  const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  for (let i = 0; i < 6; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      name: dayNames[i],
      date: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      fullDate: toDateString(d),
      isToday: d.toDateString() === new Date().toDateString(),
    });
  }
  return days;
}

export function formatDateLabel(baseDate: Date, view: AgendaView) {
  if (view === "day") {
    const d = baseDate;
    return `${DAY_NAMES_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
  }
  if (view === "month") {
    return `${MONTH_NAMES_FULL[baseDate.getMonth()]} ${baseDate.getFullYear()}`;
  }
  // week
  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  return `${start.getDate()} - ${end.getDate()} ${MONTH_NAMES[end.getMonth()]}, ${end.getFullYear()}`;
}

export function getMonthCalendarWeeks(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const offset = startDow === 0 ? 6 : startDow - 1; // Monday-based

  const weeks: { date: number; fullDate: string; isCurrentMonth: boolean; isToday: boolean }[][] = [];
  const calStart = new Date(firstDay);
  calStart.setDate(calStart.getDate() - offset);

  const today = new Date();
  const current = new Date(calStart);

  for (let w = 0; w < 6; w++) {
    const week: typeof weeks[number] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: current.getDate(),
        fullDate: toDateString(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === today.toDateString(),
      });
      current.setDate(current.getDate() + 1);
    }
    // Skip weeks entirely outside the month
    if (week.some((d) => d.isCurrentMonth)) {
      weeks.push(week);
    }
  }
  return weeks;
}

export function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2);
}
