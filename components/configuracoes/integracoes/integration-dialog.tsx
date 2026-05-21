"use client";

import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  FlowDialogContent,
} from "@/components/ui/dialog";
import { FlowDialogHeader } from "@/components/ui/flow-dialog-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      <FlowDialogContent className="max-w-[680px]">
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
              <Label>
                Nome da integração
              </Label>
              <Input
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="Ex: Agenda via WhatsApp"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Categoria</Label>
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
              <Label>
                Endpoint ou URL
              </Label>
              <Input
                value={form.endpoint}
                onChange={(event) => onFormChange({ ...form, endpoint: event.target.value })}
                placeholder="https://api.exemplo.com/webhook"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>
                Descrição
              </Label>
              <Textarea
                value={form.description}
                onChange={(event) => onFormChange({ ...form, description: event.target.value })}
                placeholder="Descreva o papel dessa integração na rotina da clínica."
                className="min-h-[120px]"
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
              variant="brand"
            >
              {editingIntegrationId ? "Salvar alterações" : "Salvar integração"}
            </Button>
          </div>
        </div>
      </FlowDialogContent>
    </Dialog>
  );
}
