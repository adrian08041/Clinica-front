"use client";

import { Controller, type Control, type FieldErrors, type UseFormTrigger } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { APPOINTMENT_TYPES, type AgendaNewDialogValues } from "./agenda-new-dialog-shared";

type AgendaDetailsStepProps = {
  control: Control<AgendaNewDialogValues>;
  errors: FieldErrors<AgendaNewDialogValues>;
  trigger: UseFormTrigger<AgendaNewDialogValues>;
};

export function AgendaDetailsStep({
  control,
  errors,
  trigger,
}: AgendaDetailsStepProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Detalhes do Atendimento
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Defina o tipo de agendamento e registre observações importantes.
        </p>
      </div>

      <div>
        <Label className="mb-2">
          Tipo de Agendamento *
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <>
              <div className="flex flex-wrap gap-2">
                {APPOINTMENT_TYPES.map((typeOption) => (
                  <Button
                    key={typeOption.value}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      field.onChange(typeOption.value);
                      void trigger("type");
                    }}
                    className={cn(
                      "gap-2 rounded-[14px] font-bold",
                      field.value === typeOption.value
                        ? "border-brand-primary bg-brand-light hover:bg-brand-light"
                        : "border-background-hover hover:border-border-light",
                    )}
                  >
                    <div className={cn("h-3 w-3 rounded-full", typeOption.dotColor)} />
                    {typeOption.label}
                  </Button>
                ))}
              </div>
              {errors.type ? (
                <p className="mt-2 text-sm text-danger-text">{errors.type.message}</p>
              ) : null}
            </>
          )}
        />
      </div>

      <div>
        <Label className="mb-2">
          Observações
        </Label>
        <Controller
          name="observations"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Ex: Paciente relatou dor, trazer exames anteriores..."
              className="min-h-[120px]"
            />
          )}
        />
      </div>
    </div>
  );
}
