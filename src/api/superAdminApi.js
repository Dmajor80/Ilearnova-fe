/**
 * Platform superadmin endpoints (ilearnova-be /api/superadmin/).
 * Lists may come back as a plain array or paginated
 * `{ count, next, previous, results }`; see `asPage`.
 */
import { http } from "./baseClient";

const BASE = "/api/superadmin";
const unwrap = (payload) => (payload && typeof payload === "object" && "data" in payload && !("results" in payload) ? payload.data : payload);
const id = (value) => encodeURIComponent(value);

/** `{ items, total, paginated }` from either list shape. */
export function asPage(payload) {
  const data = unwrap(payload);
  if (Array.isArray(data)) return { items: data, total: data.length, paginated: false, next: null };
  const items = Array.isArray(data?.results) ? data.results : [];
  return { items, total: data?.count ?? items.length, paginated: true, next: data?.next ?? null };
}

/** Every item across pages (for exports and select options). */
export async function fetchAll(list, params = {}, maxPages = 50) {
  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const result = asPage(await list({ ...params, page }));
    all.push(...result.items);
    if (!result.paginated || !result.next || !result.items.length) break;
  }
  return all;
}

export const superAdminApi = {
  metrics: async () => unwrap(await http.get(`${BASE}/dashboard/metrics/`, { auth: true })),

  users: (params) => http.get(`${BASE}/users/`, { auth: true, params }),
  user: async (userId) => unwrap(await http.get(`${BASE}/users/${id(userId)}/`, { auth: true })),
  createUser: async (body) => unwrap(await http.post(`${BASE}/users/`, body, { auth: true })),
  updateUser: async (userId, body) => unwrap(await http.patch(`${BASE}/users/${id(userId)}/`, body, { auth: true })),
  activateUser: (userId) => http.post(`${BASE}/users/${id(userId)}/activate/`, {}, { auth: true }),
  deactivateUser: (userId) => http.post(`${BASE}/users/${id(userId)}/deactivate/`, {}, { auth: true }),
  resetUserPassword: (userId) => http.post(`${BASE}/users/${id(userId)}/reset-password/`, {}, { auth: true }),
  addRole: (userId, body) => http.post(`${BASE}/users/${id(userId)}/roles/`, body, { auth: true }),
  userDeleteCheck: async (userId) => unwrap(await http.get(`${BASE}/users/${id(userId)}/delete-check/`, { auth: true })),
  /** Permanent. 409 `{ error, blockers }` when the user has payments, is you, or is the last superuser. */
  deleteUser: (userId) => http.del(`${BASE}/users/${id(userId)}/`, { auth: true }),
  removeRole: (userId, roleId) => http.del(`${BASE}/users/${id(userId)}/roles/${id(roleId)}/`, { auth: true }),

  emails: (params) => http.get(`${BASE}/emails/`, { auth: true, params }),
  email: async (emailId) => unwrap(await http.get(`${BASE}/emails/${id(emailId)}/`, { auth: true })),
  resendEmail: (emailId) => http.post(`${BASE}/emails/${id(emailId)}/resend/`, {}, { auth: true }),
  deleteEmail: (emailId) => http.del(`${BASE}/emails/${id(emailId)}/`, { auth: true }),
  /** Delete sent/failed logs older than N days → `{ deleted }`. Omit `status` for both. */
  purgeEmails: (body) => http.post(`${BASE}/emails/purge/`, body, { auth: true }),

  organizations: (params) => http.get(`${BASE}/organizations/`, { auth: true, params }),
  organization: async (orgId) => unwrap(await http.get(`${BASE}/organizations/${id(orgId)}/`, { auth: true })),
  createOrganization: async (body) => unwrap(await http.post(`${BASE}/organizations/`, body, { auth: true })),
  updateOrganization: async (orgId, body) => unwrap(await http.patch(`${BASE}/organizations/${id(orgId)}/`, body, { auth: true })),
  deactivateOrganization: (orgId) => http.post(`${BASE}/organizations/${id(orgId)}/deactivate/`, {}, { auth: true }),
  organizationDeleteCheck: async (orgId) =>
    unwrap(await http.get(`${BASE}/organizations/${id(orgId)}/delete-check/`, { auth: true })),
  /** Permanent. 409 `{ error, blockers }` when the school has payments or is protected. */
  deleteOrganization: (orgId) => http.del(`${BASE}/organizations/${id(orgId)}/`, { auth: true, params: { permanent: "true" } }),
  activateOrganization: (orgId) => http.post(`${BASE}/organizations/${id(orgId)}/activate/`, {}, { auth: true }),
};

/** A school's people counts, whichever shape the API used. */
export function orgCounts(org) {
  const c = org?.counts || {};
  const pick = (key, legacy) => {
    const v = c[key] ?? (typeof org?.[key] === "number" ? org[key] : undefined) ?? org?.[legacy];
    return typeof v === "number" ? v : null;
  };
  return {
    students: pick("students", "student_count"),
    teachers: pick("teachers", "teacher_count"),
    parents: pick("parents", "parent_count"),
    admins: pick("admins", "admin_count"),
    classes: pick("classes", "class_count"),
  };
}

export function userFullName(user) {
  if (!user) return "";
  return (
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    user.email ||
    ""
  );
}
