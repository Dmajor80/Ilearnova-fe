import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/authApi", () => ({
  getOrganizations: vi.fn().mockResolvedValue({ results: [] }),
  resendOtp: vi.fn(),
  registerOrgAdmin: vi.fn(),
}));
vi.mock("@/api/auth", () => ({ persistAuthResponse: vi.fn(), getTokens: () => ({ access: null }) }));

import { http } from "@/api/baseClient";
import * as authApi from "@/api/authApi";
import AccessCodeField from "../AccessCodeField";
import PricingPage from "../PricingPage";
import SignupForm from "@/features/auth/SignupForm";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

const inRouter = (ui, path = "/") => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="*" element={ui} />
    </Routes>
  </MemoryRouter>
);

describe("AccessCodeField", () => {
  it("checks the code as it is typed without redeeming it", async () => {
    http.post.mockResolvedValue({ success: true, data: { valid: true, plan: "annual", plan_name: "School annual", duration_days: 365, school_name: "Sunrise College" } });
    render(inRouter(<AccessCodeField value="ILN-AAAA-BBBB-CCCC" email="head@sunrise.ng" onChange={() => {}} />));
    expect(await screen.findByText(/Valid code · School annual · 1 year · for Sunrise College/)).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith(
      "/api/billing/access-codes/check/",
      { code: "ILN-AAAA-BBBB-CCCC", email: "head@sunrise.ng" },
      { auth: false }
    );
  });

  it("says when a code cannot be used", async () => {
    http.post.mockResolvedValue({ success: true, data: { valid: false } });
    render(inRouter(<AccessCodeField value="ILN-NOPE-NOPE-NOPE" onChange={() => {}} />));
    expect(await screen.findByText(/invalid, expired, used, or was issued to a different email/)).toBeTruthy();
  });

  it("points to plans when there is no code", () => {
    render(inRouter(<AccessCodeField value="" onChange={() => {}} />));
    expect(screen.getByRole("link", { name: "Need a subscription?" }).getAttribute("href")).toBe("/pricing");
  });
});

describe("SignupForm from an invite link", () => {
  const link = "/register/school?code=ILN-AAAA-BBBB-CCCC&email=principal%40sunrise.ng";

  it("pre-fills the school admin form with the email and code", async () => {
    http.post.mockResolvedValue({ success: true, data: { valid: true, duration_days: 365 } });
    render(inRouter(<SignupForm />, link));
    expect(screen.getByLabelText("Access code").value).toBe("ILN-AAAA-BBBB-CCCC");
    expect(screen.getByDisplayValue("principal@sunrise.ng")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter organization name")).toBeTruthy();
  });

  it("shows the backend's reason next to the code", async () => {
    http.post.mockResolvedValue({ success: true, data: { valid: true } });
    const error = new Error("Validation failed");
    error.status = 400;
    error.data = { field_errors: { access_code: ["This access code was issued to a different email address."] } };
    authApi.registerOrgAdmin.mockRejectedValue(error);

    const { container } = render(inRouter(<SignupForm />, link));
    const fill = (name, value) => {
      const input = container.querySelector(`[name="${name}"]`);
      if (input) fireEvent.change(input, { target: { value } });
    };
    fill("first_name", "Ngozi");
    fill("last_name", "Eze");
    fill("username", "ngozi");
    fill("password", "S3cure-pass!");
    fill("password_confirmation", "S3cure-pass!");
    fill("organization_name", "Sunrise College");
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(authApi.registerOrgAdmin).toHaveBeenCalled());
    expect(authApi.registerOrgAdmin.mock.calls[0][0]).toMatchObject({
      email: "principal@sunrise.ng",
      organization_name: "Sunrise College",
      access_code: "ILN-AAAA-BBBB-CCCC",
    });
    expect((await screen.findAllByText("This access code was issued to a different email address.")).length).toBeGreaterThan(0);
  });
});

describe("PricingPage", () => {
  it("buys a plan for a new school through Paystack", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    http.get.mockResolvedValue([{ code: "annual", name: "Annual", amount: "120000.00", duration_days: 365 }]);
    http.post.mockResolvedValue({ success: true, data: { authorization_url: "https://checkout.paystack.com/p" } });

    render(inRouter(<PricingPage />));
    fireEvent.click(await screen.findByRole("button", { name: /Annual/ }));
    const pay = screen.getByRole("button", { name: "Pay ₦120,000 with Paystack" });
    expect(pay.disabled).toBe(true); // needs an email
    fireEvent.change(screen.getByLabelText("Email for the access code"), { target: { value: "owner@sunrise.ng" } });
    fireEvent.click(pay);

    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.paystack.com/p"));
    expect(http.post).toHaveBeenCalledWith(
      "/api/billing/subscriptions/checkout/",
      { plan: "annual", email: "owner@sunrise.ng" },
      { auth: false }
    );
  });
});

describe("PricingPage plan cards", () => {
  // A plan without a description sat lower than its neighbours: button
  // content is centred vertically by default.
  it("top-aligns every card's content at equal heights", async () => {
    http.get.mockResolvedValue([
      { code: "annual", name: "Annual", amount: "120000.00", duration_days: 365, description: "Best value" },
      { code: "term", name: "Term", amount: "45000.00", duration_days: 120, description: "" },
    ]);
    render(inRouter(<PricingPage />));
    const term = await screen.findByRole("button", { name: /Term/ });
    for (const card of [term, screen.getByRole("button", { name: /Annual/ })]) {
      expect(card.className).toMatch(/\bflex\b/);
      expect(card.className).toMatch(/\bflex-col\b/);
      expect(card.className).toMatch(/\bjustify-start\b/);
      expect(card.className).toMatch(/\bh-full\b/);
    }
  });
});
