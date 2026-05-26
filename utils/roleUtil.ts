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
