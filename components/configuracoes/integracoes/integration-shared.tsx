import { Bot, CreditCard, MessageCircle, PlugZap } from "lucide-react";

export type IntegrationCategory =
  | "Comunicação"
  | "Automação"
  | "Financeiro"
  | "Atendimento";

export type Integration = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  endpoint: string;
  connected: boolean;
  status: "Conectado" | "Pendente";
  iconName: "message" | "automation" | "payment" | "assistant";
  color: string;
};

export type IntegrationFormState = {
  name: string;
  description: string;
  category: IntegrationCategory;
  endpoint: string;
};

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "integration-1",
    name: "WhatsApp (UAZAPI)",
    description: "Envio automático de lembretes e confirmações para pacientes.",
    category: "Comunicação",
    endpoint: "https://api.uazapi.com/v1/odontoflow",
    connected: true,
    status: "Conectado",
    iconName: "message",
    color: "text-success-text",
  },
  {
    id: "integration-2",
    name: "n8n Automations",
    description: "Fluxos internos para eventos de agenda, cadastro e pós-consulta.",
    category: "Automação",
    endpoint: "https://n8n.odontoflow.com/webhook/entrada",
    connected: true,
    status: "Conectado",
    iconName: "automation",
    color: "text-danger-text",
  },
  {
    id: "integration-3",
    name: "Gateway de Pagamento",
    description: "Cobranças via cartão, PIX e conciliação financeira da clínica.",
    category: "Financeiro",
    endpoint: "https://payments.odontoflow.com/api",
    connected: false,
    status: "Pendente",
    iconName: "payment",
    color: "text-warning-text",
  },
];

export const EMPTY_INTEGRATION_FORM: IntegrationFormState = {
  name: "",
  description: "",
  category: "Comunicação",
  endpoint: "",
};

export function renderIntegrationIcon(iconName: Integration["iconName"], className: string) {
  if (iconName === "message") return <MessageCircle className={className} />;
  if (iconName === "automation") return <Bot className={className} />;
  if (iconName === "payment") return <CreditCard className={className} />;
  return <PlugZap className={className} />;
}

export function getCategoryBadge(category: IntegrationCategory) {
  if (category === "Comunicação") return "bg-success-bg text-success-text border-success-border";
  if (category === "Automação") return "bg-danger-bg text-danger-text border-danger-border";
  if (category === "Financeiro") return "bg-warning-bg text-warning-text border-warning-border";
  return "bg-background-hover text-text-tertiary border-border-light";
}

export function getIntegrationVisual(category: IntegrationCategory) {
  if (category === "Comunicação") {
    return {
      iconName: "message" as const,
      color: "text-success-text",
    };
  }

  if (category === "Automação") {
    return {
      iconName: "automation" as const,
      color: "text-danger-text",
    };
  }

  if (category === "Financeiro") {
    return {
      iconName: "payment" as const,
      color: "text-warning-text",
    };
  }

  return {
    iconName: "assistant" as const,
    color: "text-brand-primary",
  };
}
