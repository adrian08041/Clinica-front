import { Star } from "lucide-react";
import { testimonials } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Card } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionTitle title="O que nossos pacientes dizem" />
        </ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={testimonial.name} delay={index * 150}>
              <Card
                asChild
                className="h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <article className="flex h-full flex-col">
                  <div className="flex items-center gap-1 text-warning-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-6 text-text-secondary">
                    {testimonial.quote}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-border-light pt-4">
                    <div className="size-11 shrink-0 overflow-hidden rounded-full border border-border-light">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">
                        {testimonial.name}
                      </p>
                      <p className="text-xs font-medium text-text-muted">
                        Paciente verificado
                      </p>
                    </div>
                  </div>
                </article>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
