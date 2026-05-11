"use client";

import { Mail, MoreHorizontal, Pencil, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getTeamMemberInitials,
  getTeamStatusClasses,
  type TeamMember,
} from "./team-shared";

type TeamMembersTableProps = {
  teamMembers: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
};

export function TeamMembersTable({
  teamMembers,
  onEdit,
  onDelete,
}: TeamMembersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-light">
      <Table className="min-w-[760px] text-left">
        <TableHeader>
          <TableRow className="border-b border-border-light bg-background-card hover:bg-background-card">
            <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
              Colaborador
            </TableHead>
            <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
              Contato
            </TableHead>
            <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
              Cargo
            </TableHead>
            <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
              Status
            </TableHead>
            <TableHead className="h-auto px-6 py-4 text-right text-[13px] font-semibold text-text-tertiary">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map((member) => (
            <TableRow
              key={member.id}
              className="border-b border-border-light transition-colors hover:bg-background-card/50 last:border-0"
            >
              <TableCell className="px-6 py-4">
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
              </TableCell>
              <TableCell className="px-6 py-4">
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
              </TableCell>
              <TableCell className="px-6 py-4 text-[14px] font-medium text-text-secondary">
                {member.role}
              </TableCell>
              <TableCell className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${getTeamStatusClasses(member.status)}`}
                >
                  {member.status}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
