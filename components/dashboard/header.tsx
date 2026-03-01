"use client";

import { useRouter } from "next/navigation";
import { Search, Bell, Menu, ChevronRight, ChevronDown, Check, Calendar as CalendarIcon, AlertTriangle, User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
    breadcrumbs?: string[];
}

export function Header({ breadcrumbs }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            <span className="sr-only">Notificações</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-80 p-4 rounded-lg bg-white border border-slate-100 shadow-lg">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-sm font-semibold">Notificações</p>
                                    <p className="text-xs text-slate-500">Últimas notificações do sistema</p>
                                </div>
                                <Button variant="ghost" size="sm">Ver tudo</Button>
                            </div>

                            <div className="mt-2 space-y-2 max-h-56 overflow-auto">
                                {[
                                    { id: 1, title: 'Pagamento recebido', desc: 'Pagamento de Ricardo Mendes (R$ 350,00)', time: 'há 2 dias', type: 'payment' },
                                    { id: 2, title: 'Consulta agendada', desc: 'Mariana Costa - 28/02 às 14:00', time: 'há 1 dia', type: 'appointment' },
                                    { id: 3, title: 'Fatura atrasada', desc: 'Carlos Eduardo possui parcela vencida', time: 'há 3 dias', type: 'overdue' },
                                ].map((n) => (
                                    <div key={n.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-slate-50">
                                        <div className="w-9 h-9 rounded-md bg-slate-50 flex items-center justify-center text-slate-600">
                                            {n.type === 'payment' ? <Check className="w-4 h-4 text-emerald-600" /> : n.type === 'appointment' ? <CalendarIcon className="w-4 h-4 text-amber-500" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">{n.title}</p>
                                            <p className="text-xs text-slate-500">{n.desc}</p>
                                        </div>
                                        <div className="text-xs text-slate-400">{n.time}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">Marcar como lidas</Button>
                                <Button variant="outline" size="sm" onClick={() => (document.activeElement as HTMLElement | null)?.blur()}>Fechar</Button>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="ml-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                                <Avatar className="border-2 border-slate-600">
                                    <AvatarImage
                                        src="https://i.pravatar.cc/150?u=ana-silva"
                                        alt="Perfil"
                                        className="w-full h-full object-cover"
                                        onError={(e: any) => {
                                            try {
                                                e.currentTarget.src = '/odonto.png'
                                            } catch (err) {
                                                // ignore
                                            }
                                        }}
                                    />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 p-2 rounded-lg bg-white border border-slate-100 shadow-lg">
                            <div className="px-2 py-2">
                                <p className="text-sm font-semibold text-slate-800">Dra. Ana Silva</p>
                                <p className="text-xs text-slate-500">ana.silva@odontoflow.com</p>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="py-1">
                                <DropdownMenuItem className="flex items-center gap-2" onSelect={(e: any) => { e.preventDefault(); router.push('/perfil') }}>
                                    <UserIcon className="w-4 h-4 text-slate-600" />
                                    Meu Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2" onSelect={(e: any) => { e.preventDefault(); router.push('/configuracoes') }}>
                                    <SettingsIcon className="w-4 h-4 text-slate-600" />
                                    Configurações
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="py-1">
                                <DropdownMenuItem data-variant="destructive" className="flex items-center gap-2 text-rose-600" onSelect={() => { console.log('Sair'); }}>
                                    <LogOutIcon className="w-4 h-4" />
                                    Sair
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
