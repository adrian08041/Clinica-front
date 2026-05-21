"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login-schema";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";

interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        initials: response.initials,
      }));

      toast.success("Bem-vindo(a) de volta!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const apiError = error as { message?: string; status?: number };
      const message = apiError.status === 400
        ? "E-mail ou senha incorretos"
        : apiError.message || "Erro ao conectar com o servidor";
      toast.error(message);
      setError("email", { message });
      setError("password", { message });
    } finally {
      setIsLoading(false);
    }
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
              className="pl-11"
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
              className="pl-11 pr-10"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </Button>
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

        {/* Remember Me + Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-5 cursor-pointer"
                />
              )}
            />
            <Label htmlFor="rememberMe" className="cursor-pointer">Lembrar de mim</Label>
          </div>
          <Link
            href="/esqueci-senha"
            className="font-bold text-[#0d9488] text-[14px] leading-[20px] hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#0d9488] hover:bg-teal-700 text-white font-bold text-[16px] leading-[24px] rounded-xl h-[56px] mt-2 shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2),0px_4px_6px_0px_rgba(0,187,167,0.2)]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
        </Button>
      </form>

      {/* Footer Text */}
      <p className="font-medium text-[#6a7282] text-[16px] leading-[24px] text-center mt-6">
        Primeiro acesso?{" "}
        <Link
          href="/cadastro"
          className="font-bold text-[#0d9488] hover:underline"
        >
          Crie sua conta
        </Link>
      </p>
    </div>
  );
}
