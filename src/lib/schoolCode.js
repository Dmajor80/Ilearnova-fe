/**
 * The signed-in school admin's school code, from the user saved at login
 * (roles[].organization.code or primary_role.organization.code), or null.
 * Read straight from storage so pages need no extra request.
 */
const ADMIN_ROLES = ["org_admin", "admin", "school_admin"];

function storedUser() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      const raw = store?.getItem("user_data");
      if (raw) return JSON.parse(raw);
    } catch {
      // Unreadable storage: try the next one.
    }
  }
  return null;
}

const codeOfRole = (entry) => String(entry?.role?.code || entry?.role || "").toLowerCase();

export function storedSchoolCode() {
  const user = storedUser();
  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const admin = roles.find((r) => ADMIN_ROLES.includes(codeOfRole(r)) && r?.organization?.code);
  if (admin) return String(admin.organization.code);
  const primary = user.primary_role;
  if (primary?.organization?.code && ADMIN_ROLES.includes(codeOfRole(primary))) return String(primary.organization.code);
  const groups = Array.isArray(user.organizations) ? user.organizations : [];
  const group = groups.find((g) => g?.organization?.code && (g.roles || []).some((r) => ADMIN_ROLES.includes(String(r?.code || "").toLowerCase())));
  return group ? String(group.organization.code) : null;
}

/** The open sign-up link for a school and role. */
export const openJoinLink = (code, role) =>
  `${window.location.origin}/join?school=${encodeURIComponent(code)}&role=${encodeURIComponent(role)}`;
