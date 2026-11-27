import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ORG, SUPERUSER, USER, paginated, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/lib/csv", () => ({ downloadCsv: vi.fn(), toCsv: vi.fn() }));

vi.mock("@/api/auth", () => ({ getStoredUser: vi.fn(() => ({ id: "u-9", email: "me@example.com" })) }));

import { http } from "@/api/baseClient";
import { getStoredUser } from "@/api/auth";
import { downloadCsv } from "@/lib/csv";
import Users from "../Users";

const renderPage = (url = "/admin-dashboard/users") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/admin-dashboard/users" element={<Users />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  routeGets(http, {
    "/api/superadmin/users/": paginated([USER, SUPERUSER]),
    "/api/superadmin/organizations/": paginated([ORG]),
  });
  http.post.mockResolvedValue({});
  http.patch.mockResolvedValue({});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const lastUsersParams = () =>
  http.get.mock.calls.filter(([path]) => path === "/api/superadmin/users/").at(-1)[1].params;

describe("Users (superadmin)", () => {
  it("renders a compact table with human role labels", async () => {
    renderPage();
    const table = await screen.findByRole("table");
    const ada = within(table).getByText("Ada Obi").closest("tr");
    expect(within(ada).getByText("School admin")).toBeTruthy();
    expect(within(ada).getAllByText("Greenfield Academy").length).toBeGreaterThan(0);
    expect(within(ada).getByText("Active")).toBeTruthy();
    const admin = within(table).getByText("Platform Admin").closest("tr");
    expect(within(admin).getByText("Platform admin")).toBeTruthy();
    expect(screen.queryAllByRole("textbox", { hidden: true }).filter((el) => el.disabled)).toHaveLength(0);
  });

  it("filters by school from the URL and by role/status", async () => {
    renderPage("/admin-dashboard/users?organization_id=org-1");
    await screen.findByRole("table");
    expect(lastUsersParams()).toMatchObject({ organization_id: "org-1", page: 1 });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "teacher" } });
    await waitFor(() => expect(lastUsersParams()).toMatchObject({ role: "teacher", organization_id: "org-1" }));
    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "false" } });
    await waitFor(() => expect(lastUsersParams()).toMatchObject({ is_active: "false" }));
  });

  it("debounces search", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderPage();
    await screen.findByRole("table");
    fireEvent.change(screen.getByLabelText("Search users"), { target: { value: "ada" } });
    expect(lastUsersParams().search).toBeUndefined();
    vi.advanceTimersByTime(400);
    await waitFor(() => expect(lastUsersParams()).toMatchObject({ search: "ada", page: 1 }));
    vi.useRealTimers();
  });

  it("exports the filtered list as CSV", async () => {
    renderPage("/admin-dashboard/users?organization_id=org-1");
    await screen.findByRole("table");
    fireEvent.click(screen.getByRole("button", { name: /export csv/i }));
    await waitFor(() => expect(downloadCsv).toHaveBeenCalled());
    const [filename, rows, columns] = downloadCsv.mock.calls[0];
    expect(filename).toMatch(/users.*\.csv$/);
    expect(rows).toHaveLength(2);
    expect(columns.map((c) => c.header)).toEqual(expect.arrayContaining(["Name", "Email", "Roles", "Schools", "Status"]));
  });

  it("sends a password reset after confirmation", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for Ada Obi" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Send password reset" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Send reset email" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/users/u-1/reset-password/", {}, { auth: true })
    );
  });

  it("deactivates a user after confirmation", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for Ada Obi" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Deactivate" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Deactivate" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/users/u-1/deactivate/", {}, { auth: true })
    );
  });

  it("adds a user to a school with a role", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for Ada Obi" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: /Change role/ }));
    const dialog = screen.getByRole("dialog");
    await within(dialog).findByRole("option", { name: "Greenfield Academy" });
    fireEvent.change(within(dialog).getByLabelText("School"), { target: { value: "org-1" } });
    fireEvent.change(within(dialog).getByLabelText("Role"), { target: { value: "teacher" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add role" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/superadmin/users/u-1/roles/",
        { organization_id: "org-1", role: "teacher" },
        { auth: true }
      )
    );
  });

  it("handles a plain-array response", async () => {
    routeGets(http, {
      "/api/superadmin/users/": [USER],
      "/api/superadmin/organizations/": [ORG],
    });
    renderPage();
    expect(await screen.findByText("Ada Obi")).toBeTruthy();
  });

  const menuLabels = async (name) => {
    fireEvent.click(await screen.findByRole("button", { name: `Actions for ${name}` }));
    const labels = within(screen.getByRole("menu")).getAllByRole("menuitem").map((el) => el.textContent);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    return labels;
  };

  it("offers 'Delete permanently…' for ordinary users only", async () => {
    renderPage();
    expect(await menuLabels("Ada Obi")).toContain("Delete permanently…");
    expect(await menuLabels("Platform Admin")).not.toContain("Delete permanently…");
  });

  it("hides delete for yourself", async () => {
    getStoredUser.mockReturnValue({ id: "u-1", email: USER.email });
    renderPage();
    expect(await menuLabels("Ada Obi")).not.toContain("Delete permanently…");
    getStoredUser.mockReturnValue({ id: "u-9", email: "me@example.com" });
  });

  it("deletes a user after typing their email", async () => {
    routeGets(http, {
      "/api/superadmin/users/u-1/delete-check/": { can_delete: true, reason: null, blockers: {}, related: { "school roles": 1, submissions: 12 } },
      "/api/superadmin/users/": paginated([USER, SUPERUSER]),
      "/api/superadmin/organizations/": paginated([ORG]),
    });
    http.del.mockResolvedValue(null);
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for Ada Obi" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Delete permanently…" }));
    const dialog = screen.getByRole("alertdialog");
    expect(await within(dialog).findByText("12 submissions")).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText(`Type ${USER.email} to confirm`), { target: { value: USER.email } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete permanently" }));
    await waitFor(() => expect(http.del).toHaveBeenCalledWith("/api/superadmin/users/u-1/", { auth: true }));
  });

  it("offers delete from the user's view modal too", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Ada Obi" }));
    const view = screen.getByRole("dialog");
    fireEvent.click(within(view).getByRole("button", { name: "Delete permanently…" }));
    expect(await screen.findByRole("alertdialog", { name: /Delete Ada Obi permanently/ })).toBeTruthy();
  });
});
