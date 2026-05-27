export const normalizeRole = (role?: string | null) => {
  const normalized = (role ?? "").trim().toUpperCase();

  if (normalized === "ORGANISER") {
    return "ORGANIZER";
  }

  if (normalized === "ORGANIZER" || normalized === "ADMIN" || normalized === "USER") {
    return normalized;
  }

  return normalized;
};

export const isRoleAllowed = (
  userRole: string | null | undefined,
  allowedRoles: string[],
) => {
  const normalizedUserRole = normalizeRole(userRole);

  return allowedRoles.some(
    (allowedRole) => normalizeRole(allowedRole) === normalizedUserRole,
  );
};

export const isOrganizerRole = (role?: string | null) =>
  normalizeRole(role) === "ORGANIZER";

export const isAdminRole = (role?: string | null) =>
  normalizeRole(role) === "ADMIN";

/** Default landing route after login for each role. */
export const getDefaultRouteForRole = (role?: string | null): string => {
  if (isAdminRole(role)) {
    return "/staff/admin/users";
  }

  if (isOrganizerRole(role)) {
    return "/staff/organiser";
  }

  return "/events";
};

/**
 * Picks the post-login destination. Role-based home wins over a stale `next`
 * (e.g. `?next=/events` from an unauthenticated redirect before login).
 */
export const resolvePostLoginPath = (
  role?: string | null,
  nextPath?: string | null,
): string => {
  const defaultPath = getDefaultRouteForRole(role);

  if (!nextPath) {
    return defaultPath;
  }

  if (isAdminRole(role)) {
    return nextPath.startsWith("/staff/admin") ? nextPath : defaultPath;
  }

  if (isOrganizerRole(role)) {
    return nextPath.startsWith("/staff/organiser") ? nextPath : defaultPath;
  }

  return nextPath.startsWith("/staff/") ? defaultPath : nextPath;
};