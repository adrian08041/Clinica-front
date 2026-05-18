"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  useAppointments,
  useRescheduleAppointment,
} from "@/lib/queries/appointments";
import type { Appointment, AgendaView } from "@/lib/types";

import { getWeekDays, getMonthCalendarWeeks } from "./agenda-utils";
import { AgendaHeader } from "./agenda-header";
import { AgendaCalendarView } from "./agenda-calendar-view";
import { AgendaDetails } from "./agenda-details";
import { AgendaNewDialog } from "./agenda-new-dialog";

export function AgendaSection() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 17));
  const [activeView, setActiveView] = useState<AgendaView>("week");
  const [selectedDentist, setSelectedDentist] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const appointmentsQuery = useAppointments(
    selectedDentist ? { dentistId: selectedDentist } : {},
  );
  const rescheduleAppointment = useRescheduleAppointment();

  const filteredAppointments = useMemo(
    () => appointmentsQuery.data ?? [],
    [appointmentsQuery.data],
  );

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  // Keep the details panel in sync with the freshest data.
  useEffect(() => {
    if (!selectedAppointment) return;
    const fresh = filteredAppointments.find((a) => a.id === selectedAppointment.id);
    if (fresh && fresh !== selectedAppointment) {
      setSelectedAppointment(fresh);
    } else if (!fresh) {
      setSelectedAppointment(null);
    }
  }, [filteredAppointments, selectedAppointment]);

  const getAppointmentForCell = useCallback(
    (time: string, date: string) => {
      return filteredAppointments.find((a) => a.time === time && a.date === date);
    },
    [filteredAppointments],
  );

  function navigate(direction: number) {
    const newDate = new Date(currentDate);
    if (activeView === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (activeView === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  }

  const monthWeeks = useMemo(
    () => getMonthCalendarWeeks(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of filteredAppointments) {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    }
    return map;
  }, [filteredAppointments]);

  // ── Drag & Drop handlers ──

  function handleDragStart(e: React.DragEvent, appointment: Appointment) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", appointment.id);
    setDraggedId(appointment.id);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDropTarget(null);
  }

  function handleDragOver(e: React.DragEvent, cellKey: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(cellKey);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  async function handleDrop(
    e: React.DragEvent,
    targetTime: string,
    targetDate: string,
  ) {
    e.preventDefault();
    setDropTarget(null);

    const appointmentId = e.dataTransfer.getData("text/plain");
    if (!appointmentId) return;

    const existing = filteredAppointments.find(
      (a) => a.time === targetTime && a.date === targetDate && a.id !== appointmentId,
    );

    if (existing) {
      toast.error("Já existe um agendamento neste horário.");
      setDraggedId(null);
      return;
    }

    const dragged = filteredAppointments.find((a) => a.id === appointmentId);
    if (!dragged) return;

    if (dragged.time === targetTime && dragged.date === targetDate) {
      setDraggedId(null);
      return;
    }

    const dayNames = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const d = new Date(targetDate + "T12:00:00");
    const dayName = dayNames[d.getDay()];

    try {
      await rescheduleAppointment.mutateAsync({
        id: appointmentId,
        payload: { date: targetDate, time: targetTime },
      });

      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment({ ...dragged, time: targetTime, date: targetDate });
      }

      toast.success(`Agendamento movido para ${dayName} às ${targetTime}`);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao reagendar agendamento");
    } finally {
      setDraggedId(null);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
      {/* Left: Calendar Area */}
      <div className="flex-1 flex flex-col gap-3 lg:gap-4 min-w-0">
        <AgendaHeader
          activeView={activeView}
          setActiveView={setActiveView}
          currentDate={currentDate}
          navigate={navigate}
          setDialogOpen={setDialogOpen}
          selectedDentist={selectedDentist}
          setSelectedDentist={setSelectedDentist}
        />

        <AgendaCalendarView
          activeView={activeView}
          setActiveView={setActiveView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          weekDays={weekDays}
          monthWeeks={monthWeeks}
          appointmentsByDate={appointmentsByDate}
          getAppointmentForCell={getAppointmentForCell}
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          setShowDetails={setShowDetails}
          draggedId={draggedId}
          dropTarget={dropTarget}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
        />
      </div>

      <AgendaDetails
        selectedAppointment={selectedAppointment}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />

      <AgendaNewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
