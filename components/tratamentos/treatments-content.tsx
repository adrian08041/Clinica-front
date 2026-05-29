"use client";

import { useMemo, useState } from "react";
import { CircleDot, Clock3, MoreVertical, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { NewPlanDialog, type ProcedureDraft } from "@/components/tratamentos/new-plan-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  useApproveStep,
  useCreateTreatment,
  useDeleteTreatment,
  useTreatment,
  useTreatments,
  type TreatmentPlanResponse,
  type TreatmentProcedureRequest,
} from "@/lib/queries/treatments";
import { formatDatePtBr } from "@/lib/utils/date";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Card className="p-5 gap-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">{label}</p>
      <p className={`mt-2 text-[18px] font-bold ${color ?? "text-[var(--color-ink-panel)]"}`}>{value}</p>
    </Card>
  );
}

function StatusBadge({ paid }: { paid: boolean }) {
  return (
    <Badge variant={paid ? "success" : "neutral"}>
      {paid ? "Pago" : "Pendente"}
    </Badge>
  );
}

export function TreatmentsContent() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<TreatmentPlanResponse | null>(null);

  const treatmentsQuery = useTreatments({ page: 0, size: 20, search });
  const plans = useMemo<TreatmentPlanResponse[]>(
    () => treatmentsQuery.data?.content ?? [],
    [treatmentsQuery.data],
  );

  const effectiveSelectedId = useMemo(() => {
    if (plans.length === 0) return null;
    if (selectedId && plans.some((plan) => plan.id === selectedId)) return selectedId;
    return plans[0].id;
  }, [plans, selectedId]);

  const selectedDetailQuery = useTreatment(effectiveSelectedId ?? undefined);
  const selectedPlan: TreatmentPlanResponse | undefined =
    selectedDetailQuery.data ?? plans.find((plan) => plan.id === effectiveSelectedId);

  const createTreatment = useCreateTreatment();
  const approveStep = useApproveStep();
  const deleteTreatment = useDeleteTreatment();

  const totalPaid =
    selectedPlan?.procedures
      .filter((item) => item.paid)
      .reduce((sum, item) => sum + Number(item.value ?? 0), 0) ?? 0;

  const handleCreatePlan = async (payload: {
    patientId: string | null;
    patientName: string;
    planName: string;
    startDate: string;
    endDate: string;
    notes: string;
    procedures: ProcedureDraft[];
  }) => {
    const procedures: TreatmentProcedureRequest[] = payload.procedures.map((procedure) => ({
      tooth: procedure.tooth || null,
      name: procedure.name || "-",
      value: Number(procedure.value) || 0,
      paid: false,
      done: false,
    }));

    try {
      const created = await createTreatment.mutateAsync({
        patientId: payload.patientId,
        patient: payload.patientName || null,
        title: payload.planName || "Novo Plano",
        startDate: payload.startDate || null,
        endDate: payload.endDate || null,
        notes: payload.notes || null,
        procedures,
      });
      setSelectedId(created.id);
      setDialogOpen(false);
      toast.success("Plano de tratamento criado!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao criar plano de tratamento");
    }
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await deleteTreatment.mutateAsync(planToDelete.id);
      if (selectedId === planToDelete.id) setSelectedId(null);
      setPlanToDelete(null);
      toast.success("Plano de tratamento excluído!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao excluir plano de tratamento");
    }
  };

  const handleApproveStep = async () => {
    if (!selectedPlan) return;
    try {
      await approveStep.mutateAsync(selectedPlan.id);
      toast.success("Etapa aprovada!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao aprovar etapa");
    }
  };

  const handlePrintPlan = () => {
    if (!selectedPlan) return;

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const total = Number(selectedPlan.total ?? 0);
    const remaining = total - totalPaid;

    const periodParts = [
      selectedPlan.startDate ? `Início: ${formatDatePtBr(selectedPlan.startDate)}` : null,
      selectedPlan.endDate ? `Término: ${formatDatePtBr(selectedPlan.endDate)}` : null,
    ].filter(Boolean);

    const rows = selectedPlan.procedures
      .map(
        (procedure) => `
          <tr>
            <td>${escapeHtml(procedure.tooth ?? "-")}</td>
            <td>${escapeHtml(procedure.name)}</td>
            <td>${procedure.done ? "Realizado" : "Aguardando"}</td>
            <td class="status">${procedure.paid ? "Pago" : "Pendente"}</td>
            <td class="value">${currency(Number(procedure.value ?? 0))}</td>
          </tr>`,
      )
      .join("");

    const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(selectedPlan.title)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #1a1a1a; margin: 32px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .muted { color: #555; font-size: 13px; margin: 2px 0; }
      .summary { display: flex; gap: 24px; margin: 24px 0; }
      .summary div { font-size: 14px; }
      .summary span { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #777; margin-bottom: 2px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
      th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e2e2; }
      th { text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; color: #777; }
      .value, td.value, th.value { text-align: right; }
      .total { margin-top: 16px; text-align: right; font-size: 16px; font-weight: 700; }
      @media print { body { margin: 0; } }
    </style>
  </head>
  <body onload="window.print()">
    <h1>${escapeHtml(selectedPlan.title)}</h1>
    <p class="muted">Paciente: ${escapeHtml(selectedPlan.patientName ?? "Não informado")}</p>
    ${periodParts.length ? `<p class="muted">${periodParts.join(" • ")}</p>` : ""}

    <div class="summary">
      <div><span>Valor Total</span>${currency(total)}</div>
      <div><span>Total Pago</span>${currency(totalPaid)}</div>
      <div><span>Restante</span>${currency(remaining)}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Dente</th>
          <th>Procedimento</th>
          <th>Andamento</th>
          <th>Pagamento</th>
          <th class="value">Valor</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <p class="total">Valor Total do Plano: ${currency(total)}</p>
  </body>
</html>`;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão. Verifique o bloqueador de pop-ups.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const isListLoading = treatmentsQuery.isLoading;
  const hasNoPendingStep =
    selectedPlan != null && selectedPlan.completed >= selectedPlan.totalProcedures;

  const hasError = treatmentsQuery.isError || selectedDetailQuery.isError;
  const firstError = treatmentsQuery.error ?? selectedDetailQuery.error;
  const isRetrying = treatmentsQuery.isFetching || selectedDetailQuery.isFetching;
  const retryAll = () => {
    void treatmentsQuery.refetch();
    if (effectiveSelectedId) void selectedDetailQuery.refetch();
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

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[var(--color-ink-panel)]">Planos de Tratamento</h1>
            <p className="mt-1 text-[15px] font-medium text-[var(--color-text-panel-soft)]">
              Acompanhe o progresso clínico e financeiro dos tratamentos.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            variant="brand"
          >
            <Plus className="size-4" />
            Novo Plano
          </Button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[560px_1fr]">
          <section>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint-soft)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar paciente ou tratamento..."
                className="pl-11"
              />
            </div>

            <div className="mt-5 space-y-4">
              {isListLoading ? (
                <div className="rounded-xl border border-dashed bg-card p-8 text-center text-[14px] font-medium text-[var(--color-text-caption)]">
                  Carregando planos...
                </div>
              ) : plans.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-card p-8 text-center text-[14px] font-medium text-[var(--color-text-caption)]">
                  Nenhum plano encontrado.
                </div>
              ) : (
                plans.map((plan) => {
                  const selected = selectedPlan?.id === plan.id;
                  const progress =
                    plan.totalProcedures > 0
                      ? (plan.completed / plan.totalProcedures) * 100
                      : 0;
                  const patientLabel = plan.patientName ?? "Paciente não informado";

                  return (
                    <Card
                      key={plan.id}
                      asChild
                      className={`w-full p-5 gap-0 text-left ${
                        selected
                          ? "border-[var(--color-brand-teal-border)] bg-[var(--color-surface-panel-tint)]"
                          : ""
                      }`}
                    >
                    <button
                      type="button"
                      onClick={() => setSelectedId(plan.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-surface-map-top)_0%,var(--color-surface-muted-alt)_100%)] text-[var(--color-brand-teal)]">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[16px] font-semibold text-[var(--color-ink-panel)]">{patientLabel}</p>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-teal)]">{plan.title}</p>
                          </div>
                        </div>
                        <MoreVertical className="h-5 w-5 text-[var(--color-text-subtle)]" />
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">
                          <span>Progresso</span>
                          <span className="text-[var(--color-brand-teal)]">
                            {plan.completed}/{plan.totalProcedures} concluídos
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[var(--color-border-panel-soft)]">
                          <div className="h-2.5 rounded-full bg-[var(--color-brand-teal)]" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between text-[12px] font-bold text-[var(--color-text-caption)]">
                        <span>{currency(Number(plan.total ?? 0))}</span>
                        <span>Criado em {formatDatePtBr(plan.createdAt)}</span>
                      </div>
                    </button>
                    </Card>
                  );
                })
              )}
            </div>
          </section>

          {selectedPlan ? (
            <Card asChild className="overflow-hidden gap-0 py-0">
              <section>
              <div className="border-b border-[var(--color-border-panel-alt)] px-6 py-6 md:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[var(--color-border-section)] bg-white text-[var(--color-brand-teal)] shadow-sm">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-[20px] font-bold text-[var(--color-ink-panel)]">{selectedPlan.title}</h2>
                      <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint-alt)]">
                        Paciente:
                        <span className="ml-2 normal-case tracking-normal text-[var(--color-brand-teal)]">
                          {selectedPlan.patientName ?? "Não informado"}
                        </span>
                      </p>
                      {selectedPlan.startDate || selectedPlan.endDate ? (
                        <p className="mt-2 text-[13px] font-medium text-[var(--color-text-caption)]">
                          {selectedPlan.startDate ? `Início: ${formatDatePtBr(selectedPlan.startDate)}` : "Início não informado"}
                          {selectedPlan.endDate ? ` • Término: ${formatDatePtBr(selectedPlan.endDate)}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label="Ações do plano"
                      className="cursor-pointer rounded-[14px] border border-[var(--color-border-section)] p-2 text-[var(--color-text-placeholder)] outline-none transition-colors hover:bg-[var(--color-surface-panel-alt)] focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onSelect={() => setPlanToDelete(selectedPlan)}
                      >
                        <Trash2 className="size-4" />
                        Excluir plano
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MiniStat label="Valor Total" value={currency(Number(selectedPlan.total ?? 0))} />
                  <MiniStat label="Total Pago" value={currency(totalPaid)} color="text-[var(--color-success-strong)]" />
                  <MiniStat
                    label="Restante"
                    value={currency(Number(selectedPlan.total ?? 0) - totalPaid)}
                    color="text-[var(--color-danger-action)]"
                  />
                </div>
              </div>

              <div className="lg:hidden">
                {selectedPlan.procedures.map((procedure) => (
                  <div key={procedure.id} className="border-b border-[var(--color-border-panel-lite)] px-6 py-5 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-[var(--color-surface-section-alt)] px-2 py-1 text-[12px] font-semibold text-[var(--color-text-subtle-alt)]">
                            {procedure.tooth ?? "-"}
                          </span>
                          <p className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{procedure.name}</p>
                        </div>
                        <p className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-success-strong)]">
                          <CircleDot className="h-3.5 w-3.5" />
                          {procedure.done ? "Realizado" : "Aguardando"}
                        </p>
                      </div>
                      <StatusBadge paid={procedure.paid} />
                    </div>
                    <div className="mt-4 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {currency(Number(procedure.value ?? 0))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block">
                <div className="grid grid-cols-[84px_minmax(0,1fr)_130px_120px] gap-4 border-b border-[var(--color-border-panel-alt)] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)] md:px-8">
                  <span>Dente</span>
                  <span>Procedimento</span>
                  <span>Valor</span>
                  <span className="text-right">Status</span>
                </div>
                {selectedPlan.procedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="grid grid-cols-[84px_minmax(0,1fr)_130px_120px] gap-4 border-b border-[var(--color-border-panel-lite)] px-6 py-5 last:border-b-0 md:px-8"
                  >
                    <div className="flex items-center">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-[var(--color-surface-section-alt)] px-2 py-1 text-[12px] font-semibold text-[var(--color-text-subtle-alt)]">
                        {procedure.tooth ?? "-"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[var(--color-ink-panel)]">{procedure.name}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-success-strong)]">
                        <CircleDot className="h-3.5 w-3.5 shrink-0" />
                        {procedure.done ? "Realizado" : "Aguardando"}
                      </p>
                    </div>
                    <div className="flex items-center text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {currency(Number(procedure.value ?? 0))}
                    </div>
                    <div className="flex items-center justify-end">
                      <StatusBadge paid={procedure.paid} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-6 py-5 md:px-8 xl:flex-row xl:items-center xl:justify-between">
                <p className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-caption)]">
                  <Clock3 className="h-4 w-4 text-[var(--color-text-faint-alt)]" />
                  Atualizado em {formatDatePtBr(selectedPlan.createdAt)}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
                  <Button variant="outline" onClick={handlePrintPlan}>
                    Imprimir
                  </Button>
                  <Button
                    onClick={() => void handleApproveStep()}
                    disabled={approveStep.isPending || hasNoPendingStep}
                    variant="brand"
                  >
                    {approveStep.isPending ? "Aprovando..." : "Aprovar Etapa"}
                  </Button>
                </div>
              </div>
              </section>
            </Card>
          ) : null}
        </div>
      </div>

      <NewPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreatePlan={(payload) => void handleCreatePlan(payload)}
      />

      <ConfirmDialog
        open={Boolean(planToDelete)}
        onOpenChange={(open) => {
          if (!open) setPlanToDelete(null);
        }}
        onConfirm={() => void confirmDeletePlan()}
        title="Excluir plano de tratamento"
        description={
          <>
            Tem certeza que deseja excluir o plano{" "}
            <span className="font-semibold text-text-primary">
              {planToDelete?.title}
            </span>
            {planToDelete?.patientName ? (
              <>
                {" "}de{" "}
                <span className="font-semibold text-text-primary">
                  {planToDelete.patientName}
                </span>
              </>
            ) : null}
            ? Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        isLoading={deleteTreatment.isPending}
      />
    </>
  );
}
