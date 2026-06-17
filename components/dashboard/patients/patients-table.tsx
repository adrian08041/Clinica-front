"use client";

import { Eye, Loader2, PencilLine, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { Patient } from "@/lib/types";
import { formatCpf, formatDate, patientStatusVariant } from "./patients-shared";

type PatientsTableProps = {
  deletingPatientId: string | null;
  isLoading: boolean;
  onDelete: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onModeChange?: (mode: "table" | "cards") => void;
  onOpenProfile: (patientId: string) => void;
  patients: Patient[];
};

const columns: DataTableColumn<Patient>[] = [
  {
    id: "patient",
    header: "Paciente",
    primary: true,
    cell: (patient) => (
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
          <Badge variant={patientStatusVariant(patient.status)} className="mt-1">
            {patient.status || "Ativo"}
          </Badge>
        </div>
      </div>
    ),
  },
  {
    id: "cpf",
    header: "CPF",
    cell: (patient) => formatCpf(patient.cpf),
    cellClassName: "whitespace-nowrap text-[13px] font-medium text-text-tertiary",
  },
  {
    id: "phone",
    header: "Telefone",
    cell: (patient) => patient.phone,
    cellClassName: "whitespace-nowrap text-[13px] font-medium text-text-tertiary",
  },
  {
    id: "lastVisit",
    header: "Última visita",
    cell: (patient) => formatDate(patient.lastVisit),
    headerClassName: "whitespace-nowrap",
    cellClassName: "whitespace-nowrap text-[13px] font-medium text-text-tertiary",
  },
  {
    id: "insurance",
    header: "Seguro",
    cell: (patient) => patient.insurance || "Particular",
    cellClassName: "whitespace-nowrap text-[13px] font-medium text-text-secondary",
  },
];

export function PatientsTable({
  deletingPatientId,
  isLoading,
  onDelete,
  onEdit,
  onModeChange,
  onOpenProfile,
  patients,
}: PatientsTableProps) {
  function renderActions(patient: Patient) {
    return (
      <>
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
      </>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={patients}
      getRowKey={(patient) => patient.id}
      actions={renderActions}
      isLoading={isLoading}
      emptyMessage="Nenhum paciente encontrado."
      onModeChange={onModeChange}
    />
  );
}
