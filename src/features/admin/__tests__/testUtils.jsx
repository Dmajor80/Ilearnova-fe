import { vi } from "vitest";

export const ORG = {
  id: "org-1",
  name: "Greenfield Academy",
  code: "GRNFLD",
  organization_type: "private",
  email: "office@greenfield.example.com",
  phone_number: "+234 800",
  address: "12 Palm Grove",
  is_active: true,
  created_at: "2026-11-20T10:00:00Z",
  counts: { students: 24, teachers: 4, parents: 1, admins: 1, classes: 2 },
  subscription: { state: "active", plan_name: "School annual", expires_at: "2027-09-07T00:00:00Z" },
};

export const INACTIVE_ORG = { ...ORG, id: "org-2", name: "Closed College", code: "CLOSED", is_active: false };

export const USER = {
  id: "u-1",
  username: "ada",
  email: "ada@greenfield.example.com",
  first_name: "Ada",
  last_name: "Obi",
  full_name: "Ada Obi",
  is_active: true,
  is_verified: true,
  is_superuser: false,
  date_joined: "2026-11-01T10:00:00Z",
  last_login: null,
  roles: [
    { id: "r-1", organization_id: "org-1", organization_name: "Greenfield Academy", role: "org_admin", role_name: "Org admin", is_active: true, is_verified: true },
  ],
};

export const SUPERUSER = {
  ...USER,
  id: "u-2",
  username: "superadmin",
  email: "super@example.com",
  first_name: "Platform",
  last_name: "Admin",
  full_name: "Platform Admin",
  is_superuser: true,
  roles: [],
};

export const paginated = (results) => ({ count: results.length, next: null, previous: null, results });

/** Route http.get by path prefix; unmatched paths resolve to {}. */
export function routeGets(http, routes) {
  http.get.mockImplementation((path, opts) => {
    const hit = Object.keys(routes).find((prefix) => path === prefix || path.startsWith(prefix));
    if (!hit) return Promise.resolve({});
    const value = routes[hit];
    return typeof value === "function" ? value(path, opts) : Promise.resolve(value);
  });
}

export const mockHttp = () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
});
