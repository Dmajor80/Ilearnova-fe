/** Human labels for role codes. */
export const ROLE_LABELS = {
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
  org_admin: "School admin",
  admin: "School admin",
  individual: "Individual learner",
  individual_learner: "Individual learner",
  super_admin: "Platform admin",
  superadmin: "Platform admin",
};

/** Roles a superadmin can give someone in a school. */
export const ASSIGNABLE_ROLES = [
  ["teacher", "Teacher"],
  ["student", "Student"],
  ["parent", "Parent"],
  ["org_admin", "School admin"],
  ["individual", "Individual learner"],
];

export function roleLabel(code) {
  if (!code) return "";
  const key = String(code).toLowerCase();
  return ROLE_LABELS[key] || key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/** Role codes on a stored user_data object (user.roles[].role.code). */
export function storedRoleCodes(user) {
  if (!user) return [];
  if (Array.isArray(user.roles)) {
    return user.roles.map((r) => String(r?.role?.code || r?.role || r || "").toLowerCase());
  }
  return typeof user.role === "string" ? [user.role.toLowerCase()] : [];
}

export function isSuperUser(user) {
  if (!user) return false;
  const roles = storedRoleCodes(user);
  return user.is_superuser === true || roles.includes("super_admin") || roles.includes("superadmin");
}
