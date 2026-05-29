"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, Stethoscope, Banknote, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientProfileHeader } from "@/components/pacientes/patient-profile-header";
import { PatientTabs } from "@/components/pacientes/patient-tabs";
import { PatientPersonalDataTab } from "@/components/pacientes/patient-personal-data-tab";
import { PatientTimelineTab } from "@/components/pacientes/patient-timeline-tab";
import { PatientTreatmentsTab } from "@/components/pacientes/patient-treatments-tab";
import { PatientFinancialTab } from "@/components/pacientes/patient-financial-tab";
import { PatientDocumentsTab } from "@/components/pacientes/patient-documents-tab";
import { AgendaNewDialog } from "@/components/agenda/agenda-new-dialog";
import { usePatient } from "@/lib/queries/patients";
import { useAppointments } from "@/lib/queries/appointments";
import { useReceivables } from "@/lib/queries/finance";
import { toFinancialRecord, toTimelineEntry } from "@/lib/adapters/patient-history";

const TABS = [
  { id: "Dados Pessoais", label: "Dados Pessoais", icon: User },
  { id: "Consultas", label: "Consultas", icon: Calendar },
  { id: "Tratamentos", label: "Tratamentos", icon: Stethoscope },
  { id: "Financeiro", label: "Financeiro", icon: Banknote },
  { id: "Documentos", label: "Documentos", icon: FileText },
];

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [activeTab, setActiveTab] = useState("Consultas");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleKey, setScheduleKey] = useState(0);

  const { data: patient, isLoading, isError } = usePatient(id);

  const appointmentsQuery = useAppointments({ patientId: id });
  const receivablesQuery = useReceivables({ patientId: id, size: 100 });

  const todayIso = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  // Linha do tempo: próximas consultas primeiro (mais próxima no topo = "Próxima
  // Consulta"), depois o histórico do mais recente para o mais antigo.
  const timelineEntries = useMemo(() => {
    const appointments = appointmentsQuery.data ?? [];
    const key = (a: (typeof appointments)[number]) => `${a.date}${a.time}`;
    const upcoming = appointments
      .filter((a) => a.date >= todayIso)
      .sort((a, b) => (key(a) < key(b) ? -1 : 1));
    const past = appointments
      .filter((a) => a.date < todayIso)
      .sort((a, b) => (key(a) < key(b) ? 1 : -1));
    const nextId = upcoming[0]?.id;
    return [...upcoming, ...past].map((appointment) =>
      toTimelineEntry(appointment, todayIso, appointment.id === nextId),
    );
  }, [appointmentsQuery.data, todayIso]);

  const financialRecords = useMemo(
    () => (receivablesQuery.data?.content ?? []).map(toFinancialRecord),
    [receivablesQuery.data],
  );

  // Referência estável: evita re-disparar o efeito de pré-seleção do AgendaNewDialog.
  const initialPatient = useMemo(
    () => ({ id: patient?.id ?? "", name: patient?.name ?? "" }),
    [patient?.id, patient?.name],
  );

  useEffect(() => {
    if (isError) router.push("/pacientes");
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:pb-8 pt-2">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/pacientes")} className="text-text-tertiary hover:text-text-secondary">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold text-text-primary leading-8">Perfil do Paciente</h1>
      </div>

      <PatientProfileHeader patient={patient} />
      <PatientTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Dados Pessoais" && <PatientPersonalDataTab patient={patient} />}
      {activeTab === "Consultas" && (
        <PatientTimelineTab
          entries={timelineEntries}
          onSchedule={() => {
            setScheduleKey((current) => current + 1);
            setScheduleOpen(true);
          }}
        />
      )}
      {activeTab === "Tratamentos" && <PatientTreatmentsTab patientId={id} />}
      {activeTab === "Financeiro" && <PatientFinancialTab records={financialRecords} />}
      {activeTab === "Documentos" && <PatientDocumentsTab patientId={id} />}

      <AgendaNewDialog
        key={scheduleKey}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        initialPatient={initialPatient}
      />
    </div>
  );
}
