"use client";

import { useState } from "react";
import { Activity, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PrivacySetting = {
  id: string;
  title: string;
  description: string;
  icon: "lock" | "activity" | "shield";
  enabled: boolean;
};

const INITIAL_SETTINGS: PrivacySetting[] = [
  {
    id: "lgpd-encryption",
    title: "Criptografia de ponta a ponta",
    description: "Protege prontuários, exames e documentos sensíveis da clínica.",
    icon: "lock",
    enabled: true,
  },
  {
    id: "lgpd-audit",
    title: "Logs de auditoria",
    description: "Registra quem acessou, alterou ou exportou dados de pacientes.",
    icon: "activity",
    enabled: true,
  },
  {
    id: "lgpd-consent",
    title: "Consentimento para uso de dados",
    description: "Mantém o histórico de aceite e atualização de termos do paciente.",
    icon: "shield",
    enabled: false,
  },
];

function getIcon(icon: PrivacySetting["icon"]) {
  if (icon === "lock") return Lock;
  if (icon === "activity") return Activity;
  return ShieldCheck;
}

export function LGPDSettings() {
  const [settings, setSettings] = useState<PrivacySetting[]>(INITIAL_SETTINGS);

  const handleToggle = (settingId: string) => {
    const updatedSetting = settings.find((setting) => setting.id === settingId);

    setSettings((current) =>
      current.map((setting) =>
        setting.id === settingId
          ? {
              ...setting,
              enabled: !setting.enabled,
            }
          : setting,
      ),
    );

    if (updatedSetting) {
      toast.success(
        updatedSetting.enabled
          ? `${updatedSetting.title} desligado com sucesso.`
          : `${updatedSetting.title} ligado com sucesso.`,
      );
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
      <div className="mb-6 rounded-2xl border border-success-border/50 bg-success-bg p-4 sm:p-6 md:mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/70 text-success-text">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold leading-[28px] text-success-text">
              Sua clínica está protegida
            </h2>
            <p className="mt-1 text-[14px] font-medium leading-relaxed text-success-text">
              O OdontoFlow segue boas práticas de segurança e privacidade para a rotina
              da clínica. Aqui você controla recursos visuais ligados à LGPD no
              frontend.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-text-primary">
          Controle de Privacidade
        </h3>
        <p className="mt-1 text-[14px] font-medium text-text-tertiary">
          Ligue ou desligue os recursos disponíveis na interface de configuração.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {settings.map((setting) => {
          const Icon = getIcon(setting.icon);

          return (
            <div
              key={setting.id}
              className="flex flex-col gap-4 rounded-xl border border-border-light bg-background-card p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-text-muted shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-text-secondary">
                    {setting.title}
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-text-tertiary">
                    {setting.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggle(setting.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    setting.enabled ? "bg-brand-primary" : "bg-background-hover",
                  )}
                  role="switch"
                  aria-checked={setting.enabled}
                  aria-label={`Alternar ${setting.title}`}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      setting.enabled ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
