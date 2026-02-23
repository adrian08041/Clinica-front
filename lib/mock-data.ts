import type { Patient } from "./types";

export const MOCK_PATIENTS: Patient[] = [
    { id: 1, name: "Ana Carolina Silva", status: "Ativo", cpf: "123.456.789-00", phone: "(11) 98877-6655", lastVisit: "12/02/2026", insurance: "Unimed", tags: ["Ortodontia", "VIP"], avatar: "https://i.pravatar.cc/150?u=ana" },
    { id: 2, name: "Bruno Oliveira", status: "Ativo", cpf: "234.567.890-11", phone: "(11) 97766-5544", lastVisit: "05/02/2026", insurance: "Bradesco Saúde", tags: ["Implante"], avatar: "https://i.pravatar.cc/150?u=bruno" },
    { id: 3, name: "Clara Mendes", status: "Pendente", cpf: "345.678.901-22", phone: "(11) 96655-4433", lastVisit: "28/01/2026", insurance: "Amil", tags: ["Limpeza"], avatar: "https://i.pravatar.cc/150?u=clara" },
    { id: 4, name: "Dora Santos", status: "Inativo", cpf: "456.789.012-33", phone: "(11) 95544-3322", lastVisit: "15/12/2025", insurance: "Particular", tags: ["Prótese"], avatar: "https://i.pravatar.cc/150?u=dora" }
];
