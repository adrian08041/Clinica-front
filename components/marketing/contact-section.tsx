"use client";

import { Send } from "lucide-react";
import {
  CLINIC_ADDRESS,
  contactCards,
  mapsEmbedUrl,
} from "@/components/marketing/landing-data";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section id="contato" className="bg-background-main py-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <ScrollReveal direction="left">
          <Card className="p-6 md:p-8">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Fale Conosco
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
              Envie-nos uma mensagem e retornaremos em breve para tirar suas dúvidas
              ou agendar sua visita.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="exemplo@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  autoComplete="off"
                  placeholder="Como podemos ajudar?"
                  className="min-h-32"
                />
              </div>
              <Button type="submit" variant="brand" size="lg" className="w-full">
                <Send />
                Enviar Mensagem
              </Button>
            </form>
          </Card>
        </ScrollReveal>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {contactCards.map(({ title, lines, icon: Icon, href, external }, index) => {
              const inner = (
                <>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-primary/10">
                    <Icon className="size-5 text-brand-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-text-primary">
                    {title}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm leading-6 text-text-secondary">
                    {lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </>
              );

              return (
                <ScrollReveal key={title} delay={index * 100} direction="right">
                  <Card
                    asChild
                    className="h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {href ? (
                      <a
                        href={href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      <article>{inner}</article>
                    )}
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={200} direction="right">
            <Card className="overflow-hidden p-0">
              <iframe
                title={`Mapa da OdontoFlow — ${CLINIC_ADDRESS}`}
                src={mapsEmbedUrl()}
                className="h-[300px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
