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
import { Dialog, DialogDescription, DialogTitle, FlowDialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  onCreate: (payload: NewTransactionPayload) => void | Promise<void>;
  isPending?: boolean;
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

export function NewTransactionDialog({ open, onOpenChange, onCreate, isPending = false }: NewTransactionDialogProps) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<TransactionType>("receita");
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [method, setMethod] = useState("");
  const [category, setCategory] = useState("");
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
    setMethod("");
    setCategory("");
    setInstallments("À vista");
    setNotes("");
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    await onCreate({
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
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? close() : onOpenChange(true))}>
      <FlowDialogContent className="max-w-[720px] max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0">
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={close}
              aria-label="Fechar"
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
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

        <div className="bg-white overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6 px-6 py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">Tipo de Transação</h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">Selecione se é uma receita ou despesa</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setType("receita")}
                  className={`h-auto flex-col items-start justify-start gap-0 rounded-[22px] border p-6 text-left whitespace-normal shadow-none transition ${
                    type === "receita"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)] shadow-[0_10px_24px_rgba(14,158,149,0.10)] hover:bg-[var(--color-brand-teal-surface)]"
                      : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)] hover:bg-white"
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
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setType("despesa")}
                  className={`h-auto flex-col items-start justify-start gap-0 rounded-[22px] border p-6 text-left whitespace-normal shadow-none transition ${
                    type === "despesa"
                      ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)] shadow-[0_10px_24px_rgba(14,158,149,0.10)] hover:bg-[var(--color-brand-teal-surface)]"
                      : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)] hover:bg-white"
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
                </Button>
              </div>

              <div>
                <Label className="mb-2">Paciente</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                  <Input
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="Nome do paciente"
                    className="pl-11"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2">Descrição</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Limpeza e Profilaxia"
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
                  <Label className="mb-2">Valor (R$)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    />
                </div>
                <div>
                  <Label className="mb-2">Vencimento</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>
                <div>
                  <Label className="mb-2">Método de Pagamento</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-full">
                      <CreditCard />
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Boleto">Boleto</SelectItem>
                      <SelectItem value="Transferência Bancária">Transferência Bancária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <Tag />
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consulta">Consulta</SelectItem>
                      <SelectItem value="Procedimento">Procedimento</SelectItem>
                      <SelectItem value="Ortodontia">Ortodontia</SelectItem>
                      <SelectItem value="Limpeza">Limpeza</SelectItem>
                      <SelectItem value="Implante">Implante</SelectItem>
                      <SelectItem value="Clareamento">Clareamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2">Número de Parcelas</Label>
                <Select value={installments} onValueChange={setInstallments}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À vista">À vista</SelectItem>
                    <SelectItem value="2x">2x</SelectItem>
                    <SelectItem value="3x">3x</SelectItem>
                    <SelectItem value="6x">6x</SelectItem>
                    <SelectItem value="12x">12x</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label className="mb-2">Observações (Opcional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione informações complementares..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] bg-white px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => (step === 1 ? close() : setStep((current) => current - 1))}
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
            onClick={() => void handleNext()}
            disabled={isPending}
            variant="brand"
          >
            {step < 3 ? "Próximo" : isPending ? "Salvando..." : "Salvar Transação"}
          </Button>
        </div>
      </FlowDialogContent>
    </Dialog>
  );
}
