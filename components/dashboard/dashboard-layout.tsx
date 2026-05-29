"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UNAUTHORIZED_EVENT } from "@/lib/api";
import { getStoredUser, subscribeUser } from "@/lib/utils/auth";
import { canAccessRoute, homeFor } from "@/lib/utils/permissions";

export function DashboardLayout({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs?: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const storedUser = useSyncExternalStore(subscribeUser, getStoredUser, () => null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }
        // Guard de cargo: acesso por URL direta a rota proibida volta pra home do cargo.
        const role = storedUser?.role ?? null;
        if (role && pathname && !canAccessRoute(role, pathname)) {
            router.replace(homeFor(role));
        }
    }, [router, pathname, storedUser]);

    useEffect(() => {
        const onUnauthorized = () => {
            toast.error("Sessão expirada. Faça login novamente.");
            router.replace("/login");
        };
        window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    }, [router]);

    return (
        <div className="flex h-screen w-full bg-background-card text-text-primary overflow-hidden">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-text-primary/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar container */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <Sidebar className="h-full w-64 md:flex" onNavigate={() => setIsSidebarOpen(false)} />
            </div>

            <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <Header breadcrumbs={breadcrumbs} />
                <div className="relative flex-1 overflow-auto p-4 pb-20 md:p-8">
                    {children}
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
