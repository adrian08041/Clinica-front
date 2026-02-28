"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pacientes", href: "/pacientes", icon: UserIcon },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Tratamentos", href: "/tratamentos", icon: Activity },
    { name: "Financeiro", href: "/financeiro", icon: FileText },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0", className)}>
            <div>
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="bg-teal-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold">O</span>
                    </div>
                    <h1 className="text-white text-xl font-bold tracking-tight cursor-default">OdontoFlow</h1>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        // Verifica se a rota atual começa com o href do item (para manter ativo em subpáginas)
                        const isActive = pathname?.startsWith(item.href);

                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm rounded-lg transition-colors",
                                    isActive
                                        ? "bg-teal-900/40 text-teal-400 border border-teal-800/50"
                                        : "hover:bg-slate-800"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-teal-500" : "text-slate-400")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button className="w-full flex items-center px-4 py-2 text-sm rounded-lg hover:bg-slate-800 transition-colors mb-2 text-slate-300">
                    <Settings className="w-5 h-5 mr-3 text-slate-400" /> Configurações
                </button>
                <div className="flex items-center p-3 mt-2 rounded-xl border border-slate-700 bg-slate-800/50">
                    <Avatar className="w-10 h-10 border-2 border-slate-600">
                        <AvatarImage src="https://i.pravatar.cc/150?u=ana-silva" />
                        <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Dra. Ana Silva</p>
                        <p className="text-xs text-slate-400 truncate">Clínica Geral</p>
                    </div>
                    <button className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white mt-0.5">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
