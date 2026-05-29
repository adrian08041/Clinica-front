"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { getStoredUser, subscribeUser } from "@/lib/utils/auth";
import { canAccessRoute } from "@/lib/utils/permissions";
import {
    Home,
    Users,
    Calendar,
    DollarSign,
    Menu
} from "lucide-react";

const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Pacientes", href: "/pacientes", icon: Users },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Financeiro", href: "/financeiro", icon: DollarSign },
    { name: "Menu", href: "/menu", icon: Menu },
];

export function MobileNav() {
    const pathname = usePathname();
    const storedUser = useSyncExternalStore(subscribeUser, getStoredUser, () => null);
    const visibleNavItems = navItems.filter((item) =>
        canAccessRoute(storedUser?.role ?? null, item.href),
    );

    return (
        <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-light shadow-[0_-4px_15px_rgba(0,0,0,0.03)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="flex justify-around items-center h-[72px] px-2">
                {visibleNavItems.map((item) => {
                    // Trata o /dashboard como base e não ativa nos outros
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                                isActive ? "text-brand-primary" : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                            <span className="text-[10px] font-medium leading-none">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
