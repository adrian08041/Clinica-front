import { Check } from "lucide-react";
import { highlights } from "@/components/marketing/landing-data";
import { Stat } from "@/components/marketing/stat";

export function AboutSection() {
  return (
    <section id="sobre" className="bg-[var(--color-surface-canvas-soft)] py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] bg-[var(--color-surface-muted)] shadow-[0_22px_48px_rgba(var(--shadow-marketing-rgb),0.10)]">
            <div className="h-[430px] marketing-about-image" />
          </div>
          <div className="absolute -bottom-8 right-6 rounded-[1.75rem] bg-[var(--color-brand-teal)] px-8 py-7 text-white shadow-[0_18px_46px_rgba(var(--shadow-marketing-rgb),0.28)]">
            <p className="text-5xl font-black">10+</p>
            <p className="mt-2 max-w-[140px] text-lg font-semibold leading-7">
              Anos cuidando do seu sorriso
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-black leading-tight text-[var(--color-ink-strong)]">
            Por que escolher a OdontoFlow?
          </h2>
          <p className="mt-6 text-xl leading-9 text-[var(--color-text-section)]">
            Combinamos tecnologia de ponta com um ambiente acolhedor para
            proporcionar a melhor experiência odontológica possível.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl bg-white/90 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-highlight)] text-[var(--color-brand-teal)]">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-[var(--color-ink-strong)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-[var(--color-border-marketing)] pt-10">
            <div className="grid gap-8 sm:grid-cols-3">
              <Stat value="10+" label="Anos de Experiência" />
              <Stat value="5.000+" label="Pacientes Felizes" />
              <Stat value="15.000+" label="Procedimentos" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
