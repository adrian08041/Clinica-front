import type { UserRole } from "@/lib/utils/auth";

const ALL_ROLES: UserRole[] = ["ADMIN", "DENTISTA", "RECEPCIONISTA"];

/**
 * Cargos que podem acessar cada rota do painel. Fonte única do RBAC de navegação —
 * consumida pela sidebar, mobile-nav, página /menu e pelo guard do layout.
 */
const ROUTE_ROLES: Record<string, UserRole[]> = {
  "/dashboard": ["ADMIN", "DENTISTA"],
  "/agenda": ALL_ROLES,
  "/pacientes": ALL_ROLES,
  "/tratamentos": ALL_ROLES,
  "/financeiro": ["ADMIN"],
  "/configuracoes": ["ADMIN", "RECEPCIONISTA"],
  "/perfil": ALL_ROLES,
  "/menu": ALL_ROLES,
};

/** Resolve a entrada do mapa que corresponde ao pathname (rota exata ou subrota). */
function matchRoute(pathname: string): UserRole[] | null {
  const entry = Object.entries(ROUTE_ROLES).find(
    ([path]) => pathname === path || pathname.startsWith(`${path}/`),
  );
  return entry ? entry[1] : null;
}

/** true se o cargo pode acessar o pathname. Rotas não mapeadas são liberadas. */
export function canAccessRoute(
  role: UserRole | null | undefined,
  pathname: string,
): boolean {
  const roles = matchRoute(pathname);
  if (!roles) return true;
  if (!role) return false;
  return roles.includes(role);
}

/** Rota inicial pós-login conforme o cargo. */
export function homeFor(role: UserRole | null | undefined): string {
  return role === "RECEPCIONISTA" ? "/agenda" : "/dashboard";
}

/** Faturamento e módulo Financeiro são exclusivos do ADMIN. */
export function canViewFinance(role: UserRole | null | undefined): boolean {
  return role === "ADMIN";
}
