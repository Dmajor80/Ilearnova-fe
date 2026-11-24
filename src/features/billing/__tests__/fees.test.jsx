import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import MyFees from "../MyFees";
import SchoolFeesPage from "../SchoolFeesPage";
import { amountProblem } from "../subscriptionUtils";

const TUITION = {
  id: "fee-1",
  student_id: "ada",
  student_name: "Ada Obi",
  organization_name: "Sunrise College",
  fee_type: "tuition",
  academic_year: "2026/2027",
  semester: "First Term",
  total_amount: "150000.00",
  paid_amount: "50000.00",
  pending_amount: "100000.00",
  status: "partial",
  due_date: "2026-12-15",
  can_pay_online: true,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("amountProblem", () => {
  it("allows part payments up to the balance", () => {
    expect(amountProblem("40000", "100000.00")).toBe("");
    expect(amountProblem("100001", "100000.00")).toMatch(/most you can pay is ₦100,000/);
    expect(amountProblem("0", "100")).toMatch(/above/);
  });
});

describe("MyFees", () => {
  it("lets a parent pay part of a balance through Paystack", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    http.get.mockResolvedValue({ count: 1, results: [TUITION] });
    http.post.mockResolvedValue({ success: true, data: { authorization_url: "https://checkout.paystack.com/x" } });

    render(<MyFees />);
    expect(await screen.findByText("Outstanding:")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    fireEvent.change(screen.getByLabelText("Amount (₦)"), { target: { value: "40000" } });
    fireEvent.click(screen.getByRole("button", { name: "Pay ₦40,000" }));

    await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.paystack.com/x"));
    expect(http.post).toHaveBeenCalledWith("/api/billing/fees/fee-1/pay/", { amount: "40000" }, { auth: true });
  });

  it("pays the full balance without an amount and says when only the school takes payment", async () => {
    vi.stubGlobal("location", { ...window.location, assign: vi.fn() });
    http.get.mockResolvedValue({
      count: 2,
      results: [TUITION, { ...TUITION, id: "fee-2", fee_type: "transport", can_pay_online: false }],
    });
    http.post.mockResolvedValue({ success: true, data: { authorization_url: "u" } });
    render(<MyFees />);
    expect(await screen.findByText("Pay at school")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    fireEvent.click(screen.getByRole("button", { name: "Pay ₦100,000" }));
    await waitFor(() => expect(http.post).toHaveBeenCalledWith("/api/billing/fees/fee-1/pay/", {}, { auth: true }));
  });
});

describe("SchoolFeesPage", () => {
  const routes = (path) => {
    if (path === "/api/results/classes/") return Promise.resolve({ success: true, data: [{ id: "c1", name: "JSS2A" }] });
    if (path === "/api/billing/school/fees/") return Promise.resolve({ count: 1, results: [TUITION] });
    return Promise.resolve({ count: 0, results: [] });
  };

  it("bills a whole class", async () => {
    http.get.mockImplementation(routes);
    http.post.mockResolvedValue({ success: true, data: { created: [{}, {}, {}], skipped: 1 } });
    render(<SchoolFeesPage />);

    fireEvent.change(await screen.findByLabelText("Class"), { target: { value: "c1" } });
    fireEvent.change(screen.getByLabelText("Amount per student (₦)"), { target: { value: "150000" } });
    fireEvent.change(screen.getByLabelText("Due date"), { target: { value: "2026-12-15" } });
    fireEvent.click(screen.getByRole("button", { name: /Bill class/ }));

    expect(await screen.findByText("Billed 3 student(s) in JSS2A. 1 already had this fee.")).toBeTruthy();
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe("/api/billing/school/fees/assign-class/");
    expect(body).toMatchObject({ class_id: "c1", fee_type: "tuition", total_amount: "150000", semester: "First Term" });
  });

  it("records a cash payment on top of what was already paid", async () => {
    http.get.mockImplementation(routes);
    http.patch.mockResolvedValue({});
    render(<SchoolFeesPage />);

    fireEvent.click(await screen.findByRole("button", { name: "Record payment" }));
    fireEvent.change(screen.getByLabelText("Amount received (₦)"), { target: { value: "25000" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(http.patch).toHaveBeenCalledWith("/api/billing/school/fees/fee-1/", { paid_amount: "75000.00" }, { auth: true })
    );
  });
});
