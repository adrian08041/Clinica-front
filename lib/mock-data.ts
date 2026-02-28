import type { Service, Testimonial } from "@/lib/types";

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
