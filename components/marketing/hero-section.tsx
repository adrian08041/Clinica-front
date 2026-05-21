import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="border-b border-border-light bg-background-main"
    >
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-xl">
          <Badge variant="brand" className="animate-hero-in">
            <Sparkles />
            Tecnologia de ponta em Odontologia
          </Badge>
          <h1 className="animate-hero-in-delay-1 mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-5xl">
            Seu sorriso merece o{" "}
            <span className="text-brand-primary">melhor cuidado</span>
          </h1>
          <p className="animate-hero-in-delay-2 mt-6 text-lg leading-8 text-text-secondary">
            Agende sua consulta online em segundos. Tratamentos modernos com
            profissionais especializados e atendimento humanizado para toda a
            família.
          </p>
          <div className="animate-hero-in-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg">
              <Link href="/cadastro">
                <CalendarDays />
                Agendar Agora
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#sobre">Conheça a Clínica</Link>
            </Button>
          </div>
          <div className="animate-hero-in-delay-4 mt-10 flex flex-wrap items-center gap-5 text-sm font-medium text-text-muted">
            <div className="flex items-center gap-1 text-warning-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
              <span className="ml-2 text-text-muted">4.9 no Google</span>
            </div>
            <span className="text-border-light">•</span>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-brand-primary" />
              <span>+10 anos</span>
            </div>
            <span className="text-border-light">•</span>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-brand-primary" />
              <span>+5.000 sorrisos</span>
            </div>
          </div>
        </div>

        <div className="animate-hero-in-delay-2 relative mx-auto w-full max-w-[460px]">
          <Card className="animate-float absolute -left-4 -top-3 z-10 gap-0 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-7 text-warning-accent" />
              <div>
                <p className="text-xs font-medium text-text-muted">Qualidade</p>
                <p className="mt-0.5 text-lg font-bold text-text-primary">
                  Premium
                </p>
              </div>
            </div>
          </Card>
          <Card className="animate-float-delayed absolute -bottom-3 -right-4 z-10 gap-0 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <Star className="size-7 fill-warning-accent text-warning-accent" />
              <div>
                <p className="text-xs font-medium text-text-muted">Avaliação</p>
                <p className="mt-0.5 text-lg font-bold text-text-primary">
                  4.9/5.0
                </p>
              </div>
            </div>
          </Card>
          <div className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80"
              alt="Consultório odontológico moderno"
              className="h-[570px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
