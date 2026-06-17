"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { PatientFinancialRecord } from "@/lib/types";

function StatusBadge({ status }: { status: PatientFinancialRecord["status"] }) {
  const variant =
    status === "paid" ? "success" : status === "overdue" ? "danger" : "warning";
  const label =
    status === "paid" ? "Pago" : status === "overdue" ? "Atrasado" : "Pendente";
  return <Badge variant={variant}>{label}</Badge>;
}

const columns: DataTableColumn<PatientFinancialRecord>[] = [
  {
    id: "description",
    header: "Descrição",
    primary: true,
    cell: (record) => (
      <span className="text-sm font-bold text-text-secondary">
        {record.description}
      </span>
    ),
  },
  {
    id: "date",
    header: "Data",
    cell: (record) => record.date,
    cellClassName: "text-sm font-medium text-text-tertiary",
  },
  {
    id: "value",
    header: "Valor",
    cell: (record) => record.value,
    cellClassName: "text-sm font-extrabold text-text-primary",
  },
  {
    id: "status",
    header: "Status",
    cell: (record) => <StatusBadge status={record.status} />,
  },
  {
    id: "receipt",
    header: "Recibo",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (record) =>
      record.hasReceipt ? (
        <button className="text-sm font-bold text-brand-primary transition-colors hover:text-brand-dark">
          Baixar PDF
        </button>
      ) : (
        <span className="font-bold text-text-muted">-</span>
      ),
  },
];

interface PatientFinancialTabProps {
  records: PatientFinancialRecord[];
}

export function PatientFinancialTab({ records }: PatientFinancialTabProps) {
  const [listMode, setListMode] = useState<"table" | "cards">("table");

  return (
    <Card
      className={cn(
        "p-0",
        listMode === "cards" && "border-transparent bg-transparent shadow-none",
      )}
    >
      <DataTable
        columns={columns}
        data={records}
        getRowKey={(record) => record.id}
        size="sm"
        emptyMessage="Nenhum lançamento financeiro para este paciente."
        onModeChange={setListMode}
      />
    </Card>
  );
}
