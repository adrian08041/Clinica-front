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
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  NewTransactionDialog,
  type NewTransactionPayload as DialogTransactionPayload,
} from "@/components/financeiro/new-transaction-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTransaction,
  useDeleteTransaction,
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

function statusVariant(status: FinanceStatus): "success" | "warning" | "danger" {
  if (status === "Pago") return "success";
  if (status === "Atrasado") return "danger";
  return "warning";
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
    <Card className="p-6 gap-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--color-brand-teal-surface)] text-[var(--color-brand-teal)]">
          {icon}
        </div>
        {badge ? <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeColor}`}>{badge}</span> : null}
      </div>
      <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">{title}</p>
      <p className="mt-2 text-[22px] font-bold text-[var(--color-ink-panel)]">{value}</p>
    </Card>
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FinanceStatus | "">("");
  const [page] = useState(0);
  const [transactionToDelete, setTransactionToDelete] = useState<FinanceReceivableDTO | null>(null);

  const receivablesQuery = useReceivables({ search, status: statusFilter, page, size: 20 });
  const statsQuery = useFinanceStats();
  const revenueHistoryQuery = useRevenueHistory(6);
  const paymentMethodsQuery = usePaymentMethods();

  const createTransaction = useCreateTransaction();
  const updateStatus = useUpdateTransactionStatus();
  const deleteTransaction = useDeleteTransaction();

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
        patientId: payload.patientId,
        patient: payload.patientName || null,
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

  const confirmDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction.mutateAsync(transactionToDelete.id);
      setTransactionToDelete(null);
      toast.success("Transação excluída com sucesso!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao excluir transação");
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

  const handleExportReport = () => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const statsRows = stats
      ? [
          { label: "Faturamento Mensal", value: formatCurrency(stats.revenue) },
          { label: "A Receber", value: formatCurrency(stats.toReceive) },
          { label: "Inadimplência", value: formatCurrency(stats.overdue) },
          { label: "Ticket Médio", value: formatCurrency(stats.avgTicket) },
        ]
      : [];

    const summaryCards = statsRows
      .map((item) => `<div><span>${escapeHtml(item.label)}</span>${item.value}</div>`)
      .join("");

    const rows = receivables
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.patientName)}</td>
            <td>${escapeHtml(item.description)}</td>
            <td>${escapeHtml(item.status)}</td>
            <td>${formatDatePtBr(item.due)}</td>
            <td class="value">${formatCurrency(Number(item.value ?? 0))}</td>
          </tr>`,
      )
      .join("");

    const statusLabel = statusFilter || "Todos";

    const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Relatório Financeiro</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #1a1a1a; margin: 32px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .muted { color: #555; font-size: 13px; margin: 2px 0; }
      .summary { display: flex; flex-wrap: wrap; gap: 24px; margin: 24px 0; }
      .summary div { font-size: 16px; font-weight: 700; }
      .summary span { display: block; font-size: 11px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.08em; color: #777; margin-bottom: 2px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
      th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e2e2; }
      th { text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; color: #777; }
      .value, td.value, th.value { text-align: right; }
      @media print { body { margin: 0; } }
    </style>
  </head>
  <body onload="window.print()">
    <h1>Relatório Financeiro</h1>
    <p class="muted">Contas a receber — filtro: ${escapeHtml(statusLabel)}</p>

    ${summaryCards ? `<div class="summary">${summaryCards}</div>` : ""}

    <table>
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Vencimento</th>
          <th class="value">Valor</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="5">Nenhuma transação encontrada.</td></tr>'}</tbody>
    </table>
  </body>
</html>`;

    const reportWindow = window.open("", "_blank", "width=900,height=700");
    if (!reportWindow) {
      toast.error("Não foi possível abrir o relatório. Verifique o bloqueador de pop-ups.");
      return;
    }

    reportWindow.document.write(html);
    reportWindow.document.close();
  };

  const isReceivablesLoading = receivablesQuery.isLoading;

  const financeQueries = [
    receivablesQuery,
    statsQuery,
    revenueHistoryQuery,
    paymentMethodsQuery,
  ];
  const hasError = financeQueries.some((q) => q.isError);
  const firstError = financeQueries.find((q) => q.isError)?.error;
  const isRetrying = financeQueries.some((q) => q.isFetching);
  const retryAll = () => {
    financeQueries.forEach((q) => void q.refetch());
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-1 py-2">
        {hasError ? (
          <QueryErrorBanner
            error={firstError}
            onRetry={retryAll}
            isRetrying={isRetrying}
          />
        ) : null}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-ink-panel)]">Financeiro</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--color-text-panel-soft)]">
              Visão geral do faturamento e controle de caixa.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="size-4" />
              Relatórios
            </Button>
            <Button
              onClick={() => setDialogOpen(true)}
              variant="brand"
            >
              <Plus className="size-4" />
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
          <Card asChild className="p-6 md:p-8 gap-0">
            <section>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[var(--color-ink-panel)]">Faturamento</h2>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Evolução mensal nos últimos 6 meses.</p>
              </div>
              <Select defaultValue="6m">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                </SelectContent>
              </Select>
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
          </Card>

          <Card asChild className="p-6 md:p-8 gap-0">
            <section>
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
          </Card>
        </div>

        <Card asChild className="overflow-hidden gap-0 py-0">
          <section>
          <div className="flex flex-col gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-6 md:flex-row md:items-start md:justify-between md:px-8">
            <div>
              <h2 className="text-[18px] font-bold text-[var(--color-ink-panel)]">Contas a Receber</h2>
              <p className="mt-2 text-[15px] font-medium text-[var(--color-text-panel-soft)]">Listagem de faturas pendentes e pagas recentemente.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint-soft)]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar paciente ou descrição..."
                  className="pl-9 sm:w-64"
                />
              </div>
              <Select
                value={statusFilter || "all"}
                onValueChange={(v) => setStatusFilter(v === "all" ? "" : (v as FinanceStatus))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_160px] gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)] md:px-8">
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
                  className="grid grid-cols-[1.1fr_1.6fr_180px_180px_140px_160px] gap-4 border-b border-[var(--color-border-panel-lite)] px-6 py-5 last:border-b-0 md:px-8"
                >
                  <span className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{item.patientName}</span>
                  <span className="text-[15px] font-medium text-[var(--color-text-panel)]">{item.description}</span>
                  <span className="text-[15px] font-bold text-[var(--color-ink-panel)]">{formatCurrency(item.value)}</span>
                  <span className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{formatDatePtBr(item.due)}</span>
                  <span>
                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                  </span>
                  <span className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() => void handleCycleStatus(item)}
                      className="h-8 rounded-[10px] border-[var(--color-border-soft)] px-3 text-[12px] font-bold text-[var(--color-text-panel)]"
                    >
                      Avançar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Excluir transação"
                      title="Excluir transação"
                      onClick={() => setTransactionToDelete(item)}
                      className="h-8 w-8 rounded-[10px] border-[var(--color-border-soft)] text-[var(--color-danger-action)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger-action)]"
                    >
                      <Trash2 className="h-4 w-4" />
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
                <Card key={item.id} className="p-5 gap-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-[var(--color-ink-panel)]">{item.patientName}</p>
                      <p className="mt-1 text-[14px] font-medium text-[var(--color-text-panel)]">{item.description}</p>
                    </div>
                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
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
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={() => void handleCycleStatus(item)}
                      className="h-8 rounded-[10px] border-[var(--color-border-soft)] px-3 text-[12px] font-bold text-[var(--color-text-panel)]"
                    >
                      Avançar status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTransactionToDelete(item)}
                      className="h-8 rounded-[10px] border-[var(--color-border-soft)] px-3 text-[12px] font-bold text-[var(--color-danger-action)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger-action)]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
          </section>
        </Card>
      </div>

      <NewTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreateTransaction}
        isPending={createTransaction.isPending}
      />

      <ConfirmDialog
        open={Boolean(transactionToDelete)}
        onOpenChange={(open) => {
          if (!open) setTransactionToDelete(null);
        }}
        onConfirm={() => void confirmDeleteTransaction()}
        title="Excluir transação"
        description={
          <>
            Tem certeza que deseja excluir a transação{" "}
            <span className="font-semibold text-text-primary">
              {transactionToDelete?.description}
            </span>
            {transactionToDelete?.patientName ? (
              <>
                {" "}de{" "}
                <span className="font-semibold text-text-primary">
                  {transactionToDelete.patientName}
                </span>
              </>
            ) : null}
            ? Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        isLoading={deleteTransaction.isPending}
      />
    </>
  );
}
