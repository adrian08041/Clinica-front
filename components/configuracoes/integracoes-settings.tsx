import {
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  MessageCircle,
  Plus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const integrations = [
  {
    name: "WhatsApp (UAZAPI)",
    description: "Envio automatico de lembretes e confirmacoes.",
    status: "Conectado",
    icon: MessageCircle,
    color: "text-[#00c776]",
    statusClass: "bg-[#e8faf2] text-[#0e9e95]",
  },
  {
    name: "n8n Automation",
    description: "Integracao de fluxos de trabalho e dados.",
    status: "Conectado",
    icon: Zap,
    color: "text-[#ff5a52]",
    statusClass: "bg-[#e8faf2] text-[#0e9e95]",
  },
  {
    name: "Gateway de Pagamento",
    description: "Processamento de cartoes e boletos direto no app.",
    status: "Pendente",
    icon: CreditCard,
    color: "text-[#5970ff]",
    statusClass: "bg-[#fff4e5] text-[#ff9800]",
  },
];

export function IntegracoesSettings() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="border-b border-[#eef2f8] px-6 py-8 md:px-12">
        <h2 className="text-[20px] font-black text-[#0f274c] md:text-[22px]">Ecossistema de Integracoes</h2>
        <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Conecte o OdontoFlow com as suas ferramentas favoritas.</p>
      </div>

      <div className="grid gap-6 px-6 py-8 md:grid-cols-2 md:px-12">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const StatusIcon = integration.status === "Conectado" ? CheckCircle2 : Clock3;

          return (
            <div key={integration.name} className="rounded-[26px] border border-[#dfe6f2] bg-white p-6 shadow-[0_4px_14px_rgba(15,39,76,0.03)]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className={cn("flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-[#edf2f7] bg-white shadow-sm", integration.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${integration.statusClass}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {integration.status}
                </span>
              </div>

              <h3 className="text-[18px] font-black text-[#0f274c]">{integration.name}</h3>
              <p className="mt-2 min-h-12 text-[15px] font-medium leading-7 text-[#5f7091]">{integration.description}</p>

              <Button variant="outline" className="mt-7 h-11 w-full rounded-full border-[#d9e1ef] text-[14px] font-bold text-[#4f6183] hover:bg-[#f8fbff]">
                Configurar Integracao
                <ExternalLink className="ml-2 h-4 w-4 text-[#93a0bd]" />
              </Button>
            </div>
          );
        })}

        <div className="flex min-h-[278px] flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#d8e0ee] bg-[#fbfcfe] px-6 text-center">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[#eef3fa] text-[#91a0bd]">
            <Plus className="h-7 w-7" />
          </div>
          <h3 className="mt-6 text-[18px] font-black text-[#91a0bd]">Explorar Marketplace</h3>
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#b1bdd2]">Breve: novas conexoes</p>
        </div>
      </div>
    </div>
  );
}
