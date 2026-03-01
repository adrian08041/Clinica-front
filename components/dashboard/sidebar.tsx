"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    const [user, setUser] = useState({
        name: "Dra. Ana Silva",
        role: "Clínica Geral",
        initials: "AS"
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line
                setUser({
                    name: parsedUser.name || "Dra. Ana Silva",
                    role: parsedUser.role || "Clínica Geral",
                    initials: parsedUser.initials || "AS"
                });
            }
        } catch (e) {
            console.error("Failed to parse user from local storage", e);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <aside className={cn("w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0", className)}>
            <div>
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden bg-teal-600">
                        <img src="/odonto.png" alt="OdontoFlow" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        <span className="text-white font-bold sr-only">O</span>
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
                                onClick={onNavigate}
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
                <Link
                    href="/configuracoes"
                    onClick={onNavigate}
                    className={cn(
                        "w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors mb-2",
                        pathname?.startsWith("/configuracoes")
                            ? "bg-teal-900/40 text-teal-400 border border-teal-800/50"
                            : "text-slate-300 hover:bg-slate-800"
                    )}
                >
                    <Settings className={cn("w-5 h-5 mr-3", pathname?.startsWith("/configuracoes") ? "text-teal-500" : "text-slate-400")} /> Configurações
                </Link>
                <div className="flex items-center p-3 mt-2 rounded-xl border border-slate-700 bg-slate-800/50">
                    <Avatar className="w-10 h-10 border-2 border-slate-600">
                        <AvatarImage src="https://i.pravatar.cc/150?u=ana-silva" />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.role}</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700 mt-0.5 ml-2"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
