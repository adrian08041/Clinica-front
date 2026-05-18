"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { horariosSchema, type HorariosFormData } from "@/lib/schemas/horarios-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    useHours,
    useUpdateHours,
    type HoursResponse,
} from "@/lib/queries/settings";

const DEFAULT_DAYS = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];

const DEFAULT_FORM: HorariosFormData = {
    dias: DEFAULT_DAYS.map((label) => ({
        label,
        active: false,
        start: "",
        end: "",
        hours: "",
    })),
    duracaoConsulta: "30 minutos",
    intervalo: "Sem intervalo",
};

function computeHoursLabel(start?: string, end?: string): string {
    if (!start || !end) return "0h";
    const [sH, sM] = start.split(":").map((value) => parseInt(value, 10));
    const [eH, eM] = end.split(":").map((value) => parseInt(value, 10));
    if (Number.isNaN(sH) || Number.isNaN(eH)) return "0h";
    const minutes = eH * 60 + (eM || 0) - (sH * 60 + (sM || 0));
    if (minutes <= 0) return "0h";
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0 ? `${hours}h` : `${hours}h${rest}m`;
}

function hoursToForm(data: HoursResponse | undefined): HorariosFormData {
    if (!data) return DEFAULT_FORM;
    return {
        dias: data.dias.map((d) => ({
            label: d.label,
            active: d.active,
            start: d.start ?? "",
            end: d.end ?? "",
            hours: computeHoursLabel(d.start ?? "", d.end ?? ""),
        })),
        duracaoConsulta: data.duracaoConsulta || "30 minutos",
        intervalo: data.intervalo || "Sem intervalo",
    };
}

export function HorariosSettings() {
    const hoursQuery = useHours();
    const updateHours = useUpdateHours();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<HorariosFormData>({
        resolver: zodResolver(horariosSchema),
        defaultValues: DEFAULT_FORM,
    });

    const { fields } = useFieldArray({
        control,
        name: "dias",
    });

    const dias = useWatch({
        control,
        name: "dias",
    });

    useEffect(() => {
        if (hoursQuery.data) {
            reset(hoursToForm(hoursQuery.data));
        }
    }, [hoursQuery.data, reset]);

    const onSubmit = async (data: HorariosFormData) => {
        try {
            await updateHours.mutateAsync({
                dias: data.dias.map((d) => ({
                    label: d.label,
                    active: d.active,
                    start: d.active ? d.start ?? null : null,
                    end: d.active ? d.end ?? null : null,
                })),
                duracaoConsulta: data.duracaoConsulta,
                intervalo: data.intervalo,
            });
            toast.success("Horários salvos com sucesso!");
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao salvar horários");
        }
    };

    const handleDiscard = () => {
        reset(hoursToForm(hoursQuery.data));
    };

    const isSaving = updateHours.isPending;

    return (
        <div className="bg-white rounded-[14px] border border-border-light shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="mb-6 md:mb-8">
                <h2 className="text-[20px] font-bold text-text-primary leading-[28px]">
                    Horários de Atendimento
                </h2>
                <p className="text-[14px] text-text-tertiary font-medium mt-1">
                    Configure os dias e horários de funcionamento da clínica.
                </p>
            </div>

            {hoursQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="flex flex-col gap-6 mb-10">
                        {fields.map((field, index) => {
                            const isActive = dias?.[index]?.active ?? false;
                            const start = dias?.[index]?.start ?? "";
                            const end = dias?.[index]?.end ?? "";
                            const hoursLabel = computeHoursLabel(start, end);

                            return (
                                <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-border-light pb-6 last:border-0 last:pb-0">
                                    <div className="w-full sm:w-[180px] flex items-center justify-between shrink-0">
                                        <span className="text-[14px] font-bold text-text-primary">
                                            {field.label}
                                        </span>
                                        <div
                                            onClick={() => setValue(`dias.${index}.active`, !isActive, { shouldDirty: true })}
                                            className={cn(
                                                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                                                isActive ? "bg-brand-primary" : "bg-background-hover"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                                    isActive ? "translate-x-[18px]" : "translate-x-1"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {isActive ? (
                                        <div className="flex-1 flex flex-row items-center gap-2 sm:gap-4 w-full">
                                            <div className="flex-1">
                                                <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                                    Início
                                                </label>
                                                <Input
                                                    type="time"
                                                    {...register(`dias.${index}.start`)}
                                                    className={cn(
                                                        "h-10 w-full rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary border-border-light"
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                                    Término
                                                </label>
                                                <Input
                                                    type="time"
                                                    {...register(`dias.${index}.end`)}
                                                    className={cn(
                                                        "h-10 w-full rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary border-border-light"
                                                    )}
                                                />
                                            </div>
                                            <div className="w-12 pt-6 text-right">
                                                <span className="text-[14px] font-bold text-text-muted">
                                                    {hoursLabel}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center h-[58px]">
                                            <span className="text-[14px] font-bold text-text-muted">
                                                Fechado
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="text-[16px] font-bold text-text-primary mb-4">
                        Intervalo de Atendimento
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-6 mb-10">
                        <div className="flex-1">
                            <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                Duração Padrão da Consulta
                            </label>
                            <select
                                {...register("duracaoConsulta")}
                                className={cn(
                                    "flex h-11 w-full rounded-lg border bg-background-card/50 px-4 text-sm font-medium outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                                    errors.duracaoConsulta ? "border-danger-text focus:border-danger-text focus:ring-danger-text" : "border-border-light"
                                )}
                            >
                                <option value="30 minutos">30 minutos</option>
                                <option value="45 minutos">45 minutos</option>
                                <option value="1 hora">1 hora</option>
                            </select>
                            {errors.duracaoConsulta && <span className="text-xs text-danger-text block mt-1">{errors.duracaoConsulta.message}</span>}
                        </div>
                        <div className="flex-1">
                            <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                Intervalo entre Consultas
                            </label>
                            <select
                                {...register("intervalo")}
                                className={cn(
                                    "flex h-11 w-full rounded-lg border bg-background-card/50 px-4 text-sm font-medium outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                                    errors.intervalo ? "border-danger-text focus:border-danger-text focus:ring-danger-text" : "border-border-light"
                                )}
                            >
                                <option value="Sem intervalo">Sem intervalo</option>
                                <option value="5 minutos">5 minutos</option>
                                <option value="10 minutos">10 minutos</option>
                                <option value="15 minutos">15 minutos</option>
                            </select>
                            {errors.intervalo && <span className="text-xs text-danger-text block mt-1">{errors.intervalo.message}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border-light mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDiscard}
                            disabled={isSaving}
                            className="h-10 px-6 rounded-lg text-text-secondary font-semibold text-sm hover:bg-background-card"
                        >
                            Descartar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="h-10 px-6 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-dark shadow-sm"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isSaving ? "Salvando..." : "Salvar Horários"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
