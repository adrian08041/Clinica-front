"use client";

import { useMemo, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCreateDentist,
  useDeleteDentist,
  useDentists,
  useUpdateDentist,
} from "@/lib/queries/dentists";
import type { Dentist } from "@/lib/types";
import { TeamMemberDialog } from "./equipe/team-member-dialog";
import { TeamMembersTable } from "./equipe/team-members-table";
import {
  EMPTY_TEAM_FORM,
  type TeamFormState,
  type TeamMember,
  type TeamRole,
} from "./equipe/team-shared";

const VALID_ROLES: TeamRole[] = [
  "Administrador",
  "Dentista",
  "Recepcionista",
  "Auxiliar",
  "Financeiro",
];

function isTeamRole(value: string): value is TeamRole {
  return (VALID_ROLES as string[]).includes(value);
}

function dentistToMember(dentist: Dentist): TeamMember {
  return {
    id: dentist.id,
    name: dentist.name,
    email: "",
    phone: "",
    role: isTeamRole(dentist.specialty) ? dentist.specialty : "Dentista",
    status: "Ativo",
    avatar: "",
  };
}

export function EquipeSettings() {
  const dentistsQuery = useDentists();
  const createDentist = useCreateDentist();
  const updateDentist = useUpdateDentist();
  const deleteDentist = useDeleteDentist();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormState>(EMPTY_TEAM_FORM);

  const teamMembers: TeamMember[] = useMemo(
    () => (dentistsQuery.data ?? []).map(dentistToMember),
    [dentistsQuery.data],
  );

  const totalActiveMembers = teamMembers.filter((member) => member.status === "Ativo").length;
  const isLoading = dentistsQuery.isLoading;
  const isSaving = createDentist.isPending || updateDentist.isPending;

  const resetForm = () => {
    setForm(EMPTY_TEAM_FORM);
    setEditingMemberId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
    });
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) resetForm();
    setDialogOpen(open);
  };

  const handleSaveMember = async () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do colaborador.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      specialty: form.role,
    };

    try {
      if (editingMemberId) {
        await updateDentist.mutateAsync({ id: editingMemberId, payload });
        toast.success("Cadastro da equipe atualizado com sucesso!");
      } else {
        await createDentist.mutateAsync(payload);
        toast.success("Novo funcionário adicionado com sucesso!");
      }
      handleDialogChange(false);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(
        apiError.message ||
          (editingMemberId ? "Erro ao atualizar cadastro" : "Erro ao adicionar funcionário"),
      );
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const target = teamMembers.find((member) => member.id === memberId);
    const shouldDelete = window.confirm(
      target
        ? `Deseja remover o cadastro de ${target.name}?`
        : "Deseja remover este funcionário?",
    );
    if (!shouldDelete) return;

    try {
      await deleteDentist.mutateAsync(memberId);
      toast.success("Funcionário removido com sucesso!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao remover funcionário");
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden p-4 sm:p-6 md:p-8 gap-0">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Gestão de Equipe
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Cadastre funcionários, organize cargos e mantenha o time alinhado.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            variant="brand"
          >
            <UserPlus className="size-4" />
            Adicionar Funcionário
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-2">
          <Card className="bg-background-card p-5 gap-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Total na Equipe
            </p>
            <p className="mt-2 text-[24px] font-bold text-text-primary">
              {teamMembers.length}
            </p>
          </Card>
          <Card className="bg-background-card p-5 gap-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Ativos no Sistema
            </p>
            <p className="mt-2 text-[24px] font-bold text-success-text">
              {totalActiveMembers}
            </p>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-[14px] border border-dashed border-border-light text-text-tertiary">
            <p className="text-[14px]">Nenhum funcionário cadastrado.</p>
          </div>
        ) : (
          <TeamMembersTable
            teamMembers={teamMembers}
            onEdit={openEditDialog}
            onDelete={handleDeleteMember}
          />
        )}
      </Card>

      <TeamMemberDialog
        open={dialogOpen}
        editingMemberId={editingMemberId}
        form={form}
        isSaving={isSaving}
        onOpenChange={handleDialogChange}
        onFormChange={setForm}
        onSave={handleSaveMember}
      />
    </>
  );
}
