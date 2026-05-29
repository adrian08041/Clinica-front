"use client";

import { useEffect } from "react";
import { Target, DollarSign, Activity, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { metasSchema, type MetasFormData } from "@/lib/schemas/metas-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    useClinic,
    useUpdateClinic,
    type ClinicResponse,
} from "@/lib/queries/settings";

// Mesmos valores padrão usados pelo backend (DashboardService) quando a clínica
// ainda não definiu metas. Servem de ponto de partida no formulário.
const DEFAULT_REVENUE_GOAL = 50000;
const DEFAULT_TREATMENT_GOAL = 80;

function clinicToMetas(clinic: ClinicResponse | undefined): MetasFormData {
    return {
        revenueGoal: clinic?.revenueGoal ?? DEFAULT_REVENUE_GOAL,
        treatmentGoal: clinic?.treatmentGoal ?? DEFAULT_TREATMENT_GOAL,
    };
}

export function MetasSettings() {
    const clinicQuery = useClinic();
    const updateClinic = useUpdateClinic();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MetasFormData>({
        resolver: zodResolver(metasSchema),
        defaultValues: clinicToMetas(undefined),
    });

    useEffect(() => {
        if (clinicQuery.data) {
            reset(clinicToMetas(clinicQuery.data));
        }
    }, [clinicQuery.data, reset]);

    const onSubmit = async (data: MetasFormData) => {
        const clinic = clinicQuery.data;
        if (!clinic) return;

        try {
            // O PUT /settings/clinic exige os dados cadastrais completos; enviamos
            // o estado atual da clínica + as metas para não sobrescrever nada.
            await updateClinic.mutateAsync({
                nomeFantasia: clinic.nomeFantasia,
                cnpj: clinic.cnpj,
                telefone: clinic.telefone,
                endereco: clinic.endereco,
                email: clinic.email,
                website: clinic.website,
                logoUrl: clinic.logoUrl,
                revenueGoal: data.revenueGoal,
                treatmentGoal: data.treatmentGoal,
            });
            toast.success("Metas atualizadas com sucesso!");
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao atualizar as metas");
        }
    };

    const handleDiscard = () => {
        reset(clinicToMetas(clinicQuery.data));
    };

    const isSaving = updateClinic.isPending;

    return (
        <Card className="p-4 sm:p-6 md:p-8 w-full overflow-hidden gap-0">
            <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-12 h-12 bg-background-card border border-border-light rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                    <Target className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-[20px] font-bold text-text-primary leading-[28px]">
                        Metas Mensais
                    </h2>
                    <p className="text-[14px] text-text-tertiary font-medium">
                        Defina os objetivos exibidos no card de Metas do dashboard.
                    </p>
                </div>
            </div>

            {clinicQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <div className="flex flex-col gap-2 relative">
                            <Label>Meta de Faturamento Mensal (R$)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="number"
                                    min={0}
                                    step={100}
                                    {...register("revenueGoal", { valueAsNumber: true })}
                                    className={cn("pl-10", errors.revenueGoal && "border-danger-text focus-visible:ring-danger-text")}
                                />
                            </div>
                            {errors.revenueGoal && <span className="text-xs text-danger-text">{errors.revenueGoal.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <Label>Meta de Tratamentos Mensais</Label>
                            <div className="relative">
                                <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="number"
                                    min={0}
                                    step={1}
                                    {...register("treatmentGoal", { valueAsNumber: true })}
                                    className={cn("pl-10", errors.treatmentGoal && "border-danger-text focus-visible:ring-danger-text")}
                                />
                            </div>
                            {errors.treatmentGoal && <span className="text-xs text-danger-text">{errors.treatmentGoal.message}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-border-light">
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
                            disabled={isSaving || !clinicQuery.data}
                            variant="brand"
                        >
                            {isSaving && <Loader2 className="size-4 animate-spin" />}
                            {isSaving ? "Salvando..." : "Salvar Metas"}
                        </Button>
                    </div>
                </form>
            )}
        </Card>
    );
}
