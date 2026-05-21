"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas/reset-password-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            await api<{ message: string }>("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password: data.password }),
            });

            toast.success("Senha redefinida com sucesso!");
            router.push("/login");
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0 py-8 lg:py-0">
                <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-[var(--color-text-primary)] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
                        Link inválido
                    </h1>
                    <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px]">
                        O link de redefinição de senha é inválido ou está ausente.
                    </p>
                </div>

                <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px] text-center mt-4">
                    <Link
                        href="/esqueci-senha"
                        className="font-bold text-[var(--color-brand-primary)] hover:underline"
                    >
                        Solicitar novo link
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0 py-8 lg:py-0">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-[var(--color-text-primary)] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
                    Redefinir senha
                </h1>
                <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px]">
                    Digite sua nova senha.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 mt-2 w-full"
            >
                {/* Password Field */}
                <div className="flex flex-col gap-2 relative">
                    <Label htmlFor="password">Nova senha</Label>
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
                    <Label htmlFor="confirmPassword">Confirme a nova senha</Label>
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
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Redefinir senha"}
                </Button>
            </form>

            {/* Footer Text */}
            <p className="font-medium text-[var(--color-text-tertiary)] text-[16px] leading-[24px] text-center mt-6">
                <Link href="/login" className="font-bold text-[var(--color-brand-primary)] hover:underline">
                    Voltar ao login
                </Link>
            </p>
        </div>
    );
}
