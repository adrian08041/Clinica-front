"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  NotificationListItem,
  NotificationsDialog,
} from "@/components/dashboard/notifications-center";
import type { DashboardAlert } from "@/lib/types";

interface AlertsPanelProps {
  alerts: DashboardAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="flex h-[409px] flex-col gap-0 overflow-hidden p-0">
        <CardHeader className="flex shrink-0 flex-col gap-3 border-b border-border-light px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg leading-7 text-text-primary">
              <Bell className="size-5 text-brand-primary" />
              Alertas Próximos
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="h-9 rounded-xl border-border-light px-4 text-sm font-semibold text-text-secondary hover:bg-background-hover hover:text-brand-primary"
            >
              Ver todas
            </Button>
          </div>
          <Badge variant="warning" className="self-start">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning-text opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-warning-text" />
            </span>
            Atenção
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          {alerts.map((alert) => (
            <NotificationListItem key={alert.id} alert={alert} />
          ))}
        </CardContent>
      </Card>

      <NotificationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        alerts={alerts}
      />
    </>
  );
}
