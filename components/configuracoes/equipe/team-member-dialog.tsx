"use client";

import { BriefcaseBusiness, UsersRound } from "lucide-react";
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
import type { TeamFormState, TeamRole, TeamStatus } from "./team-shared";

type TeamMemberDialogProps = {
  editingMemberId: string | null;
  form: TeamFormState;
  onFormChange: (form: TeamFormState) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  open: boolean;
};

export function TeamMemberDialog({
  editingMemberId,
  form,
  onFormChange,
  onOpenChange,
  onSave,
  open,
}: TeamMemberDialogProps) {
  const title = editingMemberId ? "Editar Funcionário" : "Adicionar Funcionário";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[820px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
        showCloseButton={false}
      >
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Formulário para cadastrar ou editar membros da equipe.
          </DialogDescription>
        </div>

        <FlowDialogHeader
          description="Mantenha o cadastro da equipe atualizado no OdontoFlow."
          icon={UsersRound}
          onClose={() => onOpenChange(false)}
          title={title}
        />

        <div className="space-y-6 bg-white px-6 py-8 md:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                Nome completo
              </label>
              <Input
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="Ex: Fernanda Souza"
                className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">
                E-mail corporativo
              </label>
              <Input
                value={form.email}
                onChange={(event) => onFormChange({ ...form, email: event.target.value })}
                placeholder="nome@odontoflow.com"
                className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">Telefone</label>
              <Input
                value={form.phone}
                onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
                placeholder="(11) 99999-9999"
                className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <label className="text-[13px] font-semibold text-text-secondary">Cargo</label>
              <Select
                value={form.role}
                onValueChange={(value) => onFormChange({ ...form, role: value as TeamRole })}
              >
                <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Dentista">Dentista</SelectItem>
                  <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
              <label className="text-[13px] font-semibold text-text-secondary">Status</label>
              <Select
                value={form.status}
                onValueChange={(value) => onFormChange({ ...form, status: value as TeamStatus })}
              >
                <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-light">
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
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
              <BriefcaseBusiness className="h-4 w-4" />
              {editingMemberId ? "Salvar alterações" : "Salvar funcionário"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
