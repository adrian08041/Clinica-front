export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold tracking-tight text-text-primary">{value}</p>
      <p className="mt-2 text-sm font-medium text-text-muted">{label}</p>
    </div>
  );
}
