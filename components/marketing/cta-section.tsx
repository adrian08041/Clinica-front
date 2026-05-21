import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-16 lg:px-8">
      <ScrollReveal>
        <Card className="mx-auto max-w-5xl bg-brand-primary px-8 py-12 text-center text-white lg:px-16">
          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
            Agende sua consulta agora mesmo
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/85">
            Escolha o melhor horário para você diretamente no nosso sistema, sem
            precisar ligar ou esperar. Rápido, fácil e moderno.
          </p>
          <Button
            asChild
            size="lg"
            className="mx-auto mt-8 bg-white text-brand-primary hover:bg-white/90"
          >
            <Link href="/cadastro">
              <CalendarDays />
              Agendar Consulta
            </Link>
          </Button>
          <p className="mt-5 text-xs font-medium text-white/75">
            Atendimento disponível em horário comercial e sábados.
          </p>
        </Card>
      </ScrollReveal>
    </section>
  );
}
