"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  CalendarClock,
  CreditCard,
  DollarSign,
  Download,
  Funnel,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTransactionDialog } from "@/components/financeiro/new-transaction-dialog";
import {
  FINANCE_LINE_LABELS,
  FINANCE_LINE_POINTS,
  FINANCE_PAYMENT_METHODS,
  FINANCE_RECEIVABLES,
} from "@/lib/mock-data";
import type { FinancePaymentMethod, FinanceReceivableStatus } from "@/lib/types";

function statusClass(status: FinanceReceivableStatus) {
  if (status === "Pago") return "bg-[var(--color-success-bg)] text-[var(--color-success-strong)]";
  if (status === "Atrasado") return "bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]";
  return "bg-[var(--color-surface-warning-soft)] text-[var(--color-warning-strong)]";
}

function buildPaymentMethodsConicGradient(methods: FinancePaymentMethod[]) {
  if (!methods.length) {
    return "conic-gradient(var(--color-white) 0% 100%)";
  }

  const totalValue = methods.reduce((sum, method) => sum + method.value, 0);

  if (totalValue <= 0) {
    return "conic-gradient(var(--color-white) 0% 100%)";
  }

  const separatorSize = 2;
  const separatorCount = Math.max(methods.length - 1, 0);
  const totalSeparatorSpace = separatorCount * separatorSize;
  const availableSpace = Math.max(0, 100 - totalSeparatorSpace);
  const scaleFactor = availableSpace / totalValue;

  let current = 0;
  const parts: string[] = [];

  methods.forEach((method, index) => {
    const scaledValue = method.value * scaleFactor;
    const start = current;
    const end = start + scaledValue;

    parts.push(`${method.color} ${start}% ${end}%`);
    current = end;

    if (index < methods.length - 1 && separatorSize > 0) {
      const separatorStart = current;
      const separatorEnd = separatorStart + separatorSize;
      parts.push(`var(--color-white) ${separatorStart}% ${separatorEnd}%`);
      current = separatorEnd;
    }
  });

  if (current < 100) {
    parts.push(`var(--color-white) ${current}% 100%`);
  }

  return `conic-gradient(${parts.join(", ")})`;
}

function StatCard({
  icon,
  title,
  value,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border-panel)] bg-white p-6 shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--color-brand-teal-surface)] text-[var(--color-brand-teal)]">{icon}</div>
        {badge ? <span className={`rounded-full px-3 py-1 text-[11px] font-black ${badgeColor}`}>{badge}</span> : null}
      </div>
      <p className="mt-5 text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">{title}</p>
      <p className="mt-2 text-[22px] font-black text-[var(--color-ink-panel)]">{value}</p>
    </div>
  );
}

