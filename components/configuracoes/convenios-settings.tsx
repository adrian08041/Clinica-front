import { Plus, Building, Phone, MapPin, Search, Trash2, Edit2, ShieldAlert, BadgeInfo, Percent, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const convenios = [
    {
        name: "Unimed",
        icon: "U",
        status: "Ativo",
        code: "UNI-001",
        type: "Plano de Saúde",
        discount: "15%",
        active: true,
        bg: "bg-emerald-100",
        color: "text-emerald-700"
    },
    {
        name: "Bradesco Saúde",
        icon: "B",
        status: "Ativo",
        code: "BRA-002",
        type: "Plano de Saúde",
        discount: "10%",
        active: true,
        bg: "bg-blue-100",
        color: "text-blue-700"
    },
    {
        name: "Amil",
        icon: "A",
        status: "Ativo",
        code: "AMI-003",
        type: "Plano de Saúde",
        discount: "12%",
        active: true,
        bg: "bg-purple-100",
        color: "text-purple-700"
    },
    {
        name: "SulAmérica",
        icon: "S",
        status: "Ativo",
        code: "SUL-004",
        type: "Plano de Saúde",
        discount: "8%",
        active: true,
        bg: "bg-orange-100",
        color: "text-orange-700"
    },
    {
        name: "Porto Seguro",
        icon: "P",
        status: "Inativo",
        code: "POR-005",
        type: "Plano de Saúde",
        discount: "10%",
        active: false,
        bg: "bg-slate-100",
        color: "text-slate-500"
    }
];

export function ConveniosSettings() {
    return (
        <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h2 className="text-[20px] font-bold text-slate-900 leading-[28px]">
                        Convênios Aceitos
                    </h2>
                    <p className="text-[14px] text-slate-500 font-medium mt-1">
                        Gerencie os planos de saúde e convênios da clínica.
                    </p>
                </div>
                <Button className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Convênio
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {convenios.map((item, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5 rounded-2xl border ${item.active ? 'border-slate-200 bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.02)]' : 'border-slate-100 bg-slate-50/50 opacity-75'} transition-all hover:border-slate-300 cursor-pointer`}
                    >
                        {/* Logo / Initials */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}>
                            <span className={`text-[20px] font-black ${item.color}`}>
                                {item.icon}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-[16px] font-bold text-slate-900 truncate">
                                    {item.name}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {item.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
                                <div className="flex items-center gap-1.5 min-w-[120px]">
                                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5" />
                                        Código:
                                    </span>
                                    <span className="font-bold text-slate-700">{item.code}</span>
                                </div>

                                <div className="flex items-center gap-1.5 min-w-[140px]">
                                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                                        <Building className="w-3.5 h-3.5" />
                                        Tipo:
                                    </span>
                                    <span className="font-bold text-slate-700">{item.type}</span>
                                </div>

                                <div className="flex items-center gap-1.5 min-w-[100px]">
                                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                                        <Percent className="w-3.5 h-3.5" />
                                        Desconto:
                                    </span>
                                    <span className="font-bold text-slate-700">{item.discount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
