"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    MessageCircle,
    PencilLine,
    User,
    Calendar,
    Stethoscope,
    FileText,
    Banknote,
    ChevronDown,
    Upload,
    File
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { MOCK_PATIENTS } from "@/lib/mock-data";

export default function PatientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [activeTab, setActiveTab] = useState('Consultas');

    // Fallback if patient is not found in mock data
    const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];

    const breadcrumbs = ['SaaS Dashboard', 'Pacientes', patient.name];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-5xl mx-auto space-y-6 md:pb-8 pt-2">

                {/* HEADER ROW */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/pacientes')}
                        className="text-slate-500 hover:text-slate-700 transition-colors p-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-[24px] font-bold text-slate-900 leading-[32px]">
                        Perfil do Paciente
                    </h1>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <Avatar className="!w-[88px] !h-[88px] border-[3px] border-white shadow-sm shrink-0">
                                <AvatarImage src={patient.avatar} alt={patient.name} />
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-[24px] font-bold">
                                    {patient.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute -bottom-1 -right-1 bg-[#0d9488] text-white p-2 rounded-full border-[3px] border-white shadow-sm hover:bg-[#0f766e] transition-colors">
                                <PencilLine className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[22px] font-bold text-[#1e293b]">{patient.name}</h2>
                                <span
                                    className={`text-[12px] font-bold px-2 py-[2px] rounded-[33554400px] whitespace-nowrap tracking-[0.2px]
                                    ${patient.status === 'Ativo' ? 'bg-[#dcfce7] text-[#16a34a]' :
                                            patient.status === 'Pendente' ? 'bg-[#fef9c3] text-[#ca8a04]' :
                                                'bg-[#fee2e2] text-[#dc2626]'}`}
                                >
                                    {patient.status}
                                </span>
                            </div>

                            <div className="flex gap-x-12 gap-y-4 mt-2 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-slate-400 font-medium">Idade</span>
                                    <span className="text-[14px] text-[#334155] font-semibold">28 anos</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-slate-400 font-medium">CPF</span>
                                    <span className="text-[14px] text-[#334155] font-semibold">{patient.cpf}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-slate-400 font-medium">Telefone</span>
                                    <span className="text-[14px] text-[#334155] font-semibold">{patient.phone}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] text-slate-400 font-medium">Seguro</span>
                                    <span className="text-[14px] text-[#334155] font-semibold">{patient.insurance}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 shrink-0 pt-1">
                        <Button variant="outline" className="text-slate-600 border-slate-200 shadow-sm h-10 px-4 rounded-[8px] font-semibold hover:bg-slate-50">
                            <MessageCircle className="w-4 h-4 mr-2 text-[#0d9488]" />
                            WhatsApp
                        </Button>
                        <Button className="bg-[#0f766e] hover:bg-[#115e59] text-white shadow-sm font-semibold rounded-[8px] h-10 px-4">
                            <PencilLine className="w-4 h-4 mr-2" />
                            Editar Perfil
                        </Button>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto overflow-y-hidden pb-[1px] scrollbar-hide">
                    {[
                        { id: 'Dados Pessoais', icon: User },
                        { id: 'Consultas', icon: Calendar },
                        { id: 'Tratamentos', icon: Stethoscope },
                        { id: 'Financeiro', icon: Banknote },
                        { id: 'Documentos', icon: FileText },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 text-[14px] pb-3 px-1 whitespace-nowrap transition-colors
                                    ${isActive
                                        ? 'text-[#0f766e] font-semibold border-b-2 border-[#0f766e]'
                                        : 'text-slate-400 font-medium hover:text-slate-600'}`
                                }
                            >
                                <Icon className="w-[18px] h-[18px]" />
                                {tab.id}
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT: DADOS PESSOAIS */}
                {activeTab === 'Dados Pessoais' && (
                    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-8 pt-6">
                        <h3 className="text-[18px] font-bold text-[#1e293b] mb-6">Informações Gerais</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                                <Input
                                    readOnly
                                    defaultValue={patient.name}
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                                <Input
                                    readOnly
                                    defaultValue={`${patient.name.split(' ')[0].toLowerCase()}.silva@email.com`}
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>

                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data de Nascimento</label>
                                <Input
                                    readOnly
                                    defaultValue="15/05/1998"
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gênero</label>
                                <div className="relative">
                                    <Input
                                        readOnly
                                        defaultValue="Feminino"
                                        className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px] cursor-default"
                                    />
                                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">CPF</label>
                                <Input
                                    readOnly
                                    defaultValue={patient.cpf}
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Telefone Principal</label>
                                <Input
                                    readOnly
                                    defaultValue={patient.phone}
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>

                            <div className="space-y-2 flex flex-col md:col-span-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Endereço Residencial</label>
                                <Input
                                    readOnly
                                    defaultValue="Rua das Flores, 123 - Apto 45, São Paulo - SP"
                                    className="h-12 bg-[#f8fafc] border-slate-200/60 text-[#334155] font-medium text-[14px] rounded-[8px]"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: CONSULTAS */}
                {activeTab === 'Consultas' && (
                    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-8 pt-7">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[18px] font-bold text-[#1e293b]">Linha do Tempo</h3>
                            <Button className="bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#0d9488] shadow-none font-bold rounded-[8px] h-9 px-4">
                                Agendar Nova
                            </Button>
                        </div>

                        <div className="relative pl-6 ml-2 border-l-[3px] border-slate-100 flex flex-col gap-10 pb-4">

                            {/* ITEM 1 */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#0d9488] ring-[5px] ring-white"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                        <span className="text-[11px] font-extrabold text-[#0d9488] uppercase tracking-widest">Próxima Consulta</span>
                                        <h4 className="text-[15px] font-bold text-[#1e293b]">Manutenção de Aparelho Ortodôntico</h4>
                                        <div className="flex items-center text-[13px] text-slate-500 font-medium">
                                            <Calendar className="w-4 h-4 mr-1.5 opacity-60" />
                                            25 de Fevereiro, 2026 às 14:30
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold bg-[#f1f5f9] text-[#475569] px-3 py-[3px] rounded-[33554400px]">confirmado</span>
                                </div>
                            </div>

                            {/* ITEM 2 */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-200 ring-[5px] ring-white"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Finalizado</span>
                                        <h4 className="text-[15px] font-bold text-[#1e293b]">Limpeza e Profilaxia</h4>
                                        <div className="flex items-center text-[13px] text-slate-500 font-medium">
                                            <Calendar className="w-4 h-4 mr-1.5 opacity-60" />
                                            12 de Fevereiro, 2026 às 10:00
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold bg-[#dcfce7] text-[#16a34a] px-3 py-[3px] rounded-[33554400px]">Pago</span>
                                </div>
                            </div>

                            {/* ITEM 3 */}
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-200 ring-[5px] ring-white"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1.5 pt-0.5">
                                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Finalizado</span>
                                        <h4 className="text-[15px] font-bold text-[#1e293b]">Avaliação Inicial</h4>
                                        <div className="flex items-center text-[13px] text-slate-500 font-medium">
                                            <Calendar className="w-4 h-4 mr-1.5 opacity-60" />
                                            28 de Janeiro, 2026 às 09:00
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold bg-[#dcfce7] text-[#16a34a] px-3 py-[3px] rounded-[33554400px]">Pago</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* TAB CONTENT: FINANCEIRO */}
                {activeTab === 'Financeiro' && (
                    <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-200">
                                    <TableHead className="h-14 font-extrabold text-[12px] text-slate-400 tracking-wider pl-8">DESCRIÇÃO</TableHead>
                                    <TableHead className="h-14 font-extrabold text-[12px] text-slate-400 tracking-wider">DATA</TableHead>
                                    <TableHead className="h-14 font-extrabold text-[12px] text-slate-400 tracking-wider">VALOR</TableHead>
                                    <TableHead className="h-14 font-extrabold text-[12px] text-slate-400 tracking-wider">STATUS</TableHead>
                                    <TableHead className="h-14 font-extrabold text-[12px] text-slate-400 tracking-wider text-right pr-8">RECIBO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* ROW 1 */}
                                <TableRow className="group border-slate-100/80 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-5 pl-8 text-[14px] font-bold text-[#334155]">
                                        Parcela 02/12 - Aparelho
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-medium text-slate-500">
                                        10/02/2026
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-extrabold text-[#1e293b]">
                                        R$ 150,00
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="text-[12px] font-bold bg-[#dcfce7] text-[#16a34a] px-3 py-1 rounded-[33554400px]">
                                            Pago
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <button className="text-[14px] font-bold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                                            Baixar PDF
                                        </button>
                                    </TableCell>
                                </TableRow>

                                {/* ROW 2 */}
                                <TableRow className="group border-slate-100/80 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-5 pl-8 text-[14px] font-bold text-[#334155]">
                                        Limpeza e Profilaxia
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-medium text-slate-500">
                                        12/02/2026
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-extrabold text-[#1e293b]">
                                        R$ 220,00
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="text-[12px] font-bold bg-[#dcfce7] text-[#16a34a] px-3 py-1 rounded-[33554400px]">
                                            Pago
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right">
                                        <button className="text-[14px] font-bold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                                            Baixar PDF
                                        </button>
                                    </TableCell>
                                </TableRow>

                                {/* ROW 3 */}
                                <TableRow className="group border-transparent hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-5 pl-8 text-[14px] font-bold text-[#334155]">
                                        Parcela 03/12 - Aparelho
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-medium text-slate-500">
                                        10/03/2026
                                    </TableCell>
                                    <TableCell className="py-5 text-[14px] font-extrabold text-[#1e293b]">
                                        R$ 150,00
                                    </TableCell>
                                    <TableCell className="py-5">
                                        <span className="text-[12px] font-bold bg-[#fef9c3] text-[#ca8a04] px-3 py-1 rounded-[33554400px]">
                                            Pendente
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-5 pr-8 text-right text-slate-400 font-bold">
                                        -
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* TAB CONTENT: DOCUMENTOS */}
                {activeTab === 'Documentos' && (
                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[18px] font-bold text-[#1e293b]">Arquivos e Exames</h3>
                            <Button className="bg-[#009e86] hover:bg-[#008772] text-white shadow-none font-bold rounded-[8px] h-[38px] px-5">
                                <Upload className="w-4 h-4 mr-2" />
                                Enviar Novo
                            </Button>
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">

                            {/* DOC 1 */}
                            <div className="w-[200px] shrink-0 bg-white rounded-[12px] border border-slate-200 overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <div className="h-[180px] bg-[#eef2f6] p-4 flex items-center justify-center">
                                    <div className="w-full h-full rounded-[8px] bg-[#d9e8e6] overflow-hidden relative">
                                        {/* Mocking the 3D shapes image with a pure CSS gradient that resembles it slightly */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#80b1ab] to-[#3a605c] opacity-90"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-white/40">
                                            <File className="w-16 h-16" />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-white flex flex-col gap-0.5 border-t border-slate-100">
                                    <span className="text-[13px] font-bold text-[#334155] truncate">Panorâmica_v1.jpg</span>
                                    <span className="text-[11px] font-bold text-slate-400">12/02/2026 • 2.4 MB</span>
                                </div>
                            </div>

                            {/* DOC 2 */}
                            <div className="w-[200px] shrink-0 bg-white rounded-[12px] border border-slate-200 overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <div className="h-[180px] bg-[#f1f5f9] flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                                </div>
                                <div className="px-4 py-3 bg-white flex flex-col gap-0.5 border-t border-slate-100">
                                    <span className="text-[13px] font-bold text-[#334155] truncate">Contrato_Prestacao.pdf</span>
                                    <span className="text-[11px] font-bold text-slate-400">28/01/2026 • 1.1 MB</span>
                                </div>
                            </div>

                            {/* DOC 3 */}
                            <div className="w-[200px] shrink-0 bg-white rounded-[12px] border border-slate-200 overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <div className="h-[180px] bg-[#eef2f6] p-4 flex items-center justify-center">
                                    <div className="w-full h-full rounded-[8px] bg-slate-200 overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=200&auto=format&fit=crop" alt="Intraoral" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="px-4 py-3 bg-white flex flex-col gap-0.5 border-t border-slate-100">
                                    <span className="text-[13px] font-bold text-[#334155] truncate">Intraoral_sup.png</span>
                                    <span className="text-[11px] font-bold text-slate-400">05/02/2026 • 4.8 MB</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}
