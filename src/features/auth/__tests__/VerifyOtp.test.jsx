/**
 * Bug: "Resend OTP" never reached the API. The click handler was named
 * resendOtp, shadowing the imported API call, so it called itself until the
 * stack overflowed.
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../api/authApi", () => ({ verifyOtp: vi.fn(), resendOtp: vi.fn(() => Promise.resolve({})) }));

import * as authApi from "../../../api/authApi";
import VerifyOtp from "../VerifyOtp";

beforeEach(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  sessionStorage.setItem("otp_email", "ada@example.com");
});
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe("VerifyOtp", () => {
  it("sends a new code to the saved email when Resend OTP is pressed", async () => {
    render(<MemoryRouter initialEntries={["/verify-otp"]}><VerifyOtp /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /resend otp/i }));
    await waitFor(() => expect(authApi.resendOtp).toHaveBeenCalledWith("ada@example.com"));
    expect(await screen.findByText(/OTP resent/i)).toBeTruthy();
  });
});
