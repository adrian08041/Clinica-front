// Ponte entre o ISO "YYYY-MM-DD" guardado nos forms e o objeto Date que o
// <DatePicker> (shadcn) espera. Usa data local ao meio-dia para evitar drift de fuso.
export function isoToDate(iso?: string | null): Date | undefined {
  if (!iso) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
}

export function dateToIso(date?: Date): string {
  if (!date) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDatePtBr(dateInput?: string | Date) {
  if (!dateInput) {
    return "";
  }

  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const localDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);

    if (localDateMatch) {
      const [, year, month, day] = localDateMatch;
      date = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      date = new Date(dateInput);
    }
  }

  if (Number.isNaN(date.getTime())) {
    return String(dateInput);
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
