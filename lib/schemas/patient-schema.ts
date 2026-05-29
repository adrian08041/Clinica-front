import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  phone: z
    .string()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      // Número BR local: DDD (2) + 8 (fixo) ou 9 (celular) dígitos. Sem DDI 55.
      return digits.length === 10 || digits.length === 11;
    }, "Telefone inválido"),
  insurance: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// Edição completa no perfil do paciente (aba Dados Pessoais) — todos os campos da entidade.
export const patientDetailsSchema = patientSchema.extend({
  email: z
    .string()
    .email("E-mail inválido")
    .or(z.literal(""))
    .optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

export type PatientDetailsFormData = z.infer<typeof patientDetailsSchema>;
