import Link from "next/link";
import {
  type LucideIcon,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
} from "lucide-react";

type Treatment = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type TeamMember = {
  name: string;
  specialty: string;
  register: string;
  quote: string;
  initials: string;
  accent: string;
};

type Testimonial = {
  name: string;
  quote: string;
  accent: string;
};

const treatments: Treatment[] = [
  {
    title: "Implantes Dentarios",
    description: "Recupere sua autoestima e funcao mastigatoria com tecnologia de ultima geracao.",
    icon: ShieldCheck,
  },
  {
    title: "Ortodontia / Aparelho",
    description: "Alinhadores invisiveis e aparelhos modernos para um sorriso perfeito em menos tempo.",
    icon: SmilePlus,
  },
  {
    title: "Clareamento Dental",
    description: "Sorriso mais branco e radiante com tecnicas seguras e resultados imediatos.",
    icon: Sparkles,
  },
  {
    title: "Proteses Dentarias",
    description: "Reabilitacao oral completa com proteses fixas e moveis de alta naturalidade.",
    icon: Syringe,
  },
  {
    title: "Limpeza e Profilaxia",
    description: "Prevencao e o melhor remedio. Mantenha sua saude bucal em dia com nossa limpeza profunda.",
    icon: Stethoscope,
  },
  {
    title: "Odontopediatria",
    description: "Cuidado especializado para os pequenos, transformando a visita ao dentista em diversao.",
    icon: Star,
  },
];

const highlights = [
  "Agendamento Online 24h",
  "Equipamentos de Ultima Geracao",
  "Profissionais Especializados",
  "Atendimento Humanizado",
];

const teamMembers: TeamMember[] = [
  {
    name: "Dra. Ana Silva",
    specialty: "Ortodontia",
    register: "CRO-SP 12345",
    quote: '"Especialista em alinhadores invisiveis e ortodontia estetica com mais de 10 anos de experiencia."',
    initials: "AS",
    accent: "from-[var(--color-surface-team-a)] to-[var(--color-white)]",
  },
  {
    name: "Dr. Carlos Souza",
    specialty: "Implantes",
    register: "CRO-SP 67890",
    quote: '"Referencia em reabilitacao oral e implantes de carga imediata, focado em tecnologia e precisao."',
    initials: "CS",
    accent: "from-[var(--color-surface-team-b)] to-[var(--color-white)]",
  },
  {
    name: "Dra. Luisa Costa",
    specialty: "Odontopediatria",
    register: "CRO-SP 11223",
    quote: '"Apaixonada pelo atendimento infantil, cria um ambiente ludico e sem traumas para os pequenos."',
    initials: "LC",
    accent: "from-[var(--color-surface-team-c)] to-[var(--color-white)]",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Ricardo Oliveira",
    quote: '"A melhor experiencia que ja tive em um dentista. Atendimento pontual, clinica impecavel e profissionais extremamente competentes."',
    accent: "bg-[var(--color-surface-avatar-red)]",
  },
  {
    name: "Mariana Santos",
    quote: '"Fiz meu clareamento e o resultado superou todas as expectativas. Sem sensibilidade e com um acompanhamento incrivel da Dra. Ana."',
    accent: "bg-[var(--color-surface-avatar-pink)]",
  },
  {
    name: "Felipe Almeida",
    quote: '"A OdontoClinic cuidou de toda a minha familia. Meus filhos adoram ir ao dentista agora, gracas ao carinho da equipe infantil."',
    accent: "bg-[var(--color-surface-avatar-blue)]",
  },
];

