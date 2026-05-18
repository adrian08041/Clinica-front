import { z } from "zod";

export const clinicaSchema = z.object({
    nomeFantasia: z.string().min(2, "Obrigatório"),
    cnpj: z.string().min(14, "CNPJ inválido"),
    telefone: z.string().min(10, "Telefone inválido"),
    endereco: z.string().min(10, "Endereço incompleto"),
    email: z.string().email("E-mail inválido"),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
    logoUrl: z.string().optional().or(z.literal("")),
});

export type ClinicaFormData = z.infer<typeof clinicaSchema>;
