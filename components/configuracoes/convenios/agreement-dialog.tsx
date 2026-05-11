"use client";

import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlowDialogHeader } from "@/components/ui/flow-dialog-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AgreementFormState,
  AgreementStatus,
  AgreementType,
} from "./agreement-shared";

type AgreementDialogProps = {
  editingAgreementId: string | null;
  form: AgreementFormState;
  onFormChange: (form: AgreementFormState) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  open: boolean;
};

export function AgreementDialog({
  editingAgreementId,
  form,
  onFormChange,
  onOpenChange,
  onSave,
  open,
}: AgreementDialogProps) {
  const title = editingAgreementId ? "Editar Convênio" : "Cadastrar Convênio";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[820px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
        showCloseButton={false}
      >
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Formulário para cadastrar ou editar convênios aceitos pela clínica.
          </DialogDescription>
        </div>

        <FlowDialogHeader
          description="Preencha os dados de identificação do convênio."
          icon={ShieldPlus}
          onClose={() => onOpenChange(false)}
          title={title}
        />

        <div className="space-y-6 bg-white px-6 py-8 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Nome do convênio
              </label>
              <Input
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="Ex: Unimed Odonto"
                className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Código interno
              </label>
              <Input
                value={form.code}
                onChange={(event) =>
                  onFormChange({ ...form, code: event.target.value.toUpperCase() })
                }
                placeholder="Ex: UNI-001"
                className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">Tipo</label>
              <Select
                value={form.type}
                onValueChange={(value) => onFormChange({ ...form, type: value as AgreementType })}
              >
                <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="Plano odontológico">Plano odontológico</SelectItem>
                  <SelectItem value="Plano de saúde">Plano de saúde</SelectItem>
                  <SelectItem value="Convênio corporativo">Convênio corporativo</SelectItem>
                  <SelectItem value="Parceria local">Parceria local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">Status</label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  onFormChange({ ...form, status: value as AgreementStatus })
                }
              >
                <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Desconto (%)
              </label>
              <Select
                value={form.discount}
                onValueChange={(value) => onFormChange({ ...form, discount: value })}
              >
                <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione o desconto" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="8">8%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="30">30%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg border-border-light px-6 text-sm font-semibold text-text-secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              className="h-10 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {editingAgreementId ? "Salvar alterações" : "Salvar convênio"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
