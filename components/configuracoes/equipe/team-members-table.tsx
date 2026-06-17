"use client";

import { Mail, MoreHorizontal, Pencil, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getTeamMemberInitials,
  type TeamMember,
  type TeamStatus,
} from "./team-shared";

function statusVariant(status: TeamStatus) {
  return status === "Ativo" ? ("success" as const) : ("neutral" as const);
}

const columns: DataTableColumn<TeamMember>[] = [
  {
    id: "member",
    header: "Colaborador",
    primary: true,
    cell: (member) => (
      <div className="flex items-center gap-4">
        <Avatar className="h-11 w-11 border border-border-light">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-brand-primary text-white">
            {getTeamMemberInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-text-primary">
            {member.name}
          </span>
          <span className="text-[13px] text-text-tertiary">
            Cadastro interno da equipe
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    header: "Contato",
    cell: (member) => (
      <div className="flex flex-col gap-1.5 text-[13px] text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-text-muted" />
          {member.email}
        </span>
        <span className="inline-flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-text-muted" />
          {member.phone}
        </span>
      </div>
    ),
  },
  {
    id: "role",
    header: "Cargo",
    cell: (member) => member.role,
    cellClassName: "text-[14px] font-medium text-text-secondary",
  },
  {
    id: "status",
    header: "Status",
    cell: (member) => (
      <Badge variant={statusVariant(member.status)}>{member.status}</Badge>
    ),
  },
];

type TeamMembersTableProps = {
  teamMembers: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
  onModeChange?: (mode: "table" | "cards") => void;
};

export function TeamMembersTable({
  teamMembers,
  onEdit,
  onDelete,
  onModeChange,
}: TeamMembersTableProps) {
  function renderActions(member: TeamMember) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-text-secondary"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl border-border-light">
          <DropdownMenuItem
            onClick={() => onEdit(member)}
            className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
          >
            <Pencil className="h-4 w-4" />
            Editar cadastro
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(member.id)}
            className="cursor-pointer rounded-lg px-3 py-2 text-danger-text focus:text-danger-text"
          >
            <Trash2 className="h-4 w-4" />
            Remover funcionário
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={teamMembers}
      getRowKey={(member) => member.id}
      actions={renderActions}
      size="md"
      emptyMessage="Nenhum colaborador cadastrado."
      onModeChange={onModeChange}
    />
  );
}
