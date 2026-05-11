"use client";

import { AlertCircle, Bell, ChevronRight, CreditCard, Gift, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DashboardAlert } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  AlertCircle,
  CreditCard,
  Gift,
};

const VARIANT_STYLES: Record<
  DashboardAlert["variant"],
  { bg: string; text: string; border: string }
> = {
  warning: {
    bg: "bg-warning-bg",
    text: "text-warning-text",
    border: "border-warning-text/20",
  },
  danger: {
    bg: "bg-danger-bg",
    text: "text-danger-text",
    border: "border-danger-text/20",
  },
  success: {
    bg: "bg-success-bg",
    text: "text-success-text",
    border: "border-success-text/20",
  },
};

export function NotificationListItem({
  alert,
  compact = false,
}: {
  alert: DashboardAlert;
  compact?: boolean;
}) {
  const Icon = ICON_MAP[alert.iconName];
  const styles = VARIANT_STYLES[alert.variant];

  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border ${styles.border} bg-white transition-all duration-200 hover:shadow-sm ${
        compact ? "p-3 pr-3.5" : "p-3.5 pr-4"
      }`}
    >
      <div className={`${styles.bg} flex size-10 shrink-0 items-center justify-center rounded-xl`}>
        {Icon ? <Icon className={`size-[18px] ${styles.text}`} /> : null}
      </div>
      <p className="flex-1 text-sm font-medium leading-5 text-text-secondary">
        {alert.message}
      </p>
      <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text-secondary" />
    </div>
  );
}

export function NotificationsDialog({
  open,
  onOpenChange,
  alerts,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alerts: DashboardAlert[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[620px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
      >
        <div className="sr-only">
          <DialogTitle>Todas as notificações</DialogTitle>
          <DialogDescription>
            Lista com os alertas próximos e notificações importantes do sistema.
          </DialogDescription>
        </div>

        <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-7 text-white md:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/20 bg-white/10">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[20px] font-bold">Todas as Notificações</h3>
              <p className="mt-1 text-[14px] text-white/85">
                Acompanhe os alertas mais importantes da clínica em um só lugar.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-white px-6 py-7 md:px-8">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-light bg-background-card px-4 py-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Total de Alertas
              </p>
              <p className="mt-1 text-[22px] font-bold text-text-primary">{alerts.length}</p>
            </div>
            <span className="rounded-full bg-warning-bg px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warning-text">
              Atualizado agora
            </span>
          </div>

          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <NotificationListItem key={alert.id} alert={alert} />
            ))}
          </div>

          <div className="flex justify-end border-t border-border-light pt-5">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Fechar notificações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
