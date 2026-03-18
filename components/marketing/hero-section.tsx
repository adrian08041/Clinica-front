import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Sparkles, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="border-b border-[var(--color-border-marketing-alt)] marketing-hero-bg"
    >
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-chip)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-chip-text)]">
            <Sparkles className="h-4 w-4" />
            Tecnologia de ponta em Odontologia
          </div>
          <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight text-[var(--color-ink-strong)] md:text-6xl">
            Seu sorriso merece o
            <span className="mt-2 block text-[var(--color-brand-teal)]">
              melhor cuidado
            </span>
          </h1>
          <div className="mt-3 h-1.5 w-44 rounded-full bg-[var(--color-warning-accent-muted)]" />
          <p className="mt-6 text-xl leading-9 text-[var(--color-text-section)]">
            Agende sua consulta online em segundos. Tratamentos modernos com
            profissionais especializados e atendimento humanizado para toda a
            família.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-brand-teal)] px-8 py-4 text-lg font-bold text-white shadow-[0_14px_34px_var(--color-brand-teal-glow)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-teal-dark)]"
            >
              <CalendarDays className="h-5 w-5" />
              Agendar Agora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#sobre"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-brand-teal)] px-8 py-4 text-lg font-bold text-[var(--color-brand-teal)] transition hover:bg-[var(--color-brand-teal-surface-muted)]"
            >
              Conheça a Clínica
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5 text-sm font-semibold text-[var(--color-text-muted-alt)]">
            <div className="flex items-center gap-1 text-[var(--color-warning-accent-soft)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-[var(--color-text-muted-alt)]">
                4.9 no Google
              </span>
            </div>
            <span className="text-[var(--color-divider-soft)]">•</span>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[var(--color-brand-teal)]" />
              <span>+10 anos</span>
            </div>
            <span className="text-[var(--color-divider-soft)]">•</span>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[var(--color-brand-teal)]" />
              <span>+5.000 sorrisos</span>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -left-6 top-6 rounded-3xl bg-white px-5 py-4 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.12)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
              Qualidade
            </p>
            <p className="mt-1 text-xl font-extrabold text-[var(--color-ink-strong)]">
              Premium
            </p>
          </div>
          <div className="absolute -bottom-6 right-0 rounded-3xl bg-white px-5 py-4 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.12)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
              Avaliação
            </p>
            <p className="mt-1 flex items-center gap-2 text-xl font-extrabold text-[var(--color-ink-strong)]">
              <Star className="h-5 w-5 fill-[var(--color-warning-accent-soft)] text-[var(--color-warning-accent-soft)]" />
              4.9/5.0
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border-[6px] border-white bg-[var(--color-surface-muted-alt)] shadow-[0_26px_70px_rgba(var(--shadow-marketing-rgb),0.16)]">
            <div className="h-[570px] marketing-hero-image" />
          </div>
        </div>
      </div>
    </section>
  );
}
