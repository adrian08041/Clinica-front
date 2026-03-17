"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, FileText, Plus, Stethoscope, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type ProcedureDraft = {
  id: string;
  name: string;
  tooth: string;
  value: string;
};

type NewPlanDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (payload: {
    patient: string;
    planName: string;
    startDate: string;
    endDate: string;
    notes: string;
    procedures: ProcedureDraft[];
  }) => void;
};

const planSuggestions = ["Ortodontia Preventiva", "Reabilitacao Estetica", "Implantodontia", "Tratamento de Canal"];

const currency = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function NewPlanDialog({ open, onOpenChange, onCreatePlan }: NewPlanDialogProps) {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState("");
  const [planName, setPlanName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [procedures, setProcedures] = useState<ProcedureDraft[]>([{ id: "draft-1", name: "", tooth: "", value: "" }]);

  const totalEstimated = useMemo(() => procedures.reduce((sum, item) => sum + (Number(item.value) || 0), 0), [procedures]);

  const reset = () => {
    setStep(1);
    setPatient("");
    setPlanName("");
    setStartDate("");
    setEndDate("");
    setNotes("");
    setProcedures([{ id: "draft-1", name: "", tooth: "", value: "" }]);
  };

  const close = () => {
    onOpenChange(false);
    reset();
  };

  const updateProcedure = (id: string, key: keyof ProcedureDraft, value: string) => {
    setProcedures((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const isStepOneInvalid = !patient || !planName || !startDate;

  const handleNextStep = () => {
    if (step === 1 && isStepOneInvalid) {
      return;
    }

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    onCreatePlan({ patient, planName, startDate, endDate, notes, procedures });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? close() : onOpenChange(true))}>
      <DialogContent className="max-w-[740px] overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]" showCloseButton={false}>
        <div className="sr-only">
          <DialogTitle>Novo Plano de Tratamento</DialogTitle>
          <DialogDescription>Formulario em etapas para criar um novo plano de tratamento para o paciente.</DialogDescription>
        </div>
        <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-6 text-white md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/20 bg-white/10"><Stethoscope className="h-6 w-6" /></div>
              <div>
                <h2 className="text-[20px] font-black">Novo Plano de Tratamento</h2>
                <p className="mt-1 text-[14px] text-white/85">Crie um plano personalizado para o paciente</p>
              </div>
            </div>
            <button type="button" onClick={close} aria-label="Fechar" className="rounded-full p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-center">
            {[1, 2, 3].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className={`flex flex-col items-center gap-2`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${step === item ? "bg-white text-[var(--color-brand-teal)]" : step > item ? "bg-white/25 text-white" : "bg-white/15 text-white/60"}`}>
                    {step > item ? <Check className="h-5 w-5" /> : item}
                  </div>
                  <span className="text-[12px] font-bold">{["Informacoes", "Procedimentos", "Revisao"][index]}</span>
                </div>
                {index < 2 ? <div className="h-0.5 w-14 bg-white/30" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white">
          {step === 1 ? (
            <div className="space-y-5 px-6 py-7 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Informacoes Basicas</h3>
                <p className="mt-1 text-[14px] font-medium text-[var(--color-text-caption)]">Dados gerais do plano de tratamento</p>
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Paciente *</label>
                <div className="relative"><User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" /><Input value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Selecione o paciente..." className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Nome do Plano de Tratamento *</label>
                <div className="relative"><FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" /><Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="Ex: Ortodontia Preventiva, Reabilitacao Estetica" className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {planSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setPlanName(suggestion)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors ${
                        planName === suggestion
                          ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)] text-[var(--color-brand-teal)]"
                          : "border-[var(--color-border-soft)] bg-white text-[var(--color-text-panel)] hover:border-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-surface)] hover:text-[var(--color-brand-teal)]"
                      }`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Data de Inicio *</label>
                  <div className="relative"><CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" /><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Previsao de Termino</label>
                  <div className="relative"><Clock3 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" /><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Observacoes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Descreva detalhes importantes sobre o tratamento..." className="min-h-[110px] w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5 px-6 py-7 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Procedimentos do Plano</h3>
                  <p className="mt-1 text-[14px] font-medium text-[var(--color-text-caption)]">Adicione os procedimentos que serao realizados</p>
                </div>
                <div className="text-right"><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Total Estimado</p><p className="mt-1 text-[20px] font-black text-[var(--color-brand-teal)]">{currency(totalEstimated)}</p></div>
              </div>
              {procedures.map((procedure, index) => (
                <div key={procedure.id} className="rounded-[20px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-4">
                  <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Procedimento {index + 1}</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.65fr]">
                    <div><label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Nome do Procedimento</label><Input value={procedure.name} onChange={(e) => updateProcedure(procedure.id, "name", e.target.value)} placeholder="Ex: Limpeza e Profilaxia" className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                    <div><label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Dente</label><Input value={procedure.tooth} onChange={(e) => updateProcedure(procedure.id, "tooth", e.target.value)} placeholder="Ex: 11, 21" className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                  </div>
                  <div className="mt-4"><label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Valor (R$)</label><Input type="number" min="0" step="0.01" value={procedure.value} onChange={(e) => updateProcedure(procedure.id, "value", e.target.value)} placeholder="0,00" className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30" /></div>
                </div>
              ))}
              <button type="button" onClick={() => setProcedures((current) => [...current, { id: `draft-${current.length + 1}`, name: "", tooth: "", value: "" }])} className="flex h-12 w-full items-center justify-center rounded-[18px] border border-dashed border-[var(--color-brand-teal-border-soft)] text-[15px] font-bold text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-surface-muted)]">
                <Plus className="mr-2 h-4 w-4" />Adicionar Procedimento
              </button>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6 px-6 py-7 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Revisao e Confirmacao</h3>
                <p className="mt-1 text-[14px] font-medium text-[var(--color-text-caption)]">Verifique todos os dados antes de criar o plano</p>
              </div>
              <div className="rounded-[20px] border border-[var(--color-brand-teal-border-pale)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.06),transparent_40%),var(--color-white)] p-5">
                <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Plano de Tratamento</p><p className="mt-2 text-[18px] font-black text-[var(--color-ink-panel)]">{planName || "-"}</p></div><span className="rounded-full bg-[var(--color-brand-teal)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-white">Novo</span></div>
                <div className="mt-5 grid gap-5 border-t border-[var(--color-brand-teal-border-pale)] pt-5 md:grid-cols-2">
                  <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Paciente</p><p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{patient || "-"}</p></div>
                  <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Data de Inicio</p><p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{startDate || "-"}</p></div>
                  <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Previsao de Termino</p><p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{endDate || "-"}</p></div>
                  <div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Total de Procedimentos</p><p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{procedures.length}</p></div>
                </div>
              </div>
              <div className="overflow-hidden rounded-[20px] border border-[var(--color-border-panel)]">
                <div className="border-b border-[var(--color-border-panel-alt)] bg-[var(--color-surface-panel)] px-5 py-4 text-[16px] font-black text-[var(--color-ink-panel)]">Procedimentos ({procedures.length})</div>
                <div className="grid grid-cols-[100px_1.4fr_140px] gap-4 border-b border-[var(--color-border-panel-alt)] px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]"><span>Dente</span><span>Procedimento</span><span className="text-right">Valor</span></div>
                {procedures.map((procedure) => <div key={procedure.id} className="grid grid-cols-[100px_1.4fr_140px] gap-4 border-b border-[var(--color-border-panel-lite)] px-5 py-4 last:border-b-0"><span className="text-[14px] font-bold text-[var(--color-text-caption)]">{procedure.tooth || "-"}</span><span className="text-[14px] font-bold text-[var(--color-ink-panel)]">{procedure.name || "-"}</span><span className="text-right text-[14px] font-black text-[var(--color-ink-panel)]">{currency(Number(procedure.value) || 0)}</span></div>)}
                <div className="flex items-center justify-between bg-[var(--color-surface-panel-ghost)] px-5 py-4"><span className="text-[15px] font-black text-[var(--color-ink-panel)]">Valor Total do Plano</span><span className="text-[18px] font-black text-[var(--color-brand-teal)]">{currency(totalEstimated)}</span></div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <Button variant="outline" onClick={() => (step === 1 ? close() : setStep((current) => current - 1))} className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]">
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>
            <div className="flex items-center gap-2">{[1, 2, 3].map((item) => <span key={item} className={`h-2.5 rounded-full ${item === step ? "w-7 bg-[var(--color-brand-teal)]" : "w-2.5 bg-[var(--color-ring-soft)]"}`} />)}</div>
            <Button
              onClick={handleNextStep}
              disabled={step === 1 && isStepOneInvalid}
              className="h-11 rounded-[16px] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white hover:bg-[var(--color-brand-teal-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {step < 3 ? "Proximo" : "Criar Plano de Tratamento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



