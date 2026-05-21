import { teamMembers } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Card } from "@/components/ui/card";

export function TeamSection() {
  return (
    <section id="equipe" className="bg-background-main py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionTitle title="Nossa Equipe" />
        </ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 150}>
              <Card
                asChild
                className="h-full p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <article>
                  <div className="mx-auto size-28 overflow-hidden rounded-full border border-border-light shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-text-primary">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-brand-primary">
                    {member.specialty} | {member.register}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">
                    {member.quote}
                  </p>
                </article>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
