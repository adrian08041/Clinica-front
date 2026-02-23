import { z } from "zod";

export const patientSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    cpf: z.string().min(14, "CPF inválido (14 caracteres obrigatórios com formatação)"),
    phone: z.string().min(14, "Telefone inválido"),
    insurance: z.string().optional()
});

export type PatientFormData = z.infer<typeof patientSchema>;
