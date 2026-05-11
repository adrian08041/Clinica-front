"use client";

import { Controller, type Control, type FieldErrors, type UseFormTrigger } from "react-hook-form";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MOCK_DENTISTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getPersonInitials, type AgendaNewDialogValues } from "./agenda-new-dialog-shared";

type PatientSearchOption = {
  id: string;
  name: string;
  cpf: string;
};

type AgendaInfoStepProps = {
  control: Control<AgendaNewDialogValues>;
  errors: FieldErrors<AgendaNewDialogValues>;
  filteredPatients: PatientSearchOption[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  trigger: UseFormTrigger<AgendaNewDialogValues>;
};

export function AgendaInfoStep({
  control,
  errors,
  filteredPatients,
  searchQuery,
  onSearchChange,
  trigger,
}: AgendaInfoStepProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Informações Iniciais
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Selecione o paciente e o profissional responsável.
        </p>
      </div>

      <div>
        <label
          className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]"
          htmlFor="patient-search"
        >
          Paciente *
        </label>
        <div className="relative">
          <Input
            id="patient-search"
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Busque por nome, CPF ou celular..."
            className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-4 pr-10 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
          />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-icon-muted)]" />
        </div>

        <Controller
          name="patientName"
          control={control}
          render={({ field }) => (
            <>
              {filteredPatients.length > 0 ? (
                <div className="mt-3 space-y-2 rounded-[18px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-3">
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        field.onChange(patient.name);
                        void trigger("patientName");
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[14px] border p-3 text-left transition-colors",
                        field.value === patient.name
                          ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)]"
                          : "border-[var(--color-border-panel-alt)] bg-white hover:border-[var(--color-brand-teal)]",
                      )}
                    >
                      <Avatar className="h-10 w-10 border border-border-light">
                        <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                          {getPersonInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{patient.name}</p>
                        <p className="text-xs text-text-tertiary">{patient.cpf}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {searchQuery && filteredPatients.length === 0 ? (
                <p className="mt-3 text-sm text-text-muted">Nenhum paciente encontrado.</p>
              ) : null}

              {errors.patientName ? (
                <p className="mt-2 text-sm text-danger-text">{errors.patientName.message}</p>
              ) : null}
            </>
          )}
        />
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          Profissional *
        </label>
        <Controller
          name="dentistId"
          control={control}
          render={({ field }) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {MOCK_DENTISTS.map((dentist) => (
                  <button
                    key={dentist.id}
                    type="button"
                    onClick={() => {
                      field.onChange(dentist.id);
                      void trigger("dentistId");
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-[16px] border p-4 text-left transition-colors",
                      field.value === dentist.id
                        ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)]"
                        : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)]",
                    )}
                  >
                    <Avatar className="h-12 w-12 border border-border-light">
                      <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                        {getPersonInitials(dentist.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{dentist.name}</p>
                      <p className="text-xs font-medium text-text-tertiary">
                        {dentist.specialty}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.dentistId ? (
                <p className="mt-2 text-sm text-danger-text">{errors.dentistId.message}</p>
              ) : null}
            </>
          )}
        />
      </div>
    </div>
  );
}
