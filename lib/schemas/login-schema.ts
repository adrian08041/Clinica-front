import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
