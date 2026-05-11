export type TeamRole =
  | "Administrador"
  | "Dentista"
  | "Recepcionista"
  | "Auxiliar"
  | "Financeiro";

export type TeamStatus = "Ativo" | "Inativo";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
  avatar: string;
};

export type TeamFormState = {
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Dra. Ana Silva",
    email: "ana.silva@odontoflow.com",
    phone: "(11) 99876-1122",
    role: "Administrador",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=ana-silva",
  },
  {
    id: "team-2",
    name: "Dr. Lucas Ferraz",
    email: "lucas.ferraz@odontoflow.com",
    phone: "(11) 99712-3310",
    role: "Dentista",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=lucas-ferraz",
  },
  {
    id: "team-3",
    name: "Mariana Santos",
    email: "mariana.santos@odontoflow.com",
    phone: "(11) 98765-0918",
    role: "Recepcionista",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=mariana-santos",
  },
];

export const EMPTY_TEAM_FORM: TeamFormState = {
  name: "",
  email: "",
  phone: "",
  role: "Recepcionista",
  status: "Ativo",
};

export function getTeamStatusClasses(status: TeamStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}

export function getTeamMemberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  return (parts[0] ?? "").slice(0, 2).toUpperCase();
}
