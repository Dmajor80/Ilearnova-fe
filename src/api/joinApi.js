import { http } from "./baseClient";

/**
 * Joining a school by its code or an emailed invite, and school admins
 * sending invites. People never pick their school from a list.
 */

const unwrap = (payload) =>
  payload && typeof payload === "object" && "data" in payload && payload.data && typeof payload.data === "object"
    ? payload.data
    : payload;

export const JOIN_ROLES = ["teacher", "student", "parent"];

/** `{ name, code }` of the school with this code (any case); 404 if none. */
export async function lookupSchool(code) {
  return unwrap(await http.get("/api/organizations/lookup/", { auth: false, params: { code } }));
}

/** Who an invite link is for: `{ email, role, role_label, organization_name, organization_code }`. */
export async function getInvite(token) {
  return unwrap(await http.get("/api/auth/invite/", { auth: false, params: { token } }));
}

/** Register as a teacher, student or parent with `invite` or `organization_code` in `body`. */
export async function registerForSchool(role, body) {
  if (!JOIN_ROLES.includes(role)) throw new Error("Unknown role.");
  return await http.post(`/api/auth/register/${role}/`, { body, auth: false });
}

/** School admin: email personal invite links. Returns `{ sent, skipped: [{ email, reason }] }`. */
export async function sendInvites({ role, emails, message }) {
  return unwrap(
    await http.post("/api/admin/school/invites/", {
      body: { role, emails, ...(message ? { message } : {}) },
    })
  );
}