const contactCards = [
  {
    title: "Endereco",
    lines: ["Rua Saude, 123 - Centro", "Sao Paulo, SP"],
    icon: MapPin,
  },
  {
    title: "Telefone",
    lines: ["(11) 3333-3333", "(11) 99999-9999"],
    icon: Phone,
  },
  {
    title: "Horario",
    lines: ["Seg-Sex: 8h - 18h", "Sabados: 8h - 12h"],
    icon: Clock3,
  },
  {
    title: "WhatsApp",
    lines: ["Resposta rapida em", "ate 15 minutos."],
    icon: MessageCircle,
  },
];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-12 text-center">
      <h2 className="text-4xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">{title}</h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--color-brand-teal)]" />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-extrabold text-[var(--color-brand-teal)]">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[var(--color-surface-canvas)] text-[var(--color-ink-strong)]">
      <section id="inicio" className="border-b border-[var(--color-border-marketing-alt)] marketing-hero-bg">
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-chip)] px-4 py-2 text-sm font-semibold text-[var(--color-surface-chip-text)]">
              <Sparkles className="h-4 w-4" />
              Tecnologia de ponta em Odontologia
            </div>
            <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight text-[var(--color-ink-strong)] md:text-6xl">
              Seu sorriso merece o
              <span className="mt-2 block text-[var(--color-brand-teal)]">melhor cuidado</span>
            </h1>
            <div className="mt-3 h-1.5 w-44 rounded-full bg-[var(--color-warning-accent-muted)]" />
            <p className="mt-6 text-xl leading-9 text-[var(--color-text-section)]">
              Agende sua consulta online em segundos. Tratamentos modernos com profissionais especializados e atendimento humanizado para toda a familia.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-brand-teal)] px-8 py-4 text-lg font-bold text-white shadow-[0_14px_34px_var(--color-brand-teal-glow)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-teal-dark)]"
              >
                <CalendarDays className="h-5 w-5" />
                Agendar Agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#sobre"
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-brand-teal)] px-8 py-4 text-lg font-bold text-[var(--color-brand-teal)] transition hover:bg-[var(--color-brand-teal-surface-muted)]"
              >
                Conheca a Clinica
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm font-semibold text-[var(--color-text-muted-alt)]">
              <div className="flex items-center gap-1 text-[var(--color-warning-accent-soft)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-[var(--color-text-muted-alt)]">4.9 no Google</span>
              </div>
              <span className="text-[var(--color-divider-soft)]">•</span>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--color-brand-teal)]" />
                <span>+10 anos</span>
              </div>
              <span className="text-[var(--color-divider-soft)]">•</span>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--color-brand-teal)]" />
                <span>+5.000 sorrisos</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute -left-6 top-6 rounded-3xl bg-white px-5 py-4 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.12)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">Qualidade</p>
              <p className="mt-1 text-xl font-extrabold text-[var(--color-ink-strong)]">Premium</p>
            </div>
            <div className="absolute -bottom-6 right-0 rounded-3xl bg-white px-5 py-4 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.12)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">Avaliacao</p>
              <p className="mt-1 flex items-center gap-2 text-xl font-extrabold text-[var(--color-ink-strong)]">
                <Star className="h-5 w-5 fill-[var(--color-warning-accent-soft)] text-[var(--color-warning-accent-soft)]" />
                4.9/5.0
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border-[6px] border-white bg-[var(--color-surface-muted-alt)] shadow-[0_26px_70px_rgba(var(--shadow-marketing-rgb),0.16)]">
              <div className="h-[570px] marketing-hero-image" />
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="Nossos Tratamentos" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {treatments.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[2rem] border border-[var(--color-border-marketing)] bg-white p-8 shadow-[0_10px_30px_rgba(var(--shadow-marketing-rgb),0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(var(--shadow-marketing-rgb),0.08)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-teal-surface-strong)] text-[var(--color-brand-teal)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-8 text-3xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">{title}</h3>
                <p className="mt-4 text-lg leading-8 text-[var(--color-text-soft)]">{description}</p>
                <Link href="#contato" className="mt-6 inline-flex items-center gap-2 text-lg font-bold text-[var(--color-brand-teal)]">
                  Saiba mais
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[var(--color-surface-canvas-soft)] py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-[var(--color-surface-muted)] shadow-[0_22px_48px_rgba(var(--shadow-marketing-rgb),0.10)]">
              <div className="h-[430px] marketing-about-image" />
            </div>
            <div className="absolute -bottom-8 right-6 rounded-[1.75rem] bg-[var(--color-brand-teal)] px-8 py-7 text-white shadow-[0_18px_46px_rgba(var(--shadow-marketing-rgb),0.28)]">
              <p className="text-5xl font-black">10+</p>
              <p className="mt-2 max-w-[140px] text-lg font-semibold leading-7">Anos cuidando do seu sorriso</p>
            </div>
          </div>

          <div>
            <h2 className="text-5xl font-black leading-tight text-[var(--color-ink-strong)]">Por que escolher a OdontoClinic?</h2>
            <p className="mt-6 text-xl leading-9 text-[var(--color-text-section)]">
              Combinamos tecnologia de ponta com um ambiente acolhedor para proporcionar a melhor experiencia odontologica possivel.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl bg-white/90 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-highlight)] text-[var(--color-brand-teal)]">
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-bold text-[var(--color-ink-strong)]">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 border-t border-[var(--color-border-marketing)] pt-10">
              <div className="grid gap-8 sm:grid-cols-3">
                <Stat value="10+" label="Anos de Experiencia" />
                <Stat value="5.000+" label="Pacientes Felizes" />
                <Stat value="15.000+" label="Procedimentos" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="equipe" className="bg-[var(--color-surface-section-alt)] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="Nossa Equipe" />
          <div className="grid gap-6 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-[2rem] border border-[var(--color-border-marketing)] bg-white p-8 text-center shadow-[0_10px_30px_rgba(var(--shadow-marketing-rgb),0.05)]"
              >
                <div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${member.accent} text-4xl font-black text-[var(--color-brand-teal)] shadow-[inset_0_0_0_4px_rgba(232,251,246,0.9)]`}>
                  {member.initials}
                </div>
                <h3 className="mt-8 text-4xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">{member.name}</h3>
                <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-[var(--color-brand-teal)]">
                  {member.specialty} | {member.register}
                </p>
                <p className="mt-6 text-lg leading-8 text-[var(--color-text-soft)]">{member.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="bg-[var(--color-brand-teal-surface)] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="O que nossos pacientes dizem" />
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[2rem] border border-[var(--color-border-panel)] bg-white p-8 shadow-[0_10px_24px_rgba(var(--shadow-marketing-rgb),0.05)]"
              >
                <div className="flex items-center gap-1 text-[var(--color-warning-accent-soft)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-6 text-lg leading-9 text-[var(--color-ink-muted)]">{testimonial.quote}</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-full ${testimonial.accent}`} />
                  <div>
                    <p className="text-lg font-extrabold text-[var(--color-ink-strong)]">{testimonial.name}</p>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-text-faint-strong)]">Paciente Verificado</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] marketing-cta-bg px-8 py-16 text-center text-white shadow-[0_26px_60px_rgba(var(--shadow-marketing-rgb),0.26)] lg:px-16">
          <h2 className="mx-auto max-w-3xl text-5xl font-black leading-tight">Agende sua consulta agora mesmo</h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/88">
            Escolha o melhor horario para voce diretamente no nosso sistema, sem precisar ligar ou esperar. Rapido, facil e moderno.
          </p>
          <Link
            href="/cadastro"
            className="mt-10 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-4 text-lg font-extrabold text-[var(--color-brand-teal)] shadow-[0_18px_40px_rgba(var(--shadow-marketing-rgb),0.18)] transition hover:-translate-y-0.5"
          >
            <CalendarDays className="h-5 w-5" />
            Agendar Consulta
          </Link>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.34em] text-white/80">
            Atendimento disponivel em horario comercial e sabados.
          </p>
        </div>
      </section>

      <section id="contato" className="bg-[var(--color-surface-section)] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.06)] md:p-10">
            <h2 className="text-5xl font-black tracking-tight text-[var(--color-ink-strong)]">Fale Conosco</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--color-text-soft)]">
              Envie-nos uma mensagem e retornaremos em breve para tirar suas duvidas ou agendar sua visita.
            </p>
            <form className="mt-10 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">Nome Completo</span>
                  <input className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]" placeholder="Seu nome" />
                </label>
                <label className="block">
                  <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">Telefone</span>
                  <input className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]" placeholder="(11) 99999-9999" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">E-mail</span>
                <input className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]" placeholder="exemplo@email.com" />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">Mensagem</span>
                <textarea className="mt-3 min-h-36 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 py-4 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]" placeholder="Como podemos ajudar?" />
              </label>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-brand-teal)] px-8 py-4 text-lg font-extrabold text-white shadow-[0_14px_34px_var(--color-brand-teal-glow)] transition hover:bg-[var(--color-brand-teal-dark)]"
              >
                <Send className="h-5 w-5" />
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {contactCards.map(({ title, lines, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-[2rem] bg-white p-6 shadow-[0_14px_32px_rgba(var(--shadow-marketing-rgb),0.06)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-teal-surface-strong)] text-[var(--color-brand-teal)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-[var(--color-ink-strong)]">{title}</h3>
                  <div className="mt-3 space-y-1 text-base leading-7 text-[var(--color-text-soft)]">
                    {lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_14px_32px_rgba(var(--shadow-marketing-rgb),0.06)]">
              <div className="flex h-[300px] items-center justify-center rounded-[1.6rem] border border-[var(--color-border-panel-muted)] marketing-map-bg">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-[var(--color-brand-teal)]" />
                  <p className="mt-4 text-3xl font-black text-[var(--color-ink-strong)]">Sao Paulo</p>
                  <p className="mt-2 text-base text-[var(--color-text-soft)]">Mapa ilustrativo da regiao da clinica</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


