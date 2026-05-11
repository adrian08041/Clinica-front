import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type FlowDialogFooterProps = {
  backLabel?: string;
  disabled?: boolean;
  firstStepBackLabel?: string;
  isLoading?: boolean;
  onBack: () => void;
  onPrimaryAction: () => void;
  primaryLabel: string;
  step: number;
  totalSteps: number;
};

export function FlowDialogFooter({
  backLabel = "Voltar",
  disabled = false,
  firstStepBackLabel = "Cancelar",
  isLoading = false,
  onBack,
  onPrimaryAction,
  primaryLabel,
  step,
  totalSteps,
}: FlowDialogFooterProps) {
  const isPrimaryDisabled = disabled || isLoading;

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:px-8">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]"
      >
        {step === 1 ? firstStepBackLabel : backLabel}
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((item) => (
          <span
            key={item}
            className={`h-2.5 rounded-full ${
              item === step ? "w-7 bg-[var(--color-brand-teal)]" : "w-2.5 bg-[var(--color-ring-soft)]"
            }`}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={onPrimaryAction}
        disabled={isPrimaryDisabled}
        aria-busy={isLoading}
        className="h-11 rounded-[16px] border-2 border-[var(--color-brand-teal-deep)] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[var(--color-brand-teal-dark)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">{primaryLabel}</span>
          </>
        ) : (
          primaryLabel
        )}
      </Button>
    </div>
  );
}
