import { getManagedSchool } from "./manageSchool";

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

/** The organization of the stored user's school-admin role, or null. */
function storedAdminSchool() {
  const user = storedUser();
  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const admin = roles.find((r) => ADMIN_ROLES.includes(codeOfRole(r)) && r?.organization?.code);
  if (admin) return admin.organization;
  const primary = user.primary_role;
  if (primary?.organization?.code && ADMIN_ROLES.includes(codeOfRole(primary))) return primary.organization;
  const groups = Array.isArray(user.organizations) ? user.organizations : [];
  const group = groups.find((g) => g?.organization?.code && (g.roles || []).some((r) => ADMIN_ROLES.includes(String(r?.code || "").toLowerCase())));
  return group ? group.organization : null;
}

export function storedSchoolCode() {
  const school = storedAdminSchool();
  return school ? String(school.code) : null;
}

/**
 * The school being managed: the one a superadmin is acting for, else the
 * signed-in admin's own school; `fallback` when neither is known.
 */
export function storedSchoolName(fallback = "your school") {
  return getManagedSchool()?.name || storedAdminSchool()?.name || fallback;
}

/** The open sign-up link for a school and role. */
export const openJoinLink = (code, role) =>
  `${window.location.origin}/join?school=${encodeURIComponent(code)}&role=${encodeURIComponent(role)}`;
