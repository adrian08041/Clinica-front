"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useCreateInsurance,
  useDeleteInsurance,
  useInsurances,
  useUpdateInsurance,
  type InsuranceResponse,
} from "@/lib/queries/settings";
import { AgreementCard } from "./convenios/agreement-card";
import { AgreementDialog } from "./convenios/agreement-dialog";
import {
  EMPTY_AGREEMENT_FORM,
  type Agreement,
  type AgreementFormState,
  type AgreementStatus,
  type AgreementType,
} from "./convenios/agreement-shared";

const VALID_TYPES: AgreementType[] = [
  "Plano odontológico",
  "Plano de saúde",
  "Convênio corporativo",
  "Parceria local",
];

const VALID_STATUSES: AgreementStatus[] = ["Ativo", "Em análise", "Inativo"];

function isAgreementType(value: string | null): value is AgreementType {
  return value !== null && (VALID_TYPES as string[]).includes(value);
}

function isAgreementStatus(value: string | null): value is AgreementStatus {
  return value !== null && (VALID_STATUSES as string[]).includes(value);
}

function toAgreement(insurance: InsuranceResponse): Agreement {
  return {
    id: insurance.id,
    name: insurance.name,
    code: insurance.code ?? "",
    type: isAgreementType(insurance.type) ? insurance.type : "Plano odontológico",
    discount: insurance.discount ?? "",
    status: isAgreementStatus(insurance.status) ? insurance.status : "Ativo",
  };
}

export function ConveniosSettings() {
  const insurancesQuery = useInsurances();
  const createInsurance = useCreateInsurance();
  const updateInsurance = useUpdateInsurance();
  const deleteInsurance = useDeleteInsurance();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null);
  const [form, setForm] = useState<AgreementFormState>(EMPTY_AGREEMENT_FORM);

  const agreements: Agreement[] = (insurancesQuery.data ?? []).map(toAgreement);
  const isLoading = insurancesQuery.isLoading;
  const isSaving = createInsurance.isPending || updateInsurance.isPending;

  const resetForm = () => {
    setForm(EMPTY_AGREEMENT_FORM);
    setEditingAgreementId(null);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) resetForm();
    setDialogOpen(open);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (agreement: Agreement) => {
    setEditingAgreementId(agreement.id);
    setForm({
      name: agreement.name,
      code: agreement.code,
      type: agreement.type,
      discount: agreement.discount,
      status: agreement.status,
    });
    setDialogOpen(true);
  };

  const toggleStatus = async (agreementId: string) => {
    const current = agreements.find((agreement) => agreement.id === agreementId);
    if (!current) return;
    const nextStatus: AgreementStatus = current.status === "Ativo" ? "Inativo" : "Ativo";

    try {
      await updateInsurance.mutateAsync({
        id: agreementId,
        payload: { name: current.name, status: nextStatus },
      });
      toast.success("Status do convênio atualizado!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao atualizar status do convênio");
    }
  };

  const handleSaveAgreement = async () => {
    if (!form.name.trim() || !form.code.trim() || !form.discount.trim()) {
      toast.error("Preencha nome, código e desconto do convênio.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      code: form.code,
      type: form.type,
      discount: form.discount,
      status: form.status,
    };

    try {
      if (editingAgreementId) {
        await updateInsurance.mutateAsync({ id: editingAgreementId, payload });
        toast.success("Convênio atualizado com sucesso!");
      } else {
        await createInsurance.mutateAsync(payload);
        toast.success("Convênio adicionado com sucesso!");
      }
      handleDialogChange(false);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(
        apiError.message ||
          (editingAgreementId ? "Erro ao atualizar convênio" : "Erro ao adicionar convênio"),
      );
    }
  };

  const handleDeleteAgreement = async (agreementId: string) => {
    const target = agreements.find((agreement) => agreement.id === agreementId);
    const shouldDelete = window.confirm(
      target
        ? `Deseja remover o convênio ${target.name}?`
        : "Deseja remover este convênio?",
    );
    if (!shouldDelete) return;

    try {
      await deleteInsurance.mutateAsync(agreementId);
      toast.success("Convênio removido com sucesso!");
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao remover convênio");
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Convênios Aceitos
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Organize os convênios cadastrados com código, tipo e desconto aplicado.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Convênio
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          </div>
        ) : agreements.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-[14px] border border-dashed border-border-light text-text-tertiary">
            <p className="text-[14px]">Nenhum convênio cadastrado.</p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {agreements.map((agreement) => (
              <AgreementCard
                key={agreement.id}
                agreement={agreement}
                onEdit={openEditDialog}
                onToggleStatus={toggleStatus}
                onDelete={handleDeleteAgreement}
              />
            ))}
          </div>
        )}
      </div>

      <AgreementDialog
        open={dialogOpen}
        editingAgreementId={editingAgreementId}
        form={form}
        isSaving={isSaving}
        onOpenChange={handleDialogChange}
        onFormChange={setForm}
        onSave={handleSaveAgreement}
      />
    </>
  );
}
