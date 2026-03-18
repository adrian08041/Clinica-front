"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CreditCard,
  Tag,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type TransactionType = "receita" | "despesa";

export type NewTransactionPayload = {
  type: TransactionType;
  patient: string;
  description: string;
  amount: number;
  dueDate: string;
  method: string;
  category: string;
  installments: string;
  notes: string;
};

type NewTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: NewTransactionPayload) => void;
};

function StepDot({ active, done, value }: { active: boolean; done: boolean; value: number }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
        active
          ? "bg-white text-[var(--color-brand-teal)]"
          : done
            ? "bg-white/25 text-white"
            : "bg-white/15 text-white/60"
      }`}
    >
      {done ? <Check className="h-5 w-5" /> : value}
    </div>
  );
}

export function NewTransactionDialog({ open, onOpenChange, onCreate }: NewTransactionDialogProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<TransactionType>("receita");
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [method, setMethod] = useState("Selecione...");
  const [category, setCategory] = useState("Selecione...");
  const [installments, setInstallments] = useState("À vista");
  const [notes, setNotes] = useState("");

  const close = () => {
    onOpenChange(false);
    setStep(1);
    setType("receita");
    setPatient("");
    setDescription("");
    setAmount("");
    setDueDate("");
    setMethod("Selecione...");
    setCategory("Selecione...");
    setInstallments("À vista");
    setNotes("");
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    onCreate({
      type,
      patient,
      description,
      amount: Number(amount) || 0,
      dueDate,
      method,
      category,
      installments,
      notes,
    });

    close();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? close() : onOpenChange(true))}>
      <DialogContent
        className="max-w-[720px] overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
        showCloseButton={false}
      >
        <div className="sr-only">
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>Formulário em etapas para registrar uma nova receita ou despesa.</DialogDescription>
        </div>

        <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-7 text-white md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-black md:text-[22px]">Nova Transação</h2>
              <p className="mt-2 text-[15px] text-white/85">Registre uma receita ou despesa no sistema</p>
            </div>
            <button type="button" onClick={close} aria-label="Fechar" className="rounded-full p-2 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 text-center">
            {[1, 2, 3].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <StepDot active={step === item} done={step > item} value={item} />
                  <span className="text-[12px] font-bold">{["Tipo", "Detalhes", "Revisão"][index]}</span>
                </div>
                {index < 2 ? <div className="h-0.5 w-14 bg-white/30" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white">
          {step === 1 ? (
            <div className="space-y-6 px-6 py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Tipo de Transação</h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">Selecione se é uma receita ou despesa</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setType("receita")}
                  className={`rounded-[22px] border p-6 text-left transition ${
                    type === "receita"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)] shadow-[0_10px_24px_rgba(14,158,149,0.10)]"
                      : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${
                      type === "receita"
                        ? "bg-[var(--color-brand-teal-fill)] text-[var(--color-success-strong)]"
                        : "bg-[var(--color-background-hover)] text-[var(--color-text-faint)]"
                    }`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <p className="mt-6 text-[18px] font-black text-[var(--color-ink-panel)]">Receita</p>
                  <p className="mt-1 text-[14px] font-medium text-[var(--color-text-caption)]">Pagamentos recebidos</p>
                </button>

                <button
                  type="button"
                  onClick={() => setType("despesa")}
                  className={`rounded-[22px] border p-6 text-left transition ${
                    type === "despesa"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)] shadow-[0_10px_24px_rgba(14,158,149,0.10)]"
                      : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)]"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[16px] ${
                      type === "despesa"
                        ? "bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]"
                        : "bg-[var(--color-background-hover)] text-[var(--color-text-faint)]"
                    }`}
                  >
                    <ArrowDownLeft className="h-5 w-5" />
                  </div>
                  <p className="mt-6 text-[18px] font-black text-[var(--color-ink-panel)]">Despesa</p>
                  <p className="mt-1 text-[14px] font-medium text-[var(--color-text-caption)]">Gastos e custos</p>
                </button>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Paciente</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                  <Input
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="Nome do paciente"
                    className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Descrição</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Limpeza e Profilaxia"
                  className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6 px-6 py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Detalhes Financeiros</h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">Informe os valores e datas</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Valor (R$)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Vencimento</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Método de Pagamento</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="h-12 w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 pr-4 text-[15px] font-medium text-[var(--color-ink-panel)] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30"
                    >
                      <option>Selecione...</option>
                      <option>Dinheiro</option>
                      <option>PIX</option>
                      <option>Cartão de Crédito</option>
                      <option>Cartão de Débito</option>
                      <option>Boleto</option>
                      <option>Transferência Bancária</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-12 w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-11 pr-4 text-[15px] font-medium text-[var(--color-ink-panel)] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30"
                    >
                      <option>Selecione...</option>
                      <option>Consulta</option>
                      <option>Procedimento</option>
                      <option>Ortodontia</option>
                      <option>Limpeza</option>
                      <option>Implante</option>
                      <option>Clareamento</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Número de Parcelas</label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="h-12 w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] px-4 text-[15px] font-medium text-[var(--color-ink-panel)] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30"
                >
                  <option>À vista</option>
                  <option>2x</option>
                  <option>3x</option>
                  <option>6x</option>
                  <option>12x</option>
                </select>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6 px-6 py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Revisão e Confirmação</h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">Verifique os dados antes de salvar</p>
              </div>

              <div className="rounded-[22px] border border-[var(--color-border-panel)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.05),transparent_38%),var(--color-white)] p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-panel-alt)] pb-5">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Tipo</p>
                    <p className="mt-2 text-[16px] font-black text-[var(--color-ink-panel)]">{type === "receita" ? "Receita" : "Despesa"}</p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-[14px] font-black ${
                      type === "receita"
                        ? "bg-[var(--color-brand-teal-fill)] text-[var(--color-success-strong)]"
                        : "bg-[var(--color-danger-soft)] text-[var(--color-danger-action)]"
                    }`}
                  >
                    {type === "receita" ? "Receita" : "Despesa"}
                  </span>
                </div>

                <div className="grid gap-5 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Paciente</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{patient || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Descrição</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{description || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Valor</p>
                    <p className="mt-2 text-[18px] font-black text-[var(--color-brand-teal)]">{amount ? `R$ ${amount}` : "R$ 0,00"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Vencimento</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{dueDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Método</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{method || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Categoria</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{category || "-"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Parcelas</p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">{installments}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">Observações (Opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione informações complementares..."
                  className="min-h-[120px] w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30"
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <Button
              variant="outline"
              onClick={() => (step === 1 ? close() : setStep((current) => current - 1))}
              className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]"
            >
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((item) => (
                <span
                  key={item}
                  className={`h-2.5 rounded-full ${item === step ? "w-7 bg-[var(--color-brand-teal)]" : "w-2.5 bg-[var(--color-ring-soft)]"}`}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="h-11 rounded-[16px] border-2 border-[var(--color-brand-teal-deep)] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[var(--color-brand-teal-dark)]"
            >
              {step < 3 ? "Próximo" : "Salvar Transação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
