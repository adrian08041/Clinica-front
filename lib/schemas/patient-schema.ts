import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  phone: z
    .string()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length === 13 && digits.startsWith("55");
    }, "Telefone inválido"),
  insurance: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;
