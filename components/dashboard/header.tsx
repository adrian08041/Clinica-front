"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { DASHBOARD_ALERTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NotificationListItem,
  NotificationsDialog,
} from "@/components/dashboard/notifications-center";

interface HeaderProps {
  breadcrumbs?: string[];
}

export function Header({ breadcrumbs }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);

  function getUserData() {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const name = parsedUser.name || "";
        return {
          fullName: name,
          firstName: name.split(" ").slice(0, 2).join(" "),
          role: parsedUser.role || "",
          email: parsedUser.email || "",
          initials: parsedUser.initials || name.substring(0, 2).toUpperCase(),
        };
      }
    } catch {
      // ignore parse errors
    }
    return { fullName: "", firstName: "", role: "", email: "", initials: "" };
  }

  const userData = getUserData();
  const userFullName = userData.fullName;
  const userFirstName = userData.firstName;
  const userRole = userData.role;
  const userEmail = userData.email;
  const userInitials = userData.initials;

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentHour = new Date().getHours();
  let greeting = "Bom dia";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Boa tarde";
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = "Boa noite";
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-light bg-white px-4 md:px-8">
        <div className="flex items-center gap-4">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <div className="flex items-center text-[13px] font-medium text-text-tertiary">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb + index} className="flex items-center">
                  <span
                    className={index === breadcrumbs.length - 1 ? "font-semibold text-text-primary" : ""}
                  >
                    {crumb}
                  </span>
                  {index < breadcrumbs.length - 1 ? (
                    <ChevronRight className="mx-2 h-4 w-4 text-text-muted" />
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h2 className="text-base font-semibold text-text-primary md:text-lg">
                {greeting}, {userFirstName}
              </h2>
              <p className="mt-1 hidden text-xs uppercase tracking-widest text-text-tertiary md:block">
                {today}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Buscar pacientes, agendamentos..."
              className="h-9 w-48 rounded-full border-border-light bg-background-card pl-9 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 md:w-64 lg:w-80"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 border-l border-border-light pl-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative p-2 text-text-muted transition-colors hover:text-text-secondary"
                >
                  <Bell className="h-5 w-5 text-text-secondary" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-danger-text" />
                  <span className="sr-only">Notificações</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[360px] rounded-2xl border-border-light p-0 shadow-xl"
              >
                <div className="border-b border-border-light px-4 py-4">
                  <p className="text-[15px] font-bold text-text-primary">Alertas próximos</p>
                  <p className="mt-1 text-[13px] font-medium text-text-tertiary">
                    Veja o que precisa de atenção agora.
                  </p>
                </div>

                <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto p-4">
                  {DASHBOARD_ALERTS.map((alert) => (
                    <NotificationListItem key={alert.id} alert={alert} compact />
                  ))}
                </div>

                <div className="border-t border-border-light p-3">
                  <Button
                    type="button"
                    onClick={() => setNotificationsDialogOpen(true)}
                    className="h-10 w-full rounded-xl bg-brand-primary text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    Ver todas as notificações
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-xl border border-transparent p-2 outline-none transition-colors hover:border-border-light hover:bg-background-card data-[state=open]:bg-background-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border-light">
                    <AvatarImage src="" alt={userFullName} />
                    <AvatarFallback className="bg-brand-primary font-medium text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-1 hidden overflow-hidden text-left md:flex md:flex-col">
                    <p className="truncate text-sm font-medium text-text-primary">{userFullName}</p>
                    <p className="truncate text-xs text-text-tertiary">{userRole}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-2 w-[300px] overflow-hidden rounded-2xl border-border-light p-0 shadow-xl"
              >
                <div className="relative flex items-center gap-3 overflow-hidden bg-brand-primary p-4">
                  <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-white opacity-10 blur-2xl" />
                  <Avatar className="relative z-10 h-14 w-14 border-2 border-white/20 shadow-sm">
                    <AvatarImage src="" alt={userFullName} />
                    <AvatarFallback className="bg-white text-lg font-bold text-brand-dark">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="relative z-10 flex flex-col text-white">
                    <span className="text-base font-bold leading-tight">{userFullName}</span>
                    <span className="text-sm text-white/90">{userEmail}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 p-2">
                  <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl p-3 hover:bg-background-card focus:bg-background-card">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background-hover text-text-secondary">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-secondary">Meu Perfil</span>
                      <span className="text-xs text-text-tertiary">Dados pessoais e configurações</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl p-3 hover:bg-background-card focus:bg-background-card">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background-hover text-text-secondary">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-secondary">Configurações</span>
                      <span className="text-xs text-text-tertiary">Preferências do sistema</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="mx-2 my-1" />

                  <DropdownMenuItem
                    className="group cursor-pointer gap-3 rounded-xl p-3 hover:bg-danger-bg focus:bg-danger-bg"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-bg text-danger-text transition-colors group-hover:bg-danger-bg">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col border-none">
                      <span className="text-sm font-bold text-danger-text">Sair da conta</span>
                      <span className="text-xs text-danger-text">Encerrar sessão</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NotificationsDialog
        open={notificationsDialogOpen}
        onOpenChange={setNotificationsDialogOpen}
        alerts={DASHBOARD_ALERTS}
      />
    </>
  );
}
