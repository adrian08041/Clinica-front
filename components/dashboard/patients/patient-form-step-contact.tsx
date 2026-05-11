"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Phone, ShieldPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PatientFormData } from "@/lib/schemas/patient-schema";
import { formatPhoneInput, patientFieldClass } from "./patients-shared";

type PatientFormStepContactProps = {
  control: Control<PatientFormData>;
  errors: FieldErrors<PatientFormData>;
  register: UseFormRegister<PatientFormData>;
};

export function PatientFormStepContact({
  control,
  errors,
  register,
}: PatientFormStepContactProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Contato e Convênio
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Complete as informações para facilitar o atendimento.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          Telefone *
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                placeholder="(55) 34 99668-8345"
                inputMode="numeric"
                className={`${patientFieldClass} pl-11`}
              />
            )}
          />
        </div>
        {errors.phone ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.phone.message}</span>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          Convênio
        </label>
        <div className="relative">
          <ShieldPlus className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            {...register("insurance")}
            placeholder="Ex: Unimed, Bradesco, Particular"
            className={`${patientFieldClass} pl-11`}
          />
        </div>
      </div>
    </div>
  );
}
