import type {
  Service,
  Patient,
  Appointment,
  Dentist,
  FinanceReceivable,
  FinancePaymentMethod,
  TreatmentPlan,
} from "@/lib/types";

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

export const FINANCE_RECEIVABLES: FinanceReceivable[] = [
  { id: "fr-1", patient: "Mariana Costa", description: "Mensalidade Ortodontia (Fev)", value: 180, due: "2026-02-25", status: "Pendente" },
  { id: "fr-2", patient: "Ricardo Mendes", description: "Restauração de Resina", value: 350, due: "2026-02-12", status: "Pago" },
  { id: "fr-3", patient: "Julia Albuquerque", description: "Limpeza e Profilaxia", value: 250, due: "2026-02-05", status: "Pago" },
  { id: "fr-4", patient: "Carlos Eduardo", description: "Cirurgia Siso", value: 800, due: "2026-02-10", status: "Atrasado" },
  { id: "fr-5", patient: "Beatriz Santos", description: "Implante Dentário (Parcela 1/12)", value: 1200, due: "2026-02-20", status: "Pendente" },
];

export const FINANCE_PAYMENT_METHODS: FinancePaymentMethod[] = [
  { label: "Cartão de Crédito", value: 45, color: "var(--color-brand-teal)" },
  { label: "PIX", value: 35, color: "var(--color-warning-accent)" },
  { label: "Boleto", value: 12, color: "var(--color-danger-accent)" },
  { label: "Dinheiro", value: 8, color: "var(--color-sidebar-foreground)" },
];

export const FINANCE_LINE_POINTS = [38, 42, 40, 48, 41, 45];
export const FINANCE_LINE_LABELS = ["Set", "Out", "Nov", "Dez", "Jan", "Fev"];

export const TREATMENT_INITIAL_PLANS: TreatmentPlan[] = [
  {
    id: "1",
    patient: "Mariana Costa",
    title: "Ortodontia Preventiva",
    createdAt: "15/11/2025",
    startDate: "2025-11-15",
    endDate: "2026-07-15",
    notes: "Acompanhamento mensal com foco em alinhamento e manutenção.",
    total: 3200,
    completed: 4,
    totalProcedures: 8,
    procedures: [
      { id: "p1", tooth: "-", name: "Limpeza e Profilaxia", value: 250, paid: true, done: true },
      { id: "p2", tooth: "11", name: "Restauração de Resina", value: 350, paid: true, done: true },
      { id: "p3", tooth: "-", name: "Instalação de Aparelho", value: 1500, paid: true, done: true },
      { id: "p4", tooth: "-", name: "Manutenção Mensal 1", value: 180, paid: true, done: true },
      { id: "p5", tooth: "-", name: "Manutenção Mensal 2", value: 180, paid: false, done: false },
      { id: "p6", tooth: "-", name: "Manutenção Mensal 3", value: 180, paid: false, done: false },
      { id: "p7", tooth: "-", name: "Manutenção Mensal 4", value: 180, paid: false, done: false },
      { id: "p8", tooth: "-", name: "Remoção e Contenção", value: 380, paid: false, done: false },
    ],
  },
  {
    id: "2",
    patient: "Ricardo Mendes",
    title: "Reabilitação Estética",
    createdAt: "10/01/2026",
    startDate: "2026-01-10",
    endDate: "2026-05-10",
    notes: "Reabilitação com foco em função mastigatória e estética do sorriso.",
    total: 8500,
    completed: 2,
    totalProcedures: 5,
    procedures: [
      { id: "p9", tooth: "14", name: "Clareamento Dentário", value: 1200, paid: true, done: true },
      { id: "p10", tooth: "16", name: "Lente de Contato Dental", value: 2300, paid: true, done: true },
      { id: "p11", tooth: "21", name: "Ajuste de Gengiva", value: 1800, paid: false, done: false },
      { id: "p12", tooth: "24", name: "Finalização Estética", value: 1700, paid: false, done: false },
      { id: "p13", tooth: "-", name: "Retorno Clínico", value: 1500, paid: false, done: false },
    ],
  },
];

