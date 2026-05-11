"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FlowDialogFooter } from "@/components/ui/flow-dialog-footer";
import { FlowDialogHeader } from "@/components/ui/flow-dialog-header";
import { MOCK_DENTISTS, MOCK_PATIENTS } from "@/lib/mock-data";
import { AgendaDetailsStep } from "./new-dialog/agenda-details-step";
import { AgendaInfoStep } from "./new-dialog/agenda-info-step";
import { AgendaReviewStep } from "./new-dialog/agenda-review-step";
import { AgendaScheduleStep } from "./new-dialog/agenda-schedule-step";
import {
  agendaNewDialogSchema,
  AGENDA_NEW_DIALOG_STEP_LABELS,
  AGENDA_NEW_DIALOG_TOTAL_STEPS,
  type AgendaNewDialogProps,
  type AgendaNewDialogValues,
  APPOINTMENT_TYPES,
  formatAgendaDate,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "./new-dialog/agenda-new-dialog-shared";
import { useForm, useWatch } from "react-hook-form";

export function AgendaNewDialog({ open, onOpenChange }: AgendaNewDialogProps) {
  const formContentRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(1);
  const [calendarYear, setCalendarYear] = useState(2026);

  const {
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm<AgendaNewDialogValues>({
    resolver: zodResolver(agendaNewDialogSchema),
    defaultValues: {
      patientName: "",
      dentistId: "",
      time: "",
      observations: "",
    },
    mode: "onChange",
  });

  const selectedPatient = useWatch({ control, name: "patientName" });
  const selectedDentistId = useWatch({ control, name: "dentistId" });
  const selectedDate = useWatch({ control, name: "date" });
  const selectedTime = useWatch({ control, name: "time" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedObservations = useWatch({ control, name: "observations" });

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.cpf.includes(query) ||
        patient.phone.includes(query),
    );
  }, [searchQuery]);

  const selectedDentist = useMemo(
    () => MOCK_DENTISTS.find((dentist) => dentist.id === selectedDentistId),
    [selectedDentistId],
  );

  const selectedTypeLabel =
    APPOINTMENT_TYPES.find((type) => type.value === selectedType)?.label ?? "-";

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const today = useMemo(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  }, []);

  useEffect(() => {
    formContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function resetForm() {
    setStep(1);
    setSearchQuery("");
    reset();
    setCalendarMonth(1);
    setCalendarYear(2026);
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  async function handleNextStep() {
    if (step === 1) {
      const isValid = await trigger(["patientName", "dentistId"]);
      if (!isValid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const isValid = await trigger(["date", "time"]);
      if (!isValid) return;
      setStep(3);
      return;
    }

    if (step === 3) {
      const isValid = await trigger(["type"]);
      if (!isValid) return;
      setStep(4);
    }
  }

  function navigateMonth(direction: number) {
    let nextMonth = calendarMonth + direction;
    let nextYear = calendarYear;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    }

    setCalendarMonth(nextMonth);
    setCalendarYear(nextYear);
  }

  function onSubmit() {
    toast.success("Agendamento criado com sucesso!");
    handleClose();
  }

  async function handlePrimaryAction() {
    if (step < AGENDA_NEW_DIALOG_TOTAL_STEPS) {
      await handleNextStep();
      return;
    }

    const isValid = await trigger(["patientName", "dentistId", "date", "time", "type"]);
    if (!isValid) {
      if (!selectedPatient || !selectedDentistId) {
        setStep(1);
        return;
      }

      if (selectedDate === undefined || selectedDate === null || !selectedTime) {
        setStep(2);
        return;
      }

      setStep(3);
      return;
    }

    onSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? handleClose() : onOpenChange(true))}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
      >
        <div className="sr-only">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Formulário em etapas para criar um novo agendamento.
          </DialogDescription>
        </div>

        <FlowDialogHeader
          currentStep={step}
          description="Organize a nova consulta com um fluxo mais claro e visual."
          icon={Stethoscope}
          onClose={handleClose}
          stepLabels={AGENDA_NEW_DIALOG_STEP_LABELS}
          title="Novo Agendamento"
        />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex min-h-0 flex-1 flex-col bg-white"
        >
          <div ref={formContentRef} className="min-h-0 flex-1 overflow-y-auto">
            {step === 1 ? (
              <AgendaInfoStep
                control={control}
                errors={errors}
                filteredPatients={filteredPatients}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                trigger={trigger}
              />
            ) : null}

            {step === 2 ? (
              <AgendaScheduleStep
                calendarMonth={calendarMonth}
                calendarYear={calendarYear}
                control={control}
                daysInMonth={daysInMonth}
                errors={errors}
                firstDay={firstDay}
                navigateMonth={navigateMonth}
                today={today}
                trigger={trigger}
              />
            ) : null}

            {step === 3 ? (
              <AgendaDetailsStep control={control} errors={errors} trigger={trigger} />
            ) : null}

            {step === 4 ? (
              <AgendaReviewStep
                formattedDate={formatAgendaDate(calendarYear, calendarMonth, selectedDate)}
                observations={selectedObservations}
                patientName={selectedPatient}
                specialty={selectedDentist?.specialty}
                dentistName={selectedDentist?.name}
                time={selectedTime}
                typeLabel={selectedTypeLabel}
              />
            ) : null}
          </div>

          <FlowDialogFooter
            onBack={() => (step === 1 ? handleClose() : setStep((current) => current - 1))}
            onPrimaryAction={() => void handlePrimaryAction()}
            primaryLabel={
              step < AGENDA_NEW_DIALOG_TOTAL_STEPS ? "Próximo" : "Confirmar Agendamento"
            }
            step={step}
            totalSteps={AGENDA_NEW_DIALOG_TOTAL_STEPS}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
