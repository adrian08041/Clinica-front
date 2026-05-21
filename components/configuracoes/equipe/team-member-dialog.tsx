"use client";

import { BriefcaseBusiness, Loader2, UsersRound } from "lucide-react";
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
  isSaving?: boolean;
  onFormChange: (form: TeamFormState) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  open: boolean;
};

export function TeamMemberDialog({
  editingMemberId,
  form,
  isSaving = false,
  onFormChange,
  onOpenChange,
  onSave,
  open,
}: TeamMemberDialogProps) {
  const title = editingMemberId ? "Editar Funcionário" : "Adicionar Funcionário";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FlowDialogContent className="max-w-[820px]">
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
              <Label>
                Nome completo
              </Label>
              <Input
                value={form.name}
                onChange={(event) => onFormChange({ ...form, name: event.target.value })}
                placeholder="Ex: Fernanda Souza"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <Label>
                E-mail corporativo
              </Label>
              <Input
                value={form.email}
                onChange={(event) => onFormChange({ ...form, email: event.target.value })}
                placeholder="nome@odontoflow.com"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(event) => onFormChange({ ...form, phone: event.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <Label>Cargo</Label>
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
              <Label>Status</Label>
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
              disabled={isSaving}
              className="h-10 rounded-lg border-border-light px-6 text-sm font-semibold text-text-secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              variant="brand"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <BriefcaseBusiness className="size-4" />
              )}
              {editingMemberId ? "Salvar alterações" : "Salvar funcionário"}
            </Button>
          </div>
        </div>
      </FlowDialogContent>
    </Dialog>
  );
}
