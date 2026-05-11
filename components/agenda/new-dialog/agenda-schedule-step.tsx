"use client";

import { Controller, type Control, type FieldErrors, type UseFormTrigger } from "react-hook-form";
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type AgendaNewDialogValues,
  AVAILABLE_TIMES,
  DAY_LABELS,
  MONTH_NAMES,
  OCCUPIED_TIMES,
} from "./agenda-new-dialog-shared";

type AgendaScheduleStepProps = {
  calendarMonth: number;
  calendarYear: number;
  control: Control<AgendaNewDialogValues>;
  daysInMonth: number;
  errors: FieldErrors<AgendaNewDialogValues>;
  firstDay: number;
  navigateMonth: (direction: number) => void;
  today: Date;
  trigger: UseFormTrigger<AgendaNewDialogValues>;
};

export function AgendaScheduleStep({
  calendarMonth,
  calendarYear,
  control,
  daysInMonth,
  errors,
  firstDay,
  navigateMonth,
  today,
  trigger,
}: AgendaScheduleStepProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Data e Horário
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Escolha quando a consulta será realizada.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-[20px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-base font-black text-[var(--color-ink-panel)]">
              {MONTH_NAMES[calendarMonth]} {calendarYear}
            </h4>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => navigateMonth(-1)}
                className="border-background-hover"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => navigateMonth(1)}
                className="border-background-hover"
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7">
            {DAY_LABELS.map((label, index) => (
              <div key={label + index} className="text-center">
                <span className="text-[10px] font-bold text-text-muted">{label}</span>
              </div>
            ))}
          </div>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const calendarDate = new Date(calendarYear, calendarMonth, day);
                    const isPast = calendarDate < today;
                    const isSelected = field.value === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (!isPast) {
                            field.onChange(day);
                            void trigger("date");
                          }
                        }}
                        disabled={isPast}
                        className={cn(
                          "aspect-square rounded-[12px] text-sm font-semibold transition-colors",
                          isSelected
                            ? "bg-[var(--color-brand-teal)] text-white"
                            : isPast
                              ? "cursor-not-allowed text-border-light"
                              : "border border-transparent text-text-secondary hover:border-black/10 hover:bg-white",
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {errors.date ? (
                  <p className="mt-2 text-sm text-danger-text">{errors.date.message}</p>
                ) : null}
              </>
            )}
          />
        </div>

        <div className="rounded-[20px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-4">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[var(--color-icon-muted)]" />
            <h4 className="text-base font-black text-[var(--color-ink-panel)]">
              Horários disponíveis
            </h4>
          </div>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_TIMES.map((time) => {
                    const isOccupied = OCCUPIED_TIMES.includes(time);
                    const isSelected = field.value === time;

                    return (
                      <Button
                        key={time}
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (!isOccupied) {
                            field.onChange(time);
                            void trigger("time");
                          }
                        }}
                        disabled={isOccupied}
                        className={cn(
                          "h-10 rounded-[12px] text-xs font-bold",
                          isSelected
                            ? "border-brand-primary bg-brand-primary text-white hover:bg-brand-dark hover:text-white"
                            : isOccupied
                              ? "cursor-not-allowed border-background-hover bg-background-card text-border-light"
                              : "border-border-light bg-white text-text-secondary hover:border-brand-primary hover:text-brand-primary",
                        )}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
                {errors.time ? (
                  <p className="mt-2 text-sm text-danger-text">{errors.time.message}</p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
