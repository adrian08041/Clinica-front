"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { horariosSchema, type HorariosFormData } from "@/lib/schemas/horarios-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HorariosSettings() {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<HorariosFormData>({
        resolver: zodResolver(horariosSchema),
        defaultValues: {
            dias: [
                { label: "Segunda-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Terça-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Quarta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Quinta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Sexta-feira", active: true, start: "08:00", end: "17:00", hours: "9h" },
                { label: "Sábado", active: true, start: "08:00", end: "12:00", hours: "4h" },
                { label: "Domingo", active: false, start: "", end: "", hours: "0h" },
            ],
            duracaoConsulta: "30 minutos",
            intervalo: "Sem intervalo",
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "dias",
    });

    const onSubmit = (data: HorariosFormData) => {
        // eslint-disable-next-line no-console
        console.log("Horários salvos:", data);
        toast.success("Horários salvos com sucesso!");
    };

    return (
        <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="mb-6 md:mb-8">
                <h2 className="text-[20px] font-bold text-slate-900 leading-[28px]">
                    Horários de Atendimento
                </h2>
                <p className="text-[14px] text-slate-500 font-medium mt-1">
                    Configure os dias e horários de funcionamento da clínica.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <div className="flex flex-col gap-6 mb-10">
                    {fields.map((field, index) => {
                        // eslint-disable-next-line
                        const isActive = watch(`dias.${index}.active`);
                        // eslint-disable-next-line
                        const hours = watch(`dias.${index}.hours`);

                        return (
                            <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                {/* Day Label & Toggle */}
                                <div className="w-full sm:w-[180px] flex items-center justify-between shrink-0">
                                    <span className="text-[14px] font-bold text-slate-800">
                                        {field.label}
                                    </span>
                                    {/* Toggle Switch */}
                                    <div
                                        onClick={() => setValue(`dias.${index}.active`, !isActive, { shouldDirty: true })}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                                            isActive ? 'bg-teal-500' : 'bg-slate-200'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                                isActive ? 'translate-x-[18px]' : 'translate-x-1'
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Time Inputs */}
                                {isActive ? (
                                    <div className="flex-1 flex flex-row items-center gap-2 sm:gap-4 w-full">
                                        <div className="flex-1">
                                            <label className="text-[12px] font-bold text-slate-500 mb-1.5 block">
                                                Início
                                            </label>
                                            <Input
                                                type="time"
                                                {...register(`dias.${index}.start`)}
                                                className={cn(
                                                    "h-10 w-full rounded-lg bg-slate-50/50 px-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 border-slate-200"
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[12px] font-bold text-slate-500 mb-1.5 block">
                                                Término
                                            </label>
                                            <Input
                                                type="time"
                                                {...register(`dias.${index}.end`)}
                                                className={cn(
                                                    "h-10 w-full rounded-lg bg-slate-50/50 px-4 text-sm font-medium transition-all focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 border-slate-200"
                                                )}
                                            />
                                        </div>
                                        <div className="w-12 pt-6 text-right">
                                            <span className="text-[14px] font-bold text-slate-400">
                                                {hours}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center h-[58px]">
                                        <span className="text-[14px] font-bold text-slate-400">
                                            Fechado
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <h3 className="text-[16px] font-bold text-slate-900 mb-4">
                    Intervalo de Atendimento
                </h3>

                <div className="flex flex-col sm:flex-row gap-6 mb-10">
                    <div className="flex-1">
                        <label className="text-[12px] font-bold text-slate-500 mb-1.5 block">
                            Duração Padrão da Consulta
                        </label>
                        <select
                            {...register("duracaoConsulta")}
                            className={cn(
                                "flex h-11 w-full rounded-lg border bg-slate-50/50 px-4 text-sm font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
                                errors.duracaoConsulta ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200"
                            )}
                        >
                            <option value="30 minutos">30 minutos</option>
                            <option value="45 minutos">45 minutos</option>
                            <option value="1 hora">1 hora</option>
                        </select>
                        {errors.duracaoConsulta && <span className="text-xs text-red-500 block mt-1">{errors.duracaoConsulta.message}</span>}
                    </div>
                    <div className="flex-1">
                        <label className="text-[12px] font-bold text-slate-500 mb-1.5 block">
                            Intervalo entre Consultas
                        </label>
                        <select
                            {...register("intervalo")}
                            className={cn(
                                "flex h-11 w-full rounded-lg border bg-slate-50/50 px-4 text-sm font-medium outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500",
                                errors.duracaoConsulta ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-200"
                            )}
                        >
                            <option value="Sem intervalo">Sem intervalo</option>
                            <option value="5 minutos">5 minutos</option>
                            <option value="10 minutos">10 minutos</option>
                            <option value="15 minutos">15 minutos</option>
                        </select>
                        {errors.intervalo && <span className="text-xs text-red-500 block mt-1">{errors.intervalo.message}</span>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-4">
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
                        Salvar Horários
                    </Button>
                </div>
            </form>
        </div>
    );
}
