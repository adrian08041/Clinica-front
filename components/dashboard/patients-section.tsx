"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  useCreatePatient,
  useDeletePatient,
  useInsurances,
  usePatients,
  useUpdatePatient,
} from "@/lib/queries/patients";
import { patientSchema, type PatientFormData } from "@/lib/schemas/patient-schema";
import type { Patient } from "@/lib/types";
import { PatientDialog } from "./patients/patient-dialog";
import { PatientsFilters } from "./patients/patients-filters";
import { PatientsPagination } from "./patients/patients-pagination";
import { PatientsTable } from "./patients/patients-table";
import {
  formatCpfInput,
  formatPhoneInput,
  PATIENT_DIALOG_STEPS,
  patientStatusClassMap,
  PHONE_PREFIX,
} from "./patients/patients-shared";

const EMPTY_FORM: PatientFormData = {
  name: "",
  cpf: "",
  phone: PHONE_PREFIX,
  insurance: "",
};

export function PatientsSection() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name,asc");
  const [step, setStep] = useState(1);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const patientsQuery = usePatients({
    page,
    size: 20,
    sort: sortBy,
    search,
    insurance: insuranceFilter,
    status: statusFilter,
  });
  const insurancesQuery = useInsurances();
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const patients = patientsQuery.data?.content ?? [];
  const totalPages = patientsQuery.data?.totalPages ?? 0;
  const totalElements = patientsQuery.data?.totalElements ?? 0;
  const isLoading = patientsQuery.isLoading;
  const insurances = insurancesQuery.data ?? [];

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: EMPTY_FORM,
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedCpf = useWatch({ control, name: "cpf" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedInsurance = useWatch({ control, name: "insurance" });

  const dialogTitle = editingPatient ? "Editar Paciente" : "Novo Paciente";
  const dialogDescription = editingPatient
    ? "Revise as informações e ajuste o cadastro do paciente."
    : "Cadastre os dados principais do paciente com mais organização.";

  const reviewBadgeClass = useMemo(
    () =>
      editingPatient?.status
        ? patientStatusClassMap[editingPatient.status] ?? "bg-danger-bg text-danger-text"
        : "bg-[var(--color-brand-teal)] text-white",
    [editingPatient],
  );

  const resetDialogState = () => {
    setStep(1);
    setEditingPatient(null);
    reset(EMPTY_FORM);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }
    setIsDialogOpen(open);
  };

  const openCreateDialog = () => {
    resetDialogState();
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setStep(1);
    reset({
      name: patient.name ?? "",
      cpf: formatCpfInput(patient.cpf ?? ""),
      phone: formatPhoneInput(patient.phone ?? ""),
      insurance: patient.insurance ?? "",
    });
    setIsDialogOpen(true);
  };

  const goToNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["name", "cpf"]);
      if (isValid) setStep(2);
      return false;
    }

    if (step === 2) {
      const isValid = await trigger(["phone"]);
      if (isValid) setStep(3);
      return false;
    }

    return true;
  };

  const submitPatient = async (data: PatientFormData) => {
    const payload = {
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      insurance: data.insurance || null,
    };

    try {
      if (editingPatient) {
        await updatePatient.mutateAsync({ id: editingPatient.id, payload });
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await createPatient.mutateAsync(payload);
        toast.success("Paciente adicionado com sucesso!");
      }
      handleDialogChange(false);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(
        apiError.message ||
          (editingPatient ? "Erro ao atualizar paciente" : "Erro ao criar paciente"),
      );
    }
  };

  const handlePrimaryAction = async () => {
    if (step < PATIENT_DIALOG_STEPS.length) {
      await goToNextStep();
      return;
    }

    const isValid = await trigger(["name", "cpf", "phone"]);
    if (!isValid) return;

    await submitPatient({
      name: watchedName ?? "",
      cpf: watchedCpf ?? "",
      phone: watchedPhone ?? "",
      insurance: watchedInsurance ?? "",
    });
  };

  const handleDeletePatient = async (patient: Patient) => {
    const shouldDelete = window.confirm(
      `Deseja excluir o paciente ${patient.name}? Essa ação remove o cadastro da lista ativa.`,
    );

    if (!shouldDelete) return;

    try {
      await deletePatient.mutateAsync(patient.id);
      toast.success("Paciente excluído com sucesso!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao excluir paciente");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-4 pt-2 sm:px-6 md:space-y-6 md:pb-8 lg:px-8">
      {patientsQuery.isError ? (
        <QueryErrorBanner
          error={patientsQuery.error}
          onRetry={() => void patientsQuery.refetch()}
          isRetrying={patientsQuery.isFetching}
        />
      ) : null}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold leading-[32px] text-text-primary">Pacientes</h1>
          <p className="mt-0.5 text-[14px] font-medium text-text-tertiary">
            Gerencie o histórico e informações dos seus pacientes.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="h-11 w-full rounded-[8px] bg-brand-dark px-5 font-semibold text-white shadow-sm hover:bg-brand-dark sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>

        <PatientDialog
          control={control}
          description={dialogDescription}
          errors={errors}
          isEditing={Boolean(editingPatient)}
          isOpen={isDialogOpen}
          isSubmitting={isSubmitting || createPatient.isPending || updatePatient.isPending}
          name={watchedName}
          cpf={watchedCpf}
          insurance={watchedInsurance}
          onClose={() =>
            step === 1 ? handleDialogChange(false) : setStep((current) => current - 1)
          }
          onOpenChange={handleDialogChange}
          onPrimaryAction={() => void handlePrimaryAction()}
          phone={watchedPhone}
          register={register}
          reviewBadgeClass={reviewBadgeClass}
          step={step}
          title={dialogTitle}
        />
      </div>

      <div className="flex flex-col rounded-[14px] border border-border-light bg-white pt-2 shadow-sm">
        <PatientsFilters
          insuranceFilter={insuranceFilter}
          insurances={insurances}
          onInsuranceFilterChange={(value) => {
            setInsuranceFilter(value === "all" ? "" : value);
            setPage(0);
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          onSortChange={setSortBy}
          onStatusFilterChange={(value) => {
            setStatusFilter(value === "all" ? "" : value);
            setPage(0);
          }}
          search={search}
          sortBy={sortBy}
          statusFilter={statusFilter}
        />

        <PatientsTable
          deletingPatientId={deletePatient.isPending ? deletePatient.variables ?? null : null}
          isLoading={isLoading}
          onDelete={(patient) => void handleDeletePatient(patient)}
          onEdit={openEditDialog}
          onOpenProfile={(patientId) => router.push(`/pacientes/${patientId}`)}
          patients={patients}
        />

        <PatientsPagination
          currentPage={page}
          endIndex={Math.min((page + 1) * 20, totalElements)}
          onPageChange={setPage}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
