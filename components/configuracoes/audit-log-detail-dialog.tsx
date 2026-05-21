"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  useAuditLog,
  type AuditAction,
  type AuditLogDetailResponse,
} from "@/lib/queries/audit";
import {
  actionLabel,
  actionVerb,
  entityLabel,
  extractEntitySummary,
  formatIp,
} from "@/lib/utils/audit-helpers";

const ACTION_VARIANT: Record<AuditAction, "success" | "warning" | "danger" | "neutral"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "danger",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

interface AuditLogDetailDialogProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function prettyJson(raw: string | null | undefined): string {
  if (!raw) return "—";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function buildSentence(log: AuditLogDetailResponse): string {
  const user = log.userName || "Usuário";
  const verb = actionVerb(log.action);

  // LOGIN/LOGOUT têm verbos completos ("fez login" / "encerrou a sessão") —
  // não montar com "o <entidade>" pra evitar frases estranhas.
  if (log.action === "LOGIN") return `${user} ${verb} no sistema.`;
  if (log.action === "LOGOUT") return `${user} ${verb}.`;

  const entity = entityLabel(log.entity).toLowerCase();
  // Prefere o summary computado pelo back; cai pro helper local se ausente.
  const summary = log.summary ?? extractEntitySummary(log.changes, log.entity);
  if (summary) {
    return `${user} ${verb} o ${entity}: ${summary}.`;
  }
  return `${user} ${verb} um ${entity}.`;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
        {label}
      </span>
      <span className="break-all text-[14px] font-semibold text-[var(--color-ink-panel)]">
        {value}
      </span>
    </div>
  );
}

function DetailBody({ log }: { log: AuditLogDetailResponse }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[12px] border border-border-light bg-background-card/60 p-4">
        <p className="text-[14px] font-medium leading-relaxed text-text-secondary">
          {buildSentence(log)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetaRow label="Usuário" value={log.userName || "—"} />
        <MetaRow label="Entidade" value={entityLabel(log.entity)} />
        <MetaRow label="Endereço IP" value={formatIp(log.ipAddress)} />
        <MetaRow label="Data e hora" value={formatTimestamp(log.timestamp)} />
        <MetaRow label="ID do registro" value={log.entityId} />
        <MetaRow label="ID do usuário" value={log.userId} />
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
          Dados completos (snapshot)
        </p>
        <pre className="max-h-[360px] overflow-auto rounded-[12px] bg-[var(--color-surface-panel)] p-4 font-mono text-[12px] leading-[18px] text-[var(--color-ink-panel)]">
          {prettyJson(log.changes)}
        </pre>
      </div>
    </div>
  );
}

export function AuditLogDetailDialog({
  id,
  open,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  const query = useAuditLog(id ?? undefined);
  const log = query.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle>Detalhe do log</DialogTitle>
            {log ? (
              <Badge variant={ACTION_VARIANT[log.action]}>
                {actionLabel(log.action)}
              </Badge>
            ) : null}
          </div>
          <DialogDescription>
            Registro imutável de auditoria conforme LGPD.
          </DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="flex h-40 items-center justify-center gap-2 text-[var(--color-text-panel-soft)]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-[14px] font-medium">Carregando…</span>
          </div>
        ) : query.isError ? (
          <QueryErrorBanner
            error={query.error}
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        ) : log ? (
          <DetailBody log={log} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
