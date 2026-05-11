"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { IdCard, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PatientFormData } from "@/lib/schemas/patient-schema";
import { formatCpfInput, patientFieldClass } from "./patients-shared";

type PatientFormStepBasicProps = {
  control: Control<PatientFormData>;
  errors: FieldErrors<PatientFormData>;
  register: UseFormRegister<PatientFormData>;
};

export function PatientFormStepBasic({
  control,
  errors,
  register,
}: PatientFormStepBasicProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Informações Básicas
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Comece com a identificação principal do paciente.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          Nome completo *
        </label>
        <div className="relative">
          <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            {...register("name")}
            placeholder="Ex: Ana Carolina Silva"
            className={`${patientFieldClass} pl-11`}
          />
        </div>
        {errors.name ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.name.message}</span>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          CPF *
        </label>
        <div className="relative">
          <IdCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={(event) => field.onChange(formatCpfInput(event.target.value))}
                placeholder="123.456.789-00"
                inputMode="numeric"
                className={`${patientFieldClass} pl-11`}
              />
            )}
          />
        </div>
        {errors.cpf ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.cpf.message}</span>
        ) : null}
      </div>
    </div>
  );
}
