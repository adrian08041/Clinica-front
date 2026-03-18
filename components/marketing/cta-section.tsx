import Link from "next/link";
import { CalendarDays } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] marketing-cta-bg px-8 py-16 text-center text-white shadow-[0_26px_60px_rgba(var(--shadow-marketing-rgb),0.26)] lg:px-16">
        <h2 className="mx-auto max-w-3xl text-5xl font-black leading-tight">
          Agende sua consulta agora mesmo
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/88">
          Escolha o melhor horário para você diretamente no nosso sistema, sem
          precisar ligar ou esperar. Rápido, fácil e moderno.
        </p>
        <Link
          href="/cadastro"
          className="mt-10 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-4 text-lg font-extrabold text-[var(--color-brand-teal)] shadow-[0_18px_40px_rgba(var(--shadow-marketing-rgb),0.18)] transition hover:-translate-y-0.5"
        >
          <CalendarDays className="h-5 w-5" />
          Agendar Consulta
        </Link>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.34em] text-white/80">
          Atendimento disponível em horário comercial e sábados.
        </p>
      </div>
    </section>
  );
}
