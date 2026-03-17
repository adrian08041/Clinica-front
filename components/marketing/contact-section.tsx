"use client";

import { MapPin, Send } from "lucide-react";
import { contactCards } from "@/components/marketing/landing-data";

export function ContactSection() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section id="contato" className="bg-[var(--color-surface-section)] py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_38px_rgba(var(--shadow-marketing-rgb),0.06)] md:p-10">
          <h2 className="text-5xl font-black tracking-tight text-[var(--color-ink-strong)]">
            Fale Conosco
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--color-text-soft)]">
            Envie-nos uma mensagem e retornaremos em breve para tirar suas dúvidas
            ou agendar sua visita.
          </p>
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                  Nome Completo
                </span>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]"
                  placeholder="Seu nome"
                />
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                  Telefone
                </span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]"
                  placeholder="(11) 99999-9999"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                E-mail
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="mt-3 h-14 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]"
                placeholder="exemplo@email.com"
              />
            </label>
            <label className="block">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                Mensagem
              </span>
              <textarea
                name="message"
                autoComplete="off"
                className="mt-3 min-h-36 w-full rounded-2xl border border-[var(--color-border-panel-muted)] bg-[var(--color-background-card)] px-5 py-4 text-base text-[var(--color-ink-strong)] outline-none transition focus:border-[var(--color-brand-teal)]"
                placeholder="Como podemos ajudar?"
              />
            </label>
            <button
              type="submit"
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
                <h3 className="mt-5 text-xl font-extrabold text-[var(--color-ink-strong)]">
                  {title}
                </h3>
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
                <p className="mt-4 text-3xl font-black text-[var(--color-ink-strong)]">
                  São Paulo
                </p>
                <p className="mt-2 text-base text-[var(--color-text-soft)]">
                  Mapa ilustrativo da região da clínica
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
