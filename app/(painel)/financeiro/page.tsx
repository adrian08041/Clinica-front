import type { Metadata } from "next";
import { FinanceContent } from "@/components/financeiro/finance-content";

export const metadata: Metadata = {
  title: "Financeiro | OdontoFlow",
  description: "Controle financeiro da clínica",
};

export default function FinanceiroPage() {
  return <FinanceContent />;
}
