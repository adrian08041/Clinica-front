import { Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PatientTimelineEntry } from "@/lib/types"

interface PatientTimelineTabProps {
  entries: PatientTimelineEntry[]
  onSchedule: () => void
}

export function PatientTimelineTab({ entries, onSchedule }: PatientTimelineTabProps) {
  return (
    <Card className="p-8 pt-7">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-text-primary">
          Linha do Tempo
        </h3>
        <Button variant="brand" onClick={onSchedule}>
          Agendar Nova
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-muted">
          Nenhuma consulta registrada para este paciente.
        </div>
      ) : (
        <div className="relative pl-6 ml-2 border-l-[3px] border-border-light flex flex-col gap-10 pb-4">
          {entries.map((entry) => {
            const isUpcoming = entry.status === "upcoming"
            return (
              <div key={entry.id} className="relative">
                <div
                  className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full ring-[5px] ring-white ${
                    isUpcoming ? "bg-brand-primary" : "bg-border-light"
                  }`}
                />
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-widest ${
                      isUpcoming ? "text-brand-primary" : "text-text-muted"
                    }`}
                  >
                    {entry.label}
                  </span>
                  <h4 className="text-[15px] font-bold text-text-primary">
                    {entry.procedure}
                  </h4>
                  <div className="flex items-center text-[13px] text-text-tertiary font-medium">
                    <Calendar className="size-4 mr-1.5 opacity-60" />
                    {entry.date}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
