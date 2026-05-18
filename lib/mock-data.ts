import type { PatientTimelineEntry, PatientFinancialRecord } from "@/lib/types";

export const PATIENT_TIMELINE: PatientTimelineEntry[] = [
  {
    id: "pt1",
    label: "Próxima Consulta",
    status: "upcoming",
    procedure: "Manutenção de Aparelho Ortodôntico",
    date: "25 de Fevereiro, 2026 às 14:30",
    paymentStatus: undefined,
  },
  {
    id: "pt2",
    label: "Finalizado",
    status: "completed",
    procedure: "Limpeza e Profilaxia",
    date: "12 de Fevereiro, 2026 às 10:00",
    paymentStatus: "paid",
  },
  {
    id: "pt3",
    label: "Finalizado",
    status: "completed",
    procedure: "Avaliação Inicial",
    date: "28 de Janeiro, 2026 às 09:00",
    paymentStatus: "paid",
  },
];

export const PATIENT_FINANCIAL_RECORDS: PatientFinancialRecord[] = [
  {
    id: "pf1",
    description: "Parcela 02/12 - Aparelho",
    date: "10/02/2026",
    value: "R$ 150,00",
    status: "paid",
    hasReceipt: true,
  },
  {
    id: "pf2",
    description: "Limpeza e Profilaxia",
    date: "12/02/2026",
    value: "R$ 220,00",
    status: "paid",
    hasReceipt: true,
  },
  {
    id: "pf3",
    description: "Parcela 03/12 - Aparelho",
    date: "10/03/2026",
    value: "R$ 150,00",
    status: "pending",
    hasReceipt: false,
  },
];
