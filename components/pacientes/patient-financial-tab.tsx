import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PatientFinancialRecord } from "@/lib/types"

interface PatientFinancialTabProps {
  records: PatientFinancialRecord[]
}

export function PatientFinancialTab({ records }: PatientFinancialTabProps) {
  return (
    <Card className="overflow-x-auto p-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border-light">
            <TableHead className="h-14 font-extrabold text-xs text-text-muted tracking-wider pl-8">
              DESCRIÇÃO
            </TableHead>
            <TableHead className="h-14 font-extrabold text-xs text-text-muted tracking-wider">
              DATA
            </TableHead>
            <TableHead className="h-14 font-extrabold text-xs text-text-muted tracking-wider">
              VALOR
            </TableHead>
            <TableHead className="h-14 font-extrabold text-xs text-text-muted tracking-wider">
              STATUS
            </TableHead>
            <TableHead className="h-14 font-extrabold text-xs text-text-muted tracking-wider text-right pr-8">
              RECIBO
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow className="hover:bg-transparent border-transparent">
              <TableCell colSpan={5} className="py-10 text-center text-sm text-text-muted">
                Nenhum lançamento financeiro para este paciente.
              </TableCell>
            </TableRow>
          ) : null}
          {records.map((record, index) => (
            <TableRow
              key={record.id}
              className={`group hover:bg-background-hover/50 transition-colors ${
                index < records.length - 1 ? "border-border-light" : "border-transparent"
              }`}
            >
              <TableCell className="py-5 pl-8 text-sm font-bold text-text-secondary">
                {record.description}
              </TableCell>
              <TableCell className="py-5 text-sm font-medium text-text-tertiary">
                {record.date}
              </TableCell>
              <TableCell className="py-5 text-sm font-extrabold text-text-primary">
                {record.value}
              </TableCell>
              <TableCell className="py-5">
                <Badge
                  variant={
                    record.status === "paid"
                      ? "success"
                      : record.status === "overdue"
                        ? "danger"
                        : "warning"
                  }
                >
                  {record.status === "paid"
                    ? "Pago"
                    : record.status === "overdue"
                      ? "Atrasado"
                      : "Pendente"}
                </Badge>
              </TableCell>
              <TableCell className="py-5 pr-8 text-right">
                {record.hasReceipt ? (
                  <button className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors">
                    Baixar PDF
                  </button>
                ) : (
                  <span className="text-text-muted font-bold">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
