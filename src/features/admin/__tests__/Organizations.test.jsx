import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ORG, INACTIVE_ORG, paginated, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Organizations from "../Organizations";

function Where() {
  const location = useLocation();
  return <p data-testid="where">{location.pathname + location.search}</p>;
}

const renderPage = (url = "/admin-dashboard/organizations") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/admin-dashboard/organizations" element={<Organizations />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  window.sessionStorage.clear();
  routeGets(http, {
    "/api/superadmin/organizations/": paginated([ORG, INACTIVE_ORG]),
    "/api/billing/superadmin/plans/": paginated([{ id: "p1", code: "annual", name: "Annual", amount: "1000", duration_days: 365, is_active: true }]),
  });
  http.post.mockResolvedValue({});
  http.patch.mockResolvedValue({});
  http.del.mockResolvedValue({});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

const openActions = async (name) => {
  fireEvent.click(await screen.findByRole("button", { name: `Actions for ${name}` }));
  return screen.getByRole("menu");
};

describe("Organizations (superadmin)", () => {
  it("lists schools with counts and subscription state", async () => {
    renderPage();
    const row = (await screen.findByText("Greenfield Academy")).closest("tr");
    expect(within(row).getByText("24")).toBeTruthy();
    expect(within(row).getByText("4")).toBeTruthy();
    expect(within(row).getByText(/School annual/)).toBeTruthy();
  });

  it("deactivates through a custom confirm dialog, never window.confirm", async () => {
    const nativeConfirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Deactivate" }));
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText(/Deactivate Greenfield Academy\?/)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: "Deactivate" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/organizations/org-1/deactivate/", {}, { auth: true })
    );
    expect(http.del).not.toHaveBeenCalled();
    expect(nativeConfirm).not.toHaveBeenCalled();
  });

  it("reactivates an inactive school", async () => {
    renderPage();
    const menu = await openActions("Closed College");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Reactivate" }));
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Reactivate" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/organizations/org-2/activate/", {}, { auth: true })
    );
  });

  it("creates an organization from the modal form", async () => {
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /add school/i }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: "North School" } });
    fireEvent.change(within(dialog).getByLabelText(/^Code/), { target: { value: "NORTH" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create school" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/superadmin/organizations/",
        expect.objectContaining({ name: "North School", code: "NORTH", organization_type: "private" }),
        { auth: true }
      )
    );
  });

  it("opens the create form from ?new=1 (dashboard quick action)", async () => {
    renderPage("/admin-dashboard/organizations?new=1");
    expect(await screen.findByRole("dialog", { name: /add school/i })).toBeTruthy();
  });

  it("'Manage school' enters manage mode and goes to the org dashboard", async () => {
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Manage school" }));
    expect(JSON.parse(window.sessionStorage.getItem("ilearnova_managed_school"))).toEqual({
      id: "org-1",
      name: "Greenfield Academy",
    });
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/overview");
  });

  it("'View users' goes to Users filtered by the school", async () => {
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "View users" }));
    expect(screen.getByTestId("where").textContent).toBe("/admin-dashboard/users?organization_id=org-1");
  });

  it("'Manage subscription' renews the school", async () => {
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Manage subscription" }));
    const dialog = await screen.findByRole("dialog", { name: /Greenfield Academy/ });
    await within(dialog).findByRole("option", { name: /Annual/ });
    fireEvent.click(within(dialog).getByRole("button", { name: "Renew" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/superadmin/subscriptions/",
        { organization: "org-1", plan: "annual", notes: "" },
        { auth: true }
      )
    );
  });

  it("offers 'Delete permanently…' below Deactivate, separated", async () => {
    renderPage();
    const menu = await openActions("Greenfield Academy");
    const labels = within(menu).getAllByRole("menuitem").map((el) => el.textContent);
    expect(labels.slice(-2)).toEqual(["Deactivate", "Delete permanently…"]);
    const separators = within(menu).getAllByRole("separator");
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it("permanently deletes after typing the school name", async () => {
    const check = { can_delete: true, reason: null, blockers: {}, related: { students: 24, classes: 2 }, note: "User accounts are kept; they lose their role in this school." };
    routeGets(http, {
      "/api/superadmin/organizations/org-1/delete-check/": check,
      "/api/superadmin/organizations/": paginated([ORG, INACTIVE_ORG]),
    });
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Delete permanently…" }));
    const dialog = screen.getByRole("alertdialog");
    expect(await within(dialog).findByText("24 students")).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText(/Type Greenfield Academy to confirm/), { target: { value: "Greenfield Academy" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete permanently" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/superadmin/organizations/org-1/", { auth: true, params: { permanent: "true" } })
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("explains why a school with payments can't be deleted and offers to deactivate", async () => {
    routeGets(http, {
      "/api/superadmin/organizations/org-1/delete-check/": {
        can_delete: false,
        reason: "This school has financial or protected records (3 payments). Deactivate it instead so those records stay intact.",
        blockers: { payments: 3 },
        related: { students: 24 },
      },
      "/api/superadmin/organizations/": paginated([ORG, INACTIVE_ORG]),
    });
    renderPage();
    const menu = await openActions("Greenfield Academy");
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Delete permanently…" }));
    const alert = await within(screen.getByRole("alertdialog")).findByRole("alert");
    expect(alert.textContent).toMatch(/3 payments/);
    fireEvent.click(within(alert).getByRole("button", { name: "Deactivate instead" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/organizations/org-1/deactivate/", {}, { auth: true })
    );
    expect(http.del).not.toHaveBeenCalled();
  });
});
