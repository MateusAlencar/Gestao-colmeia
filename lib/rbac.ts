export type UserRole = "admin" | "marketing" | "comite";

function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role) return null;
  const normalized = role
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized === "admin") return "admin";
  if (normalized === "marketing") return "marketing";
  if (normalized === "comite") return "comite";
  return null;
}

const ALLOWED_BASE_PATHS: Record<Exclude<UserRole, "admin">, string[]> = {
  marketing: ["/", "/cases", "/news"],
  comite: ["/", "/denuncias", "/sugestoes-elogios"],
};

function isPathAllowedByBasePaths(pathname: string, basePaths: string[]) {
  for (const base of basePaths) {
    if (base === "/") {
      if (pathname === "/") return true;
      continue;
    }
    if (pathname === base || pathname.startsWith(base + "/")) return true;
  }
  return false;
}

/**
 * Role-based access check for any pathname.
 * - admin: access all
 * - marketing: /, /cases(+subroutes), /news(+subroutes)
 * - comite: /, /denuncias(+subroutes), /sugestoes-elogios(+subroutes)
 */
export function canAccessPath(role: string | null | undefined, pathname: string): boolean {
  const normalizedRole = normalizeRole(role);
  if (!pathname) return false;

  // Always allow auth pages (UI can still decide to hide sidebar there).
  if (pathname === "/login" || pathname === "/signup") return true;

  if (!normalizedRole) return false;
  if (normalizedRole === "admin") return true;

  return isPathAllowedByBasePaths(pathname, ALLOWED_BASE_PATHS[normalizedRole]);
}

export function filterNavigation<T extends { href: string }>(
  role: string | null | undefined,
  navigation: T[]
): T[] {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "admin") return navigation;
  if (!normalizedRole) return [];
  return navigation.filter((item) => canAccessPath(normalizedRole, item.href));
}

