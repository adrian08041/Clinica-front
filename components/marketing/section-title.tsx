export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--color-brand-teal)]" />
    </div>
  );
}
