/**
 * The Parents tab: the old "Delete" button only suspended the parent. It now
 * offers the same choices as Students and Teachers: suspend, remove from the
 * school, or delete a mistaken account permanently.
 */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import OrganizationOperations from "../OrganizationOperations";

const NGOZI = { id: "p-ngozi", full_name: "Ngozi Eze", email: "ngozi@x.ng", children_count: 2, status: "active", membership_id: "m-ngozi" };
const COUNTS = { all: 1, active: 1, pending: 0, suspended: 0 };

beforeEach(() => {
  window.localStorage.setItem(
    "user_data",
    JSON.stringify({ id: "me", roles: [{ role: { code: "org_admin" }, organization: { id: "o1", name: "Sunrise College", code: "SUN12345" } }] })
  );
  http.get.mockImplementation((path) =>
    Promise.resolve(
      path.startsWith("/api/admin/school/parent-links")
        ? { success: true, data: { parent_links: [], pagination: { total: 0 } } }
        : path.startsWith("/api/admin/school/parents")
          ? { success: true, data: { parents: [NGOZI], counts: COUNTS, pagination: { page: 1, pages: 1, total: 1 } } }
          : {}
    )
  );
  http.post.mockResolvedValue({ success: true, data: {} });
  http.del.mockResolvedValue({ success: true, message: "Ngozi Eze was removed from Sunrise College." });
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

const openRowMenu = async () => {
  const row = (await screen.findByText("Ngozi Eze")).closest("tr");
  fireEvent.click(within(row).getByRole("button", { name: "Actions for Ngozi Eze" }));
  return row;
};

describe("Parents tab", () => {
  it("has no misleading Delete button; the row menu names what each action does", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    const row = await openRowMenu();
    expect(within(row).queryByRole("button", { name: /^delete$/i })).toBeNull();
    expect(screen.getAllByRole("menuitem").map((i) => i.textContent)).toEqual([
      "Edit",
      "Suspend…",
      "Remove from school…",
      "Delete permanently…",
    ]);
    expect(within(row).getByText("2")).toBeTruthy(); // children
  });

  // There is no parent import, so the shared people list must not offer one.
  it("offers Invite but no Import for parents", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    await openRowMenu();
    expect(screen.getByRole("button", { name: /^invite/i })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^import/i })).toBeNull();
  });

  it("suspends a parent", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    await openRowMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Suspend…" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Suspend" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/admin/school/parents/p-ngozi/suspend/", {}, { auth: true })
    );
  });

  it("removes a parent from the school", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    await openRowMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove from school…" }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("they lose access to Sunrise College");
    fireEvent.click(within(dialog).getByRole("button", { name: "Remove from school" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/admin/school/parents/p-ngozi/", { auth: true })
    );
  });

  it("checks before deleting a parent permanently", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    await openRowMenu();
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete permanently…" }));
    await waitFor(() =>
      expect(http.get).toHaveBeenCalledWith("/api/admin/school/parents/p-ngozi/delete-check/", { auth: true })
    );
  });
});
