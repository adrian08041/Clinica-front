import { Building2, Phone, MapPin, Mail, Globe, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clinicaSchema, type ClinicaFormData } from "@/lib/schemas/clinica-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ClinicaSettings() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ClinicaFormData>({
        resolver: zodResolver(clinicaSchema),
        defaultValues: {
            nomeFantasia: "OdontoFlow Clínica Matriz",
            cnpj: "12.345.678/0001-90",
            telefone: "(11) 4567-8900",
            endereco: "Av. Paulista, 1200 - Conj 12 - São Paulo, SP",
            email: "contato@odontoflow.com",
            website: "https://www.odontoflow.com.br",
        },
    });

    const onSubmit = (data: ClinicaFormData) => {
        console.log("Configurações salvas:", data);
        toast.success("Informações salvas com sucesso!");
    };

    return (
        <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-[96px] h-[96px] bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <Button variant="ghost" className="text-[13px] font-semibold text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        Alterar Logo
                    </Button>
                </div>

                <div className="flex flex-col pt-1">
                    <h2 className="text-[20px] font-bold text-slate-900 leading-[28px]">
                        Informações da Clínica
                    </h2>
                    <p className="text-[14px] text-slate-500 font-medium">
                        Configure os dados cadastrais da sua unidade.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Linha 1 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-700">Nome Fantasia</label>
                        <Input
                            type="text"
                            {...register("nomeFantasia")}
                            className={cn(
                                "h-11 rounded-lg bg-slate-50/50 px-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                errors.nomeFantasia ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                            )}
                        />
                        {errors.nomeFantasia && <span className="text-xs text-red-500">{errors.nomeFantasia.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-semibold text-slate-700">CNPJ</label>
                        <Input
                            type="text"
                            {...register("cnpj")}
                            className={cn(
                                "h-11 rounded-lg bg-slate-50/50 px-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                errors.cnpj ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                            )}
                        />
                        {errors.cnpj && <span className="text-xs text-red-500">{errors.cnpj.message}</span>}
                    </div>

                    {/* Linha 2 */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[13px] font-semibold text-slate-700">Telefone de Contato</label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                {...register("telefone")}
                                className={cn(
                                    "h-11 w-full rounded-lg bg-slate-50/50 pl-10 pr-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                    errors.telefone ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                                )}
                            />
                        </div>
                        {errors.telefone && <span className="text-xs text-red-500">{errors.telefone.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[13px] font-semibold text-slate-700">Endereço Completo</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                {...register("endereco")}
                                className={cn(
                                    "h-11 w-full rounded-lg bg-slate-50/50 pl-10 pr-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                    errors.endereco ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                                )}
                            />
                        </div>
                        {errors.endereco && <span className="text-xs text-red-500">{errors.endereco.message}</span>}
                    </div>

                    {/* Linha 3 */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[13px] font-semibold text-slate-700">E-mail Clínico</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="email"
                                {...register("email")}
                                className={cn(
                                    "h-11 w-full rounded-lg bg-slate-50/50 pl-10 pr-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                    errors.email ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                                )}
                            />
                        </div>
                        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        <label className="text-[13px] font-semibold text-slate-700">Website</label>
                        <div className="relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                {...register("website")}
                                className={cn(
                                    "h-11 w-full rounded-lg bg-slate-50/50 pl-10 pr-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500",
                                    errors.website ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                                )}
                            />
                        </div>
                        {errors.website && <span className="text-xs text-red-500">{errors.website.message}</span>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        className="h-10 px-6 rounded-lg text-slate-600 font-semibold text-sm hover:bg-slate-50"
                    >
                        Descartar
                    </Button>
                    <Button
                        type="submit"
                        className="h-10 px-6 rounded-lg bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 shadow-sm"
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </div>
    );
}
