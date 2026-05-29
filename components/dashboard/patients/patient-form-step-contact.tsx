"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Mail, MapPin, Phone, ShieldPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PatientDetailsFormData } from "@/lib/schemas/patient-schema";
import { formatPhoneInput } from "./patients-shared";

const NO_INSURANCE = "__none__";

type PatientFormStepContactProps = {
  control: Control<PatientDetailsFormData>;
  errors: FieldErrors<PatientDetailsFormData>;
  register: UseFormRegister<PatientDetailsFormData>;
  insuranceOptions: string[];
};

export function PatientFormStepContact({
  control,
  errors,
  register,
  insuranceOptions,
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
        <Label className="mb-2">
          Telefone *
        </Label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                value={field.value}
                onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                placeholder="(11) 99668-8345"
                inputMode="numeric"
                className="pl-11"
              />
            )}
          />
        </div>
        {errors.phone ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.phone.message}</span>
        ) : null}
      </div>

      <div>
        <Label className="mb-2">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            {...register("email")}
            type="email"
            placeholder="email@exemplo.com"
            className="pl-11"
          />
        </div>
        {errors.email ? (
          <span className="mt-2 block text-xs text-danger-text">{errors.email.message}</span>
        ) : null}
      </div>

      <div>
        <Label className="mb-2">
          Convênio
        </Label>
        <div className="relative">
          <ShieldPlus className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Controller
            name="insurance"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? field.value : NO_INSURANCE}
                onValueChange={(value) =>
                  field.onChange(value === NO_INSURANCE ? "" : value)
                }
              >
                <SelectTrigger className="w-full pl-11">
                  <SelectValue placeholder="Selecione o convênio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_INSURANCE}>Sem convênio (Particular)</SelectItem>
                  {insuranceOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2">
          Endereço
        </Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <Input
            {...register("address")}
            placeholder="Rua, número, complemento, cidade - UF"
            className="pl-11"
          />
        </div>
      </div>
    </div>
  );
}
