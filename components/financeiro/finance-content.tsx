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

function statusClass(status: string) {
  if (status === "Pago") return "bg-[#e8faf2] text-[#00a56d]";
  if (status === "Atrasado") return "bg-[#ffe8ed] text-[#ff2056]";
  return "bg-[#fff4e5] text-[#ff9800]";
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
    <div className="rounded-[24px] border border-[#dfe6f2] bg-white p-6 shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#eefcfb] text-[#0e9e95]">{icon}</div>
        {badge ? <span className={`rounded-full px-3 py-1 text-[11px] font-black ${badgeColor}`}>{badge}</span> : null}
      </div>
      <p className="mt-5 text-[12px] font-black uppercase tracking-[0.14em] text-[#93a0bd]">{title}</p>
      <p className="mt-2 text-[22px] font-black text-[#0f274c]">{value}</p>
    </div>
  );
}

export function FinanceContent() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const path = FINANCE_LINE_POINTS
    .map((value, index) => {
      const x = 40 + index * 110;
      const y = 220 - value * 3;
      return `${index === 0 ? "M" : "S"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-1 py-2">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#0f274c]">Financeiro</h1>
            <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Visao geral do faturamento e controle de caixa.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-[16px] border-[#d9e1ef] px-6 text-[15px] font-bold text-[#4f6183]">
              <Download className="mr-2 h-4 w-4" />
              Relatorios
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="h-11 rounded-[16px] bg-[#0e9e95] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[#0c8d85]">
              <Plus className="mr-2 h-4 w-4" />
              Nova Transacao
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          <StatCard icon={<DollarSign className="h-6 w-6" />} title="Faturamento Mensal" value="R$ 45.200" badge="↑ 12%" badgeColor="bg-[#e8faf2] text-[#00a56d]" />
          <StatCard icon={<CalendarClock className="h-6 w-6 text-[#d9ad4c]" />} title="A Receber" value="R$ 12.800" badge="Previsao" badgeColor="bg-[#f8fbff] text-[#93a0bd]" />
          <StatCard icon={<ArrowDownLeft className="h-6 w-6 text-[#ff2056]" />} title="Inadimplencia" value="R$ 3.400" badge="7.5%" badgeColor="bg-[#ffe8ed] text-[#ff2056]" />
          <StatCard icon={<TrendingUp className="h-6 w-6 text-[#4f6183]" />} title="Ticket Medio" value="R$ 380" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
          <section className="rounded-[28px] border border-[#dfe6f2] bg-white p-6 shadow-[0_8px_24px_rgba(15,39,76,0.06)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[18px] font-black text-[#0f274c]">Faturamento</h2>
                <p className="mt-2 text-[15px] font-medium text-[#5f7091]">Evolucao mensal nos ultimos 6 meses.</p>
              </div>
              <select className="h-10 rounded-[14px] border border-[#d9e1ef] bg-white px-4 text-[14px] font-bold text-[#0f274c] outline-none">
                <option>Ultimos 6 meses</option>
              </select>
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox="0 0 640 280" className="h-[320px] w-full">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <line key={line} x1="40" y1={40 + line * 55} x2="610" y2={40 + line * 55} stroke="#e9eef6" strokeDasharray="4 6" />
                  ))}
                  {["R$ 60k", "R$ 45k", "R$ 30k", "R$ 15k", "R$ 0k"].map((label, index) => (
                    <text key={label} x="0" y={45 + index * 55} fill="#6b7d99" fontSize="14" fontWeight="700">
                      {label}
                    </text>
                  ))}
                  <path d={`${path} L 590 220 L 40 220 Z`} fill="url(#fillGradient)" opacity="0.22" />
                  <path d={path} fill="none" stroke="#0e9e95" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0e9e95" />
                      <stop offset="100%" stopColor="#0e9e95" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {FINANCE_LINE_LABELS.map((label, index) => (
                    <text key={label} x={40 + index * 110} y="250" fill="#4f6183" fontSize="14" fontWeight="700">
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#dfe6f2] bg-white p-6 shadow-[0_8px_24px_rgba(15,39,76,0.06)] md:p-8">
            <h2 className="text-[18px] font-black text-[#0f274c]">Metodos de Pagamento</h2>
            <p className="mt-2 text-[15px] font-medium text-[#5f7091]">Distribuicao por volume de transacao.</p>

            <div className="mt-8 flex justify-center">
              <div className="relative h-52 w-52 rounded-full" style={{ background: "conic-gradient(#0e9e95 0% 45%, #ffffff 45% 48%, #d9ad4c 48% 83%, #ffffff 83% 86%, #ff6f66 86% 98%, #ffffff 98% 100%)" }}>
                <div className="absolute inset-[24px] flex flex-col items-center justify-center rounded-full bg-white text-center">
                  <CreditCard className="h-8 w-8 text-[#b5c1d6]" />
                  <p className="mt-2 text-[13px] font-black uppercase tracking-[0.14em] text-[#b5c1d6]">Geral</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {FINANCE_PAYMENT_METHODS.map((method) => (
                <div key={method.label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                    <span className="text-[15px] font-bold text-[#0f274c]">{method.label}</span>
                  </div>
                  <span className="text-[15px] font-black text-[#0f274c]">{method.value}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
          <div className="flex flex-col gap-4 border-b border-[#eef2f8] px-6 py-6 md:flex-row md:items-start md:justify-between md:px-8">
            <div>
              <h2 className="text-[18px] font-black text-[#0f274c]">Contas a Receber</h2>
              <p className="mt-2 text-[15px] font-medium text-[#5f7091]">Listagem de faturas pendentes e pagas recentemente.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-[14px] border-[#d9e1ef] text-[#4f6183]">
                <Funnel className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-10 rounded-[14px] border-[#d9e1ef] px-5 text-[14px] font-bold text-[#4f6183]">
                Ver Tudo
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_90px] gap-4 border-b border-[#eef2f8] px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#93a0bd] md:px-8">
              <span>Paciente</span>
              <span>Descricao</span>
              <span>Valor</span>
              <span>Vencimento</span>
              <span>Status</span>
              <span className="text-right">Acao</span>
            </div>
            {FINANCE_RECEIVABLES.map((item) => (
              <div key={`${item.patient}-${item.description}`} className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_90px] gap-4 border-b border-[#f1f4f9] px-6 py-5 last:border-b-0 md:px-8">
                <span className="text-[15px] font-black text-[#0f274c]">{item.patient}</span>
                <span className="text-[15px] font-medium text-[#4f6183]">{item.description}</span>
                <span className="text-[15px] font-black text-[#0f274c]">{item.value}</span>
                <span className="text-[15px] font-black text-[#0f274c]">{item.due}</span>
                <span><span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${statusClass(item.status)}`}>{item.status}</span></span>
                <span className="text-right text-[15px] font-bold text-[#4f6183]">...</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-5 lg:hidden">
            {FINANCE_RECEIVABLES.map((item) => (
              <div key={`${item.patient}-${item.description}`} className="rounded-[20px] border border-[#e1e8f2] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[16px] font-black text-[#0f274c]">{item.patient}</p>
                    <p className="mt-1 text-[14px] font-medium text-[#4f6183]">{item.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase ${statusClass(item.status)}`}>{item.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
                  <div><p className="font-black uppercase tracking-[0.12em] text-[#93a0bd]">Valor</p><p className="mt-1 font-black text-[#0f274c]">{item.value}</p></div>
                  <div><p className="font-black uppercase tracking-[0.12em] text-[#93a0bd]">Vencimento</p><p className="mt-1 font-black text-[#0f274c]">{item.due}</p></div>
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
