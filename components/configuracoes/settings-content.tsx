"use client";

import { useState } from "react";
import { Building2, Users, Clock, FileText, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicaSettings } from "@/components/configuracoes/clinica-settings";
import { EquipeSettings } from "@/components/configuracoes/equipe-settings";
import { HorariosSettings } from "@/components/configuracoes/horarios-settings";
import { ConveniosSettings } from "@/components/configuracoes/convenios-settings";
import { IntegracoesSettings } from "@/components/configuracoes/integracoes-settings";
import { LGPDSettings } from "@/components/configuracoes/lgpd-settings";

const menuItems = [
    { id: "clinica", label: "Clínica", icon: Building2 },
    { id: "equipe", label: "Equipe", icon: Users },
    { id: "horarios", label: "Horários", icon: Clock },
    { id: "convenios", label: "Convênios", icon: FileText },
    { id: "integracoes", label: "Integrações", icon: LinkIcon },
    { id: "lgpd", label: "LGPD", icon: ShieldCheck },
];

export function SettingsContent() {
    const [activeTab, setActiveTab] = useState("clinica");

    const renderContent = () => {
        switch (activeTab) {
            case "clinica":
                return <ClinicaSettings />;
            case "equipe":
                return <EquipeSettings />;
            case "horarios":
                return <HorariosSettings />;
            case "convenios":
                return <ConveniosSettings />;
            case "integracoes":
                return <IntegracoesSettings />;
            case "lgpd":
                return <LGPDSettings />;
            default:
                return (
                    <div className="flex h-[400px] flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                        <p className="text-[14px]">Esta seção está em desenvolvimento.</p>
                    </div>
                );
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-[1267px] flex-col gap-6 md:gap-8 p-4 md:p-8 min-w-0">
            <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 leading-[32px]">
                Configurações
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Lateral Navigation Menu */}
                <aside className="w-full md:w-64 shrink-0 grid grid-cols-2 gap-2 md:flex md:flex-col">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "flex items-center gap-2 md:gap-3 rounded-[8px] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-semibold transition-colors text-left cursor-pointer",
                                    isActive
                                        ? "bg-[#0d9488] text-white shadow-[0px_4px_10px_0px_rgba(13,148,136,0.25)]"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 md:w-[18px] md:h-[18px] shrink-0", isActive ? "text-white" : "text-slate-400")} />
                                {item.label}
                            </button>
                        );
                    })}
                </aside>

                {/* Main View Area */}
                <div className="flex-1 w-full min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
