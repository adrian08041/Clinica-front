"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // If you used sonner for toasts

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false, // will handle via standard checkbox
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Formulário de login:", data);
    toast.success("Login simulado com sucesso!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[423px] mx-auto md:mx-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-[#101828] text-[36px] leading-[40px] tracking-[-0.9px] font-['Outfit',sans-serif]">
          Bem-vindo de volta
        </h1>
        <p className="font-medium text-[#6a7282] text-[16px] leading-[24px]">
          Insira seus dados para acessar sua conta.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mt-4 w-full"
      >
        {/* Email Field */}
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="email"
            className="font-semibold text-[#364153] text-[14px] leading-[20px]"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className={cn(
                "bg-[#f9fafb] border border-[#e5e7eb] rounded-xl h-[54px] w-full pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all",
                errors.email && "border-red-500 focus:ring-red-500",
              )}
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

        {/* Password Field */}
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="font-semibold text-[#364153] text-[14px] leading-[20px]"
            >
              Senha
            </label>
            <button
              type="button"
              className="font-bold text-[#0d9488] text-[12px] leading-[16px] tracking-[0.6px] uppercase hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={cn(
                "bg-[#f9fafb] border border-[#e5e7eb] rounded-xl h-[54px] w-full pl-11 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all",
                errors.password && "border-red-500 focus:ring-red-500",
              )}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span
              id="password-error"
              className="text-red-500 text-sm mt-1 animate-in fade-in"
            >
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <input
            id="rememberMe"
            type="checkbox"
            {...register("rememberMe")}
            className="w-5 h-5 rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488] cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="font-medium text-[#4a5565] text-[14px] leading-[20px] cursor-pointer"
          >
            Lembrar de mim
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#0d9488] hover:bg-teal-700 text-white font-bold text-[16px] leading-[24px] rounded-xl h-[56px] mt-2 shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2),0px_4px_6px_0px_rgba(0,187,167,0.2)] transition-all flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] focus:outline-none"
        >
          Entrar
        </button>
      </form>

      {/* Footer Text */}
      <p className="font-medium text-[#6a7282] text-[16px] leading-[24px] text-center mt-6">
        Primeiro acesso?{" "}
        <button
          type="button"
          className="font-bold text-[#0d9488] hover:underline"
        >
          Fale com o administrador
        </button>
      </p>
    </div>
  );
}
