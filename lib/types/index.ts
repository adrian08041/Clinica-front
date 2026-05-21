// ─────────────────────────────────────────────────────────────────────────────
// Fonte única de tipos compartilhados do front.
//
// Payloads de request e DTOs específicos de wire format ficam em
// `lib/queries/<feature>.ts` (ex.: PatientPayload, FinanceReceivableDTO,
// BackendAppointment). Aqui ficam apenas:
//   1. Shapes canônicos do back consumidos direto pela UI (Patient, Dentist)
//   2. View models do front (Appointment achatado, Dashboard*, Schedule*)
//   3. Genéricos (PageResponse)
// ─────────────────────────────────────────────────────────────────────────────

// Marketing (landing)

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

// Entidades do back consumidas direto pela UI

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  insurance?: string;
  status?: string;
  lastVisit?: string;
  avatar?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  createdAt: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
}

// Genérico do Spring Page

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// View model: Appointment achatado (traduzido via toAppointment em lib/queries/appointments.ts)

export type AppointmentType = "evaluation" | "cleaning" | "procedure" | "return" | "urgency";

export interface Appointment {
  id: string;
  patientName: string;
  dentistId: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  procedure: string;
  observations?: string;
  patientSince?: string;
}

export type AgendaView = "day" | "week" | "month";

// Dashboard — view models

export type ScheduleStatus = "confirmed" | "pending" | "cancelled";

export interface DashboardStat {
  title: string;
  value: string;
  subtitle?: string;
  iconName: string;
  trend?: {
    value: string;
    label: string;
  };
}

export interface ScheduleEntry {
  id: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  procedure: string;
  dentist: string;
  status: ScheduleStatus;
}

export interface GoalProgress {
  label: string;
  current: string;
  target: string;
  percentage: number;
  variant: "brand" | "warning";
}

export interface DashboardAlert {
  id: string;
  message: string;
  variant: "warning" | "danger" | "success";
  iconName: string;
}

export interface WeeklyChartBar {
  label: string;
  percentage: number;
  variant: "primary" | "dark" | "accent";
}

// Detalhe de paciente — view models alimentados por mock-data
// (ainda não há endpoint dedicado no back)

export type PatientTimelineStatus = "upcoming" | "completed";
export type PatientPaymentStatus = "paid" | "pending";

export interface PatientTimelineEntry {
  id: string;
  label: string;
  status: PatientTimelineStatus;
  procedure: string;
  date: string;
  paymentStatus?: "paid" | "pending";
}

export interface PatientFinancialRecord {
  id: string;
  description: string;
  date: string;
  value: string;
  status: PatientPaymentStatus;
  hasReceipt: boolean;
}
