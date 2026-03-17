import {
  type LucideIcon,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
} from "lucide-react";

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
};

export type Testimonial = {
  name: string;
  quote: string;
  accent: string;
};

export type ContactCard = {
  title: string;
  lines: string[];
  icon: LucideIcon;
};

export const treatments: Treatment[] = [
  {
    title: "Implantes Dentários",
    description:
      "Recupere sua autoestima e função mastigatória com tecnologia de última geração.",
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
      "Sorriso mais branco e radiante com técnicas seguras e resultados imediatos.",
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
  },
  {
    name: "Dr. Carlos Souza",
    specialty: "Implantes",
    register: "CRO-SP 67890",
    quote:
      '"Referência em reabilitação oral e implantes de carga imediata, focado em tecnologia e precisão."',
    initials: "CS",
    accent: "from-[var(--color-surface-team-b)] to-[var(--color-white)]",
  },
  {
    name: "Dra. Luisa Costa",
    specialty: "Odontopediatria",
    register: "CRO-SP 11223",
    quote:
      '"Apaixonada pelo atendimento infantil, cria um ambiente lúdico e sem traumas para os pequenos."',
    initials: "LC",
    accent: "from-[var(--color-surface-team-c)] to-[var(--color-white)]",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ricardo Oliveira",
    quote:
      '"A melhor experiência que já tive em um dentista. Atendimento pontual, clínica impecável e profissionais extremamente competentes."',
    accent: "bg-[var(--color-surface-avatar-red)]",
  },
  {
    name: "Mariana Santos",
    quote:
      '"Fiz meu clareamento e o resultado superou todas as expectativas. Sem sensibilidade e com um acompanhamento incrível da Dra. Ana."',
    accent: "bg-[var(--color-surface-avatar-pink)]",
  },
  {
    name: "Felipe Almeida",
    quote:
      '"A OdontoFlow cuidou de toda a minha família. Meus filhos adoram ir ao dentista agora, graças ao carinho da equipe infantil."',
    accent: "bg-[var(--color-surface-avatar-blue)]",
  },
];

export const contactCards: ContactCard[] = [
  {
    title: "Endereço",
    lines: ["Rua Saúde, 123 - Centro", "São Paulo, SP"],
    icon: MapPin,
  },
  {
    title: "Telefone",
    lines: ["(11) 3333-3333", "(11) 99999-9999"],
    icon: Phone,
  },
  {
    title: "Horário",
    lines: ["Seg-Sex: 8h - 18h", "Sábados: 8h - 12h"],
    icon: Clock3,
  },
  {
    title: "WhatsApp",
    lines: ["Resposta rápida em", "até 15 minutos."],
    icon: MessageCircle,
  },
];
