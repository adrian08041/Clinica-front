"use client"

import { Loader2, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTreatments } from "@/lib/queries/treatments"
import { formatDatePtBr } from "@/lib/utils/date"

interface PatientTreatmentsTabProps {
  patientId: string
}

function currency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function dateRange(start: string | null, end: string | null) {
  const startLabel = formatDatePtBr(start ?? undefined)
  const endLabel = formatDatePtBr(end ?? undefined)
  if (startLabel && endLabel) return `${startLabel} – ${endLabel}`
  if (startLabel) return `A partir de ${startLabel}`
  return "Sem data definida"
}

export function PatientTreatmentsTab({ patientId }: PatientTreatmentsTabProps) {
  const { data, isLoading } = useTreatments({ patientId, size: 100 })
  const plans = data?.content ?? []

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-12">
        <Loader2 className="size-6 animate-spin text-brand-primary" />
      </Card>
    )
  }

  if (plans.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <Stethoscope className="mb-3 size-8 text-text-muted opacity-50" />
        <p className="mb-1 text-sm font-medium text-text-secondary">Nenhum plano de tratamento</p>
        <p className="text-xs text-text-muted">
          Este paciente ainda não possui planos de tratamento cadastrados.
        </p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {plans.map((plan) => {
        const progress =
          plan.totalProcedures > 0 ? (plan.completed / plan.totalProcedures) * 100 : 0
        return (
          <Card key={plan.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-text-primary">{plan.title}</h4>
                <p className="mt-1 text-[13px] font-medium text-text-tertiary">
                  {dateRange(plan.startDate, plan.endDate)}
                </p>
              </div>
              <span className="text-base font-extrabold text-text-primary">
                {currency(Number(plan.total ?? 0))}
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[13px] font-medium text-text-tertiary">
                <span>Progresso</span>
                <span>
                  {plan.completed}/{plan.totalProcedures} concluídos
                </span>
              </div>
              <Progress value={progress} />
            </div>

            {plan.notes ? (
              <p className="mt-4 rounded-lg border border-border-light bg-background-card p-3 text-xs italic leading-relaxed text-text-tertiary">
                {plan.notes}
              </p>
            ) : null}
          </Card>
        )
      })}
    </div>
  )
}
