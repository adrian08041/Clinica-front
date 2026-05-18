"use client";

import { useMemo, useState } from "react";
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
import { toast } from "sonner";
import {
  NewTransactionDialog,
  type NewTransactionPayload as DialogTransactionPayload,
} from "@/components/financeiro/new-transaction-dialog";
import { Button } from "@/components/ui/button";
import {
  useCreateTransaction,
  useFinanceStats,
  usePaymentMethods,
  useReceivables,
  useRevenueHistory,
  useUpdateTransactionStatus,
  nextStatus,
  type FinanceReceivableDTO,
  type FinanceStatus,
  type PaymentMethodDTO,
} from "@/lib/queries/finance";
import { formatDatePtBr } from "@/lib/utils/date";

function statusClass(status: FinanceStatus) {
  if (status === "Pago") return "bg-[var(--color-success-bg)] text-[var(--color-success-strong)]";
  if (status === "Atrasado") return "bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]";
  return "bg-[var(--color-surface-warning-soft)] text-[var(--color-warning-strong)]";
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPercent(value: number) {
  const sign = value >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(value).toFixed(1)}%`;
}

function buildPaymentMethodsConicGradient(methods: PaymentMethodDTO[]) {
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
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--color-brand-teal-surface)] text-[var(--color-brand-teal)]">
          {icon}
        </div>
        {badge ? <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeColor}`}>{badge}</span> : null}
      </div>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">{title}</p>
      <p className="mt-2 text-[22px] font-bold text-[var(--color-ink-panel)]">{value}</p>
    </div>
  );
}

interface ChartShape {
  path: string;
  fillPath: string;
  maxValue: number;
}

