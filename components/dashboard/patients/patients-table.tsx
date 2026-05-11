"use client";

import { Eye, Loader2, PencilLine, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Patient } from "@/lib/types";
import { formatCpf, formatDate, patientStatusClassMap } from "./patients-shared";

type PatientsTableProps = {
  deletingPatientId: string | null;
  isLoading: boolean;
  onDelete: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onOpenProfile: (patientId: string) => void;
  patients: Patient[];
};

export function PatientsTable({
  deletingPatientId,
  isLoading,
  onDelete,
  onEdit,
  onOpenProfile,
  patients,
}: PatientsTableProps) {
  return (
    <div className="w-full flex-1 overflow-x-auto border-t border-border-light">
      <Table className="min-w-[960px]">
        <TableHeader className="bg-white">
          <TableRow className="border-b border-border-light px-4 hover:bg-transparent">
            <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Paciente
            </TableHead>
            <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              CPF
            </TableHead>
            <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Telefone
            </TableHead>
            <TableHead className="h-[52px] whitespace-nowrap px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Última visita
            </TableHead>
            <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Seguro
            </TableHead>
            <TableHead className="h-[52px] px-6 text-right align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-primary" />
              </TableCell>
            </TableRow>
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                Nenhum paciente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => {
              const badgeClass =
                patient.status && patientStatusClassMap[patient.status]
                  ? patientStatusClassMap[patient.status]
                  : "bg-danger-bg text-danger-text";

              return (
                <TableRow
                  key={patient.id}
                  className="group border-b border-border-light transition-colors hover:bg-background-card/50"
                >
                  <TableCell className="align-middle px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border border-border-light">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback className="bg-brand-primary text-[13px] font-semibold text-white">
                          {patient.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="whitespace-nowrap text-[14px] font-semibold text-text-secondary">
                          {patient.name}
                        </p>
                        <span
                          className={`mt-1 w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.2px] ${badgeClass}`}
                        >
                          {patient.status || "Inativo"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                    {formatCpf(patient.cpf)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                    {patient.phone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                    {formatDate(patient.lastVisit)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-secondary">
                    {patient.insurance || "Particular"}
                  </TableCell>

                  <TableCell className="align-middle px-6 py-5">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenProfile(patient.id)}
                        className="cursor-pointer text-text-muted transition-colors hover:text-brand-primary"
                        title="Ver perfil"
                      >
                        <Eye className="h-[18px] w-[18px]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(patient)}
                        className="cursor-pointer text-text-muted transition-colors hover:text-brand-primary"
                        title="Editar paciente"
                      >
                        <PencilLine className="h-[18px] w-[18px]" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(patient)}
                        disabled={deletingPatientId === patient.id}
                        className="cursor-pointer text-text-muted transition-colors hover:text-danger-text"
                        title="Excluir paciente"
                      >
                        {deletingPatientId === patient.id ? (
                          <Loader2 className="h-[18px] w-[18px] animate-spin" />
                        ) : (
                          <Trash2 className="h-[18px] w-[18px]" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
