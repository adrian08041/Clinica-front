export const PHONE_PREFIX = "(55) ";

export const PATIENT_DIALOG_STEPS = ["Identificação", "Contato", "Revisão"];

export const patientFieldClass =
  "h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30";

export const patientStatusClassMap: Record<string, string> = {
  Ativo: "bg-success-bg text-success-text",
  Pendente: "bg-warning-bg text-warning-text",
};

export function formatCpf(cpf: string) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

export function formatCpfInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^55/, "").slice(0, 11);
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (!digits) return PHONE_PREFIX;
  if (digits.length <= 2) return `${PHONE_PREFIX}${digits}`;
  if (number.length <= 4) return `${PHONE_PREFIX}${ddd} ${number}`;
  if (number.length <= 8) return `${PHONE_PREFIX}${ddd} ${number.slice(0, 4)}-${number.slice(4)}`;

  return `${PHONE_PREFIX}${ddd} ${number.slice(0, 5)}-${number.slice(5)}`;
}
