"use client"

import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/lib/types"
import { patientStatusVariant } from "@/components/dashboard/patients/patients-shared"

interface PatientProfileHeaderProps {
  patient: Patient
}

// Monta o número para o wa.me garantindo o DDI 55 (número local recebe o prefixo).
function toWhatsappNumber(phone?: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "")
  if (!digits) return null
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
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
    <Card className="p-6 flex flex-col md:flex-row md:items-start justify-between">
      <div className="flex items-start gap-6">
        <Avatar className="!w-[88px] !h-[88px] border-[3px] border-white shadow-sm shrink-0">
          <AvatarImage src={patient.avatar} alt={patient.name} />
          <AvatarFallback className="bg-background-card text-text-tertiary text-2xl font-bold">
            {patient.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-bold text-text-primary">
              {patient.name}
            </h2>
            <Badge variant={patientStatusVariant(patient.status)}>
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
          onClick={() => {
            const number = toWhatsappNumber(patient.phone)
            if (!number) {
              toast.error("Paciente sem telefone cadastrado.")
              return
            }
            window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer")
          }}
        >
          <MessageCircle className="size-4 mr-2 text-brand-primary" />
          WhatsApp
        </Button>
      </div>
    </Card>
  )
}
