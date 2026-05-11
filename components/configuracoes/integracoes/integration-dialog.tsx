"use client";

import { Link2 } from "lucide-react";
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
import type { IntegrationCategory, IntegrationFormState } from "./integration-shared";

type IntegrationDialogProps = {
  editingIntegrationId: string | null;
  form: IntegrationFormState;
  onFormChange: (form: IntegrationFormState) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  open: boolean;
};

export function IntegrationDialog({
  editingIntegrationId,
  form,
  onFormChange,
  onOpenChange,
  onSave,
  open,
}: IntegrationDialogProps) {
  const title = editingIntegrationId ? "Editar Integração" : "Cadastrar Integração";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[680px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
        showCloseButton={false}
      >
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Formulário para cadastrar ou editar integrações do sistema.
          </DialogDescription>
        </div>

        <FlowDialogHeader
          description="Registre o nome, a categoria e a origem da conexão."
          icon={Link2}
          onClose={() => onOpenChange(false)}
          title={title}
        />

        <div className="space-y-6 bg-white px-6 py-7 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Nome da integração
              </label>
              <Input
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="Ex: Agenda via WhatsApp"
                className="h-11 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">Categoria</label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  onFormChange({ ...form, category: value as IntegrationCategory })
                }
              >
                <SelectTrigger className="h-11 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="Comunicação">Comunicação</SelectItem>
                  <SelectItem value="Automação">Automação</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Atendimento">Atendimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Endpoint ou URL
              </label>
              <Input
                value={form.endpoint}
                onChange={(event) => onFormChange({ ...form, endpoint: event.target.value })}
                placeholder="https://api.exemplo.com/webhook"
                className="h-11 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(event) => onFormChange({ ...form, description: event.target.value })}
                placeholder="Descreva o papel dessa integração na rotina da clínica."
                className="min-h-[120px] rounded-lg border border-border-light bg-background-card/50 px-4 py-3 text-sm font-medium text-text-primary outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
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
              {editingIntegrationId ? "Salvar alterações" : "Salvar integração"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
