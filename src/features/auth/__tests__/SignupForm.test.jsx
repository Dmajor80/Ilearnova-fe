import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/authApi", () => ({
  getOrganizations: vi.fn(() => Promise.resolve([])),
  resendOtp: vi.fn(),
}));
vi.mock("@/api/baseClient", () => ({ http: { get: vi.fn(() => Promise.resolve({})), post: vi.fn() } }));

import SignupForm from "../SignupForm";

afterEach(cleanup);

describe("SignupForm", () => {
  it("marks Date of Birth as required, like the other required fields", () => {
    // Found clicking through: the form refused to submit without a date of
    // birth, but its label had no asterisk (and was not tied to the input).
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/Date of Birth/);
    expect(input.required).toBe(true);
    expect(input.closest("div").parentElement.querySelector("label").textContent).toContain("*");
  });
});
