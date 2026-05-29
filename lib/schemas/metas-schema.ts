import { z } from "zod";

export const metasSchema = z.object({
    revenueGoal: z
        .number({ error: "Informe um valor numérico" })
        .min(0, "A meta não pode ser negativa"),
    treatmentGoal: z
        .number({ error: "Informe um valor numérico" })
        .int("Use um número inteiro")
        .min(0, "A meta não pode ser negativa"),
});

export type MetasFormData = z.infer<typeof metasSchema>;
