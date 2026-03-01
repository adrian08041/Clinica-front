import { SettingsContent } from "@/components/configuracoes/settings-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Configurações | OdontoFlow",
    description: "Gerencie as configurações da sua clínica",
};

export default function ConfiguracoesPage() {
    return (
        <SettingsContent />
    );
}
