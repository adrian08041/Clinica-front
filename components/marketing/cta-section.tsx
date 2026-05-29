import { MessageCircle, Plus, Star } from "lucide-react";
import { whatsappAgendarUrl } from "@/components/marketing/landing-data";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CtaSection() {
  return (
    <section className="bg-white px-6 py-16 lg:px-8">
      <ScrollReveal>
        <Card className="relative mx-auto max-w-5xl overflow-hidden bg-gradient-to-br from-brand-primary to-brand-dark px-8 py-12 text-center text-white lg:px-16">
          {/* Decorações de fundo (referência Figma): estrelas + cruzes semitransparentes */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Star className="absolute -left-12 -top-14 size-52 rotate-12 fill-white/10 text-white/10" />
            <Star className="absolute -bottom-16 -right-12 size-64 -rotate-12 fill-white/10 text-white/10" />
            <Plus className="absolute left-20 top-10 size-10 text-white/15" strokeWidth={3} />
            <Plus className="absolute right-28 top-20 size-12 text-white/10" strokeWidth={3} />
            <Plus className="absolute bottom-12 right-20 size-9 text-white/15" strokeWidth={3} />
          </div>

          <div className="relative z-10">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
              Agende sua consulta agora mesmo
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/85">
              Fale com a gente diretamente pelo WhatsApp e escolha o melhor horário,
              sem precisar ligar ou esperar. Rápido, fácil e moderno.
            </p>
            <Button
              asChild
              size="lg"
              className="mx-auto mt-8 bg-white text-brand-primary hover:bg-white/90"
            >
              <a href={whatsappAgendarUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Agendar Consulta
              </a>
            </Button>
            <p className="mt-5 text-xs font-medium text-white/75">
              Atendimento disponível em horário comercial e sábados.
            </p>
          </div>
        </Card>
      </ScrollReveal>
    </section>
  );
}
