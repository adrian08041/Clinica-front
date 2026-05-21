"use client";

import {
  CheckCircle2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  PlugZap,
  Unplug,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  renderIntegrationIcon,
  type Integration,
  type IntegrationCategory,
} from "./integration-shared";

function categoryVariant(category: IntegrationCategory) {
  if (category === "Comunicação") return "success" as const;
  if (category === "Automação") return "danger" as const;
  if (category === "Financeiro") return "warning" as const;
  return "neutral" as const;
}

type IntegrationCardProps = {
  integration: Integration;
  onEdit: (integration: Integration) => void;
  onToggleConnection: (integrationId: string) => void;
};

export function IntegrationCard({
  integration,
  onEdit,
  onToggleConnection,
}: IntegrationCardProps) {
  return (
    <div className="flex flex-col rounded-[24px] border border-border-light bg-white p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.02)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-[52px] w-[52px] items-center justify-center rounded-full border border-border-light bg-white shadow-sm",
            integration.color,
          )}
        >
          {renderIntegrationIcon(integration.iconName, "h-6 w-6")}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={integration.connected ? "success" : "warning"}>
            <CheckCircle2 />
            {integration.status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-muted hover:text-text-secondary"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-border-light">
              <DropdownMenuItem
                onClick={() => onEdit(integration)}
                className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
              >
                <Pencil className="h-4 w-4" />
                Editar integração
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleConnection(integration.id)}
                className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
              >
                {integration.connected ? (
                  <Unplug className="h-4 w-4" />
                ) : (
                  <PlugZap className="h-4 w-4" />
                )}
                {integration.connected ? "Desconectar" : "Conectar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[18px] font-bold text-text-primary">{integration.name}</h3>
          <Badge variant={categoryVariant(integration.category)}>
            {integration.category}
          </Badge>
        </div>
        <p className="mt-2 text-[14px] font-medium text-text-tertiary">
          {integration.description}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border-light bg-background-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Endpoint / Origem
        </p>
        <p className="mt-2 break-all text-[14px] font-medium text-text-secondary">
          {integration.endpoint}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className="h-10 flex-1 rounded-full border-border-light text-[13px] font-semibold text-text-secondary hover:bg-background-card"
        >
          Configurar Integração
          <ExternalLink className="ml-2 h-[14px] w-[14px] text-text-muted" />
        </Button>
        <Button
          onClick={() => onToggleConnection(integration.id)}
          className={cn(
            "h-10 flex-1 rounded-full text-[13px] font-semibold text-white shadow-sm",
            integration.connected
              ? "bg-danger-text hover:bg-danger-text/90"
              : "bg-brand-primary hover:bg-brand-dark",
          )}
        >
          {integration.connected ? "Desconectar" : "Conectar"}
        </Button>
      </div>
    </div>
  );
}
