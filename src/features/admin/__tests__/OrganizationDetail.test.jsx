import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ORG, paginated, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import OrganizationDetail from "../OrganizationDetail";

beforeEach(() => {
  routeGets(http, {
    "/api/superadmin/organizations/org-1/delete-check/": { can_delete: true, reason: null, blockers: {}, related: { classes: 2 } },
    "/api/superadmin/organizations/org-1/": ORG,
    "/api/billing/superadmin/schools/": paginated([]),
  });
  http.del.mockResolvedValue(null);
  http.post.mockResolvedValue({});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OrganizationDetail", () => {
  it("deletes the school permanently and goes back to the list", async () => {
    render(
      <MemoryRouter initialEntries={["/admin-dashboard/organizations/org-1"]}>
        <Routes>
          <Route path="/admin-dashboard/organizations/:organizationId" element={<OrganizationDetail />} />
          <Route path="/admin-dashboard/organizations" element={<p>School list</p>} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(await screen.findByRole("button", { name: `More actions for ${ORG.name}` }));
    const menu = screen.getByRole("menu");
    const labels = within(menu).getAllByRole("menuitem").map((el) => el.textContent);
    expect(labels.slice(-2)).toEqual(["Deactivate", "Delete permanently…"]);
    fireEvent.click(within(menu).getByRole("menuitem", { name: "Delete permanently…" }));
    const dialog = screen.getByRole("alertdialog");
    fireEvent.change(await within(dialog).findByLabelText(`Type ${ORG.name} to confirm`), { target: { value: ORG.name } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete permanently" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/superadmin/organizations/org-1/", { auth: true, params: { permanent: "true" } })
    );
    expect(await screen.findByText("School list")).toBeTruthy();
  });
});
