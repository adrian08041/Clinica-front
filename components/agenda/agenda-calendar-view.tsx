import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Appointment, AgendaView } from "@/lib/types";
import {
  TIME_SLOTS,
  DAY_NAMES_FULL,
  MONTH_NAMES,
  APPOINTMENT_COLORS,
  APPOINTMENT_LABELS,
  toDateString,
} from "./agenda-utils";

export interface AgendaCalendarViewProps {
  activeView: AgendaView;
  setActiveView: (view: AgendaView) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  weekDays: { name: string; date: number; month: string; fullDate: string; isToday: boolean }[];
  monthWeeks: { date: number; fullDate: string; isCurrentMonth: boolean; isToday: boolean }[][];
  appointmentsByDate: Record<string, Appointment[]>;
  getAppointmentForCell: (time: string, date: string) => Appointment | undefined;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (apt: Appointment) => void;
  setShowDetails: (show: boolean) => void;
  draggedId: string | null;
  dropTarget: string | null;
  handleDragStart: (e: React.DragEvent, appointment: Appointment) => void;
  handleDragOver: (e: React.DragEvent, cellKey: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, time: string, date: string) => void;
  handleDragEnd: () => void;
}

export function AgendaCalendarView({
  activeView,
  setActiveView,
  currentDate,
  setCurrentDate,
  weekDays,
  monthWeeks,
  appointmentsByDate,
  getAppointmentForCell,
  selectedAppointment,
  setSelectedAppointment,
  setShowDetails,
  draggedId,
  dropTarget,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}: AgendaCalendarViewProps) {
  return (
    <>
      {/* Calendar Grid */}
      <div className="bg-white border border-border-light rounded-xl overflow-hidden flex-1 flex flex-col">
        {/* ── DAY VIEW ── */}
        {activeView === "day" && (
          <div className="overflow-y-auto flex-1 relative">
            <div className="sticky top-0 z-20 grid grid-cols-[60px_1fr] lg:grid-cols-[80px_1fr] bg-background-card border-b border-border-light">
              <div className="p-2 lg:p-4 border-r border-border-light flex items-center bg-background-card">
                <span className="text-[10px] font-bold text-text-muted uppercase">Horário</span>
              </div>
              <div className="p-2 lg:p-3 text-center bg-background-card">
                <p className="text-[10px] font-medium uppercase text-brand-primary">
                  {DAY_NAMES_FULL[currentDate.getDay()]}
                </p>
                <p className="text-sm font-semibold mt-0.5 text-text-primary">
                  {currentDate.getDate()} {MONTH_NAMES[currentDate.getMonth()]}
                </p>
              </div>
            </div>
              {TIME_SLOTS.map((time) => {
                const dateStr = toDateString(currentDate);
                const appointment = getAppointmentForCell(time, dateStr);
                const cellKey = `${time}-${dateStr}`;
                const isDragOver = dropTarget === cellKey && draggedId !== appointment?.id;

                return (
                  <div key={time} className="grid grid-cols-[60px_1fr] lg:grid-cols-[80px_1fr] border-b border-border-light last:border-b-0">
                    <div className="p-2 lg:p-3 border-r border-border-light flex items-center justify-center">
                      <span className="text-[10px] font-medium text-text-muted">{time}</span>
                    </div>
                    <div
                      onDragOver={(e) => handleDragOver(e, cellKey)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, time, dateStr)}
                      className={cn(
                        "p-1 min-h-[44px] lg:min-h-[48px] transition-colors",
                        isDragOver && "bg-brand-primary/10 ring-2 ring-inset ring-brand-primary/30"
                      )}
                    >
                      {appointment && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, appointment)}
                          onDragEnd={handleDragEnd}
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetails(true);
                          }}
                          className={cn(
                            "w-full rounded-lg p-2 text-left text-white cursor-grab active:cursor-grabbing transition-all select-none",
                            APPOINTMENT_COLORS[appointment.type],
                            selectedAppointment?.id === appointment.id && "ring-2 ring-offset-1 ring-black/20",
                            draggedId === appointment.id && "opacity-40 scale-95"
                          )}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <p className="text-[10px] font-medium uppercase tracking-wider opacity-90">
                                {APPOINTMENT_LABELS[appointment.type]}
                              </p>
                              <p className="text-xs font-semibold truncate">{appointment.patientName}</p>
                            </div>
                            <GripVertical className="size-3 opacity-50 shrink-0 mt-0.5" />
                          </div>
                          <span className="text-[10px] opacity-80 mt-0.5 block">{appointment.duration} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {/* ── WEEK VIEW ── */}
        {activeView === "week" && (
          <div className="overflow-x-auto relative flex-1 flex flex-col">
            <div className="min-w-[600px] overflow-y-auto flex-1 relative">
              <div className="sticky top-0 z-20 grid grid-cols-[60px_repeat(6,1fr)] lg:grid-cols-[80px_repeat(6,1fr)] bg-background-card border-b border-border-light">
                <div className="p-2 lg:p-4 border-r border-border-light flex items-center bg-background-card">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Horário</span>
                </div>
                {weekDays.map((day) => (
                  <div
                    key={day.fullDate}
                    className={cn(
                      "p-2 lg:p-3 text-center border-r border-border-light last:border-r-0 bg-background-card",
                      day.isToday && "bg-brand-light"
                    )}
                  >
                    <p className={cn("text-[10px] font-medium uppercase", day.isToday ? "text-brand-primary" : "text-text-muted")}>
                      {day.name}
                    </p>
                    <p className={cn("text-xs lg:text-sm font-semibold mt-0.5", day.isToday ? "text-text-primary" : "text-text-secondary")}>
                      {day.date} {day.month}
                    </p>
                  </div>
                ))}
              </div>
                {TIME_SLOTS.map((time) => (
                  <div key={time} className="grid grid-cols-[60px_repeat(6,1fr)] lg:grid-cols-[80px_repeat(6,1fr)] border-b border-border-light last:border-b-0">
                    <div className="p-2 lg:p-3 border-r border-border-light flex items-center justify-center">
                      <span className="text-[10px] font-medium text-text-muted">{time}</span>
                    </div>
                    {weekDays.map((day) => {
                      const appointment = getAppointmentForCell(time, day.fullDate);
                      const cellKey = `${time}-${day.fullDate}`;
                      const isDragOver = dropTarget === cellKey && draggedId !== appointment?.id;

                      return (
                        <div
                          key={cellKey}
                          onDragOver={(e) => handleDragOver(e, cellKey)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, time, day.fullDate)}
                          className={cn(
                            "p-1 border-r border-border-light last:border-r-0 min-h-[44px] lg:min-h-[48px] transition-colors",
                            day.isToday && "bg-brand-light",
                            isDragOver && "bg-brand-primary/10 ring-2 ring-inset ring-brand-primary/30"
                          )}
                        >
                          {appointment && (
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, appointment)}
                              onDragEnd={handleDragEnd}
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowDetails(true);
                              }}
                              className={cn(
                                "w-full rounded-lg p-1.5 lg:p-2 text-left text-white cursor-grab active:cursor-grabbing transition-all select-none",
                                APPOINTMENT_COLORS[appointment.type],
                                selectedAppointment?.id === appointment.id && "ring-2 ring-offset-1 ring-black/20",
                                draggedId === appointment.id && "opacity-40 scale-95"
                              )}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <p className="text-[10px] font-medium uppercase tracking-wider opacity-90">
                                    {APPOINTMENT_LABELS[appointment.type]}
                                  </p>
                                  <p className="text-[10px] lg:text-xs font-semibold truncate">{appointment.patientName}</p>
                                </div>
                                <GripVertical className="size-3 opacity-50 shrink-0 mt-0.5 hidden lg:block" />
                              </div>
                              <span className="text-[10px] opacity-80 mt-0.5 block">{appointment.duration} min</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── MONTH VIEW ── */}
        {activeView === "month" && (
          <div className="overflow-x-auto relative flex-1 flex flex-col">
            <div className="min-w-[500px] overflow-y-auto flex-1 relative flex flex-col">
              <div className="sticky top-0 z-20 grid grid-cols-7 bg-background-card border-b border-border-light">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                  <div key={d} className="p-2 lg:p-3 text-center border-r border-border-light last:border-r-0 bg-background-card">
                    <span className="text-[10px] font-bold text-text-muted uppercase">{d}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                {monthWeeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 border-b border-border-light last:border-b-0 flex-1">
                    {week.map((day) => {
                      const dayAppointments = appointmentsByDate[day.fullDate] ?? [];
                      return (
                        <div
                          key={day.fullDate}
                          onClick={() => {
                            const [y, m, d] = day.fullDate.split("-").map(Number);
                            setCurrentDate(new Date(y, m - 1, d));
                            setActiveView("day");
                          }}
                          className={cn(
                            "p-1.5 lg:p-2 border-r border-border-light last:border-r-0 min-h-[70px] lg:min-h-[90px] cursor-pointer hover:bg-brand-light/50 transition-colors",
                            !day.isCurrentMonth && "opacity-40",
                            day.isToday && "bg-brand-light"
                          )}
                        >
                          <p className={cn(
                            "text-[10px] lg:text-xs font-semibold mb-1",
                            day.isToday ? "text-brand-primary" : "text-text-secondary"
                          )}>
                            {day.date}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div
                                key={apt.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAppointment(apt);
                                  setShowDetails(true);
                                }}
                                className={cn(
                                  "rounded px-1 lg:px-1.5 py-0.5 text-white truncate",
                                  APPOINTMENT_COLORS[apt.type]
                                )}
                              >
                                <span className="text-[8px] lg:text-[9px] font-medium">{apt.time} {apt.patientName}</span>
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <span className="text-[8px] lg:text-[9px] text-text-muted font-medium">
                                +{dayAppointments.length - 2} mais
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 lg:gap-4 bg-white border border-border-light rounded-lg px-3 lg:px-4 py-2 lg:py-3 overflow-x-auto">
        <span className="text-[10px] lg:text-xs font-bold text-text-muted uppercase shrink-0">
          Legenda:
        </span>
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 lg:size-3 rounded-sm bg-appointment-evaluation" />
            <span className="text-[10px] lg:text-xs text-text-secondary">Avaliação</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 lg:size-3 rounded-sm bg-appointment-cleaning" />
            <span className="text-[10px] lg:text-xs text-text-secondary">Limpeza</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 lg:size-3 rounded-sm bg-appointment-procedure" />
            <span className="text-[10px] lg:text-xs text-text-secondary">Procedimento</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 lg:size-3 rounded-sm bg-appointment-return" />
            <span className="text-[10px] lg:text-xs text-text-secondary">Retorno</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-2.5 lg:size-3 rounded-sm bg-appointment-urgency" />
            <span className="text-[10px] lg:text-xs text-text-secondary">Urgência</span>
          </div>
        </div>
      </div>
    </>
  );
}
