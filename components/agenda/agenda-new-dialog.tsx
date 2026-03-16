"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_DENTISTS, MOCK_PATIENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { AppointmentType } from "@/lib/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  patientName: z.string().min(1, "Selecione um paciente"),
  dentistId: z.string().min(1, "Selecione um dentista"),
  date: z.number({ message: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  type: z.enum(["evaluation", "return", "procedure", "urgency", "cleaning"], {
    message: "Selecione o tipo de agendamento"
  }),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AgendaNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 6;

const APPOINTMENT_TYPES: {
  value: AppointmentType;
  label: string;
  dotColor: string;
}[] = [
  { value: "evaluation", label: "Avaliação", dotColor: "bg-blue-200" },
  { value: "return", label: "Retorno", dotColor: "bg-gray-200" },
  { value: "procedure", label: "Procedimento", dotColor: "bg-purple-200" },
  { value: "urgency", label: "Urgência", dotColor: "bg-red-200" },
  { value: "cleaning", label: "Limpeza", dotColor: "bg-green-200" },
];

const AVAILABLE_TIMES = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

const OCCUPIED_TIMES = ["09:00", "14:30"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2);
}

export function AgendaNewDialog({ open, onOpenChange }: AgendaNewDialogProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(1); // Fevereiro (index 1)
  const [calendarYear, setCalendarYear] = useState(2026);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      dentistId: "",
      time: "",
      observations: "",
    },
    mode: "onChange",
  });

  const selectedPatient = watch("patientName");
  const selectedDentist = watch("dentistId");
  const selectedDate = watch("date");
  const selectedTime = watch("time");
  const selectedType = watch("type");
  const observations = watch("observations");

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.cpf.includes(q) ||
        p.phone.includes(q)
    );
  }, [searchQuery]);

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const today = new Date();
  const todayDate =
    today.getFullYear() === calendarYear && today.getMonth() === calendarMonth
      ? today.getDate()
      : null;

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  function resetForm() {
    setStep(1);
    setSearchQuery("");
    reset();
    setCalendarMonth(1);
    setCalendarYear(2026);
  }

  async function handleNextStep() {
    let fieldsToValidate: (keyof FormValues)[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ["patientName"];
        break;
      case 2:
        fieldsToValidate = ["dentistId"];
        break;
      case 3:
        fieldsToValidate = ["date"];
        break;
      case 4:
        fieldsToValidate = ["time"];
        break;
      case 5:
        fieldsToValidate = ["type"];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(step + 1);
    }
  }

  function onSubmit(data: FormValues) {
    const dentist = MOCK_DENTISTS.find((d) => d.id === data.dentistId);
    console.log("Novo agendamento:", {
      patient: data.patientName,
      dentist: dentist?.name,
      date: getFormattedDate(data.date),
      time: data.time,
      type: data.type,
      observations: data.observations,
    });
    toast.success("Agendamento criado com sucesso!");
    handleClose();
  }

  function navigateMonth(dir: number) {
    let newMonth = calendarMonth + dir;
    let newYear = calendarYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  }

  function getFormattedDate(dateNum?: number) {
    const dNum = dateNum ?? selectedDate;
    if (dNum === undefined || dNum === null) return "";
    const d = new Date(calendarYear, calendarMonth, dNum);
    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const shortMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${dayNames[d.getDay()]}, ${dNum} de ${shortMonths[calendarMonth]}`;
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-hover">
          <div>
            <DialogTitle className="text-xl font-bold text-text-primary">Novo Agendamento</DialogTitle>
            <p className="text-xs font-medium text-text-tertiary">
              Passo {step} de {TOTAL_STEPS}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="size-5 text-text-muted" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-background-hover" role="progressbar" aria-valuenow={(step / TOTAL_STEPS) * 100} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-1 bg-brand-primary transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6">
            {/* Step 1: Selecionar Paciente */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" htmlFor="patient-search">
                  1. Selecionar Paciente
                </label>
                <div className="relative">
                  <Input
                    id="patient-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busque por nome, CPF ou celular..."
                    className="h-[46px] bg-background-card border-border-light rounded-[14px] pl-4 pr-10"
                    aria-label="Buscar paciente"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-text-muted" aria-hidden="true" />
                </div>
                
                <Controller
                  name="patientName"
                  control={control}
                  render={({ field }) => (
                    <>
                      {filteredPatients.length > 0 && (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto" role="listbox" aria-label="Lista de pacientes">
                          {filteredPatients.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              role="option"
                              aria-selected={field.value === patient.name}
                              onClick={() => {
                                field.onChange(patient.name);
                                trigger("patientName");
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-[14px] border transition-colors text-left cursor-pointer",
                                field.value === patient.name
                                  ? "border-brand-primary bg-brand-light"
                                  : "border-background-hover hover:border-border-light hover:bg-background-card"
                              )}
                            >
                              <Avatar className="size-10 border border-border-light">
                                <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                                  {getInitials(patient.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-text-primary">{patient.name}</p>
                                <p className="text-xs text-text-tertiary">{patient.cpf}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {errors.patientName && (
                        <p className="text-sm text-red-500 mt-2" role="alert" id="patient-error">
                          {errors.patientName.message}
                        </p>
                      )}
                    </>
                  )}
                />
                
                {searchQuery && filteredPatients.length === 0 && (
                  <p className="text-sm text-text-muted text-center py-4">
                    Nenhum paciente encontrado
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Selecionar Dentista */}
            {step === 2 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" id="dentist-label">
                  2. Selecionar Dentista
                </label>
                <Controller
                  name="dentistId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-2 gap-3" role="listbox" aria-labelledby="dentist-label">
                        {MOCK_DENTISTS.map((dentist) => (
                          <button
                            key={dentist.id}
                            type="button"
                            role="option"
                            aria-selected={field.value === dentist.id}
                            onClick={() => {
                              field.onChange(dentist.id);
                              trigger("dentistId");
                            }}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-[14px] border transition-colors text-left cursor-pointer",
                              field.value === dentist.id
                                ? "border-brand-primary bg-brand-light"
                                : "border-background-hover hover:border-border-light"
                            )}
                          >
                            <Avatar className="size-12 border border-border-light">
                              <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                                {getInitials(dentist.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{dentist.name}</p>
                              <p className="text-xs font-medium text-text-tertiary">{dentist.specialty}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.dentistId && (
                        <p className="text-sm text-red-500 mt-2" role="alert">
                          {errors.dentistId.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Step 3: Selecionar Data */}
            {step === 3 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" id="date-label">
                  3. Selecionar Data
                </label>
                <div className="bg-background-card border border-background-hover rounded-2xl p-4" aria-labelledby="date-label">
                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-text-primary" aria-live="polite">
                      {monthNames[calendarMonth]} {calendarYear}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => navigateMonth(-1)}
                        className="border-background-hover cursor-pointer"
                        aria-label="Mês anterior"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => navigateMonth(1)}
                        className="border-background-hover cursor-pointer"
                        aria-label="Próximo mês"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 mb-2" aria-hidden="true">
                    {dayLabels.map((label, i) => (
                      <div key={i} className="text-center">
                        <span className="text-[10px] font-bold text-text-muted">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Dias do mês">
                          {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} role="gridcell" />
                          ))}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isPast = day < (todayDate ?? 999);
                            const isSelected = field.value === day;
                            return (
                              <button
                                key={day}
                                type="button"
                                role="gridcell"
                                aria-selected={isSelected}
                                aria-disabled={isPast}
                                onClick={() => {
                                  if (!isPast) {
                                    field.onChange(day);
                                    trigger("date");
                                  }
                                }}
                                disabled={isPast}
                                className={cn(
                                  "aspect-square rounded-[10px] text-sm font-medium flex items-center justify-center transition-colors",
                                  isSelected
                                    ? "bg-brand-primary text-white cursor-pointer"
                                    : isPast
                                      ? "text-border-light cursor-not-allowed"
                                      : "text-text-secondary hover:bg-white border border-transparent hover:border-black/10 cursor-pointer"
                                )}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        {errors.date && (
                          <p className="text-sm text-red-500 mt-2" role="alert">
                            {errors.date.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Selecionar Horário */}
            {step === 4 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" id="time-label">
                  4. Selecionar Horário
                </label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-4 gap-2" role="listbox" aria-labelledby="time-label">
                        {AVAILABLE_TIMES.map((time) => {
                          const isOccupied = OCCUPIED_TIMES.includes(time);
                          const isSelected = field.value === time;
                          return (
                            <Button
                              key={time}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              aria-disabled={isOccupied}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (!isOccupied) {
                                  field.onChange(time);
                                  trigger("time");
                                }
                              }}
                              disabled={isOccupied}
                              className={cn(
                                "h-[34px] rounded-[10px] text-xs font-bold cursor-pointer",
                                isSelected
                                  ? "bg-brand-primary border-brand-primary text-white hover:bg-brand-dark hover:text-white"
                                  : isOccupied
                                    ? "bg-background-card border-background-hover text-border-light cursor-not-allowed"
                                    : "bg-white border-border-light text-text-secondary hover:border-brand-primary hover:text-brand-primary"
                              )}
                            >
                              {time}
                            </Button>
                          );
                        })}
                      </div>
                      {errors.time && (
                        <p className="text-sm text-red-500 mt-2" role="alert">
                          {errors.time.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Step 5: Tipo de Agendamento */}
            {step === 5 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" id="type-label">
                  5. Tipo de Agendamento
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="type-label">
                        {APPOINTMENT_TYPES.map((typeObj) => (
                          <Button
                            key={typeObj.value}
                            type="button"
                            role="radio"
                            aria-checked={field.value === typeObj.value}
                            variant="outline"
                            onClick={() => {
                              field.onChange(typeObj.value);
                              trigger("type");
                            }}
                            className={cn(
                              "gap-2 rounded-[14px] font-bold cursor-pointer",
                              field.value === typeObj.value
                                ? "border-brand-primary bg-brand-light hover:bg-brand-light"
                                : "border-background-hover hover:border-border-light"
                            )}
                          >
                            <div className={cn("size-3 rounded-full", typeObj.dotColor)} aria-hidden="true" />
                            {typeObj.label}
                          </Button>
                        ))}
                      </div>
                      {errors.type && (
                        <p className="text-sm text-red-500 mt-2" role="alert">
                          {errors.type.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Step 6: Observações + Resumo */}
            {step === 6 && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary" htmlFor="observations">
                  6. Observações (Opcional)
                </label>
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id="observations"
                      {...field}
                      placeholder="Ex: Paciente relatou dor, trazer exames anteriores..."
                      className="w-full h-32 bg-background-card border border-border-light rounded-2xl p-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                      aria-label="Observações do agendamento"
                    />
                  )}
                />

                {/* Resumo */}
                <div className="bg-brand-light border border-brand-border rounded-[14px] p-4" aria-live="polite">
                  <h5 className="text-xs font-bold text-brand-primary mb-3">
                    Resumo do Agendamento
                  </h5>
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-sm font-medium text-text-tertiary">Paciente:</span>
                    <span className="text-sm font-bold text-text-primary">{selectedPatient}</span>
                    <span className="text-sm font-medium text-text-tertiary">Data:</span>
                    <span className="text-sm font-bold text-text-primary">{getFormattedDate()}</span>
                    <span className="text-sm font-medium text-text-tertiary">Horário:</span>
                    <span className="text-sm font-bold text-text-primary">{selectedTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-background-hover">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="text-sm font-bold text-text-muted hover:text-text-tertiary cursor-pointer"
              >
                Voltar
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="text-sm font-bold text-text-tertiary cursor-pointer"
              >
                Cancelar
              </Button>
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-[14px] cursor-pointer"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-[14px] cursor-pointer"
                >
                  Confirmar Agendamento
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
