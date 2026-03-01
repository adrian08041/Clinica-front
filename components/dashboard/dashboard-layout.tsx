"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs?: string[] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
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
                <Header breadcrumbs={breadcrumbs} onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
            <Toaster position="bottom-right" />
        </div>
    );
}
