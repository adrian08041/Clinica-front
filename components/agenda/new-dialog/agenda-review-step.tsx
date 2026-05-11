"use client";

type AgendaReviewStepProps = {
  formattedDate: string;
  observations?: string;
  patientName?: string;
  specialty?: string;
  dentistName?: string;
  time?: string;
  typeLabel: string;
};

export function AgendaReviewStep({
  formattedDate,
  observations,
  patientName,
  specialty,
  dentistName,
  time,
  typeLabel,
}: AgendaReviewStepProps) {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div>
        <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
          Confirmação do Agendamento
        </h3>
        <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
          Revise todos os dados antes de confirmar o agendamento do paciente.
        </p>
      </div>

      <div className="rounded-[22px] border border-[var(--color-border-panel)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.05),transparent_38%),var(--color-white)] p-6">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-panel-alt)] pb-5">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Agendamento
            </p>
            <p className="mt-2 text-[18px] font-black text-[var(--color-ink-panel)]">
              {patientName || "-"}
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-brand-teal)] px-4 py-2 text-[12px] font-black text-white">
            {typeLabel}
          </span>
        </div>

        <div className="grid gap-5 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Profissional
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {dentistName || "-"}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Especialidade
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {specialty || "-"}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Tipo
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {typeLabel}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Data
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {formattedDate}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Horário
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {time || "-"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Observações
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {observations || "Sem observações registradas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
