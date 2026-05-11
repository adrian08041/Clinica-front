"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AgreementCard } from "./convenios/agreement-card";
import { AgreementDialog } from "./convenios/agreement-dialog";
import {
  EMPTY_AGREEMENT_FORM,
  INITIAL_AGREEMENTS,
  type Agreement,
  type AgreementFormState,
} from "./convenios/agreement-shared";

export function ConveniosSettings() {
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null);
  const [form, setForm] = useState<AgreementFormState>(EMPTY_AGREEMENT_FORM);

  const resetForm = () => {
    setForm(EMPTY_AGREEMENT_FORM);
    setEditingAgreementId(null);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }

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

  const toggleStatus = (agreementId: string) => {
    setAgreements((current) =>
      current.map((agreement) =>
        agreement.id === agreementId
          ? {
              ...agreement,
              status: agreement.status === "Ativo" ? "Inativo" : "Ativo",
            }
          : agreement,
      ),
    );
  };

  const handleSaveAgreement = () => {
    if (!form.name.trim() || !form.code.trim() || !form.discount.trim()) {
      toast.error("Preencha nome, código e desconto do convênio.");
      return;
    }

    if (editingAgreementId) {
      setAgreements((current) =>
        current.map((agreement) =>
          agreement.id === editingAgreementId
            ? {
                ...agreement,
                ...form,
              }
            : agreement,
        ),
      );
      toast.success("Convênio atualizado com sucesso!");
    } else {
      setAgreements((current) => [
        {
          id: `agreement-${Date.now()}`,
          ...form,
        },
        ...current,
      ]);
      toast.success("Convênio adicionado com sucesso!");
    }

    handleDialogChange(false);
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

        <div className="grid gap-4 xl:grid-cols-2">
          {agreements.map((agreement) => (
            <AgreementCard
              key={agreement.id}
              agreement={agreement}
              onEdit={openEditDialog}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      </div>

      <AgreementDialog
        open={dialogOpen}
        editingAgreementId={editingAgreementId}
        form={form}
        onOpenChange={handleDialogChange}
        onFormChange={setForm}
        onSave={handleSaveAgreement}
      />
    </>
  );
}
