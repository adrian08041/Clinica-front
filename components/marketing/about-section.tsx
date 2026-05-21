import { Check } from "lucide-react";
import { highlights } from "@/components/marketing/landing-data";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { CountUp } from "@/components/marketing/count-up";
import { Card } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="sobre" className="bg-background-main py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <ScrollReveal direction="left">
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80"
                alt="Dentista sorrindo em consultório moderno"
                className="h-[430px] w-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl">
              Por que escolher a OdontoFlow?
            </h2>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              Combinamos tecnologia de ponta com um ambiente acolhedor para
              proporcionar a melhor experiência odontológica possível.
            </p>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {highlights.map((item, index) => (
              <ScrollReveal key={item} delay={index * 100} direction="right">
                <Card className="flex-row items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
                    <Check className="size-5 text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {item}
                  </span>
                </Card>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="mt-12 border-t border-border-light pt-10">
              <div className="grid gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-text-primary">
                    <CountUp end={10} suffix="+" />
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-muted">
                    Anos de Experiência
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-text-primary">
                    <CountUp end={5000} suffix="+" formatBR />
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-muted">
                    Pacientes Felizes
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-text-primary">
                    <CountUp end={15000} suffix="+" formatBR />
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-muted">
                    Procedimentos
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
