import {
  type LucideIcon,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
} from "lucide-react";

// Linha de WhatsApp da clínica (mesma do chatbot/uazapi). Único lugar onde o
// número vive — reusado pelos CTAs de "Agendar" e pelo telefone do header.
export const CLINIC_WHATSAPP = "5511915935231";
export const CLINIC_PHONE_DISPLAY = "(11) 91593-5231";

const AGENDAR_MESSAGE =
  "Olá! Vim pelo site da OdontoFlow e gostaria de agendar uma consulta.";

/** Deep link do WhatsApp com mensagem pré-preenchida para o lead agendar. */
export function whatsappAgendarUrl(): string {
  return `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(AGENDAR_MESSAGE)}`;
}

/** Endereço da clínica — usado nos cards de contato e no mapa. */
export const CLINIC_ADDRESS = "Rua Saúde, 123 - Centro, São Paulo, SP";

/** E-mail de contato da clínica. */
export const CLINIC_EMAIL = "contato@odontoflow.com";

/** URL de embed do Google Maps (sem API key) centrada no endereço da clínica. */
export function mapsEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS)}&z=15&output=embed`;
}

/** Link do Google Maps (abre o app/site) para o endereço da clínica. */
export function mapsLinkUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS)}`;
}

export type Treatment = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type TeamMember = {
  name: string;
  specialty: string;
  register: string;
  quote: string;
  initials: string;
  accent: string;
  photo: string;
};

export type Testimonial = {
  name: string;
  quote: string;
  accent: string;
  photo: string;
};

export type ContactCard = {
  title: string;
  lines: string[];
  icon: LucideIcon;
  /** Quando presente, o card vira um link clicável. */
  href?: string;
  /** true abre em nova aba (links externos: mapa, WhatsApp). */
  external?: boolean;
};

export const treatments: Treatment[] = [
  {
    title: "Implantes Dentários",
    description:
      "Recupere sua autoestima e função mastigatória com tecnologia suíça de última geração.",
    icon: ShieldCheck,
  },
  {
    title: "Ortodontia / Aparelho",
    description:
      "Alinhadores invisíveis e aparelhos modernos para um sorriso perfeito em menos tempo.",
    icon: SmilePlus,
  },
  {
    title: "Clareamento Dental",
    description:
      "Sorriso mais branco e radiante com técnicas a laser seguras e resultados imediatos.",
    icon: Sparkles,
  },
  {
    title: "Próteses Dentárias",
    description:
      "Reabilitação oral completa com próteses fixas e móveis de alta naturalidade.",
    icon: Syringe,
  },
  {
    title: "Limpeza e Profilaxia",
    description:
      "Prevenção é o melhor remédio. Mantenha sua saúde bucal em dia com nossa limpeza profunda.",
    icon: Stethoscope,
  },
  {
    title: "Odontopediatria",
    description:
      "Cuidado especializado para os pequenos, transformando a visita ao dentista em diversão.",
    icon: Star,
  },
];

export const highlights = [
  "Agendamento Online 24h",
  "Equipamentos de Última Geração",
  "Profissionais Especializados",
  "Atendimento Humanizado",
];

export const teamMembers: TeamMember[] = [
  {
    name: "Dra. Ana Silva",
    specialty: "Ortodontia",
    register: "CRO-SP 12345",
    quote:
      '"Especialista em alinhadores invisíveis e ortodontia estética com mais de 10 anos de experiência."',
    initials: "AS",
    accent: "from-[var(--color-surface-team-a)] to-[var(--color-white)]",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&auto=format&fit=crop&crop=faces&q=80",
  },
  {
    name: "Dr. Carlos Souza",
    specialty: "Implantes",
    register: "CRO-SP 67890",
    quote:
      '"Referência em reabilitação oral e implantes de carga imediata, focado em tecnologia e precisão."',
    initials: "CS",
    accent: "from-[var(--color-surface-team-b)] to-[var(--color-white)]",
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&auto=format&fit=crop&crop=faces&q=80",
  },
  {
    name: "Dra. Luísa Costa",
    specialty: "Odontopediatria",
    register: "CRO-SP 11223",
    quote:
      '"Apaixonada pelo atendimento infantil, cria um ambiente lúdico e sem traumas para os pequenos."',
    initials: "LC",
    accent: "from-[var(--color-surface-team-c)] to-[var(--color-white)]",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&auto=format&fit=crop&crop=faces&q=80",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ricardo Oliveira",
    quote:
      '"A melhor experiência que já tive em um dentista. Atendimento pontual, clínica impecável e profissionais extremamente competentes."',
    accent: "bg-[var(--color-surface-avatar-red)]",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop&crop=face&q=80",
  },
  {
    name: "Mariana Santos",
    quote:
      '"Fiz meu clareamento e o resultado superou todas as expectativas. Sem sensibilidade e com um acompanhamento incrível da Dra. Ana."',
    accent: "bg-[var(--color-surface-avatar-pink)]",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&auto=format&fit=crop&crop=face&q=80",
  },
  {
    name: "Felipe Almeida",
    quote:
      '"A OdontoFlow cuidou de toda a minha família. Meus filhos adoram ir ao dentista agora, graças ao carinho da equipe infantil."',
    accent: "bg-[var(--color-surface-avatar-blue)]",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&auto=format&fit=crop&crop=face&q=80",
  },
];

export const contactCards: ContactCard[] = [
  {
    title: "Endereço",
    lines: ["Rua Saúde, 123 - Centro", "São Paulo, SP"],
    icon: MapPin,
    href: mapsLinkUrl(),
    external: true,
  },
  {
    title: "E-mail",
    lines: [CLINIC_EMAIL, "Respondemos em até 1 dia útil"],
    icon: Mail,
    href: `mailto:${CLINIC_EMAIL}`,
  },
  {
    title: "Horário",
    lines: ["Seg-Sex: 8h - 18h", "Sábados: 8h - 12h"],
    icon: Clock3,
  },
  {
    title: "WhatsApp",
    lines: [CLINIC_PHONE_DISPLAY, "Resposta em até 15 min"],
    icon: MessageCircle,
    href: `https://wa.me/${CLINIC_WHATSAPP}`,
    external: true,
  },
];
