import { teamMembers } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";

export function TeamSection() {
  return (
    <section id="equipe" className="bg-[var(--color-surface-section-alt)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionTitle title="Nossa Equipe" />
        <div className="grid gap-6 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="rounded-[2rem] border border-[var(--color-border-marketing)] bg-white p-8 text-center shadow-[0_10px_30px_rgba(var(--shadow-marketing-rgb),0.05)]"
            >
              <div
                className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${member.accent} text-4xl font-black text-[var(--color-brand-teal)] shadow-[inset_0_0_0_4px_rgba(232,251,246,0.9)]`}
              >
                {member.initials}
              </div>
              <h3 className="mt-8 text-4xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">
                {member.name}
              </h3>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-[var(--color-brand-teal)]">
                {member.specialty} | {member.register}
              </p>
              <p className="mt-6 text-lg leading-8 text-[var(--color-text-soft)]">
                {member.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
