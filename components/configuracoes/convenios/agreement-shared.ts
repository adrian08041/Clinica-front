export type AgreementType =
  | "Plano odontológico"
  | "Plano de saúde"
  | "Convênio corporativo"
  | "Parceria local";

export type AgreementStatus = "Ativo" | "Em análise" | "Inativo";

export type Agreement = {
  id: string;
  name: string;
  code: string;
  type: AgreementType;
  discount: string;
  status: AgreementStatus;
};

export type AgreementFormState = {
  name: string;
  code: string;
  type: AgreementType;
  discount: string;
  status: AgreementStatus;
};

export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: "agreement-1",
    name: "Unimed Odonto",
    code: "UNI-001",
    type: "Plano odontológico",
    discount: "15",
    status: "Ativo",
  },
  {
    id: "agreement-2",
    name: "Bradesco Saúde",
    code: "BRA-014",
    type: "Plano de saúde",
    discount: "10",
    status: "Ativo",
  },
  {
    id: "agreement-3",
    name: "Clube Empresarial Paulista",
    code: "CEP-221",
    type: "Convênio corporativo",
    discount: "8",
    status: "Em análise",
  },
];

export const EMPTY_AGREEMENT_FORM: AgreementFormState = {
  name: "",
  code: "",
  type: "Plano odontológico",
  discount: "10",
  status: "Ativo",
};

export function getAgreementStatusClasses(status: AgreementStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  if (status === "Em análise") {
    return "bg-warning-bg text-warning-text border-warning-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}
