"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogDescription, DialogTitle, FlowDialogContent } from "@/components/ui/dialog";
import { FlowDialogFooter } from "@/components/ui/flow-dialog-footer";
import { FlowDialogHeader } from "@/components/ui/flow-dialog-header";
import { useDentists } from "@/lib/queries/dentists";
import { usePatients } from "@/lib/queries/patients";
import {
  TYPE_MAP_TO_BACK,
  useAppointments,
  useCreateAppointment,
  type AppointmentRequestPayload,
} from "@/lib/queries/appointments";
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

const DEFAULT_DURATION_MINUTES = 30;

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

export function AgendaNewDialog({ open, onOpenChange, initialPatient }: AgendaNewDialogProps) {
  const formContentRef = useRef<HTMLDivElement | null>(null);
  // Aberto a partir do perfil (com initialPatient) já começa na etapa de data/hora.
  // O pai remonta via key a cada abertura, então o inicializador roda fresco.
  const [step, setStep] = useState(initialPatient ? 2 : 1);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const {
    control,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<AgendaNewDialogValues>({
    resolver: zodResolver(agendaNewDialogSchema),
    defaultValues: {
      patientId: initialPatient?.id ?? "",
      patientName: initialPatient?.name ?? "",
      dentistId: "",
      time: "",
      observations: "",
    },
    mode: "onChange",
  });

  const selectedPatientId = useWatch({ control, name: "patientId" });
  const selectedPatient = useWatch({ control, name: "patientName" });
  const selectedDentistId = useWatch({ control, name: "dentistId" });
  const selectedDate = useWatch({ control, name: "date" });
  const selectedTime = useWatch({ control, name: "time" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedObservations = useWatch({ control, name: "observations" });

  const dentistsQuery = useDentists();
  const dentists = useMemo(() => dentistsQuery.data ?? [], [dentistsQuery.data]);

  const trimmedSearch = searchQuery.trim();
  const patientsQuery = usePatients({
    page: 0,
    size: 10,
    search: trimmedSearch,
  });
  const createAppointment = useCreateAppointment();

  const filteredPatients = useMemo(() => {
    if (!trimmedSearch) return [];
    const list = patientsQuery.data?.content ?? [];
    return list.map((patient) => ({
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
    }));
  }, [trimmedSearch, patientsQuery.data]);

  const selectedDentist = useMemo(
    () => dentists.find((dentist) => dentist.id === selectedDentistId),
    [dentists, selectedDentistId],
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

  // Horários ocupados reais: consultas já marcadas para o dentista no dia escolhido.
  const scheduleDateIso =
    selectedDate !== undefined && selectedDate !== null
      ? toIsoDate(calendarYear, calendarMonth, selectedDate)
      : undefined;
  const hasScheduleContext = Boolean(scheduleDateIso && selectedDentistId);
  const dayAppointmentsQuery = useAppointments(
    {
      startDate: scheduleDateIso,
      endDate: scheduleDateIso,
      dentistId: selectedDentistId || undefined,
    },
    { enabled: hasScheduleContext },
  );
  const occupiedTimes = useMemo(
    () =>
      hasScheduleContext
        ? (dayAppointmentsQuery.data ?? []).map((appointment) => appointment.time)
        : [],
    [hasScheduleContext, dayAppointmentsQuery.data],
  );

  useEffect(() => {
    formContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function resetForm() {
    setStep(1);
    setSearchQuery("");
    reset();
    const now = new Date();
    setCalendarMonth(now.getMonth());
    setCalendarYear(now.getFullYear());
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  async function handleNextStep() {
    if (step === 1) {
      const isValid = await trigger(["patientId", "patientName", "dentistId"]);
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

  async function onSubmit() {
    if (
      !selectedPatientId ||
      !selectedDentistId ||
      selectedDate === undefined ||
      selectedDate === null ||
      !selectedTime ||
      !selectedType
    ) {
      return;
    }

    const payload: AppointmentRequestPayload = {
      patientId: selectedPatientId,
      dentistId: selectedDentistId,
      date: toIsoDate(calendarYear, calendarMonth, selectedDate),
      time: selectedTime,
      duration: DEFAULT_DURATION_MINUTES,
      type: TYPE_MAP_TO_BACK[selectedType],
      procedure: selectedTypeLabel,
      observations: selectedObservations ?? null,
      status: "Pendente",
    };

    try {
      await createAppointment.mutateAsync(payload);
      toast.success("Agendamento criado com sucesso!");
      handleClose();
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao criar agendamento");
    }
  }

  async function handlePrimaryAction() {
    if (step < AGENDA_NEW_DIALOG_TOTAL_STEPS) {
      await handleNextStep();
      return;
    }

    const isValid = await trigger([
      "patientId",
      "patientName",
      "dentistId",
      "date",
      "time",
      "type",
    ]);
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

    await onSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? handleClose() : onOpenChange(true))}>
      <FlowDialogContent className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col">
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
                onSelectPatient={(patient) => {
                  setValue("patientName", patient.name, { shouldValidate: true });
                }}
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
                occupiedTimes={occupiedTimes}
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
            isLoading={createAppointment.isPending}
            onBack={() => (step === 1 ? handleClose() : setStep((current) => current - 1))}
            onPrimaryAction={() => void handlePrimaryAction()}
            primaryLabel={
              step < AGENDA_NEW_DIALOG_TOTAL_STEPS ? "Próximo" : "Confirmar Agendamento"
            }
            step={step}
            totalSteps={AGENDA_NEW_DIALOG_TOTAL_STEPS}
          />
        </form>
      </FlowDialogContent>
    </Dialog>
  );
}
