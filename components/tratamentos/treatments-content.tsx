"use client";

import { useMemo, useState } from "react";
import { CircleDot, Clock3, MoreVertical, Plus, Search, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewPlanDialog, type ProcedureDraft } from "@/components/tratamentos/new-plan-dialog";
import { TREATMENT_INITIAL_PLANS } from "@/lib/mock-data";

type Procedure = {
  id: string;
  tooth: string;
  name: string;
  value: number;
  paid: boolean;
  done: boolean;
};

type TreatmentPlan = {
  id: string;
  patient: string;
  title: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  total: number;
  completed: number;
  totalProcedures: number;
  procedures: Procedure[];
};

const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-[20px] border border-[#e1e8f2] bg-white p-5 shadow-[0_4px_14px_rgba(15,39,76,0.03)]">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#93a0bd]">{label}</p>
      <p className={`mt-2 text-[18px] font-black ${color ?? "text-[#0f274c]"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ paid }: { paid: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${paid ? "bg-[#e8faf2] text-[#00a56d]" : "bg-[#f3f5fb] text-[#a1adbf]"}`}>
      {paid ? "Pago" : "Pendente"}
    </span>
  );
}

export function TreatmentsContent() {
  const [plans, setPlans] = useState<TreatmentPlan[]>(TREATMENT_INITIAL_PLANS);
  const [selectedId, setSelectedId] = useState(TREATMENT_INITIAL_PLANS[0].id);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPlans = useMemo(() => plans.filter((plan) => `${plan.patient} ${plan.title}`.toLowerCase().includes(search.toLowerCase())), [plans, search]);
  const selectedPlan = filteredPlans.find((plan) => plan.id === selectedId) ?? plans.find((plan) => plan.id === selectedId) ?? plans[0];
  const totalPaid = selectedPlan?.procedures.filter((item) => item.paid).reduce((sum, item) => sum + item.value, 0) ?? 0;

  const handleCreatePlan = (payload: {
    patient: string;
    planName: string;
    startDate: string;
    endDate: string;
    notes: string;
    procedures: ProcedureDraft[];
  }) => {
    const procedures: Procedure[] = payload.procedures.map((procedure, index) => ({
      id: `generated-${Date.now()}-${index}`,
      tooth: procedure.tooth || "-",
      name: procedure.name || "-",
      value: Number(procedure.value) || 0,
      paid: false,
      done: false,
    }));

    const total = procedures.reduce((sum, item) => sum + item.value, 0);
    const plan: TreatmentPlan = {
      id: `plan-${Date.now()}`,
      patient: payload.patient || "Paciente nao informado",
      title: payload.planName || "Novo Plano",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      startDate: payload.startDate || undefined,
      endDate: payload.endDate || undefined,
      notes: payload.notes || undefined,
      total,
      completed: 0,
      totalProcedures: procedures.length,
      procedures,
    };

    setPlans((current) => [plan, ...current]);
    setSelectedId(plan.id);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-1 py-2">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#0f274c]">Planos de Tratamento</h1>
            <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Acompanhe o progresso clinico e financeiro dos tratamentos.</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="h-11 rounded-[16px] bg-[#0e9e95] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[#0c8d85]"><Plus className="mr-2 h-4 w-4" />Novo Plano</Button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[560px_1fr]">
          <section>
            <div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9cabc5]" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar paciente ou tratamento..." className="h-12 rounded-[16px] border-[#d9e1ef] bg-white pl-11 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[#0e9e95]/30" /></div>
            <div className="mt-5 space-y-4">
              {filteredPlans.map((plan) => {
                const selected = selectedPlan?.id === plan.id;
                const progress = plan.totalProcedures > 0 ? (plan.completed / plan.totalProcedures) * 100 : 0;
                return (
                  <button key={plan.id} type="button" onClick={() => setSelectedId(plan.id)} className={`w-full rounded-[22px] border p-5 text-left shadow-[0_6px_18px_rgba(15,39,76,0.04)] ${selected ? "border-[#91e8df] bg-[#f1fcfb]" : "border-[#e1e8f2] bg-white"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f2f7fb_0%,#dbe7f4_100%)] text-[#0e9e95]"><Stethoscope className="h-5 w-5" /></div>
                        <div><p className="text-[16px] font-black text-[#0f274c]">{plan.patient}</p><p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#0e9e95]">{plan.title}</p></div>
                      </div>
                      <MoreVertical className="h-5 w-5 text-[#7ca1bb]" />
                    </div>
                    <div className="mt-5"><div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-[#93a0bd]"><span>Progresso</span><span className="text-[#0e9e95]">{plan.completed}/{plan.totalProcedures} concluidos</span></div><div className="h-2.5 rounded-full bg-[#e8eef5]"><div className="h-2.5 rounded-full bg-[#0e9e95]" style={{ width: `${progress}%` }} /></div></div>
                    <div className="mt-5 flex items-center justify-between text-[12px] font-bold text-[#6b7d99]"><span>{currency(plan.total)}</span><span>Criado em {plan.createdAt}</span></div>
                  </button>
                );
              })}
            </div>
          </section>

          {selectedPlan ? (
            <section className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
              <div className="border-b border-[#eef2f8] px-6 py-6 md:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#e1e8f2] bg-white text-[#0e9e95] shadow-sm"><Stethoscope className="h-6 w-6" /></div>
                    <div>
                      <h2 className="text-[20px] font-black text-[#0f274c]">{selectedPlan.title}</h2>
                      <p className="mt-1 text-[13px] font-black uppercase tracking-[0.12em] text-[#93a0bd]">Paciente:<span className="ml-2 normal-case tracking-normal text-[#0e9e95]">{selectedPlan.patient}</span></p>
                      {(selectedPlan.startDate || selectedPlan.endDate) ? (
                        <p className="mt-2 text-[13px] font-medium text-[#6b7d99]">
                          {selectedPlan.startDate ? `Inicio: ${selectedPlan.startDate}` : "Inicio nao informado"}
                          {selectedPlan.endDate ? ` • Termino: ${selectedPlan.endDate}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <button type="button" className="rounded-[14px] border border-[#e1e8f2] p-2 text-[#a0acc3]"><MoreVertical className="h-5 w-5" /></button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MiniStat label="Valor Total" value={currency(selectedPlan.total)} />
                  <MiniStat label="Total Pago" value={currency(totalPaid)} color="text-[#00a56d]" />
                  <MiniStat label="Restante" value={currency(selectedPlan.total - totalPaid)} color="text-[#ff2056]" />
                </div>
              </div>

              <div className="lg:hidden">
                {selectedPlan.procedures.map((procedure) => (
                  <div key={procedure.id} className="border-b border-[#f1f4f9] px-6 py-5 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-[#f3f7fb] px-2 py-1 text-[12px] font-black text-[#7d8eac]">
                            {procedure.tooth}
                          </span>
                          <p className="text-[15px] font-black text-[#0f274c]">{procedure.name}</p>
                        </div>
                        <p className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#00a56d]">
                          <CircleDot className="h-3.5 w-3.5" />
                          {procedure.done ? "Realizado" : "Aguardando"}
                        </p>
                      </div>
                      <StatusBadge paid={procedure.paid} />
                    </div>
                    <div className="mt-4 text-[15px] font-black text-[#0f274c]">{currency(procedure.value)}</div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block">
                <div className="grid grid-cols-[84px_minmax(0,1fr)_130px_120px] gap-4 border-b border-[#eef2f8] px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-[#93a0bd] md:px-8">
                  <span>Dente</span>
                  <span>Procedimento</span>
                  <span>Valor</span>
                  <span className="text-right">Status</span>
                </div>
                {selectedPlan.procedures.map((procedure) => (
                  <div key={procedure.id} className="grid grid-cols-[84px_minmax(0,1fr)_130px_120px] gap-4 border-b border-[#f1f4f9] px-6 py-5 last:border-b-0 md:px-8">
                    <div className="flex items-center">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-[#f3f7fb] px-2 py-1 text-[12px] font-black text-[#7d8eac]">
                        {procedure.tooth}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-black text-[#0f274c]">{procedure.name}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-[#00a56d]">
                        <CircleDot className="h-3.5 w-3.5 shrink-0" />
                        {procedure.done ? "Realizado" : "Aguardando"}
                      </p>
                    </div>
                    <div className="flex items-center text-[15px] font-black text-[#0f274c]">{currency(procedure.value)}</div>
                    <div className="flex items-center justify-end">
                      <StatusBadge paid={procedure.paid} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-[#eef2f8] px-6 py-5 md:px-8 xl:flex-row xl:items-center xl:justify-between">
                <p className="inline-flex items-center gap-2 text-[13px] font-medium text-[#6b7d99]"><Clock3 className="h-4 w-4 text-[#93a0bd]" />Ultima atualizacao: Hoje as 14:30</p>
                <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
                  <Button variant="outline" className="h-11 rounded-[16px] border-[#d9e1ef] px-6 text-[15px] font-bold text-[#4f6183]">Imprimir</Button>
                  <Button className="h-11 rounded-[16px] bg-[#0e9e95] px-6 text-[15px] font-bold text-white hover:bg-[#0c8d85]">Aprovar Etapa</Button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <NewPlanDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreatePlan={handleCreatePlan} />
    </>
  );
}
