import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { ScheduleEntry, ScheduleStatus } from "@/lib/types"

const STATUS_CONFIG: Record<
  ScheduleStatus,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  confirmed: { label: "Confirmado", variant: "success" },
  pending: { label: "Pendente", variant: "warning" },
  cancelled: { label: "Cancelado", variant: "danger" },
}

function StatusBadge({ status }: { status: ScheduleStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface TodayScheduleTableProps {
  entries: ScheduleEntry[]
}

export function TodayScheduleTable({ entries }: TodayScheduleTableProps) {
  return (
    <Card className="gap-0 p-0 overflow-hidden">
      <div className="border-b border-border-light h-[77px] px-6 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary text-lg leading-7">
          Agenda de Hoje
        </h3>
        <Button
          variant="link"
          className="text-brand-primary font-medium text-sm p-0 h-auto hover:text-brand-dark"
        >
          Ver Agenda Completa
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border-light hover:bg-transparent">
            <TableHead className="w-[15%] min-w-[80px] px-4 text-text-tertiary text-xs font-semibold uppercase tracking-wider">
              Horário
            </TableHead>
            <TableHead className="w-[30%] min-w-[160px] px-4 text-text-tertiary text-xs font-semibold uppercase tracking-wider">
              Paciente
            </TableHead>
            <TableHead className="w-[25%] min-w-[140px] px-4 text-text-tertiary text-xs font-semibold uppercase tracking-wider">
              Procedimento
            </TableHead>
            <TableHead className="w-[20%] min-w-[120px] px-4 text-text-tertiary text-xs font-semibold uppercase tracking-wider">
              Dentista
            </TableHead>
            <TableHead className="min-w-[100px] px-4 text-right text-text-tertiary text-xs font-semibold uppercase tracking-wider">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="border-border-light h-[65px] hover:bg-background-hover transition-colors"
            >
              <TableCell className="px-4 font-medium text-text-secondary text-sm">
                {entry.time}
              </TableCell>
              <TableCell className="px-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={entry.patientAvatar}
                      alt={entry.patientName}
                    />
                    <AvatarFallback>
                      {getInitials(entry.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-text-primary text-sm truncate">
                    {entry.patientName}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 text-text-secondary text-sm truncate">
                {entry.procedure}
              </TableCell>
              <TableCell className="px-4 text-text-tertiary text-sm truncate">
                {entry.dentist}
              </TableCell>
              <TableCell className="px-4 text-right">
                <StatusBadge status={entry.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
