"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  useCreatePatient,
  useDeletePatient,
  usePatients,
  useUpdatePatient,
} from "@/lib/queries/patients";
import { useInsurances as useInsuranceCatalog } from "@/lib/queries/settings";
import {
  patientDetailsSchema,
  type PatientDetailsFormData,
} from "@/lib/schemas/patient-schema";
import type { Patient } from "@/lib/types";
import { PatientDialog } from "./patients/patient-dialog";
import { PatientsFilters } from "./patients/patients-filters";
import { PatientsPagination } from "./patients/patients-pagination";
import { PatientsTable } from "./patients/patients-table";
import {
  formatCpfInput,
  formatPhoneInput,
  PATIENT_DIALOG_STEPS,
  patientStatusVariant,
  toLocalPhoneDigits,
} from "./patients/patients-shared";

const EMPTY_FORM: PatientDetailsFormData = {
  name: "",
  cpf: "",
  phone: "",
  email: "",
  birthDate: "",
  gender: "",
  address: "",
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
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const patientsQuery = usePatients({
    page,
    size: 20,
    sort: sortBy,
    search,
    insurance: insuranceFilter,
    status: statusFilter,
  });
  const insuranceCatalogQuery = useInsuranceCatalog();
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const patients = patientsQuery.data?.content ?? [];
  const totalPages = patientsQuery.data?.totalPages ?? 0;
  const totalElements = patientsQuery.data?.totalElements ?? 0;
  const isLoading = patientsQuery.isLoading;
  const insuranceOptions = (insuranceCatalogQuery.data ?? []).map((item) => item.name);

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<PatientDetailsFormData>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: EMPTY_FORM,
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedCpf = useWatch({ control, name: "cpf" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedInsurance = useWatch({ control, name: "insurance" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedBirthDate = useWatch({ control, name: "birthDate" });
  const watchedGender = useWatch({ control, name: "gender" });
  const watchedAddress = useWatch({ control, name: "address" });

  const dialogTitle = editingPatient ? "Editar Paciente" : "Novo Paciente";
  const dialogDescription = editingPatient
    ? "Revise as informações e ajuste o cadastro do paciente."
    : "Cadastre os dados principais do paciente com mais organização.";

  const reviewBadgeVariant = useMemo(
    () =>
      editingPatient?.status
        ? patientStatusVariant(editingPatient.status)
        : ("brand" as const),
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
      phone: formatPhoneInput(toLocalPhoneDigits(patient.phone)),
      email: patient.email ?? "",
      birthDate: patient.birthDate ?? "",
      gender: patient.gender ?? "",
      address: patient.address ?? "",
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
      const isValid = await trigger(["phone", "email"]);
      if (isValid) setStep(3);
      return false;
    }

    return true;
  };

  const submitPatient = async (data: PatientDetailsFormData) => {
    const payload = {
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email || null,
      birthDate: data.birthDate || null,
      gender: data.gender || null,
      address: data.address || null,
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

    const isValid = await trigger(["name", "cpf", "phone", "email"]);
    if (!isValid) return;

    await submitPatient({
      name: watchedName ?? "",
      cpf: watchedCpf ?? "",
      phone: watchedPhone ?? "",
      email: watchedEmail ?? "",
      birthDate: watchedBirthDate ?? "",
      gender: watchedGender ?? "",
      address: watchedAddress ?? "",
      insurance: watchedInsurance ?? "",
    });
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient.mutateAsync(patientToDelete.id);
      toast.success("Paciente excluído com sucesso!");
      setPatientToDelete(null);
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
          variant="brand"
          className="w-full sm:w-auto"
        >
          <Plus className="size-4" />
          Novo Paciente
        </Button>

        <PatientDialog
          control={control}
          description={dialogDescription}
          errors={errors}
          isEditing={Boolean(editingPatient)}
          isOpen={isDialogOpen}
          isSubmitting={isSubmitting || createPatient.isPending || updatePatient.isPending}
          insuranceOptions={insuranceOptions}
          name={watchedName}
          cpf={watchedCpf}
          insurance={watchedInsurance}
          email={watchedEmail}
          birthDate={watchedBirthDate}
          gender={watchedGender}
          address={watchedAddress}
          onClose={() =>
            step === 1 ? handleDialogChange(false) : setStep((current) => current - 1)
          }
          onOpenChange={handleDialogChange}
          onPrimaryAction={() => void handlePrimaryAction()}
          phone={watchedPhone}
          register={register}
          reviewBadgeVariant={reviewBadgeVariant}
          step={step}
          title={dialogTitle}
        />
      </div>

      <Card className="pt-2 gap-0">
        <PatientsFilters
          insuranceFilter={insuranceFilter}
          insurances={insuranceOptions}
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
          onDelete={(patient) => setPatientToDelete(patient)}
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
      </Card>

      <ConfirmDialog
        open={Boolean(patientToDelete)}
        onOpenChange={(open) => {
          if (!open) setPatientToDelete(null);
        }}
        onConfirm={() => void confirmDeletePatient()}
        title="Excluir paciente"
        description={
          <>
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-text-primary">
              {patientToDelete?.name}
            </span>
            ? Essa ação remove o cadastro da lista ativa.
          </>
        }
        confirmLabel="Excluir"
        isLoading={deletePatient.isPending}
      />
    </div>
  );
}
