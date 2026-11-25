import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Subscriptions from "../Subscriptions";

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
    return Promise.resolve({});
  });
  http.post.mockResolvedValue({});
  http.del.mockResolvedValue({});
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Superadmin subscriptions", () => {
  it("renews a locked school after a bank transfer", async () => {
    render(<Subscriptions />);
    fireEvent.click(await screen.findByRole("button", { name: "Renew" }));
    await screen.findByRole("option", { name: /Annual/ });
    fireEvent.change(screen.getByLabelText("Note"), { target: { value: "Transfer ref 123" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Renew" }).at(-1));

    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/superadmin/subscriptions/",
        { organization: "org-1", plan: "annual", notes: "Transfer ref 123" },
        { auth: true }
      )
    );
    expect(await screen.findByText("Sunrise College renewed.")).toBeTruthy();
  });

  it("invites a principal with a code only they can use", async () => {
    render(<Subscriptions />);
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
    render(<Subscriptions />);
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
    render(<Subscriptions />);
    fireEvent.click(screen.getByRole("tab", { name: "Access codes" }));
    fireEvent.click(await screen.findByRole("button", { name: /Resend/ }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/billing/superadmin/access-codes/c1/send/", {}, { auth: true })
    );
    fireEvent.click(screen.getByRole("button", { name: /Deactivate/ }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/billing/superadmin/access-codes/c1/", { auth: true })
    );
  });
});
