import type { Service, Patient, Appointment, Dentist } from "@/lib/types";

// As per design, the login page doesn't strictly require data mapping here,
// but to satisfy project conventions, mock data is centralized here.

export const SERVICES: Service[] = [
  {
    id: "1",
    title: "Clareamento",
    description: "Clareamento dental a laser",
    icon: "Smile",
  },
];

export const MOCK_USER = {
  email: "seu@email.com",
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "111.222.333-44",
    phone: "(11) 98765-4321",
    insurance: "Unimed",
    createdAt: "2026-02-28",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    cpf: "555.666.777-88",
    phone: "(11) 91234-5678",
    insurance: "Bradesco Saúde",
    createdAt: "2026-02-27",
  },
  {
    id: "3",
    name: "Carlos Souza",
    cpf: "999.888.777-66",
    phone: "(11) 99999-8888",
    createdAt: "2026-02-26",
  }
];

export const MOCK_DENTISTS: Dentist[] = [
  {
    id: "d1",
    name: "Dra. Ana Silva",
    specialty: "Clínica Geral",
  },
  {
    id: "d2",
    name: "Dr. Lucas Ferraz",
    specialty: "Ortodontia",
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    patientName: "Carlos Eduardo",
    dentistId: "d2",
    date: "2026-02-20",
    time: "08:00",
    duration: 45,
    type: "procedure",
    procedure: "Restauração de Resina",
    observations: "Paciente com histórico de sensibilidade.",
    patientSince: "2023",
  },
  {
    id: "a2",
    patientName: "Mariana Costa",
    dentistId: "d1",
    date: "2026-02-17",
    time: "08:30",
    duration: 60,
    type: "evaluation",
    procedure: "Avaliação Inicial",
    observations: "Primeira consulta. Paciente encaminhada por convênio.",
    patientSince: "2026",
  },
  {
    id: "a3",
    patientName: "Ricardo Mendes",
    dentistId: "d1",
    date: "2026-02-18",
    time: "09:30",
    duration: 90,
    type: "procedure",
    procedure: "Tratamento de Canal",
    observations: "Retorno para finalização do canal no dente 36.",
    patientSince: "2022",
  },
  {
    id: "a4",
    patientName: "Beatriz Santos",
    dentistId: "d2",
    date: "2026-02-20",
    time: "10:30",
    duration: 30,
    type: "cleaning",
    procedure: "Limpeza e Profilaxia",
    observations:
      '"Paciente relatou sensibilidade no molar superior esquerdo. Verificar histórico de restauração."',
    patientSince: "2024",
  },
  {
    id: "a5",
    patientName: "Pedro Lucas",
    dentistId: "d1",
    date: "2026-02-17",
    time: "11:00",
    duration: 30,
    type: "cleaning",
    procedure: "Limpeza e Profilaxia",
    patientSince: "2025",
  },
  {
    id: "a6",
    patientName: "Julia Albuquerque",
    dentistId: "d1",
    date: "2026-02-18",
    time: "14:00",
    duration: 60,
    type: "evaluation",
    procedure: "Avaliação Ortodôntica",
    observations: "Paciente com interesse em aparelho ortodôntico.",
    patientSince: "2025",
  },
  {
    id: "a7",
    patientName: "Fernando Souza",
    dentistId: "d2",
    date: "2026-02-21",
    time: "15:00",
    duration: 60,
    type: "evaluation",
    procedure: "Avaliação Periodontal",
    patientSince: "2024",
  },
];
