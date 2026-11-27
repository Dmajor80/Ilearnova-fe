import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INACTIVE_ORG, ORG, SUPERUSER, USER, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/auth", () => ({ getStoredUser: vi.fn(() => ({ id: "u-9", email: "me@example.com" })) }));

import { http } from "@/api/baseClient";
import Organizations from "../Organizations";
import Users from "../Users";

const at = (path, element) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={element} />
      </Routes>
    </MemoryRouter>
  );

// One page of two shown, five match in total (so "Select all 5" appears).
const page = (results, count = results.length) => ({ count, next: count > results.length ? "?page=2" : null, previous: null, results });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Users: select and delete many", () => {
  beforeEach(() => {
    routeGets(http, {
      "/api/superadmin/users/ids/": { count: 5, ids: ["u-1", "u-2", "u-3", "u-4", "u-5"] },
      "/api/superadmin/users/": page([USER, SUPERUSER], 5),
      "/api/superadmin/organizations/": page([ORG]),
    });
  });

  it("selects rows one by one or the whole page", async () => {
    at("/admin-dashboard/users", <Users />);
    await screen.findByRole("table");
    expect(screen.queryByRole("region", { name: "Selection" })).toBeNull();

    fireEvent.click(screen.getByRole("checkbox", { name: "Select Ada Obi" }));
    expect(within(screen.getByRole("region", { name: "Selection" })).getByText("1 user selected")).toBeTruthy();

    const pageBox = screen.getByRole("checkbox", { name: "Select all users on this page" });
    expect(pageBox.indeterminate).toBe(true);
    fireEvent.click(pageBox);
    expect(screen.getByText("2 users selected")).toBeTruthy();
    expect(pageBox.checked).toBe(true);

    fireEvent.click(pageBox); // untick the page
    expect(screen.queryByRole("region", { name: "Selection" })).toBeNull();
  });

  it("selects every matching user across pages with the current filters", async () => {
    at("/admin-dashboard/users", <Users />);
    await screen.findByRole("table");
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "student" } });
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "Select all users on this page" })).toBeTruthy());
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all users on this page" }));
    fireEvent.click(screen.getByRole("button", { name: "Select all 5 users" }));
    expect(await screen.findByText("5 users selected")).toBeTruthy();
    const idsCall = http.get.mock.calls.find(([path]) => path === "/api/superadmin/users/ids/");
    expect(idsCall[1].params).toMatchObject({ role: "student" });
  });

  it("previews, needs DELETE typed, deletes, and reports who was kept and why", async () => {
    http.post.mockImplementation((path) => {
      if (path.endsWith("bulk-delete-check/")) {
        return Promise.resolve({
          deletable: 1,
          blocked: 1,
          related: { "school roles": 1, submissions: 3, students: 1 },
          items: [
            { id: "u-1", name: "Ada Obi", reason: null },
            { id: "u-2", name: "Platform Admin", reason: "This is the last active superuser; make another superuser before deleting this account." },
          ],
        });
      }
      if (path.endsWith("bulk-delete/")) {
        return Promise.resolve({
          deleted: ["u-1"],
          skipped: [{ id: "u-2", name: "Platform Admin", reason: "This is the last active superuser; make another superuser before deleting this account." }],
        });
      }
      return Promise.resolve({});
    });
    at("/admin-dashboard/users", <Users />);
    await screen.findByRole("table");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all users on this page" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete selected" }));

    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByText("Delete 2 users permanently?")).toBeTruthy();
    expect(await within(dialog).findByText("3 submissions")).toBeTruthy();
    expect(within(dialog).getByText("1 school role")).toBeTruthy();
    expect(within(dialog).getByText("1 student")).toBeTruthy();
    expect(within(dialog).getByText(/will be deleted/).textContent).toBe("1 user will be deleted; 1 can't be and will be kept.");
    expect(within(dialog).getByRole("list", { name: "Will be kept" }).textContent).toMatch(/Platform Admin: This is the last active superuser/);

    const confirm = within(dialog).getByRole("button", { name: "Delete 1 user" });
    expect(confirm.disabled).toBe(true);
    fireEvent.change(within(dialog).getByLabelText(/to confirm/), { target: { value: "DELETE" } });
    expect(confirm.disabled).toBe(false);
    fireEvent.click(confirm);

    expect(await within(dialog).findByText("1 user deleted, 1 kept.")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith("/api/superadmin/users/bulk-delete/", { ids: ["u-1", "u-2"] }, { auth: true });
    // The kept user stays selected so it's clear which one is left.
    fireEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    expect(screen.getByText("1 user selected")).toBeTruthy();
  });

  it("can't delete when nothing in the selection is deletable", async () => {
    http.post.mockResolvedValue({
      deletable: 0,
      blocked: 1,
      related: {},
      items: [{ id: "u-2", name: "Platform Admin", reason: "You cannot delete yourself." }],
    });
    at("/admin-dashboard/users", <Users />);
    await screen.findByRole("table");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Platform Admin" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete selected" }));
    const dialog = await screen.findByRole("alertdialog");
    const kept = await within(dialog).findByRole("list", { name: "Will be kept" });
    expect(kept.textContent).toBe("Platform Admin: You cannot delete yourself.");
    expect(within(dialog).queryByLabelText(/to confirm/)).toBeNull();
    expect(within(dialog).getByRole("button", { name: "Delete" }).disabled).toBe(true);
  });
});

describe("Organizations: select and delete many", () => {
  beforeEach(() => {
    routeGets(http, {
      "/api/superadmin/organizations/ids/": { count: 2, ids: ["org-1", "org-2"] },
      "/api/superadmin/organizations/": page([ORG, INACTIVE_ORG]),
    });
    http.post.mockImplementation((path) =>
      Promise.resolve(
        path.endsWith("bulk-delete-check/")
          ? { deletable: 2, blocked: 0, related: { students: 24, classes: 2 }, items: [{ id: "org-1", name: ORG.name, reason: null }, { id: "org-2", name: INACTIVE_ORG.name, reason: null }] }
          : { deleted: ["org-1", "org-2"], skipped: [] }
      )
    );
  });

  it("deletes the selected schools after DELETE is typed", async () => {
    at("/admin-dashboard/organizations", <Organizations />);
    await screen.findByRole("table");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all schools on this page" }));
    expect(screen.getByText("2 schools selected")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Delete selected" }));
    const dialog = await screen.findByRole("alertdialog");
    expect(await within(dialog).findByText("24 students")).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText(/to confirm/), { target: { value: "DELETE" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete 2 schools" }));
    expect(await within(dialog).findByText("2 schools deleted.")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith("/api/superadmin/organizations/bulk-delete/", { ids: ["org-1", "org-2"] }, { auth: true });
  });

  it("clears the selection when the search changes", async () => {
    at("/admin-dashboard/organizations", <Organizations />);
    await screen.findByRole("table");
    fireEvent.click(screen.getByRole("checkbox", { name: `Select ${ORG.name}` }));
    expect(screen.getByText("1 school selected")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Search schools"), { target: { value: "green" } });
    await waitFor(() => expect(screen.queryByText("1 school selected")).toBeNull());
  });
});
