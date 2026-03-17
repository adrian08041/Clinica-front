"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cadastroSchema, type CadastroFormData } from "@/lib/schemas/cadastro-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CadastroForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: CadastroFormData) => {
        // eslint-disable-next-line no-console
        console.log("Formulário de cadastro:", data);
        toast.success("Conta criada com sucesso! Bem-vindo(a) ao OdontoFlow.");
        // eslint-disable-next-line no-console
        console.log("Dados do cadastro:", data);
        // router.push("/dashboard");
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0 py-8 lg:py-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-[var(--color-text-primary)] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
                    Crie sua conta
                </h1>
                <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px]">
                    Preencha os dados abaixo para começar.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 mt-2 w-full"
            >
                {/* Name Field */}
                <div className="flex flex-col gap-2 relative">
                    <label
                        htmlFor="name"
                        className="font-semibold text-[var(--color-text-secondary)] text-[14px] leading-[20px]"
                    >
                        Nome completo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome completo"
                            {...register("name")}
                            className={cn(
                                "bg-[var(--color-background-card)] border border-[var(--color-border-light)] rounded-xl h-[54px] w-full pl-11 pr-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-0 focus-visible:border-transparent transition-all",
                                errors.name && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </div>
                    {errors.name && (
                        <span className="text-red-500 text-sm mt-1 animate-in fade-in">
                            {errors.name.message}
                        </span>
                    )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2 relative">
                    <label
                        htmlFor="email"
                        className="font-semibold text-[var(--color-text-secondary)] text-[14px] leading-[20px]"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            {...register("email")}
                            className={cn(
                                "bg-[var(--color-background-card)] border border-[var(--color-border-light)] rounded-xl h-[54px] w-full pl-11 pr-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-0 focus-visible:border-transparent transition-all",
                                errors.email && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </div>
                    {errors.email && (
                        <span className="text-red-500 text-sm mt-1 animate-in fade-in">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 relative">
                    <label
                        htmlFor="password"
                        className="font-semibold text-[var(--color-text-secondary)] text-[14px] leading-[20px]"
                    >
                        Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password")}
                            className={cn(
                                "bg-[var(--color-background-card)] border border-[var(--color-border-light)] rounded-xl h-[54px] w-full pl-11 pr-12 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-0 focus-visible:border-transparent transition-all",
                                errors.password && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-[54px] w-[54px] flex items-center text-gray-400 hover:text-gray-600 focus:outline-none hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                    </div>
                    {errors.password && (
                        <span className="text-red-500 text-sm mt-1 animate-in fade-in">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-2 relative">
                    <label
                        htmlFor="confirmPassword"
                        className="font-semibold text-[var(--color-text-secondary)] text-[14px] leading-[20px]"
                    >
                        Confirme a senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("confirmPassword")}
                            className={cn(
                                "bg-[var(--color-background-card)] border border-[var(--color-border-light)] rounded-xl h-[54px] w-full pl-11 pr-12 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-0 focus-visible:border-transparent transition-all",
                                errors.confirmPassword && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-[54px] w-[54px] flex items-center text-gray-400 hover:text-gray-600 focus:outline-none hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-sm mt-1 animate-in fade-in">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-[16px] leading-[24px] rounded-xl h-[56px] mt-4 shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2),0px_4px_6px_0px_rgba(0,187,167,0.2)]"
                >
                    Cadastrar
                </Button>
            </form>

            {/* Footer Text */}
            <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px] text-center mt-6">
                Já possui uma conta?{" "}
                <Link href="/login" className="font-bold text-[var(--color-brand-primary)] hover:underline">
                    Faça login
                </Link>
            </p>
        </div>
    );
}


