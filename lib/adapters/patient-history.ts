import type {
  Appointment,
  PatientFinancialRecord,
  PatientTimelineEntry,
} from "@/lib/types";
import type { FinanceReceivableDTO } from "@/lib/queries/finance";
import { formatDatePtBr } from "@/lib/utils/date";

const MONTH_NAMES_FULL = [
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

// "2026-02-25" + "14:30" → "25 de Fevereiro, 2026 às 14:30"
function formatTimelineDate(isoDate: string, time: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return time ? `${isoDate} às ${time}` : isoDate;
  const [, year, month, day] = match;
  const monthName = MONTH_NAMES_FULL[Number(month) - 1] ?? month;
  const dayNum = Number(day);
  return time
    ? `${dayNum} de ${monthName}, ${year} às ${time}`
    : `${dayNum} de ${monthName}, ${year}`;
}

// Procedimentos de dados antigos vêm como o enum em inglês (ex: "CLEANING").
// Normaliza para PT mantendo descrições livres já em português intactas.
const PROCEDURE_PT: Record<string, string> = {
  cleaning: "Limpeza",
  evaluation: "Avaliação",
  procedure: "Procedimento",
  return: "Retorno",
  urgency: "Urgência",
}

function normalizeProcedure(raw: string) {
  return PROCEDURE_PT[raw.trim().toLowerCase()] ?? raw
}

/**
 * Mapeia uma consulta para a entrada da linha do tempo do paciente.
 * `isNext` marca a única consulta futura mais próxima como "Próxima Consulta";
 * as demais futuras são "Agendada" e as passadas, "Finalizado".
 */
export function toTimelineEntry(
  appointment: Appointment,
  todayIso: string,
  isNext: boolean,
): PatientTimelineEntry {
  const isPast = appointment.date < todayIso;
  return {
    id: appointment.id,
    label: isPast ? "Finalizado" : isNext ? "Próxima Consulta" : "Agendada",
    status: isPast ? "completed" : "upcoming",
    procedure: normalizeProcedure(appointment.procedure),
    date: formatTimelineDate(appointment.date, appointment.time),
  };
}

/** Mapeia uma conta a receber para o registro financeiro exibido no perfil do paciente. */
export function toFinancialRecord(
  receivable: FinanceReceivableDTO,
): PatientFinancialRecord {
  return {
    id: receivable.id,
    description: receivable.description,
    date: formatDatePtBr(receivable.due),
    value: receivable.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    status:
      receivable.status === "Pago"
        ? "paid"
        : receivable.status === "Atrasado"
          ? "overdue"
          : "pending",
    // Não há feature de comprovante/recibo no back ainda.
    hasReceipt: false,
  };
}
