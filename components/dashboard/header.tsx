"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    breadcrumbs?: string[];
}

export function Header({ breadcrumbs }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [userFirstName, setUserFirstName] = useState("Dra. Ana");
    const [userFullName, setUserFullName] = useState("Dra. Ana Silva");
    const [userRole, setUserRole] = useState("Dentista");
    const [userEmail, setUserEmail] = useState("ana.silva@odontoflow.com");

    // Load user data on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line
                if (parsedUser.firstName) {
                    setUserFirstName(parsedUser.firstName);
                    setUserFullName(parsedUser.firstName + (parsedUser.lastName ? ` ${parsedUser.lastName}` : ""));
                }
                if (parsedUser.role) {
                    setUserRole(parsedUser.role);
                }
                if (parsedUser.email) {
                    setUserEmail(parsedUser.email);
                }
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

    const currentHour = new Date().getHours();
    let greeting = "Bom dia";
    if (currentHour >= 12 && currentHour < 18) {
        greeting = "Boa tarde";
    } else if (currentHour >= 18 || currentHour < 5) {
        greeting = "Boa noite";
    }

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
                        <h2 className="text-base md:text-lg font-semibold text-slate-800">{greeting}, {userFirstName} 👋</h2>
                        <p className="hidden md:block text-xs text-slate-500 uppercase tracking-widest mt-1">
                            {today}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Buscar pacientes, agendamentos..."
                        className="pl-9 w-48 md:w-64 lg:w-80 bg-slate-50 border-slate-200 rounded-full h-9 focus-visible:ring-teal-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    <Button variant="ghost" size="icon" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        <span className="sr-only">Notificações</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 data-[state=open]:bg-slate-50">
                            <div className="hidden md:flex flex-col items-end text-sm">
                                <span className="font-bold text-slate-700 leading-tight">{userFullName}</span>
                                <span className="text-xs text-slate-500">{userRole}</span>
                            </div>
                            <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                                <AvatarImage src="" alt={userFullName} />
                                <AvatarFallback className="bg-teal-50 text-teal-700 font-medium">
                                    {userFirstName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[300px] p-0 overflow-hidden rounded-2xl border-slate-200 shadow-xl mt-2">
                            <div className="bg-[#14b8a6] p-4 flex items-center gap-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 -mr-10 -mt-10 blur-2xl"></div>
                                <Avatar className="h-14 w-14 border-2 border-white/20 shadow-sm relative z-10">
                                    <AvatarImage src="" alt={userFullName} />
                                    <AvatarFallback className="bg-white text-teal-700 font-bold text-lg">
                                        {userFirstName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-white relative z-10">
                                    <span className="font-bold text-base leading-tight">{userFullName}</span>
                                    <span className="text-sm text-teal-50 opacity-90">{userEmail}</span>
                                </div>
                            </div>

                            <div className="p-2 flex flex-col gap-1">
                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50">
                                    <div className="h-10 w-10 bg-slate-100 flex items-center justify-center rounded-xl text-slate-600 shrink-0">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 text-sm">Meu Perfil</span>
                                        <span className="text-xs text-slate-500">Dados pessoais e configurações</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50">
                                    <div className="h-10 w-10 bg-slate-100 flex items-center justify-center rounded-xl text-slate-600 shrink-0">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 text-sm">Configurações</span>
                                        <span className="text-xs text-slate-500">Preferências do sistema</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="mx-2 my-1" />

                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-red-50 focus:bg-red-50 group" onClick={() => {
                                    localStorage.removeItem("user");
                                    window.location.href = "/";
                                }}>
                                    <div className="h-10 w-10 bg-red-50 group-hover:bg-red-100 flex items-center justify-center rounded-xl text-[#f87171] shrink-0 transition-colors">
                                        <LogOut className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col border-none">
                                        <span className="font-bold text-[#f87171] text-sm">Sair da conta</span>
                                        <span className="text-xs text-[#fca5a5]">Encerrar sessão</span>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
