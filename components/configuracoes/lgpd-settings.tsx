"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Eye,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AuditLogDetailDialog } from "@/components/configuracoes/audit-log-detail-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAuditLogs,
  type AuditAction,
  type AuditLogListParams,
} from "@/lib/queries/audit";
import { AUDIT_ENTITIES, entityLabel, formatIp } from "@/lib/utils/audit-helpers";
import { cn } from "@/lib/utils";


type PrivacySetting = {
  id: string;
  title: string;
  description: string;
  icon: "lock" | "activity" | "shield";
  enabled: boolean;
};

const INITIAL_SETTINGS: PrivacySetting[] = [
  {
    id: "lgpd-encryption",
    title: "Criptografia de ponta a ponta",
    description: "Protege prontuários, exames e documentos sensíveis da clínica.",
    icon: "lock",
    enabled: true,
  },
  {
    id: "lgpd-audit",
    title: "Logs de auditoria",
    description: "Registra quem acessou, alterou ou exportou dados de pacientes.",
    icon: "activity",
    enabled: true,
  },
  {
    id: "lgpd-consent",
    title: "Consentimento para uso de dados",
    description: "Mantém o histórico de aceite e atualização de termos do paciente.",
    icon: "shield",
    enabled: false,
  },
];

function getIcon(icon: PrivacySetting["icon"]) {
  if (icon === "lock") return Lock;
  if (icon === "activity") return Activity;
  return ShieldCheck;
}

