"use client";

import {
  BadgePercent,
  Building2,
  FileBadge2,
  MoreHorizontal,
  Pencil,
  ShieldPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAgreementStatusClasses, type Agreement } from "./agreement-shared";

type AgreementCardProps = {
  agreement: Agreement;
  onEdit: (agreement: Agreement) => void;
  onToggleStatus: (agreementId: string) => void;
};

export function AgreementCard({
  agreement,
  onEdit,
  onToggleStatus,
}: AgreementCardProps) {
  return (
    <div className="rounded-[24px] border border-border-light bg-white p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.02)] transition-colors hover:bg-background-card/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <ShieldPlus className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[16px] font-semibold text-text-primary">{agreement.name}</h3>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getAgreementStatusClasses(agreement.status)}`}
              >
                {agreement.status}
              </span>
            </div>
            <p className="mt-2 text-[13px] font-medium text-text-tertiary">
              Convênio habilitado para atendimento da clínica.
            </p>
          </div>
        </div>

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
              onClick={() => onEdit(agreement)}
              className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
            >
              <Pencil className="h-4 w-4" />
              Editar cadastro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleStatus(agreement.id)}
              className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
            >
              <ShieldPlus className="h-4 w-4" />
              {agreement.status === "Ativo" ? "Desativar convênio" : "Ativar convênio"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Código
          </p>
          <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold text-text-primary">
            <FileBadge2 className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
            <span className="min-w-0 break-words">{agreement.code}</span>
          </p>
        </div>

        <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Tipo
          </p>
          <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold leading-5 text-text-primary">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
            <span className="min-w-0 break-words">{agreement.type}</span>
          </p>
        </div>

        <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Desconto
          </p>
          <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold text-text-primary">
            <BadgePercent className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
            <span className="min-w-0 break-words">{agreement.discount}%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
