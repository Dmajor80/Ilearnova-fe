import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Dashboard from "../Dashboard";

// recharts' ResponsiveContainer needs ResizeObserver, which jsdom lacks.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const OLD_SHAPE = {
  success: true,
  data: {
    organizations: { total: 6, active: 6 },
    users: { total: 25, students: 4, teachers: 2, parents: 1, org_admins: 5 },
    classes: 3,
    exams: 7,
  },
};

const signups = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-11-${String(i + 1).padStart(2, "0")}`,
  users: i % 3,
  organizations: i % 7 === 0 ? 1 : 0,
}));

const FULL_SHAPE = {
  success: true,
  data: {
    ...OLD_SHAPE.data,
    subscriptions: { active: 4, expiring_soon: 1, expired: 1, none: 0 },
    revenue: { this_month: 250000, last_month: 120000, currency: "NGN", by_purpose: {} },
    signups,
    recent_organizations: [
      { id: "org-1", name: "Greenfield Academy", code: "GRNFLD", created_at: "2026-11-20T10:00:00Z", students: 24, teachers: 4 },
    ],
    emails: { failed: 3, pending: 0 },
  },
};

const renderDashboard = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Superadmin dashboard", () => {
  beforeEach(() => http.get.mockResolvedValue(OLD_SHAPE));

  it("shows real numbers with sub-labels, never raw JSON", async () => {
    renderDashboard();
    const schools = await screen.findByRole("group", { name: "Schools" });
    expect(within(schools).getByText("6")).toBeTruthy();
    expect(within(schools).getByText(/6 active/)).toBeTruthy();
    const users = screen.getByRole("group", { name: "Users" });
    expect(within(users).getByText("25")).toBeTruthy();
    expect(within(users).getByText(/4 students · 2 teachers · 1 parent · 5 admins/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/\{"total"/);
  });

  it("renders gracefully when the newer metrics are missing", async () => {
    renderDashboard();
    await screen.findByRole("group", { name: "Schools" });
    expect(screen.queryByText(/failed email/i)).toBeNull();
    expect(screen.getByText(/No sign-up data yet/i)).toBeTruthy();
  });

  it("shows revenue, subscriptions, recent schools and a failed-email alert", async () => {
    http.get.mockResolvedValue(FULL_SHAPE);
    renderDashboard();
    expect(await screen.findByText("₦250,000")).toBeTruthy();
    expect(screen.getByText(/₦120,000 last month/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /Greenfield Academy/ }).getAttribute("href")).toBe(
      "/admin-dashboard/organizations/org-1"
    );
    expect(screen.getByRole("link", { name: /3 emails failed/i }).getAttribute("href")).toBe(
      "/admin-dashboard/emails?status=failed"
    );
    expect(screen.getByRole("img", { name: /sign-ups over the last 30 days/i })).toBeTruthy();
  });

  it("refreshes on demand and has working quick actions", async () => {
    renderDashboard();
    await screen.findByRole("group", { name: "Schools" });
    const before = http.get.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: /refresh/i }));
    await waitFor(() => expect(http.get).toHaveBeenCalledTimes(before + 1));
    expect(http.get).toHaveBeenLastCalledWith("/api/superadmin/dashboard/metrics/", { auth: true });
    expect(screen.getByRole("link", { name: /Add user/ }).getAttribute("href")).toBe("/admin-dashboard/users/new-user");
    expect(screen.getByRole("link", { name: /Add school/ }).getAttribute("href")).toBe("/admin-dashboard/organizations?new=1");
    expect(screen.getByRole("link", { name: /Invite a school/ }).getAttribute("href")).toBe("/admin-dashboard/subscriptions?tab=invite");
    expect(screen.getByRole("link", { name: /Create plan/ }).getAttribute("href")).toBe("/admin-dashboard/subscriptions?tab=plans&new=1");
  });
});
