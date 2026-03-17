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

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  insurance?: string;
  createdAt: string;
  status?: string;
  lastVisit?: string;
  tags?: string[];
  avatar?: string;
}

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

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
}

export type AgendaView = "day" | "week" | "month";

export type FinanceReceivableStatus = "Pendente" | "Pago" | "Atrasado";

export interface FinanceReceivable {
  patient: string;
  description: string;
  value: string;
  due: string;
  status: FinanceReceivableStatus;
}

export interface FinancePaymentMethod {
  label: string;
  value: number;
  color: string;
}

export interface TreatmentProcedure {
  id: string;
  tooth: string;
  name: string;
  value: number;
  paid: boolean;
  done: boolean;
}

export interface TreatmentPlan {
  id: string;
  patient: string;
  title: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  total: number;
  completed: number;
  totalProcedures: number;
  procedures: TreatmentProcedure[];
}
