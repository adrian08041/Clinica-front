"use client";

import { UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlowDialogFooter } from "@/components/ui/flow-dialog-footer";
import { FlowDialogHeader } from "@/components/ui/flow-dialog-header";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { PatientFormData } from "@/lib/schemas/patient-schema";
import { PatientFormStepBasic } from "./patient-form-step-basic";
import { PatientFormStepContact } from "./patient-form-step-contact";
import { PATIENT_DIALOG_STEPS } from "./patients-shared";

type PatientDialogProps = {
  control: Control<PatientFormData>;
  description: string;
  errors: FieldErrors<PatientFormData>;
  isEditing: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  name?: string;
  cpf?: string;
  insurance?: string;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onPrimaryAction: () => void;
  phone?: string;
  register: UseFormRegister<PatientFormData>;
  reviewBadgeClass: string;
  step: number;
  title: string;
};

export function PatientDialog({
  control,
  description,
  errors,
  isEditing,
  isOpen,
  isSubmitting,
  name,
  cpf,
  insurance,
  onClose,
  onOpenChange,
  onPrimaryAction,
  phone,
  register,
  reviewBadgeClass,
  step,
  title,
}: PatientDialogProps) {
  const submitLabel = step < 3 ? "Próximo" : isEditing ? "Salvar Alterações" : "Salvar Paciente";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
      >
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Formulário em etapas para cadastrar ou editar um paciente.
          </DialogDescription>
        </div>

        <FlowDialogHeader
          currentStep={step}
          description={description}
          icon={UserRound}
          onClose={onClose}
          stepLabels={PATIENT_DIALOG_STEPS}
          title={title}
        />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex min-h-0 flex-1 flex-col bg-white"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {step === 1 ? (
              <PatientFormStepBasic control={control} errors={errors} register={register} />
            ) : null}

            {step === 2 ? (
              <PatientFormStepContact control={control} errors={errors} register={register} />
            ) : null}

            {step === 3 ? (
              <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
                <div>
                  <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                    Revisão do Cadastro
                  </h3>
                  <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                    Confira os dados antes de salvar o paciente.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[var(--color-border-panel)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.05),transparent_38%),var(--color-white)] p-6">
                  <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-panel-alt)] pb-5">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Paciente
                      </p>
                      <p className="mt-2 text-[18px] font-black text-[var(--color-ink-panel)]">
                        {name || "-"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-[12px] font-black ${
                        isEditing ? reviewBadgeClass : "bg-[var(--color-brand-teal)] text-white"
                      }`}
                    >
                      {isEditing ? "Atualização" : "Novo Cadastro"}
                    </span>
                  </div>

                  <div className="grid gap-5 pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        CPF
                      </p>
                      <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                        {cpf || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Telefone
                      </p>
                      <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                        {phone || "-"}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Convênio
                      </p>
                      <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                        {insurance || "Particular"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <FlowDialogFooter
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onBack={onClose}
            onPrimaryAction={onPrimaryAction}
            primaryLabel={submitLabel}
            step={step}
            totalSteps={3}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