function buildRevenuePath(values: number[]): ChartShape {
  if (!values.length) return { path: "", fillPath: "", maxValue: 0 };

  const width = 640;
  const paddingLeft = 40;
  const paddingRight = 30;
  const top = 40;
  const bottom = 220;

  const maxValue = Math.max(...values, 1);
  const usableWidth = width - paddingLeft - paddingRight;
  const stepX = values.length > 1 ? usableWidth / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = paddingLeft + index * stepX;
    const ratio = value / maxValue;
    const y = bottom - ratio * (bottom - top);
    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

  const lastX = points[points.length - 1].x.toFixed(1);
  const firstX = points[0].x.toFixed(1);
  const fillPath = `${path} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;

  return { path, fillPath, maxValue };
}

function buildYAxisLabels(maxValue: number) {
  const ceil = Math.ceil(maxValue / 1000) * 1000 || 1000;
  const steps = 4;
  const labels: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const value = (ceil * (steps - i)) / steps;
    if (value >= 1000) {
      labels.push(`R$ ${Math.round(value / 1000)}k`);
    } else {
      labels.push(`R$ ${Math.round(value)}`);
    }
  }
  return labels;
}

export function FinanceContent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FinanceStatus | "">("");
  const [page] = useState(0);

  const receivablesQuery = useReceivables({ status: statusFilter, page, size: 20 });
  const statsQuery = useFinanceStats();
  const revenueHistoryQuery = useRevenueHistory(6);
  const paymentMethodsQuery = usePaymentMethods();

  const createTransaction = useCreateTransaction();
  const updateStatus = useUpdateTransactionStatus();

  const receivables: FinanceReceivableDTO[] = receivablesQuery.data?.content ?? [];
  const stats = statsQuery.data;
  const revenueHistory = revenueHistoryQuery.data;
  const paymentMethods = paymentMethodsQuery.data ?? [];

  const chart = useMemo(() => buildRevenuePath(revenueHistory?.values ?? []), [revenueHistory]);
  const yLabels = useMemo(
    () => buildYAxisLabels(chart.maxValue),
    [chart.maxValue],
  );

  const handleCreateTransaction = async (payload: DialogTransactionPayload) => {
    try {
      await createTransaction.mutateAsync({
        type: payload.type,
        patient: payload.patient || null,
        description: payload.description || (payload.type === "receita" ? "Nova receita" : "Nova despesa"),
        amount: payload.amount,
        dueDate: payload.dueDate || new Date().toISOString().slice(0, 10),
        method: payload.method && payload.method !== "Selecione..." ? payload.method : null,
        category: payload.category && payload.category !== "Selecione..." ? payload.category : null,
        installments: payload.installments || null,
        notes: payload.notes || null,
      });
      toast.success("Transação criada com sucesso!");
      setDialogOpen(false);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao criar transação");
    }
  };

  const handleCycleStatus = async (item: FinanceReceivableDTO) => {
    const target = nextStatus(item.status);
    try {
      await updateStatus.mutateAsync({ id: item.id, status: target });
      toast.success(`Status atualizado para ${target}`);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao atualizar status");
    }
  };

  const isReceivablesLoading = receivablesQuery.isLoading;

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-1 py-2">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-ink-panel)]">Financeiro</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--color-text-panel-soft)]">
              Visão geral do faturamento e controle de caixa.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]"
            >
              <Download className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
            <Button
              onClick={() => setDialogOpen(true)}
              className="h-11 rounded-[16px] bg-[var(--color-brand-teal)] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_var(--color-brand-teal-glow)] hover:bg-[var(--color-brand-teal-dark)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Faturamento Mensal"
            value={stats ? formatCurrency(stats.revenue) : "—"}
            badge={stats ? formatPercent(stats.revenueGrowth) : undefined}
            badgeColor={
              stats && stats.revenueGrowth >= 0
                ? "bg-[var(--color-success-bg)] text-[var(--color-success-strong)]"
                : "bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]"
            }
          />
          <StatCard
            icon={<CalendarClock className="h-6 w-6 text-[var(--color-warning-accent)]" />}
            title="A Receber"
            value={stats ? formatCurrency(stats.toReceive) : "—"}
            badge="Previsão"
            badgeColor="bg-[var(--color-surface-panel)] text-[var(--color-text-faint-alt)]"
          />
          <StatCard
            icon={<ArrowDownLeft className="h-6 w-6 text-[var(--color-danger-action)]" />}
            title="Inadimplência"
            value={stats ? formatCurrency(stats.overdue) : "—"}
            badgeColor="bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-[var(--color-text-panel)]" />}
            title="Ticket Médio"
            value={stats ? formatCurrency(stats.avgTicket) : "—"}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
          <section className="rounded-[28px] border border-[var(--color-border-panel)] bg-white p-6 shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--color-ink-panel)]">Faturamento</h2>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Evolução mensal nos últimos 6 meses.</p>
              </div>
              <select className="h-10 rounded-[14px] border border-[var(--color-border-soft)] bg-white px-4 text-[14px] font-bold text-[var(--color-ink-panel)] outline-none">
                <option>Últimos 6 meses</option>
              </select>
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="min-w-[620px]">
                <svg viewBox="0 0 640 280" className="h-[320px] w-full">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <line
                      key={line}
                      x1="40"
                      y1={40 + line * 45}
                      x2="610"
                      y2={40 + line * 45}
                      stroke="var(--color-border-panel-soft)"
                      strokeDasharray="4 6"
                    />
                  ))}
                  {yLabels.map((label, index) => (
                    <text key={`${label}-${index}`} x="0" y={45 + index * 45} fill="var(--color-text-caption)" fontSize="14" fontWeight="700">
                      {label}
                    </text>
                  ))}
                  {chart.path ? (
                    <>
                      <path d={chart.fillPath} fill="url(#fillGradient)" opacity="0.22" />
                      <path d={chart.path} fill="none" stroke="var(--color-brand-teal)" strokeWidth="4" strokeLinecap="round" />
                    </>
                  ) : null}
                  <defs>
                    <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-brand-teal)" />
                      <stop offset="100%" stopColor="var(--color-brand-teal)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {(revenueHistory?.labels ?? []).map((label, index) => {
                    const usableWidth = 640 - 40 - 30;
                    const stepX = (revenueHistory?.labels.length ?? 1) > 1
                      ? usableWidth / ((revenueHistory?.labels.length ?? 1) - 1)
                      : 0;
                    return (
                      <text
                        key={`${label}-${index}`}
                        x={40 + index * stepX}
                        y="250"
                        fill="var(--color-text-panel)"
                        fontSize="14"
                        fontWeight="700"
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[var(--color-border-panel)] bg-white p-6 shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)] md:p-8">
            <h2 className="text-[18px] font-black text-[var(--color-ink-panel)]">Métodos de Pagamento</h2>
            <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Distribuição por volume de transação.</p>

            <div className="mt-8 flex justify-center">
              <div className="relative h-52 w-52 rounded-full" style={{ background: buildPaymentMethodsConicGradient(paymentMethods) }}>
                <div className="absolute inset-[24px] flex flex-col items-center justify-center rounded-full bg-white text-center">
                  <CreditCard className="h-8 w-8 text-[var(--color-text-dim)]" />
                  <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-dim)]">Geral</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {paymentMethods.length === 0 ? (
                <p className="text-[14px] font-medium text-[var(--color-text-panel-soft)]">Sem dados ainda.</p>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.label} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: method.color }} />
                      <span className="text-[15px] font-bold text-[var(--color-ink-panel)]">{method.label}</span>
                    </div>
                    <span className="text-[15px] font-bold text-[var(--color-ink-panel)]">{method.value}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[var(--color-border-panel)] bg-white shadow-[0_8px_24px_rgba(var(--shadow-panel-rgb),0.06)]">
          <div className="flex flex-col gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-6 md:flex-row md:items-start md:justify-between md:px-8">
            <div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink-panel)]">Contas a Receber</h2>
              <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Listagem de faturas pendentes e pagas recentemente.</p>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FinanceStatus | "")}
                className="h-10 rounded-[14px] border border-[var(--color-border-soft)] bg-white px-3 text-[14px] font-bold text-[var(--color-ink-panel)] outline-none"
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Atrasado">Atrasado</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                aria-label="Filtrar"
                title="Filtrar"
                className="h-10 w-10 rounded-[14px] border-[var(--color-border-soft)] text-[var(--color-text-panel)]"
              >
                <Funnel className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_120px] gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)] md:px-8">
              <span>Paciente</span>
              <span>Descrição</span>
              <span>Valor</span>
              <span>Vencimento</span>
              <span>Status</span>
              <span className="text-right">Ação</span>
            </div>
            {isReceivablesLoading ? (
              <div className="px-6 py-8 text-[15px] font-medium text-[var(--color-text-panel-soft)] md:px-8">Carregando...</div>
            ) : receivables.length === 0 ? (
              <div className="px-6 py-8 text-[15px] font-medium text-[var(--color-text-panel-soft)] md:px-8">Nenhuma transação encontrada.</div>
            ) : (
              receivables.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_120px] gap-4 border-b border-[var(--color-border-panel-lite)] px-6 py-5 last:border-b-0 md:px-8"
                >
                  <span className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{item.patientName}</span>
                  <span className="text-[15px] font-medium text-[var(--color-text-panel)]">{item.description}</span>
                  <span className="text-[15px] font-bold text-[var(--color-ink-panel)]">{formatCurrency(item.value)}</span>
                  <span className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{formatDatePtBr(item.due)}</span>
                  <span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${statusClass(item.status)}`}>{item.status}</span>
                  </span>
                  <span className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() => void handleCycleStatus(item)}
                      className="h-8 rounded-[10px] border-[var(--color-border-soft)] px-3 text-[12px] font-bold text-[var(--color-text-panel)]"
                    >
                      Avançar
                    </Button>
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4 p-5 lg:hidden">
            {isReceivablesLoading ? (
              <p className="text-[15px] font-medium text-[var(--color-text-panel-soft)]">Carregando...</p>
            ) : receivables.length === 0 ? (
              <p className="text-[15px] font-medium text-[var(--color-text-panel-soft)]">Nenhuma transação encontrada.</p>
            ) : (
              receivables.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-[var(--color-border-section)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-[var(--color-ink-panel)]">{item.patientName}</p>
                      <p className="mt-1 text-[14px] font-medium text-[var(--color-text-panel)]">{item.description}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <p className="font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">Valor</p>
                      <p className="mt-1 font-bold text-[var(--color-ink-panel)]">{formatCurrency(item.value)}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">Vencimento</p>
                      <p className="mt-1 font-semibold text-[var(--color-ink-panel)]">{formatDatePtBr(item.due)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() => void handleCycleStatus(item)}
                      className="h-8 rounded-[10px] border-[var(--color-border-soft)] px-3 text-[12px] font-bold text-[var(--color-text-panel)]"
                    >
                      Avançar status
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <NewTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreateTransaction}
        isPending={createTransaction.isPending}
      />
    </>
  );
}