export function FinanceContent() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const path = FINANCE_LINE_POINTS
    .map((value, index) => {
      const x = 40 + index * 110;
      const y = 220 - value * 3;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-1 py-2">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[var(--color-ink-panel)]">Financeiro</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Visao geral do faturamento e controle de caixa.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]">
              <Download className="mr-2 h-4 w-4" />
              Relatorios
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="h-11 rounded-[16px] bg-[var(--color-brand-teal)] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_var(--color-brand-teal-glow)] hover:bg-[var(--color-brand-teal-dark)]">
              <Plus className="mr-2 h-4 w-4" />
              Nova Transacao
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          <StatCard icon={<DollarSign className="h-6 w-6" />} title="Faturamento Mensal" value="R$ 45.200" badge="↑ 12%" badgeColor="bg-[var(--color-success-bg)] text-[var(--color-success-strong)]" />
          <StatCard icon={<CalendarClock className="h-6 w-6 text-[var(--color-warning-accent)]" />} title="A Receber" value="R$ 12.800" badge="Previsao" badgeColor="bg-[var(--color-surface-panel)] text-[var(--color-text-faint-alt)]" />
          <StatCard icon={<ArrowDownLeft className="h-6 w-6 text-[var(--color-danger-action)]" />} title="Inadimplencia" value="R$ 3.400" badge="7.5%" badgeColor="bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]" />
          <StatCard icon={<TrendingUp className="h-6 w-6 text-[var(--color-text-panel)]" />} title="Ticket Medio" value="R$ 380" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
          <section className="rounded-[28px] border border-[var(--color-border-panel)] bg-white p-6 shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[18px] font-black text-[var(--color-ink-panel)]">Faturamento</h2>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Evolucao mensal nos ultimos 6 meses.</p>
              </div>
              <select className="h-10 rounded-[14px] border border-[var(--color-border-soft)] bg-white px-4 text-[14px] font-bold text-[var(--color-ink-panel)] outline-none">
                <option>Ultimos 6 meses</option>
              </select>
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox="0 0 640 280" className="h-[320px] w-full">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <line key={line} x1="40" y1={40 + line * 55} x2="610" y2={40 + line * 55} stroke="var(--color-border-panel-soft)" strokeDasharray="4 6" />
                  ))}
                  {["R$ 60k", "R$ 45k", "R$ 30k", "R$ 15k", "R$ 0k"].map((label, index) => (
                    <text key={label} x="0" y={45 + index * 55} fill="var(--color-text-caption)" fontSize="14" fontWeight="700">
                      {label}
                    </text>
                  ))}
                  <path d={`${path} L 590 220 L 40 220 Z`} fill="url(#fillGradient)" opacity="0.22" />
                  <path d={path} fill="none" stroke="var(--color-brand-teal)" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-brand-teal)" />
                      <stop offset="100%" stopColor="var(--color-brand-teal)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {FINANCE_LINE_LABELS.map((label, index) => (
                    <text key={label} x={40 + index * 110} y="250" fill="var(--color-text-panel)" fontSize="14" fontWeight="700">
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--color-border-panel)] bg-white p-6 shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)] md:p-8">
            <h2 className="text-[18px] font-black text-[var(--color-ink-panel)]">Metodos de Pagamento</h2>
            <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Distribuicao por volume de transacao.</p>

            <div className="mt-8 flex justify-center">
              <div className="relative h-52 w-52 rounded-full" style={{ background: buildPaymentMethodsConicGradient(FINANCE_PAYMENT_METHODS) }}>
                <div className="absolute inset-[24px] flex flex-col items-center justify-center rounded-full bg-white text-center">
                  <CreditCard className="h-8 w-8 text-[var(--color-text-dim)]" />
                  <p className="mt-2 text-[13px] font-black uppercase tracking-[0.14em] text-[var(--color-text-dim)]">Geral</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {FINANCE_PAYMENT_METHODS.map((method) => (
                <div key={method.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                    <span className="text-[15px] font-bold text-[var(--color-ink-panel)]">{method.label}</span>
                  </div>
                  <span className="text-[15px] font-black text-[var(--color-ink-panel)]">{method.value}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[var(--color-border-panel)] bg-white shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)]">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-6 md:flex-row md:items-start md:justify-between md:px-8">
            <div>
              <h2 className="text-[18px] font-black text-[var(--color-ink-panel)]">Contas a Receber</h2>
              <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Listagem de faturas pendentes e pagas recentemente.</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                aria-label="Filtrar"
                title="Filtrar"
                className="h-10 w-10 rounded-[14px] border-[var(--color-border-soft)] text-[var(--color-text-panel)]"
              >
                <Funnel className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-10 rounded-[14px] border-[var(--color-border-soft)] px-5 text-[14px] font-bold text-[var(--color-text-panel)]">
                Ver Tudo
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_90px] gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)] md:px-8">
              <span>Paciente</span>
              <span>Descricao</span>
              <span>Valor</span>
              <span>Vencimento</span>
              <span>Status</span>
              <span className="text-right">Acao</span>
            </div>
            {FINANCE_RECEIVABLES.map((item) => (
              <div key={`${item.patient}-${item.description}`} className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_90px] gap-4 border-b border-[var(--color-border-panel-lite)] px-6 py-5 last:border-b-0 md:px-8">
                <span className="text-[15px] font-black text-[var(--color-ink-panel)]">{item.patient}</span>
                <span className="text-[15px] font-medium text-[var(--color-text-panel)]">{item.description}</span>
                <span className="text-[15px] font-black text-[var(--color-ink-panel)]">{item.value}</span>
                <span className="text-[15px] font-black text-[var(--color-ink-panel)]">{item.due}</span>
                <span><span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${statusClass(item.status)}`}>{item.status}</span></span>
                <span className="text-right text-[15px] font-bold text-[var(--color-text-panel)]">...</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-5 lg:hidden">
            {FINANCE_RECEIVABLES.map((item) => (
              <div key={`${item.patient}-${item.description}`} className="rounded-[20px] border border-[var(--color-border-section)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-black text-[var(--color-ink-panel)]">{item.patient}</p>
                    <p className="mt-1 text-[14px] font-medium text-[var(--color-text-panel)]">{item.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${statusClass(item.status)}`}>{item.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
                  <div><p className="font-black uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">Valor</p><p className="mt-1 font-black text-[var(--color-ink-panel)]">{item.value}</p></div>
                  <div><p className="font-black uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">Vencimento</p><p className="mt-1 font-black text-[var(--color-ink-panel)]">{item.due}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}



