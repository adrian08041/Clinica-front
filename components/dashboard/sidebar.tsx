"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getStoredUser, subscribeUser } from "@/lib/utils/auth";
import { canAccessRoute } from "@/lib/utils/permissions";
import {
    LayoutDashboard,
    User as UserIcon,
    Calendar,
    Activity,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pacientes", href: "/pacientes", icon: UserIcon },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Tratamentos", href: "/tratamentos", icon: Activity },
    { name: "Financeiro", href: "/financeiro", icon: FileText },
];

export function Sidebar({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const storedUser = useSyncExternalStore(subscribeUser, getStoredUser, () => null);
    const role = storedUser?.role ?? null;
    const user = {
        name: storedUser?.name || "Usuário",
        role: storedUser?.role || "",
        initials: storedUser?.initials || (storedUser?.name?.substring(0, 2).toUpperCase() ?? "U"),
        avatarUrl: storedUser?.avatarUrl || "",
    };

    const visibleNavItems = navItems.filter((item) => canAccessRoute(role, item.href));
    const canSeeSettings = canAccessRoute(role, "/configuracoes");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <aside className={cn("w-64 bg-background-sidebar text-white/70 flex flex-col justify-between shrink-0", className)}>
            <div>
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <div className="bg-brand-primary w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold">O</span>
                    </div>
                    <h1 className="text-white text-xl font-bold tracking-tight cursor-default">OdontoFlow</h1>
                </div>

                <nav className="p-4 space-y-2">
                    {visibleNavItems.map((item) => {
                        // Verifica se a rota atual começa com o href do item (para manter ativo em subpáginas)
                        const isActive = pathname?.startsWith(item.href);

                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                                    isActive
                                        ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
                                        : "hover:bg-white/10"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-brand-primary" : "text-white/50")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-white/10">
                {canSeeSettings ? (
                    <Link
                        href="/configuracoes"
                        onClick={onNavigate}
                        className={cn(
                            "w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors mb-2",
                            pathname?.startsWith("/configuracoes")
                                ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
                                : "text-white/70 hover:bg-white/10"
                        )}
                    >
                        <Settings className={cn("w-5 h-5 mr-3", pathname?.startsWith("/configuracoes") ? "text-brand-primary" : "text-white/50")} /> Configurações
                    </Link>
                ) : null}
                <div className="flex items-center p-3 mt-2 rounded-xl border border-white/10 bg-white/5">
                    <Avatar className="w-10 h-10 border-2 border-white/20">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                        <AvatarFallback className="bg-brand-primary text-white font-medium">{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.role}</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/15 mt-0.5 ml-2"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
