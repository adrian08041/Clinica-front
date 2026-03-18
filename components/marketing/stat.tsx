export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-extrabold text-[var(--color-brand-teal)]">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
        {label}
      </p>
    </div>
  );
}
