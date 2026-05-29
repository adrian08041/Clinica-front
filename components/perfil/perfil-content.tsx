"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Lock, Mail, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  profileSchema,
  passwordSchema,
  type ProfileFormData,
  type PasswordFormData,
} from "@/lib/schemas/perfil-schema";
import {
  useMe,
  useUpdateMe,
  useUpdatePassword,
  useUploadAvatar,
  useDeleteAvatar,
} from "@/lib/queries/me";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QueryErrorBanner } from "@/components/ui/query-error-banner";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  DENTISTA: "Dentista",
  RECEPCIONISTA: "Recepcionista",
};

const AVATAR_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export function PerfilContent() {
  const meQuery = useMe();
  const me = meQuery.data;

  const updateMe = useUpdateMe();
  const updatePassword = useUpdatePassword();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // RHF sincroniza com os dados do servidor via `values` (sem setState em effect).
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: me?.name ?? "", email: me?.email ?? "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmitProfile = (data: ProfileFormData) => {
    updateMe.mutate(data, {
      onSuccess: () => toast.success("Perfil atualizado com sucesso!"),
      onError: (error: unknown) => {
        const apiError = error as { message?: string };
        toast.error(apiError.message || "Erro ao atualizar o perfil");
      },
    });
  };

  const onSubmitPassword = (data: PasswordFormData) => {
    updatePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Senha alterada com sucesso!");
          passwordForm.reset();
        },
        onError: (error: unknown) => {
          const apiError = error as { message?: string };
          toast.error(apiError.message || "Erro ao alterar a senha");
        },
      },
    );
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite reenviar o mesmo arquivo
    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPG ou WEBP.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("A foto excede o tamanho máximo de 2 MB.");
      return;
    }

    uploadAvatar.mutate(file, {
      onSuccess: () => toast.success("Foto atualizada!"),
      onError: (error: unknown) => {
        const apiError = error as { message?: string };
        toast.error(apiError.message || "Erro ao enviar a foto");
      },
    });
  };

  const handleRemoveAvatar = () => {
    deleteAvatar.mutate(undefined, {
      onSuccess: () => toast.success("Foto removida."),
      onError: (error: unknown) => {
        const apiError = error as { message?: string };
        toast.error(apiError.message || "Erro ao remover a foto");
      },
    });
  };

  if (meQuery.isError) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <QueryErrorBanner onRetry={() => meQuery.refetch()} />
      </div>
    );
  }

  const roleLabel = me ? ROLE_LABELS[me.role] ?? me.role : "";
  const avatarBusy = uploadAvatar.isPending || deleteAvatar.isPending;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Meu Perfil</h1>
        <p className="mt-1 text-sm text-text-tertiary">
          Gerencie seus dados pessoais, foto e senha de acesso.
        </p>
      </div>

      {/* Card 1 — Foto de perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
          <CardDescription>PNG, JPG ou WEBP de até 2 MB.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-border-light">
            <AvatarImage src={me?.avatarUrl ?? undefined} alt={me?.name ?? "Avatar"} />
            <AvatarFallback className="bg-brand-primary text-2xl font-medium text-white">
              {me?.initials ?? "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="brand"
              onClick={handlePickFile}
              disabled={avatarBusy}
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
              Alterar foto
            </Button>
            {me?.avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveAvatar}
                disabled={avatarBusy}
                className="text-danger-text hover:bg-danger-bg hover:text-danger-text"
              >
                {deleteAvatar.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Remover foto
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Card 2 — Dados pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
          <CardDescription>Atualize seu nome e e-mail de acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <UserIcon className="size-4 text-text-muted" />
                </div>
                <Input
                  id="name"
                  {...profileForm.register("name")}
                  className="pl-9"
                  aria-invalid={profileForm.formState.errors.name ? "true" : "false"}
                />
              </div>
              {profileForm.formState.errors.name && (
                <span className="text-sm text-danger-text">
                  {profileForm.formState.errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Mail className="size-4 text-text-muted" />
                </div>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                  className="pl-9"
                  aria-invalid={profileForm.formState.errors.email ? "true" : "false"}
                />
              </div>
              {profileForm.formState.errors.email && (
                <span className="text-sm text-danger-text">
                  {profileForm.formState.errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Cargo</Label>
              <div>
                <Badge variant="neutral">{roleLabel || "—"}</Badge>
              </div>
              <span className="text-xs text-text-muted">
                O cargo é definido pelo administrador.
              </span>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={updateMe.isPending}>
                {updateMe.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card 3 — Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>
            Para trocar a senha, confirme a senha atual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Lock className="size-4 text-text-muted" />
                </div>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  className="pl-9"
                  aria-invalid={passwordForm.formState.errors.currentPassword ? "true" : "false"}
                />
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <span className="text-sm text-danger-text">
                  {passwordForm.formState.errors.currentPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Lock className="size-4 text-text-muted" />
                </div>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  className="pl-9"
                  aria-invalid={passwordForm.formState.errors.newPassword ? "true" : "false"}
                />
              </div>
              {passwordForm.formState.errors.newPassword && (
                <span className="text-sm text-danger-text">
                  {passwordForm.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Lock className="size-4 text-text-muted" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  className="pl-9"
                  aria-invalid={passwordForm.formState.errors.confirmPassword ? "true" : "false"}
                />
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <span className="text-sm text-danger-text">
                  {passwordForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={updatePassword.isPending}>
                {updatePassword.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Alterar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
