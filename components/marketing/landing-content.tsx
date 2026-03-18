import { AboutSection } from "@/components/marketing/about-section";
import { ContactSection } from "@/components/marketing/contact-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { TeamSection } from "@/components/marketing/team-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export function LandingContent() {
  return (
    <div className="bg-[var(--color-surface-canvas)] text-[var(--color-ink-strong)]">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TeamSection />
      <TestimonialsSection />
      <CtaSection />
      <ContactSection />
    </div>
  );
}
