import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Subscriptions from "../Subscriptions";

const renderPage = (url = "/admin-dashboard/subscriptions") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Subscriptions />
    </MemoryRouter>
  );
const menuItem = async (rowLabel, item) => {
  fireEvent.click(await screen.findByRole("button", { name: `Actions for ${rowLabel}` }));
  fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: item }));
};

const ANNUAL = { id: "p1", code: "annual", name: "Annual", amount: "120000.00", duration_days: 365, is_active: true };
const SCHOOL = { organization_id: "org-1", organization_name: "Sunrise College", state: "locked", expires_at: "2027-03-31T00:00:00Z" };
const CODE = {
  id: "c1",
  code: "ILN-AAAA-BBBB-CCCC",
  issued_to: "principal@sunrise.ng",
  email_locked: true,
  school_name: "Sunrise College",
  plan: "annual",
  is_redeemable: true,
  redeemed_at: null,
};

beforeEach(() => {
  http.get.mockImplementation((path) => {
    if (path.endsWith("/plans/")) return Promise.resolve({ count: 1, results: [ANNUAL] });
    if (path.endsWith("/schools/")) return Promise.resolve({ count: 1, results: [SCHOOL] });
    if (path.endsWith("/access-codes/")) return Promise.resolve({ count: 1, results: [CODE] });
    if (path === "/api/superadmin/organizations/org-1/")
      return Promise.resolve({ id: "org-1", name: "Sunrise College", admins: [{ id: "u1", email: "head@sunrise.ng", full_name: "Ada Head" }] });
    return Promise.resolve({});
  });
  http.post.mockResolvedValue({});
  http.del.mockResolvedValue({});
  http.patch.mockResolvedValue({});
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Superadmin subscriptions", () => {
  it("renews a locked school after a bank transfer", async () => {
    renderPage();
    await menuItem("Sunrise College", "Renew");
    const dialog = screen.getByRole("dialog");
    await within(dialog).findByRole("option", { name: /Annual/ });
    fireEvent.change(within(dialog).getByLabelText("Note"), { target: { value: "Transfer ref 123" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Renew" }));

    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/superadmin/subscriptions/",
        { organization: "org-1", plan: "annual", notes: "Transfer ref 123" },
        { auth: true }
      )
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("invites a principal with a code only they can use", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Invite a school" }));
    await screen.findByRole("option", { name: /Annual/ });
    fireEvent.change(screen.getByLabelText("Email of the person setting up the school"), { target: { value: "principal@sunrise.ng" } });
    fireEvent.change(screen.getByLabelText("School name"), { target: { value: "Sunrise College" } });
    fireEvent.change(screen.getByLabelText("Plan"), { target: { value: "annual" } });
    fireEvent.click(screen.getByRole("button", { name: /Send invite/ }));

    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe("/api/billing/superadmin/access-codes/");
    expect(body).toMatchObject({
      count: 1,
      issued_to: "principal@sunrise.ng",
      email_locked: true,
      school_name: "Sunrise College",
      plan: "annual",
    });
    expect(await screen.findByText("Access code emailed to principal@sunrise.ng.")).toBeTruthy();
  });

  it("can grant to an email instead of sending a code", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Invite a school" }));
    fireEvent.click(screen.getByLabelText("Grant to an email"));
    fireEvent.change(screen.getByLabelText("Email of the person setting up the school"), { target: { value: "owner@hill.ng" } });
    fireEvent.change(screen.getByLabelText(/^Days/), { target: { value: "90" } });
    fireEvent.click(screen.getByRole("button", { name: /Grant subscription/ }));

    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/superadmin/subscriptions/",
        { email: "owner@hill.ng", notes: "", duration_days: 90 },
        { auth: true }
      )
    );
  });

  it("resends and deactivates unused codes", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Access codes" }));
    await menuItem(CODE.code, "Resend");
    expect(http.post).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Resend" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/billing/superadmin/access-codes/c1/send/", {}, { auth: true })
    );
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await menuItem(CODE.code, "Deactivate");
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Deactivate" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/billing/superadmin/access-codes/c1/", { auth: true })
    );
  });

  it("lists plans in a table and creates one from a modal with an auto code", async () => {
    renderPage("/admin-dashboard/subscriptions?tab=plans");
    const row = (await screen.findByText("Annual")).closest("tr");
    expect(within(row).getByText("₦120,000")).toBeTruthy();
    expect(within(row).getByText("1 year")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Create plan" }));
    const dialog = screen.getByRole("dialog", { name: "Create plan" });
    fireEvent.change(within(dialog).getByLabelText(/^Name/), { target: { value: "Term Plan Plus" } });
    expect(within(dialog).getByLabelText(/^Code/).value).toBe("term-plan-plus");
    fireEvent.change(within(dialog).getByLabelText(/^Price/), { target: { value: "45000" } });
    fireEvent.change(within(dialog).getByLabelText(/^Description/), { target: { value: "One term" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create plan" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/superadmin/plans/",
        { name: "Term Plan Plus", code: "term-plan-plus", amount: "45000", duration_days: null, description: "One term" },
        { auth: true }
      )
    );
  });

  it("opens the create-plan modal from ?new=1", async () => {
    renderPage("/admin-dashboard/subscriptions?tab=plans&new=1");
    expect(await screen.findByRole("dialog", { name: "Create plan" })).toBeTruthy();
  });

  it("edits and deactivates a plan through the actions menu", async () => {
    renderPage("/admin-dashboard/subscriptions?tab=plans");
    await menuItem("Annual", "Edit");
    const dialog = screen.getByRole("dialog", { name: "Edit Annual" });
    fireEvent.change(within(dialog).getByLabelText(/^Price/), { target: { value: "150000" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save plan" }));
    await waitFor(() =>
      expect(http.patch).toHaveBeenCalledWith(
        "/api/billing/superadmin/plans/p1/",
        expect.objectContaining({ amount: "150000", code: "annual" }),
        { auth: true }
      )
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await menuItem("Annual", "Deactivate");
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Deactivate" }));
    await waitFor(() => expect(http.del).toHaveBeenCalledWith("/api/billing/superadmin/plans/p1/", { auth: true }));
  });

  it("explains both routes and emails the school's admin a code instead of extending", async () => {
    renderPage();
    await menuItem("Sunrise College", "Renew");
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("Extend now").checked).toBe(true);
    expect(within(dialog).getByText(/Adds the time straight away/)).toBeTruthy();
    fireEvent.click(within(dialog).getByLabelText("Email them a code"));
    expect(within(dialog).getByText(/They apply it on their Billing page/)).toBeTruthy();
    const email = within(dialog).getByLabelText("Send the code to");
    await waitFor(() => expect(email.value).toBe("head@sunrise.ng"));
    fireEvent.change(email, { target: { value: "bursar@sunrise.ng" } });
    await within(dialog).findByRole("option", { name: /Annual/ });
    fireEvent.click(within(dialog).getByRole("button", { name: "Email code" }));

    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe("/api/billing/superadmin/access-codes/");
    expect(body).toMatchObject({ count: 1, organization: "org-1", issued_to: "bursar@sunrise.ng", plan: "annual" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(http.post).not.toHaveBeenCalledWith("/api/billing/superadmin/subscriptions/", expect.anything(), expect.anything());
  });

  it("shows plan names in the access codes table", async () => {
    http.get.mockImplementation((path) => {
      if (path.endsWith("/plans/")) return Promise.resolve({ count: 1, results: [ANNUAL] });
      if (path.endsWith("/access-codes/"))
        return Promise.resolve({
          count: 3,
          results: [
            { ...CODE, id: "a", code: "ILN-NAME-0000-0001", plan: "term", plan_name: "Term Plan" },
            { ...CODE, id: "b", code: "ILN-LOOK-0000-0002", plan: "annual" },
            { ...CODE, id: "c", code: "ILN-RAWC-0000-0003", plan: "legacy" },
            { ...CODE, id: "d", code: "ILN-DAYS-0000-0004", plan: null, plan_name: null, duration_days: 30 },
          ],
        });
      return Promise.resolve({});
    });
    renderPage("/admin-dashboard/subscriptions?tab=codes");
    const row = async (code) => (await screen.findByText(code)).closest("tr");
    expect(within(await row("ILN-NAME-0000-0001")).getByText("Term Plan")).toBeTruthy();
    await waitFor(async () => expect(within(await row("ILN-LOOK-0000-0002")).getByText("Annual")).toBeTruthy());
    expect(within(await row("ILN-RAWC-0000-0003")).getByText("legacy")).toBeTruthy();
    expect(within(await row("ILN-DAYS-0000-0004")).getByText("30 days, no plan")).toBeTruthy();
  });
});
