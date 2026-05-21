import { PencilLine, MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/lib/types"

interface PatientProfileHeaderProps {
  patient: Patient
}

function getStatusClasses(status?: string) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border"
  }
  if (status === "Pendente") {
    return "bg-warning-bg text-warning-text border-warning-border"
  }
  return "bg-danger-bg text-danger-text border-danger-border"
}

function calculateAge(birthDate?: string): string {
  if (!birthDate) return "—"
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate)
  const birth = isoMatch
    ? new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
    : new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return "—"

  const today = new Date()
  let years = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years -= 1
  }
  if (years < 0) return "—"
  return `${years} ${years === 1 ? "ano" : "anos"}`
}

const INFO_FIELDS: { label: string; key: "cpf" | "phone" | "insurance"; fallback?: string }[] = [
  { label: "CPF", key: "cpf" },
  { label: "Telefone", key: "phone" },
  { label: "Seguro", key: "insurance", fallback: "-" },
]

export function PatientProfileHeader({ patient }: PatientProfileHeaderProps) {
  return (
    <Card className="bg-white border-border-light shadow-sm p-6 flex flex-col md:flex-row gap-6 md:items-start justify-between">
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar className="!w-[88px] !h-[88px] border-[3px] border-white shadow-sm shrink-0">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-background-card text-text-tertiary text-2xl font-bold">
              {patient.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 bg-brand-primary text-white p-2 rounded-full border-[3px] border-white shadow-sm hover:bg-brand-dark transition-colors">
            <PencilLine className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-bold text-text-primary">
              {patient.name}
            </h2>
            <Badge
              variant="outline"
              className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide ${getStatusClasses(patient.status)}`}
            >
              {patient.status || "Ativo"}
            </Badge>
          </div>

          <div className="flex flex-wrap md:gap-x-12 gap-x-6 gap-y-4 mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-medium">Idade</span>
              <span className="text-sm text-text-secondary font-semibold">{calculateAge(patient.birthDate)}</span>
            </div>
            {INFO_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <span className="text-xs text-text-muted font-medium">{field.label}</span>
                <span className="text-sm text-text-secondary font-semibold">
                  {patient[field.key] || field.fallback || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 shrink-0 pt-1">
        <Button
          variant="outline"
          className="border-border-light shadow-sm h-10 px-4 rounded-lg font-semibold hover:bg-background-hover text-text-secondary"
        >
          <MessageCircle className="size-4 mr-2 text-brand-primary" />
          WhatsApp
        </Button>
        <Button className="bg-brand-dark hover:bg-brand-dark text-white shadow-sm font-semibold rounded-lg h-10 px-4">
          <PencilLine className="size-4 mr-2" />
          Editar Perfil
        </Button>
      </div>
    </Card>
  )
}
