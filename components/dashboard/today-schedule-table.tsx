"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { ScheduleEntry, ScheduleStatus } from "@/lib/types";

const STATUS_CONFIG: Record<
  ScheduleStatus,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  confirmed: { label: "Confirmado", variant: "success" },
  pending: { label: "Pendente", variant: "warning" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const columns: DataTableColumn<ScheduleEntry>[] = [
  {
    id: "time",
    header: "Horário",
    cell: (entry) => entry.time,
    cellClassName: "text-sm font-medium text-text-secondary",
  },
  {
    id: "patient",
    header: "Paciente",
    primary: true,
    cell: (entry) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={entry.patientAvatar} alt={entry.patientName} />
          <AvatarFallback>{getInitials(entry.patientName)}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-semibold text-text-primary">
          {entry.patientName}
        </span>
      </div>
    ),
  },
  {
    id: "procedure",
    header: "Procedimento",
    cell: (entry) => entry.procedure,
    cellClassName: "text-sm text-text-secondary",
  },
  {
    id: "dentist",
    header: "Dentista",
    cell: (entry) => entry.dentist,
    cellClassName: "text-sm text-text-tertiary",
  },
  {
    id: "status",
    header: "Status",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (entry) => <StatusBadge status={entry.status} />,
  },
];

interface TodayScheduleTableProps {
  entries: ScheduleEntry[];
}

export function TodayScheduleTable({ entries }: TodayScheduleTableProps) {
  const [listMode, setListMode] = useState<"table" | "cards">("table");

  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden p-0",
        listMode === "cards" && "border-transparent bg-transparent shadow-none",
      )}
    >
      <div className="flex h-[77px] items-center justify-between border-b border-border-light px-6">
        <h3 className="text-lg font-semibold leading-7 text-text-primary">
          Agenda de Hoje
        </h3>
        <Button
          asChild
          variant="link"
          className="h-auto p-0 text-sm font-medium text-brand-primary hover:text-brand-dark"
        >
          <Link href="/agenda">Ver Agenda Completa</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        getRowKey={(entry) => entry.id}
        size="md"
        emptyMessage="Nenhum agendamento para hoje."
        onModeChange={setListMode}
      />
    </Card>
  );
}
