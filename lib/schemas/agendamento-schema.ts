import { z } from "zod";

export const agendamentoSchema = z.object({
  patientName: z.string().min(2, "Nome do paciente é obrigatório"),
  dentistId: z.string().min(1, "Selecione um dentista"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  duration: z.number().min(15, "Duração mínima de 15 minutos"),
  type: z.enum(["evaluation", "cleaning", "procedure"], {
    message: "Tipo de consulta é obrigatório",
  }),
  procedure: z.string().min(2, "Procedimento é obrigatório"),
  observations: z.string().optional(),
});

export type AgendamentoFormData = z.infer<typeof agendamentoSchema>;
