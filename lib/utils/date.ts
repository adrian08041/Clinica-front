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
