"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { IdCard, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatientDetailsFormData } from "@/lib/schemas/patient-schema";
import { dateToIso, isoToDate } from "@/lib/utils/date";
import { formatCpfInput, GENDER_OPTIONS } from "./patients-shared";

type PatientFormStepBasicProps = {
  control: Control<PatientDetailsFormData>;
  errors: FieldErrors<PatientDetailsFormData>;
  register: UseFormRegister<PatientDetailsFormData>;
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
        <Label className="mb-2">
          Nome completo *
        </Label>
        <div className="relative">
          <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            {...register("name")}
            placeholder="Ex: Ana Carolina Silva"
            className="pl-11"
          />
        </div>
        {errors.name ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.name.message}</span>
        ) : null}
      </div>

      <div>
        <Label className="mb-2">
          CPF *
        </Label>
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
                className="pl-11"
              />
            )}
          />
        </div>
        {errors.cpf ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.cpf.message}</span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label className="mb-2">Data de Nascimento</Label>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={isoToDate(field.value)}
                onChange={(date) => field.onChange(dateToIso(date))}
                placeholder="Selecione a data"
              />
            )}
          />
        </div>

        <div>
          <Label className="mb-2">Gênero</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
