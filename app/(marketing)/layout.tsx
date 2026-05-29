import Link from "next/link";
import { LogIn, MessageCircle, Phone } from "lucide-react";
import { SmoothLink } from "@/components/marketing/smooth-link";
import {
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP,
  whatsappAgendarUrl,
} from "@/components/marketing/landing-data";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-main">
      <header className="sticky top-0 z-50 border-b border-border-light bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <SmoothLink href="#inicio" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary text-white">
              <span className="text-lg font-bold">O</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-text-primary">
              Odonto<span className="text-brand-primary">Flow</span>
            </span>
          </SmoothLink>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <SmoothLink
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition hover:text-brand-primary"
              >
                {link.label}
              </SmoothLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`https://wa.me/${CLINIC_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-secondary transition hover:text-brand-primary"
            >
              <Phone className="size-4 text-brand-primary" />
              <span className="text-sm font-medium">{CLINIC_PHONE_DISPLAY}</span>
            </a>
            <Button asChild variant="brand">
              <a href={whatsappAgendarUrl()} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Agendar Consulta
              </a>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="/login" title="Fazer login">
                <LogIn />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border-light bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center lg:flex-row lg:px-8 lg:text-left">
          <p className="text-sm font-medium text-text-muted">
            © {new Date().getFullYear()} OdontoFlow. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-text-muted">
            <SmoothLink href="#inicio" className="hover:text-brand-primary">
              Voltar ao topo
            </SmoothLink>
            <SmoothLink href="#contato" className="hover:text-brand-primary">
              Fale conosco
            </SmoothLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
