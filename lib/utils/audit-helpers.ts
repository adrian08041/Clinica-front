import type { AuditAction } from "@/lib/queries/audit";

/**
 * Fonte única de entidades auditáveis. `value` é o nome da classe Java
 * (igual ao que o back grava em `audit_logs.entity`); `label` é o texto pt-BR
 * exibido na UI. Adicionar uma entidade nova aqui — `entityLabel` e o filtro
 * de Entidade em `lgpd-settings.tsx` se atualizam automaticamente.
 */
export const AUDIT_ENTITIES = [
  { value: "Patient", label: "Paciente" },
  { value: "Appointment", label: "Agendamento" },
  { value: "FinanceReceivable", label: "Cobrança" },
  { value: "TreatmentPlan", label: "Plano de tratamento" },
  { value: "TreatmentProcedure", label: "Procedimento" },
  { value: "Clinic", label: "Clínica" },
  { value: "Insurance", label: "Convênio" },
  { value: "Dentist", label: "Dentista" },
  { value: "Document", label: "Documento" },
  { value: "User", label: "Usuário" },
] as const;

const ENTITY_LABEL: Record<string, string> = Object.fromEntries(
  AUDIT_ENTITIES.map((entity) => [entity.value, entity.label]),
);

export function entityLabel(entity: string): string {
  return ENTITY_LABEL[entity] ?? entity;
}

const LOOPBACK_IPS = new Set([
  "::1",
  "0:0:0:0:0:0:0:1",
  "127.0.0.1",
  "localhost",
  "0.0.0.0",
]);

export function formatIp(ip: string | null | undefined): string {
  if (!ip) return "—";
  const trimmed = ip.trim();
  if (!trimmed) return "—";
  if (LOOPBACK_IPS.has(trimmed)) return "Local";
  return trimmed;
}

const ACTION_LABEL: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
};

const ACTION_VERB_PAST: Record<AuditAction, string> = {
  CREATE: "criou",
  UPDATE: "atualizou",
  DELETE: "excluiu",
  LOGIN: "fez login",
  LOGOUT: "encerrou a sessão",
};

export function actionLabel(action: AuditAction): string {
  return ACTION_LABEL[action];
}

export function actionVerb(action: AuditAction): string {
  return ACTION_VERB_PAST[action];
}

// ─────────────────────────────────────────────────────────────────────────────
// Extração de descrição contextual a partir do JSON `changes`
//
// Back monta o JSON via util/AuditChanges. Estruturas possíveis:
//   { "after":  { ...snapshot } }                  // CREATE
//   { "before": { ...snapshot } }                  // DELETE
//   { "before": { ...snapshot }, "after": {...} }  // UPDATE
// ─────────────────────────────────────────────────────────────────────────────

interface ChangeWrapper {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

function pickSnapshot(parsed: ChangeWrapper): Record<string, unknown> | null {
  if (parsed.after && typeof parsed.after === "object") return parsed.after;
  if (parsed.before && typeof parsed.before === "object") return parsed.before;
  return null;
}

function str(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function brl(value: unknown): string | null {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatBackDate(value: unknown): string | null {
  const text = str(value);
  if (!text) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (!match) return text;
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

export function extractEntitySummary(
  changes: string | null | undefined,
  entity: string,
): string | null {
  if (!changes) return null;
  let parsed: ChangeWrapper;
  try {
    parsed = JSON.parse(changes) as ChangeWrapper;
  } catch {
    return null;
  }
  const snap = pickSnapshot(parsed);
  if (!snap) return null;

  switch (entity) {
    case "Patient":
    case "Dentist":
    case "Insurance": {
      return str(snap.name);
    }
    case "Appointment": {
      const patient = str(snap.patientName);
      const date = formatBackDate(snap.date);
      const time = str(snap.time);
      if (patient && date && time) return `${patient} — ${date} às ${time}`;
      if (patient && date) return `${patient} — ${date}`;
      return patient ?? str(snap.procedure);
    }
    case "FinanceReceivable": {
      const desc = str(snap.description);
      const patient = str(snap.patientName);
      const value = brl(snap.value);
      const parts = [desc, patient, value].filter(Boolean);
      return parts.length > 0 ? parts.join(" — ") : null;
    }
    case "TreatmentPlan": {
      const title = str(snap.title);
      const patient = str(snap.patientName);
      if (title && patient) return `${title} (${patient})`;
      return title ?? patient;
    }
    case "TreatmentProcedure": {
      const name = str(snap.name);
      const tooth = str(snap.tooth);
      if (name && tooth) return `${name} — dente ${tooth}`;
      return name;
    }
    case "Clinic": {
      return str(snap.nomeFantasia);
    }
    case "Document": {
      return str(snap.fileName);
    }
    case "User": {
      return str(snap.name) ?? str(snap.email);
    }
    default:
      return null;
  }
}
