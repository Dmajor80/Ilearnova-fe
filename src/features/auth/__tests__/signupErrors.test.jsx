/**
 * Bug: signing up with an email or username that already has an account
 * showed "Something went wrong" instead of the server's reason. The register
 * endpoints answer with plain DRF errors ({ email: [...], username: [...] }),
 * and the form only read { field_errors }.
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(() => Promise.resolve({})), post: vi.fn(() => Promise.resolve({})) },
}));
vi.mock("@/api/authApi", () => ({
  getOrganizations: vi.fn(() => Promise.resolve({ results: [] })),
  resendOtp: vi.fn(),
  registerTeacher: vi.fn(),
  registerStudent: vi.fn(),
  registerParent: vi.fn(),
  registerIndividualLearner: vi.fn(),
}));
vi.mock("@/api/auth", () => ({ persistAuthResponse: vi.fn(), getTokens: () => ({}), getStoredUser: () => null }));

import * as authApi from "@/api/authApi";
import SignupForm from "../SignupForm";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const apiError = (status, data) => Object.assign(new Error("Something went wrong. Please try again."), { status, data });

function submitIndividual() {
  render(<MemoryRouter initialEntries={["/signup"]}><SignupForm /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: /^individual learner/i }));
  const fill = (name, value) => fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { value } });
  fill("first_name", "Tunde");
  fill("last_name", "Bello");
  fill("username", "tunde");
  fill("email", "tunde@sunrise.example.com");
  fill("date_of_birth", "1990-05-01");
  fill("password", "Joiner-Pass-2026");
  fill("password_confirmation", "Joiner-Pass-2026");
  fireEvent.submit(document.querySelector("form"));
}

describe("sign-up errors from the server", () => {
  it("shows why the email and username were refused (plain DRF errors)", async () => {
    authApi.registerIndividualLearner.mockRejectedValue(
      apiError(400, {
        email: ["An account with this email already exists. Log in instead, or use Forgot password."],
        username: ["This username is taken. Choose another."],
      })
    );
    submitIndividual();
    expect((await screen.findAllByText(/An account with this email already exists/)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/This username is taken/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/something went wrong/i)).toBeNull();
  });

  it("also understands the wrapped { field_errors } shape", async () => {
    authApi.registerIndividualLearner.mockRejectedValue(
      apiError(400, {
        success: false,
        error: "Request failed",
        message: "Validation failed",
        field_errors: { email: ["An account with this email already exists."] },
        non_field_errors: [],
      })
    );
    submitIndividual();
    expect((await screen.findAllByText(/An account with this email already exists/)).length).toBeGreaterThan(0);
    expect(screen.queryByText(/something went wrong|validation failed|request failed/i)).toBeNull();
  });

  it("puts the email message next to the email field", async () => {
    authApi.registerIndividualLearner.mockRejectedValue(
      apiError(400, { email: ["An account with this email already exists."] })
    );
    submitIndividual();
    await waitFor(() => expect(authApi.registerIndividualLearner).toHaveBeenCalled());
    const email = document.querySelector('[name="email"]');
    const field = email.closest("div.mb-6, div");
    await waitFor(() => expect(field.parentElement.textContent).toMatch(/An account with this email already exists/));
  });
});
