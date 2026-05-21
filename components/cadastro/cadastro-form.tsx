"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { cadastroSchema, type CadastroFormData } from "@/lib/schemas/cadastro-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

interface AuthResponse {
    token: string;
    id: string;
    name: string;
    email: string;
    role: string;
    initials: string;
}

export function CadastroForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
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

    const onSubmit = async (data: CadastroFormData) => {
        setIsLoading(true);
        try {
            const response = await api<AuthResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify({
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role,
                initials: response.initials,
            }));

            toast.success("Conta criada com sucesso! Bem-vindo(a) ao OdontoFlow.");
            router.push("/dashboard");
        } catch (error: unknown) {
            const apiError = error as { message?: string; status?: number };
            const message = apiError.status === 400
                ? "E-mail já cadastrado"
                : apiError.message || "Erro ao conectar com o servidor";
            toast.error(message);
            if (apiError.status === 400) {
                setError("email", { message });
            }
        } finally {
            setIsLoading(false);
        }
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
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome completo"
                            {...register("name")}
                            className={cn("pl-11", errors.name && "border-red-500 focus-visible:ring-red-500")}
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
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            {...register("email")}
                            className={cn("pl-11", errors.email && "border-red-500 focus-visible:ring-red-500")}
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
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password")}
                            className={cn("pl-11 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-transparent"
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
                    <Label htmlFor="confirmPassword">Confirme a senha</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("confirmPassword")}
                            className={cn("pl-11 pr-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-transparent"
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
                    disabled={isLoading}
                    className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] text-white font-bold text-[16px] leading-[24px] rounded-xl h-[56px] mt-4 shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2),0px_4px_6px_0px_rgba(0,187,167,0.2)]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cadastrar"}
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


