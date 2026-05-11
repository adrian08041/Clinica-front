import * as z from "zod";
import type { AppointmentType } from "@/lib/types";

export const agendaNewDialogSchema = z.object({
  patientName: z.string().min(1, "Selecione um paciente"),
  dentistId: z.string().min(1, "Selecione um dentista"),
  date: z.number({ error: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  type: z.enum(["evaluation", "return", "procedure", "urgency", "cleaning"], {
    message: "Selecione o tipo de agendamento",
  }),
  observations: z.string().optional(),
});

export type AgendaNewDialogValues = z.infer<typeof agendaNewDialogSchema>;

export type AgendaNewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AGENDA_NEW_DIALOG_TOTAL_STEPS = 4;

export const AGENDA_NEW_DIALOG_STEP_LABELS = [
  "Informações",
  "Agenda",
  "Detalhes",
  "Confirmação",
];

export const APPOINTMENT_TYPES: {
  value: AppointmentType;
  label: string;
  dotColor: string;
}[] = [
  { value: "evaluation", label: "Avaliação", dotColor: "bg-blue-200" },
  { value: "return", label: "Retorno", dotColor: "bg-gray-200" },
  { value: "procedure", label: "Procedimento", dotColor: "bg-purple-200" },
  { value: "urgency", label: "Urgência", dotColor: "bg-danger-bg" },
  { value: "cleaning", label: "Limpeza", dotColor: "bg-green-200" },
];

export const AVAILABLE_TIMES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export const OCCUPIED_TIMES = ["09:00", "14:30"];

export const MONTH_NAMES = [
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

export const DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function getPersonInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2);
}

export function formatAgendaDate(
  year: number,
  month: number,
  dateNum?: number | null,
) {
  if (dateNum === undefined || dateNum === null) return "-";

  const date = new Date(year, month, dateNum);
  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const shortMonths = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${dayNames[date.getDay()]}, ${dateNum} de ${shortMonths[month]}`;
}
