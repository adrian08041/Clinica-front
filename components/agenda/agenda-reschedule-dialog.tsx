"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRescheduleAppointment } from "@/lib/queries/appointments";
import { AVAILABLE_TIMES } from "./new-dialog/agenda-new-dialog-shared";
import type { Appointment } from "@/lib/types";

interface AgendaRescheduleDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

// "2026-05-30" → Date local (meio-dia evita drift de fuso).
function fromIsoDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return undefined;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), 12);
}

export function AgendaRescheduleDialog({
  appointment,
  open,
  onOpenChange,
}: AgendaRescheduleDialogProps) {
  const reschedule = useRescheduleAppointment();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  // Pré-preenche com a data/hora atuais sempre que abrir para um agendamento.
  useEffect(() => {
    if (open && appointment) {
      setDate(fromIsoDate(appointment.date));
      setTime(appointment.time);
    }
  }, [open, appointment]);

  async function handleConfirm() {
    if (!appointment || !date || !time) return;
    try {
      await reschedule.mutateAsync({
        id: appointment.id,
        payload: { date: toIsoDate(date), time },
      });
      toast.success("Agendamento remarcado com sucesso!");
      onOpenChange(false);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao remarcar agendamento");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remarcar agendamento</DialogTitle>
          <DialogDescription>
            {appointment
              ? `Escolha a nova data e horário para ${appointment.patientName}.`
              : "Escolha a nova data e horário."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nova data</Label>
            <DatePicker value={date} onChange={setDate} clearable={false} />
          </div>
          <div className="grid gap-2">
            <Label>Novo horário</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TIMES.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="brand"
            onClick={handleConfirm}
            disabled={!date || !time || reschedule.isPending}
          >
            {reschedule.isPending ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