function PrivacyControlsSection() {
  const [settings, setSettings] = useState<PrivacySetting[]>(INITIAL_SETTINGS);

  const handleToggle = (settingId: string) => {
    const updatedSetting = settings.find((setting) => setting.id === settingId);

    setSettings((current) =>
      current.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting,
      ),
    );

    if (updatedSetting) {
      toast.success(
        updatedSetting.enabled
          ? `${updatedSetting.title} desligado com sucesso.`
          : `${updatedSetting.title} ligado com sucesso.`,
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-success-border/50 bg-success-bg p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 text-success-text">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-[24px] text-success-text">
              Sua clínica está protegida
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-relaxed text-success-text">
              O OdontoFlow segue boas práticas de segurança e privacidade para a
              rotina da clínica.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {settings.map((setting) => {
          const Icon = getIcon(setting.icon);
          return (
            <Card
              key={setting.id}
              className="gap-3 bg-background-card p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-text-muted shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-text-secondary">
                    {setting.title}
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium text-text-tertiary">
                    {setting.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setting.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                  setting.enabled ? "bg-brand-primary" : "bg-background-hover",
                )}
                role="switch"
                aria-checked={setting.enabled}
                aria-label={`Alternar ${setting.title}`}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    setting.enabled ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


const ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
};

const ACTION_VARIANT: Record<AuditAction, "success" | "warning" | "danger" | "neutral"> = {
  CREATE: "success",
  UPDATE: "warning",
  DELETE: "danger",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

const PAGE_SIZE = 25;

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

// Back aceita LocalDateTime ISO 8601 sem timezone (YYYY-MM-DDTHH:mm:ss).
function toStartOfDayIso(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}

// Convenção half-open [start, end): manda o início do dia SEGUINTE
// pra casar com `a.timestamp < :endDate` no AuditLogRepository.
// Garante que logs do segundo 23:59:59.xxx do dia escolhido entram no filtro.
function toEndOfDayIso(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T00:00:00`;
}

// Select shadcn não emite string vazia — sentinel pra representar "sem filtro".
const ALL_SENTINEL = "ALL";

function AuditLogsSection() {
  const [action, setAction] = useState<AuditAction | "">("");
  const [entityClass, setEntityClass] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queryParams = useMemo<AuditLogListParams>(
    () => ({
      page,
      size: PAGE_SIZE,
      action: action || undefined,
      entity: entityClass || undefined,
      startDate: toStartOfDayIso(startDate),
      endDate: toEndOfDayIso(endDate),
    }),
    [page, action, entityClass, startDate, endDate],
  );

  const logsQuery = useAuditLogs(queryParams);
  const logs = logsQuery.data?.content ?? [];
  const totalPages = logsQuery.data?.totalPages ?? 0;
  const totalElements = logsQuery.data?.totalElements ?? 0;

  const clearFilters = () => {
    setAction("");
    setEntityClass("");
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(0);
  };

  const onChangeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Label>Ação</Label>
          <Select
            value={action || ALL_SENTINEL}
            onValueChange={(value) =>
              onChangeFilter<AuditAction | "">(setAction)(
                value === ALL_SENTINEL ? "" : (value as AuditAction),
              )
            }
          >
            <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary transition-all">
              <SelectValue placeholder="Todas as ações" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border-light">
              <SelectItem value={ALL_SENTINEL}>Todas as ações</SelectItem>
              <SelectItem value="CREATE">Criação</SelectItem>
              <SelectItem value="UPDATE">Atualização</SelectItem>
              <SelectItem value="DELETE">Exclusão</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <Label>
            Entidade
          </Label>
          <Select
            value={entityClass || ALL_SENTINEL}
            onValueChange={(value) =>
              onChangeFilter<string>(setEntityClass)(value === ALL_SENTINEL ? "" : value)
            }
          >
            <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary transition-all">
              <SelectValue placeholder="Todas as entidades" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border-light">
              <SelectItem value={ALL_SENTINEL}>Todas as entidades</SelectItem>
              {AUDIT_ENTITIES.map((entity) => (
                <SelectItem key={entity.value} value={entity.value}>
                  {entity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <Label>De</Label>
          <DatePicker
            value={startDate}
            onChange={onChangeFilter<Date | undefined>(setStartDate)}
            placeholder="Data inicial"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <Label>Até</Label>
          <DatePicker
            value={endDate}
            onChange={onChangeFilter<Date | undefined>(setEndDate)}
            placeholder="Data final"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-text-tertiary">
          {logsQuery.isLoading
            ? "Carregando registros…"
            : `${totalElements.toLocaleString("pt-BR")} registro${totalElements === 1 ? "" : "s"} encontrado${totalElements === 1 ? "" : "s"}`}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="h-9 rounded-[10px] border-border-light px-3 text-[13px] font-semibold text-text-secondary"
          >
            Limpar filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void logsQuery.refetch()}
            disabled={logsQuery.isFetching}
            className="h-9 rounded-[10px] border-border-light px-3 text-[13px] font-semibold text-text-secondary"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", logsQuery.isFetching && "animate-spin")}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {logsQuery.isError ? (
        <QueryErrorBanner
          error={logsQuery.error}
          onRetry={() => void logsQuery.refetch()}
          isRetrying={logsQuery.isFetching}
        />
      ) : null}

      <div className="overflow-hidden rounded-[14px] border border-border-light bg-white">
        <div className="hidden md:block">
          <div className="grid grid-cols-[160px_1.2fr_120px_1fr_140px_90px] gap-3 border-b border-border-light bg-background-card px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint-alt">
            <span>Quando</span>
            <span>Usuário</span>
            <span>Ação</span>
            <span>Entidade</span>
            <span>IP</span>
            <span className="text-right">—</span>
          </div>

          {logsQuery.isLoading ? (
            <div className="px-4 py-8 text-center text-[14px] font-medium text-text-tertiary">
              Carregando…
            </div>
          ) : logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-[14px] font-medium text-text-tertiary">
              Nenhum log encontrado para os filtros aplicados.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-[160px_1.2fr_120px_1fr_140px_90px] items-center gap-3 border-b border-border-light px-4 py-3 last:border-b-0"
              >
                <span className="text-[13px] font-semibold text-text-secondary">
                  {formatTimestamp(log.timestamp)}
                </span>
                <span className="truncate text-[13px] font-medium text-text-secondary">
                  {log.userName || "—"}
                </span>
                <span>
                  <Badge variant={ACTION_VARIANT[log.action]}>
                    {ACTION_LABEL[log.action]}
                  </Badge>
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-medium text-text-secondary">
                    {entityLabel(log.entity)}
                  </span>
                  {log.summary ? (
                    <span className="truncate text-[12px] font-medium text-text-tertiary">
                      {log.summary}
                    </span>
                  ) : null}
                </span>
                <span className="truncate text-[13px] font-medium text-text-tertiary">
                  {formatIp(log.ipAddress)}
                </span>
                <span className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedId(log.id)}
                    className="h-8 rounded-[8px] border-border-light px-2 text-[12px] font-semibold text-text-secondary"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Ver
                  </Button>
                </span>
              </div>
            ))
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-3 p-3 md:hidden">
          {logsQuery.isLoading ? (
            <p className="px-2 py-6 text-center text-[14px] font-medium text-text-tertiary">
              Carregando…
            </p>
          ) : logs.length === 0 ? (
            <p className="px-2 py-6 text-center text-[14px] font-medium text-text-tertiary">
              Nenhum log encontrado.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-[12px] border border-border-light p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-text-secondary">
                      {log.userName || "—"}
                    </p>
                    <p className="text-[12px] font-medium text-text-tertiary">
                      {formatTimestamp(log.timestamp)}
                    </p>
                  </div>
                  <Badge variant={ACTION_VARIANT[log.action]} className="shrink-0">
                    {ACTION_LABEL[log.action]}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-text-secondary">
                      {entityLabel(log.entity)}
                    </p>
                    {log.summary ? (
                      <p className="truncate text-[11px] font-medium text-text-tertiary">
                        {log.summary}
                      </p>
                    ) : null}
                    <p className="truncate text-[11px] font-medium text-text-tertiary">
                      {formatIp(log.ipAddress)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedId(log.id)}
                    className="h-8 shrink-0 rounded-[8px] border-border-light px-2 text-[12px] font-semibold text-text-secondary"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Ver
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] font-medium text-text-tertiary">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0 || logsQuery.isFetching}
              className="h-9 rounded-[10px] border-border-light px-3 text-[13px] font-semibold text-text-secondary"
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setPage((current) => Math.min(totalPages - 1, current + 1))
              }
              disabled={page >= totalPages - 1 || logsQuery.isFetching}
              className="h-9 rounded-[10px] border-border-light px-3 text-[13px] font-semibold text-text-secondary"
            >
              Próxima
            </Button>
          </div>
        </div>
      ) : null}

      <AuditLogDetailDialog
        id={selectedId}
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página
// ─────────────────────────────────────────────────────────────────────────────

interface AccordionSectionProps {
  value: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function AccordionSection({
  value,
  title,
  description,
  icon,
  children,
}: AccordionSectionProps) {
  return (
    <Card asChild className="overflow-hidden gap-0 py-0">
      <AccordionItem value={value} className="border-b-0">
        <AccordionTrigger className="px-4 py-4 sm:px-6 rounded-none hover:no-underline hover:bg-background-card [&>svg]:size-5 [&>svg]:text-text-muted">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
              {icon}
            </div>
            <div>
              <p className="text-[15px] font-bold text-text-primary">{title}</p>
              {description ? (
                <p className="mt-0.5 text-[12px] font-medium text-text-tertiary">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t border-border-light px-4 py-5 sm:px-6">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
}

export function LGPDSettings() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <Card className="p-4 sm:p-6 gap-0">
        <h2 className="text-[18px] font-bold leading-[28px] text-text-primary">
          LGPD &amp; Auditoria
        </h2>
        <p className="mt-1 text-[14px] font-medium text-text-tertiary">
          Controles de privacidade e trilha de auditoria do sistema. Acesso
          restrito a administradores.
        </p>
      </Card>

      <Accordion
        type="multiple"
        defaultValue={["audit-logs"]}
        className="flex flex-col gap-4"
      >
        <AccordionSection
          value="privacy-controls"
          title="Controle de Privacidade"
          description="Recursos visuais de LGPD"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <PrivacyControlsSection />
        </AccordionSection>

        <AccordionSection
          value="audit-logs"
          title="Logs de Auditoria"
          description="Histórico de criação, atualização, exclusão e acessos"
          icon={<Activity className="h-5 w-5" />}
        >
          <AuditLogsSection />
        </AccordionSection>
      </Accordion>
    </div>
  );
}
