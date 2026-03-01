"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Search,
    ListFilter,
    ChevronRight,
    Plus,
    Eye,
    PencilLine,
    MessageCircle
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { MOCK_PATIENTS } from "@/lib/mock-data";
import { patientSchema, type PatientFormData } from "@/lib/schemas/patient-schema";
import type { Patient } from "@/lib/types";

export function PatientsSection() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form Hook
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
    });

    const filteredPatients = patients.filter(
        (p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.cpf.includes(search) ||
            p.phone.includes(search)
    );

    const onSubmit = async (data: PatientFormData) => {
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newPatient: Patient = {
            id: crypto.randomUUID(),
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            insurance: data.insurance || "Particular",
            status: "Ativo",
            lastVisit: "Hoje",
            tags: ["Novo"],
            avatar: "https://i.pravatar.cc/150?u=" + encodeURIComponent(data.name),
            createdAt: new Date().toISOString()
        };

        setPatients([newPatient, ...patients]);
        toast.success("Paciente adicionado com sucesso!");
        setIsDialogOpen(false);
        reset();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 md:pb-8 pt-2">

            {/* HEADER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-slate-900 leading-[32px]">Pacientes</h1>
                    <p className="text-[14px] text-slate-500 mt-0.5 font-medium">Gerencie o histórico e informações dos seus pacientes.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#0f766e] hover:bg-[#115e59] text-white shadow-sm font-semibold rounded-[8px] h-11 px-5 w-full sm:w-auto transition-colors">
                            <Plus className="w-4 h-4 mr-2" /> Novo Paciente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Novo Paciente</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Ana Carolina Silva"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                                {errors.name && <span id="name-error" className="text-xs text-red-500" role="alert">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                                <Input
                                    id="cpf"
                                    {...register("cpf")}
                                    placeholder="123.456.789-00"
                                    aria-invalid={!!errors.cpf}
                                    aria-describedby={errors.cpf ? "cpf-error" : undefined}
                                />
                                {errors.cpf && <span id="cpf-error" className="text-xs text-red-500" role="alert">{errors.cpf.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    placeholder="(11) 98877-6655"
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={errors.phone ? "phone-error" : undefined}
                                />
                                {errors.phone && <span id="phone-error" className="text-xs text-red-500" role="alert">{errors.phone.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="insurance" className="text-sm font-medium">Seguro</label>
                                <Input
                                    id="insurance"
                                    {...register("insurance")}
                                    placeholder="Ex: Unimed, Bradesco..."
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0f766e] hover:bg-[#115e59] h-11 shadow-sm mt-4">
                                {isSubmitting ? "Salvando..." : "Salvar Paciente"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* MAIN CARD CONTAINER */}
            <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm flex flex-col pt-2">
                {/* FILTERS HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-4 shrink-0">
                    <div className="relative w-full lg:flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquisar por nome, CPF ou telefone..."
                            className="pl-9 w-full h-10 border border-slate-200 bg-slate-50/50 text-[14px] placeholder:text-slate-400 rounded-[8px]"
                            aria-label="Buscar pacientes"
                        />
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto overflow-x-auto shrink-0">
                        <Button variant="outline" className="h-10 text-slate-600 bg-white border-slate-200 whitespace-nowrap rounded-[8px] px-3 font-medium text-[13px] shadow-sm">
                            <ListFilter className="w-4 h-4 mr-2 text-slate-500" /> Filtros <ChevronRight className="w-4 h-4 ml-2 text-slate-400" />
                        </Button>
                        <Button variant="outline" className="h-10 text-slate-600 bg-white border-slate-200 whitespace-nowrap rounded-[8px] px-3 font-medium text-[13px] shadow-sm">
                            Seguro <ChevronRight className="w-4 h-4 ml-2 text-slate-400" />
                        </Button>
                        <Button variant="outline" className="h-10 text-slate-600 bg-white border-slate-200 whitespace-nowrap rounded-[8px] px-3 font-medium text-[13px] shadow-sm">
                            Ordenar por <ChevronRight className="w-4 h-4 ml-2 text-slate-400" />
                        </Button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto flex-1 border-t border-slate-200">
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-slate-200 hover:bg-transparent px-4">
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">PACIENTE</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">CPF</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">TELEFONE</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] whitespace-nowrap align-middle px-6">ÚLTIMA VISITA</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">SEGURO</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">TAGS</TableHead>
                                <TableHead className="font-semibold text-slate-500 text-[11px] tracking-wider uppercase h-[52px] align-middle px-6 text-right">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        Nenhum paciente encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <TableRow key={patient.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors group">
                                        <TableCell className="py-5 align-top px-6 w-[240px]">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="w-10 h-10 border border-slate-200 shrink-0">
                                                    <AvatarImage src={patient.avatar} alt={patient.name} />
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 text-[13px] font-semibold">
                                                        {patient.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col pt-0.5">
                                                    <p className="font-semibold text-slate-700 text-[14px] leading-tight flex flex-col gap-0.5 max-w-[120px]">
                                                        <span>{patient.name.split(' ').slice(0, 2).join(' ')}</span>
                                                        {patient.name.split(' ').length > 2 && <span>{patient.name.split(' ').slice(2).join(' ')}</span>}
                                                    </p>
                                                    <div className="mt-2 inline-flex">
                                                        <span
                                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-[33554400px] whitespace-nowrap tracking-[0.2px]
                        ${patient.status === 'Ativo' ? 'bg-[#dcfce7] text-[#16a34a]' :
                                                                    patient.status === 'Pendente' ? 'bg-[#fef9c3] text-[#ca8a04]' :
                                                                        'bg-[#fee2e2] text-[#dc2626]'}`}
                                                        >
                                                            {patient.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top text-slate-500 text-[13px] font-medium whitespace-nowrap py-6 px-6">
                                            {patient.cpf}
                                        </TableCell>
                                        <TableCell className="align-top text-slate-500 text-[13px] font-medium whitespace-nowrap py-6 px-6">
                                            {patient.phone}
                                        </TableCell>
                                        <TableCell className="align-top text-slate-500 text-[13px] font-medium whitespace-nowrap py-6 px-6">
                                            {patient.lastVisit || "-"}
                                        </TableCell>
                                        <TableCell className="align-top text-slate-700 text-[13px] font-medium whitespace-nowrap py-6 px-6">
                                            <div className="flex flex-col gap-0.5">
                                                {patient.insurance ? patient.insurance.split(' ').map((word, index) => (
                                                    <span key={index}>{word}</span>
                                                )) : <span>Particular</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top py-6 px-6">
                                            <div className="flex gap-1.5 flex-wrap max-w-[150px] flex-col items-start">
                                                {patient.tags?.map((tag, i) => (
                                                    <span key={i} className="px-[6px] py-[2px] bg-[#f1f5f9] text-slate-600 text-[10px] rounded-[4px] font-bold uppercase tracking-wider flex items-center">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle px-6 py-6 h-full">
                                            <div className="flex items-center gap-[18px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end">
                                                <Button
                                                    variant="ghost" size="icon"
                                                    onClick={() => router.push(`/pacientes/${patient.id}`)}
                                                    className="text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                                                    title="Ver Perfil"
                                                >
                                                    <Eye className="w-[18px] h-[18px]" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-teal-600 hover:text-teal-700 transition-colors cursor-pointer" title="Editar">
                                                    <PencilLine className="w-[18px] h-[18px]" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Mensagem">
                                                    <MessageCircle className="w-[18px] h-[18px]" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-[16px] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-[14px] shrink-0">
                    <p className="text-[14px] text-slate-500 font-medium">
                        Mostrando 1-{filteredPatients.length} de {filteredPatients.length > 4 ? filteredPatients.length : "342"} pacientes
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-[6px]">
                        <Button variant="outline" size="sm" className="h-[36px] px-4 text-slate-500 bg-white border-slate-200 rounded-[6px] font-medium hover:text-slate-700 shadow-sm border">Anterior</Button>
                        <Button variant="default" size="sm" className="h-[36px] w-[36px] bg-[#0d9488] hover:bg-[#0f766e] text-white p-0 flex items-center justify-center font-medium rounded-[6px] border-none shadow-md">1</Button>
                        <Button variant="outline" size="sm" className="h-[36px] w-[36px] hidden sm:flex text-slate-600 bg-white border-slate-200 p-0 items-center justify-center font-medium hover:bg-slate-50 rounded-[6px] shadow-sm border">2</Button>
                        <Button variant="outline" size="sm" className="h-[36px] w-[36px] hidden sm:flex text-slate-600 bg-white border-slate-200 p-0 items-center justify-center font-medium hover:bg-slate-50 rounded-[6px] shadow-sm border">3</Button>
                        <Button variant="outline" size="sm" className="h-[36px] px-4 text-slate-600 bg-white border-slate-200 font-medium hover:bg-slate-50 rounded-[6px] shadow-sm border">Próximo</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
