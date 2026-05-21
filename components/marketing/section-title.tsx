export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-brand-primary" />
    </div>
  );
}
