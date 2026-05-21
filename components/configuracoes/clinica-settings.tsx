"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Building2, Phone, MapPin, Mail, Globe, Upload, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clinicaSchema, type ClinicaFormData } from "@/lib/schemas/clinica-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    useClinic,
    useUpdateClinic,
    useUploadLogo,
    type ClinicResponse,
} from "@/lib/queries/settings";

const EMPTY_FORM: ClinicaFormData = {
    nomeFantasia: "",
    cnpj: "",
    telefone: "",
    endereco: "",
    email: "",
    website: "",
    logoUrl: "",
};

function clinicToForm(clinic: ClinicResponse | undefined): ClinicaFormData {
    if (!clinic) return EMPTY_FORM;
    return {
        nomeFantasia: clinic.nomeFantasia ?? "",
        cnpj: clinic.cnpj ?? "",
        telefone: clinic.telefone ?? "",
        endereco: clinic.endereco ?? "",
        email: clinic.email ?? "",
        website: clinic.website ?? "",
        logoUrl: clinic.logoUrl ?? "",
    };
}

export function ClinicaSettings() {
    const clinicQuery = useClinic();
    const updateClinic = useUpdateClinic();
    const uploadLogo = useUploadLogo();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!previewUrl) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ClinicaFormData>({
        resolver: zodResolver(clinicaSchema),
        defaultValues: EMPTY_FORM,
    });

    useEffect(() => {
        if (clinicQuery.data) {
            reset(clinicToForm(clinicQuery.data));
        }
    }, [clinicQuery.data, reset]);

    const displayedLogo = previewUrl ?? clinicQuery.data?.logoUrl ?? null;

    const onSubmit = async (data: ClinicaFormData) => {
        try {
            await updateClinic.mutateAsync({
                nomeFantasia: data.nomeFantasia,
                cnpj: data.cnpj,
                telefone: data.telefone,
                endereco: data.endereco,
                email: data.email,
                website: data.website || null,
            });
            toast.success("Configurações atualizadas com sucesso!");
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao atualizar configurações da clínica");
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        try {
            await uploadLogo.mutateAsync(file);
            toast.success("Logo enviado com sucesso!");
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao enviar o logo");
        } finally {
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDiscard = () => {
        reset(clinicToForm(clinicQuery.data));
    };

    const isSaving = updateClinic.isPending;
    const isUploading = uploadLogo.isPending;

    return (
        <div className="bg-white rounded-[14px] border border-border-light shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center mb-8 md:mb-10">
                <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="w-[80px] h-[80px] md:w-[96px] md:h-[96px] bg-background-card border border-border-light rounded-2xl flex items-center justify-center text-brand-primary shadow-sm overflow-hidden">
                        {displayedLogo ? (
                            <Image
                                src={displayedLogo}
                                alt="Logo da clínica"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <Building2 className="w-10 h-10" />
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleLogoClick}
                        disabled={isUploading}
                        className="text-[13px] font-semibold text-text-tertiary hover:text-brand-primary transition-colors flex items-center gap-1"
                    >
                        {isUploading ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        ) : (
                            <Upload className="w-3.5 h-3.5 mr-1" />
                        )}
                        {isUploading ? "Enviando..." : "Alterar Logo"}
                    </Button>
                </div>

                <div className="flex flex-col pt-1">
                    <h2 className="text-[20px] font-bold text-text-primary leading-[28px]">
                        Informações da Clínica
                    </h2>
                    <p className="text-[14px] text-text-tertiary font-medium">
                        Configure os dados cadastrais da sua unidade.
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
                        {/* Linha 1 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-text-secondary">Nome Fantasia</label>
                            <Input
                                type="text"
                                {...register("nomeFantasia")}
                                className={cn(
                                    "h-11 rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all",
                                    errors.nomeFantasia ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                )}
                            />
                            {errors.nomeFantasia && <span className="text-xs text-danger-text">{errors.nomeFantasia.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-semibold text-text-secondary">CNPJ</label>
                            <Input
                                type="text"
                                {...register("cnpj")}
                                className={cn(
                                    "h-11 rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all",
                                    errors.cnpj ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                )}
                            />
                            {errors.cnpj && <span className="text-xs text-danger-text">{errors.cnpj.message}</span>}
                        </div>

                        {/* Linha 2 */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[13px] font-semibold text-text-secondary">Telefone de Contato</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="text"
                                    {...register("telefone")}
                                    className={cn(
                                        "h-11 w-full rounded-lg bg-background-card/50 pl-10 pr-4 text-sm font-medium transition-all",
                                        errors.telefone ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                    )}
                                />
                            </div>
                            {errors.telefone && <span className="text-xs text-danger-text">{errors.telefone.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[13px] font-semibold text-text-secondary">Endereço Completo</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="text"
                                    {...register("endereco")}
                                    className={cn(
                                        "h-11 w-full rounded-lg bg-background-card/50 pl-10 pr-4 text-sm font-medium transition-all",
                                        errors.endereco ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                    )}
                                />
                            </div>
                            {errors.endereco && <span className="text-xs text-danger-text">{errors.endereco.message}</span>}
                        </div>

                        {/* Linha 3 */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[13px] font-semibold text-text-secondary">E-mail Clínico</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="email"
                                    {...register("email")}
                                    className={cn(
                                        "h-11 w-full rounded-lg bg-background-card/50 pl-10 pr-4 text-sm font-medium transition-all",
                                        errors.email ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                    )}
                                />
                            </div>
                            {errors.email && <span className="text-xs text-danger-text">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <label className="text-[13px] font-semibold text-text-secondary">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <Input
                                    type="text"
                                    {...register("website")}
                                    className={cn(
                                        "h-11 w-full rounded-lg bg-background-card/50 pl-10 pr-4 text-sm font-medium transition-all",
                                        errors.website ? "border-danger-text focus-visible:border-danger-text focus-visible:ring-danger-text" : "border-border-light"
                                    )}
                                />
                            </div>
                            {errors.website && <span className="text-xs text-danger-text">{errors.website.message}</span>}
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
                            disabled={isSaving}
                            className="h-10 px-6 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-dark shadow-sm"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
