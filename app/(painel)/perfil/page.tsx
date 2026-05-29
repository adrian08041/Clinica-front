import { PerfilContent } from "@/components/perfil/perfil-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil | OdontoFlow",
  description: "Gerencie seus dados pessoais, foto e senha de acesso",
};

export default function PerfilPage() {
  return <PerfilContent />;
}
