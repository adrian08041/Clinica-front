import { Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_DENTISTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatDateLabel } from "./agenda-utils";
import type { AgendaView } from "@/lib/types";

export const VIEWS: { label: string; value: AgendaView }[] = [
  { label: "Dia", value: "day" },
  { label: "Semana", value: "week" },
  { label: "Mês", value: "month" },
];

export interface AgendaHeaderProps {
  activeView: AgendaView;
  setActiveView: (view: AgendaView) => void;
  currentDate: Date;
  navigate: (direction: number) => void;
  setDialogOpen: (open: boolean) => void;
  selectedDentist: string | null;
  setSelectedDentist: (id: string | null) => void;
}

export function AgendaHeader({
  activeView,
  setActiveView,
  currentDate,
  navigate,
  setDialogOpen,
  selectedDentist,
  setSelectedDentist,
}: AgendaHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl lg:text-2xl font-bold text-text-primary">Agenda</h1>

        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          {/* View Switcher */}
          <div className="flex items-center bg-white border border-border-light rounded-xl p-1 h-9 lg:h-10">
            {VIEWS.map((view) => (
              <button
                key={view.value}
                onClick={() => setActiveView(view.value)}
                className={cn(
                  "px-3 lg:px-5 h-full text-xs lg:text-sm font-bold transition-all cursor-pointer rounded-lg",
                  activeView === view.value
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 lg:gap-2 bg-white border border-border-light rounded-lg px-2 lg:px-3 h-9 lg:h-10">
            <Button
              variant="ghost"
              size="icon-xs"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="size-4 lg:size-5 text-text-tertiary" />
            </Button>
            <span className="text-xs lg:text-sm font-medium text-text-secondary min-w-[100px] lg:min-w-[140px] text-center">
              {formatDateLabel(currentDate, activeView)}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="cursor-pointer"
              onClick={() => navigate(1)}
            >
              <ChevronRight className="size-4 lg:size-5 text-text-tertiary" />
            </Button>
          </div>

          {/* New Appointment Button */}
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-brand-primary hover:bg-brand-dark text-white font-bold gap-2 cursor-pointer h-9 lg:h-10 text-xs lg:text-sm"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Dentist Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDentist(null)}
          className={cn(
            "rounded-full text-xs font-bold cursor-pointer shrink-0",
            !selectedDentist
              ? "border-brand-primary text-brand-primary bg-brand-light hover:bg-brand-light"
              : "border-border-light text-text-tertiary"
          )}
        >
          Todos os Dentistas
        </Button>
        {MOCK_DENTISTS.map((dentist) => (
          <Button
            key={dentist.id}
            variant="outline"
            size="sm"
            onClick={() =>
              setSelectedDentist(
                selectedDentist === dentist.id ? null : dentist.id
              )
            }
            className={cn(
              "rounded-full text-xs font-bold cursor-pointer shrink-0",
              selectedDentist === dentist.id
                ? "border-brand-primary text-brand-primary bg-brand-light hover:bg-brand-light"
                : "border-border-light text-text-tertiary"
            )}
          >
            {dentist.name}
          </Button>
        ))}
        <Button variant="ghost" size="icon-xs" className="cursor-pointer shrink-0">
          <Filter className="size-4 text-text-tertiary" />
        </Button>
      </div>
    </div>
  );
}
