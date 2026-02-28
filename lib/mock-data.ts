import type { Service, Testimonial, Patient } from "@/lib/types";

// As per design, the login page doesn't strictly require data mapping here,
// but to satisfy project conventions, mock data is centralized here.

export const SERVICES: Service[] = [
  {
    id: "1",
    title: "Clareamento",
    description: "Clareamento dental a laser",
    icon: "Smile",
  },
];

export const MOCK_USER = {
  email: "seu@email.com",
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "João Silva",
    cpf: "111.222.333-44",
    phone: "(11) 98765-4321",
    insurance: "Unimed",
    createdAt: "2026-02-28",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    cpf: "555.666.777-88",
    phone: "(11) 91234-5678",
    insurance: "Bradesco Saúde",
    createdAt: "2026-02-27",
  },
  {
    id: "3",
    name: "Carlos Souza",
    cpf: "999.888.777-66",
    phone: "(11) 99999-8888",
    createdAt: "2026-02-26",
  }
];
