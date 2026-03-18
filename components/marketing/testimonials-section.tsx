import { Star } from "lucide-react";
import { testimonials } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-[var(--color-brand-teal-surface)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title="O que nossos pacientes dizem" />
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[2rem] border border-[var(--color-border-panel)] bg-white p-8 shadow-[0_10px_24px_rgba(var(--shadow-marketing-rgb),0.05)]"
            >
              <div className="flex items-center gap-1 text-[var(--color-warning-accent-soft)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-9 text-[var(--color-ink-muted)]">
                {testimonial.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className={`h-14 w-14 rounded-full ${testimonial.accent}`} />
                <div>
                  <p className="text-lg font-extrabold text-[var(--color-ink-strong)]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-faint-strong)]">
                    Paciente Verificado
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
