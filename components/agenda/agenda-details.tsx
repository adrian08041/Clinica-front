import { X, Calendar, Clock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";
import { DAY_NAMES_FULL, MONTH_NAMES, getInitials } from "./agenda-utils";

export interface AgendaDetailsProps {
  selectedAppointment: Appointment | null;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}

export function AgendaDetails({
  selectedAppointment,
  showDetails,
  setShowDetails,
}: AgendaDetailsProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300",
          showDetails ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowDetails(false)}
      />
      
      {/* Animated wrapper to contain sidebar width transition */}
      <div
        className={cn(
          "z-50 transition-all duration-300 ease-in-out shrink-0",
          // Mobile: floating right panel
          "fixed inset-y-0 right-0 shadow-xl",
          // Desktop: static panel in flex flow
          "lg:static lg:shadow-none lg:overflow-hidden lg:rounded-xl",
          showDetails
            ? "translate-x-0 w-[300px] sm:w-[340px] lg:w-[320px] opacity-100"
            : "translate-x-full w-[300px] sm:w-[340px] lg:translate-x-0 lg:w-0 opacity-0 lg:-ml-6 pointer-events-none"
        )}
      >
        {/* Inner fixed-width container prevents content from squishing during width slide out */}
        <div className="bg-white flex flex-col h-full w-[300px] sm:w-[340px] lg:w-[320px] p-4 lg:p-6 border border-border-light rounded-none lg:rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary">Detalhes</h3>
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer hover:bg-transparent"
              onClick={() => setShowDetails(false)}
            >
              <X className="size-5 text-text-tertiary hover:text-text-primary transition-colors" />
            </Button>
          </div>

          {selectedAppointment ? (
            <div className="flex flex-col flex-1 overflow-y-auto pr-1 -mr-1">
              {/* Patient Card */}
              <div className="flex items-center gap-3 bg-background-card rounded-xl p-3 lg:p-4 mb-4 lg:mb-6 shrink-0">
                <Avatar className="size-10 lg:size-12 border border-border-light">
                  <AvatarFallback className="bg-white text-xs lg:text-sm font-semibold text-brand-primary">
                    {getInitials(selectedAppointment.patientName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm lg:text-base font-semibold text-text-primary truncate">
                    {selectedAppointment.patientName}
                  </h4>
                  <p className="text-[10px] lg:text-xs text-text-tertiary">
                    Paciente desde {selectedAppointment.patientSince}
                  </p>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-success-bg flex items-center justify-center shrink-0">
                    <Calendar className="size-4 text-brand-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted font-medium">Data e Hora</p>
                    <p className="text-xs lg:text-sm text-text-secondary font-medium truncate">
                      {(() => {
                        const d = new Date(selectedAppointment.date + "T12:00:00");
                        return `${DAY_NAMES_FULL[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} às ${selectedAppointment.time}`;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="size-4 text-appointment-evaluation" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted font-medium">Duração Estimada</p>
                    <p className="text-xs lg:text-sm text-text-secondary font-medium truncate">
                      {selectedAppointment.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Stethoscope className="size-4 text-appointment-procedure" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-text-muted font-medium">Procedimento</p>
                    <p className="text-xs lg:text-sm text-text-secondary font-medium truncate">
                      {selectedAppointment.procedure}
                    </p>
                  </div>
                </div>
              </div>

              {/* Observations */}
              {selectedAppointment.observations && (
                <div className="mb-4 lg:mb-6 border-t border-border-light pt-3 lg:pt-4 shrink-0">
                  <p className="text-[10px] text-text-muted font-bold mb-2 uppercase tracking-wide">Observações</p>
                  <p className="text-xs text-text-tertiary bg-background-card rounded-lg p-3 lg:p-4 border border-border-light leading-relaxed italic">
                    "{selectedAppointment.observations}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto space-y-2 lg:space-y-3 border-t border-border-light pt-3 lg:pt-4 shrink-0">
                <Button className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold cursor-pointer text-xs lg:text-sm transition-colors">
                  Ver Prontuário
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-bold text-text-secondary border-border-light cursor-pointer text-xs lg:text-sm transition-colors"
                >
                  Remarcar
                </Button>
                <Button
                  variant="ghost"
                  className="w-full font-bold text-danger-action hover:text-danger-action hover:bg-danger-bg cursor-pointer text-xs lg:text-sm transition-colors"
                >
                  Cancelar Agendamento
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-background-card rounded-xl border border-border-light/50">
              <Calendar className="size-8 text-text-muted mb-3 opacity-50" />
              <p className="text-sm font-medium text-text-secondary mb-1">Nada selecionado</p>
              <p className="text-xs text-text-muted">
                Selecione um agendamento na agenda para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
