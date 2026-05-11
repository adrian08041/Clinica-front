"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IntegrationCard } from "./integracoes/integration-card";
import { IntegrationDialog } from "./integracoes/integration-dialog";
import {
  EMPTY_INTEGRATION_FORM,
  INITIAL_INTEGRATIONS,
  getIntegrationVisual,
  type Integration,
  type IntegrationFormState,
} from "./integracoes/integration-shared";

export function IntegracoesSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntegrationId, setEditingIntegrationId] = useState<string | null>(null);
  const [form, setForm] = useState<IntegrationFormState>(EMPTY_INTEGRATION_FORM);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setEditingIntegrationId(null);
      setForm(EMPTY_INTEGRATION_FORM);
    }

    setDialogOpen(open);
  };

  const openCreateDialog = () => {
    setEditingIntegrationId(null);
    setForm(EMPTY_INTEGRATION_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (integration: Integration) => {
    setEditingIntegrationId(integration.id);
    setForm({
      name: integration.name,
      description: integration.description,
      category: integration.category,
      endpoint: integration.endpoint,
    });
    setDialogOpen(true);
  };

  const toggleConnection = (integrationId: string) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              connected: !integration.connected,
              status: integration.connected ? "Pendente" : "Conectado",
            }
          : integration,
      ),
    );
  };

  const handleSaveIntegration = () => {
    if (!form.name.trim() || !form.description.trim() || !form.endpoint.trim()) {
      toast.error("Preencha nome, descrição e endpoint da integração.");
      return;
    }

    const integrationVisual = getIntegrationVisual(form.category);

    if (editingIntegrationId) {
      setIntegrations((current) =>
        current.map((integration) =>
          integration.id === editingIntegrationId
            ? {
                ...integration,
                ...form,
                ...integrationVisual,
              }
            : integration,
        ),
      );
      toast.success("Integração atualizada com sucesso!");
    } else {
      setIntegrations((current) => [
        {
          id: `integration-${Date.now()}`,
          connected: false,
          status: "Pendente",
          ...integrationVisual,
          ...form,
        },
        ...current,
      ]);
      toast.success("Integração adicionada com sucesso!");
    }

    handleDialogChange(false);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Ecossistema de Integrações
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Centralize conexões com comunicação, automação e serviços financeiros.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Integração
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onEdit={openEditDialog}
              onToggleConnection={toggleConnection}
            />
          ))}
        </div>
      </div>

      <IntegrationDialog
        open={dialogOpen}
        editingIntegrationId={editingIntegrationId}
        form={form}
        onOpenChange={handleDialogChange}
        onFormChange={setForm}
        onSave={handleSaveIntegration}
      />
    </>
  );
}
