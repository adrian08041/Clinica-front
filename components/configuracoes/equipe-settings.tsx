"use client";

import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TeamMemberDialog } from "./equipe/team-member-dialog";
import { TeamMembersTable } from "./equipe/team-members-table";
import {
  EMPTY_TEAM_FORM,
  INITIAL_TEAM_MEMBERS,
  type TeamFormState,
  type TeamMember,
} from "./equipe/team-shared";

export function EquipeSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormState>(EMPTY_TEAM_FORM);

  const totalActiveMembers = useMemo(
    () => teamMembers.filter((member) => member.status === "Ativo").length,
    [teamMembers],
  );

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
    if (!open) {
      resetForm();
    }

    setDialogOpen(open);
  };

  const handleSaveMember = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Preencha nome, e-mail e telefone da equipe.");
      return;
    }

    if (editingMemberId) {
      setTeamMembers((current) =>
        current.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                ...form,
              }
            : member,
        ),
      );
      toast.success("Cadastro da equipe atualizado com sucesso!");
    } else {
      setTeamMembers((current) => [
        {
          id: `team-${Date.now()}`,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(form.email)}`,
          ...form,
        },
        ...current,
      ]);
      toast.success("Novo funcionário adicionado com sucesso!");
    }

    handleDialogChange(false);
  };

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers((current) => current.filter((member) => member.id !== memberId));
    toast.success("Funcionário removido com sucesso!");
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
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
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border-light bg-background-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Total na Equipe
            </p>
            <p className="mt-2 text-[24px] font-bold text-text-primary">
              {teamMembers.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-light bg-background-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Ativos no Sistema
            </p>
            <p className="mt-2 text-[24px] font-bold text-success-text">
              {totalActiveMembers}
            </p>
          </div>
        </div>

        <TeamMembersTable
          teamMembers={teamMembers}
          onEdit={openEditDialog}
          onDelete={handleDeleteMember}
        />
      </div>

      <TeamMemberDialog
        open={dialogOpen}
        editingMemberId={editingMemberId}
        form={form}
        onOpenChange={handleDialogChange}
        onFormChange={setForm}
        onSave={handleSaveMember}
      />
    </>
  );
}
