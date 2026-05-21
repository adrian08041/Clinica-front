import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Card } from "@/components/ui/card";

export function ServicesSection() {
  return (
    <section id="servicos" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionTitle title="Nossos Tratamentos" />
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {treatments.map(({ title, description, icon: Icon }, index) => (
            <ScrollReveal key={title} delay={index * 100}>
              <Card
                asChild
                className="group h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <article>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-primary/10 transition-colors duration-300 group-hover:bg-brand-primary/20">
                    <Icon className="size-5 text-brand-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-text-primary">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {description}
                  </p>
                  <Link
                    href="#contato"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:underline"
                  >
                    Saiba mais
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
