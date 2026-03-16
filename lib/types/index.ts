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
