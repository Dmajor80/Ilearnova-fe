import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(() => Promise.resolve({})), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import AdminDashboard from "../AdminDashboard";

const renderAt = (url) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="users" element={<p>users page</p>} />
          <Route path="emails" element={<p>emails page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  window.sessionStorage.setItem("auth_access", "x");
  window.sessionStorage.setItem(
    "user_data",
    JSON.stringify({ username: "superadmin", first_name: "Platform", last_name: "Admin", is_superuser: true })
  );
});
afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe("Superadmin layout", () => {
  it("titles the header after the current page", () => {
    renderAt("/admin-dashboard/emails");
    expect(screen.getByRole("heading", { level: 1, name: "Email Logs" })).toBeTruthy();
    expect(screen.queryByText("Page/Student Portal")).toBeNull();
    expect(screen.queryByPlaceholderText(/search courses/i)).toBeNull();
  });

  it("only links to real pages, with proper labels, and marks the active one", () => {
    renderAt("/admin-dashboard/users");
    const nav = screen.getByRole("navigation", { name: "Admin" });
    const labels = within(nav).getAllByRole("link").map((a) => a.textContent.trim());
    expect(labels).toEqual(["Dashboard", "Organizations", "Users", "Subscriptions", "Email Logs", "Reports", "Settings"]);
    expect(within(nav).getByRole("link", { name: "Users" }).getAttribute("aria-current")).toBe("page");
    expect(within(nav).queryByText(/messages/i)).toBeNull();
    expect(within(nav).queryByText(/analytics/i)).toBeNull();
  });

  it("shows initials instead of a broken avatar image and a current-year footer", () => {
    renderAt("/admin-dashboard/users");
    expect(screen.queryByRole("img", { name: "User" })).toBeNull();
    expect(screen.getByText("PA")).toBeTruthy();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} iLearnova`))).toBeTruthy();
  });
});
