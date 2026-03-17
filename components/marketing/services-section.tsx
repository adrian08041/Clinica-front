import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";

export function ServicesSection() {
  return (
    <section id="servicos" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title="Nossos Tratamentos" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {treatments.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[2rem] border border-[var(--color-border-marketing)] bg-white p-8 shadow-[0_10px_30px_rgba(var(--shadow-marketing-rgb),0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(var(--shadow-marketing-rgb),0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-teal-surface-strong)] text-[var(--color-brand-teal)]">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-8 text-3xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">
                {title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-[var(--color-text-soft)]">
                {description}
              </p>
              <Link
                href="#contato"
                className="mt-6 inline-flex items-center gap-2 text-lg font-bold text-[var(--color-brand-teal)]"
              >
                Saiba mais
                <ArrowRight className="h-5 w-5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
