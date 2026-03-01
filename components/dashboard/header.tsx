"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    breadcrumbs?: string[];
}

export function Header({ breadcrumbs }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("Dra. Ana");

    // Load user data on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line
                if (parsedUser.firstName) setUserName(parsedUser.firstName);
            }
        } catch (e) {
            console.error("Failed to parse user from local storage", e);
        }
    }, []);

    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    <div className="flex items-center text-[13px] font-medium text-slate-500">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center">
                                <span className={index === breadcrumbs.length - 1 ? "text-slate-900 font-semibold" : ""}>
                                    {crumb}
                                </span>
                                {index < breadcrumbs.length - 1 && (
                                    <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-slate-800">Bom dia, {userName} 👋</h2>
                        <p className="hidden md:block text-xs text-slate-500 uppercase tracking-widest mt-1">
                            {today}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar pacientes, agendamentos..."
                        className="pl-9 w-48 md:w-64 lg:w-80 bg-slate-50 border-slate-200 rounded-full h-9 focus-visible:ring-teal-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="ghost" size="icon" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    <span className="sr-only">Notificações</span>
                </Button>
            </div>
        </header>
    );
}
