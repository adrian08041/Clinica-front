"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/schemas/forgot-password-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await api<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: data.email }),
      });

      setSent(true);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      const message = apiError.message || "Erro ao conectar com o servidor";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-[#101828] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
            Verifique seu e-mail
          </h1>
          <p className="font-medium text-[#6a7282] text-[16px] leading-[24px]">
            Se o e-mail estiver cadastrado, você receberá as instruções para
            redefinir sua senha em breve.
          </p>
        </div>

        <p className="font-medium text-[#6a7282] text-[16px] leading-[24px] text-center mt-6">
          <Link
            href="/login"
            className="font-bold text-[#0d9488] hover:underline"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-[#101828] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
          Esqueci minha senha
        </h1>
        <p className="font-medium text-[#6a7282] text-[16px] leading-[24px]">
          Digite seu e-mail para receber o link de redefinição.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mt-4 w-full"
      >
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
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {errors.email && (
            <span
              id="email-error"
              className="text-red-500 text-sm mt-1 animate-in fade-in"
            >
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#0d9488] hover:bg-teal-700 text-white font-bold text-[16px] leading-[24px] rounded-xl h-[56px] mt-2 shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2),0px_4px_6px_0px_rgba(0,187,167,0.2)]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Enviar link"
          )}
        </Button>
      </form>

      {/* Footer Text */}
      <p className="font-medium text-[#6a7282] text-[16px] leading-[24px] text-center mt-6">
        <Link
          href="/login"
          className="font-bold text-[#0d9488] hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
