import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/auth", () => ({ getTokens: vi.fn(() => ({ access: "token" })) }));

import { http } from "@/api/baseClient";
import { getTokens } from "@/api/auth";
import SubscriptionBanner from "../SubscriptionBanner";
import PaymentCallback from "../PaymentCallback";
import BillingPage from "../BillingPage";
import { TOAST_EVENT } from "@/lib/toast";
import { formatDate } from "../subscriptionUtils";

const LOCKED = {
  organization_id: "org-1",
  organization_name: "Sunrise College",
  is_admin: true,
  mode: "billing_only",
  state: "locked",
  expires_at: "2027-03-31T00:00:00Z",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SubscriptionBanner", () => {
  it("shows a renew prompt for a locked school's admin and reloads on 402", async () => {
    http.get.mockResolvedValue({ success: true, data: [LOCKED] });
    render(
      <MemoryRouter initialEntries={["/organization-dashboard/students"]}>
        <SubscriptionBanner />
      </MemoryRouter>
    );
    expect(await screen.findByText(/subscription has expired/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Renew" })).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/billing/subscription/status/", { auth: true });

    window.dispatchEvent(new CustomEvent("ilearnova:subscription-blocked"));
    await waitFor(() => expect(http.get).toHaveBeenCalledTimes(2));
  });

  it("stays quiet when signed out", async () => {
    getTokens.mockReturnValueOnce({ access: null });
    render(
      <MemoryRouter>
        <SubscriptionBanner />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(http.get).not.toHaveBeenCalled();
  });
});

describe("PaymentCallback", () => {
  const visit = (query) =>
    render(
      <MemoryRouter initialEntries={[`/payments/callback${query}`]}>
        <PaymentCallback />
      </MemoryRouter>
    );

  it("tells a new school's payer to check their email for the code", async () => {
    getTokens.mockReturnValue({ access: null });
    http.get.mockResolvedValue({
      success: true,
      data: { reference: "ILN-1", purpose: "subscription", status: "success", amount: "120000.00" },
    });
    visit("?trxref=ILN-1&reference=ILN-1");
    expect(await screen.findByText("Payment received: ₦120,000")).toBeTruthy();
    expect(screen.getByText(/emailed you an access code/)).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/billing/payments/ILN-1/verify/", { auth: false });
    getTokens.mockReturnValue({ access: "token" });
  });

  it("offers to check again while Paystack is still processing", async () => {
    http.get.mockResolvedValue({ success: true, data: { reference: "ILN-2", status: "pending" } });
    visit("?reference=ILN-2");
    fireEvent.click(await screen.findByRole("button", { name: "Check again" }));
    await waitFor(() => expect(http.get).toHaveBeenCalledTimes(2));
  });
});

describe("BillingPage", () => {
  it("renews with the chosen plan through Paystack", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    http.get.mockImplementation((path) => {
      if (path === "/api/billing/school/subscription/")
        return Promise.resolve({ success: true, data: { ...LOCKED, history: [] } });
      if (path === "/api/billing/plans/")
        return Promise.resolve([
          { code: "annual", name: "Annual", amount: "120000.00", duration_days: 365 },
          { code: "free", name: "Free", amount: "0.00", duration_days: 30 },
        ]);
      return Promise.resolve({ success: true, data: null });
    });
    http.post.mockResolvedValue({
      success: true,
      data: { reference: "ILN-3", authorization_url: "https://checkout.paystack.com/abc" },
    });

    render(<MemoryRouter><BillingPage /></MemoryRouter>);
    const pay = await screen.findByRole("button", { name: /Pay ₦120,000 with Paystack/ });
    expect(screen.queryByText(/Free/)).toBeNull(); // free plans are not on sale
    expect(screen.getByText("Locked")).toBeTruthy();

    fireEvent.click(pay);
    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.paystack.com/abc"));
    expect(http.post).toHaveBeenCalledWith(
      "/api/billing/school/subscription/renew/",
      { plan: "annual" },
      { auth: true }
    );
    vi.unstubAllGlobals();
  });
});

describe("Payout account bank list", () => {
  // Found clicking through: with Paystack not configured the bank list
  // request fails (503) and the dropdown said "Loading banks…" forever.
  it("explains when the bank list cannot load", async () => {
    http.get.mockImplementation((path) => {
      if (path === "/api/billing/school/banks/") {
        const error = new Error("Service Unavailable");
        error.status = 503;
        return Promise.reject(error);
      }
      if (path === "/api/billing/plans/") return Promise.resolve([]);
      return Promise.resolve({ success: true, data: null });
    });
    render(<MemoryRouter><BillingPage /></MemoryRouter>);
    expect(await screen.findByText(/Bank list unavailable/)).toBeTruthy();
    expect(screen.queryByText("Loading banks…")).toBeNull();
  });
});

describe("BillingPage access code", () => {
  const subscriptionGets = (subscription) =>
    http.get.mockImplementation((path) => {
      if (path === "/api/billing/school/subscription/")
        return Promise.resolve({ success: true, data: subscription });
      if (path === "/api/billing/plans/") return Promise.resolve([]);
      return Promise.resolve({ success: true, data: null });
    });
  const showAt = (url) =>
    render(
      <MemoryRouter initialEntries={[url]}>
        <BillingPage />
      </MemoryRouter>
    );

  it("prefills the code from ?code=, applies it, toasts and shows the new end date", async () => {
    subscriptionGets({ ...LOCKED, history: [] });
    const extended = { ...LOCKED, state: "active", expires_at: "2028-03-31T00:00:00Z", days_left: 490, history: [] };
    http.post.mockResolvedValue({ success: true, data: extended });
    const toasts = [];
    const onToast = (e) => toasts.push(e.detail);
    window.addEventListener(TOAST_EVENT, onToast);

    showAt("/organization-dashboard/billing?code=iln-aaaa-bbbb-cccc");
    const input = await screen.findByLabelText("Access code");
    expect(input.value).toBe("ILN-AAAA-BBBB-CCCC");
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.click(screen.getByRole("button", { name: "Apply code" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/billing/school/subscription/redeem/",
        { code: "ILN-AAAA-BBBB-CCCC" },
        { auth: true }
      )
    );
    await waitFor(() => expect(toasts).toEqual([{ message: `Subscription extended to ${formatDate("2028-03-31T00:00:00Z")}`, type: "success" }]));
    expect(screen.getByText("Active")).toBeTruthy();
    expect(screen.getByLabelText("Access code").value).toBe("");
    window.removeEventListener(TOAST_EVENT, onToast);
  });

  it("shows the server's reason when the code is refused", async () => {
    subscriptionGets({ ...LOCKED, history: [] });
    const error = new Error("Bad Request");
    error.status = 400;
    error.data = { error: "This code has already been used." };
    http.post.mockRejectedValue(error);

    showAt("/organization-dashboard/billing");
    const input = await screen.findByLabelText("Access code");
    expect(screen.getByRole("button", { name: "Apply code" }).disabled).toBe(true);
    fireEvent.change(input, { target: { value: "iln-used-code-0000" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply code" }));
    expect(await screen.findByText("This code has already been used.")).toBeTruthy();
    expect(screen.getByText("Locked")).toBeTruthy();
  });
});
