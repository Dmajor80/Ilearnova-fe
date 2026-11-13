import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useSuperAdminEmails, useSuperAdminOrganizations } from "@/hooks/superadmin";
import EmailLogs from "../EmailLogs";
import Organizations from "../Organizations";

vi.mock("@/hooks/superadmin", () => ({
  useSuperAdminEmails: vi.fn(),
  useSuperAdminOrganizations: vi.fn()
}));

const notification = {
  show: false,
  message: "",
  type: "info"
};

const createOrganization = vi.fn();
const fetchOrganizations = vi.fn();
const updateOrganization = vi.fn();
const fetchOrganizationDetails = vi.fn();
const deactivateOrganization = vi.fn();

const resendEmail = vi.fn();
const fetchEmails = vi.fn();
const fetchEmailDetails = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  useSuperAdminOrganizations.mockReturnValue({
    loading: false,
    error: null,
    organizations: [],
    totalOrganizations: 0,
    mutating: false,
    fetchOrganizations,
    fetchOrganizationDetails,
    createOrganization,
    updateOrganization,
    deactivateOrganization,
    notification
  });
  useSuperAdminEmails.mockReturnValue({
    loading: false,
    error: null,
    emails: [{
      id: "email-1",
      to: "person@example.com",
      subject: "Welcome",
      status: "failed",
      attempts: 2,
      can_resend: true,
      created_at: "2026-11-12T10:00:00Z",
      sent_at: null
    }],
    totalEmails: 1,
    mutating: false,
    fetchEmails,
    fetchEmailDetails,
    resendEmail,
    notification
  });
});

afterEach(cleanup);

describe("super-admin management pages", () => {
  it("creates an organization using the form values", async () => {
    render(<Organizations />);

    fireEvent.click(screen.getByRole("button", { name: /add organization/i }));
    fireEvent.change(screen.getByLabelText("Name *"), { target: { value: "North School" } });
    fireEvent.change(screen.getByLabelText("Code *"), { target: { value: "NORTH" } });
    fireEvent.click(screen.getByRole("button", { name: "Create organization" }));

    await waitFor(() => {
      expect(createOrganization).toHaveBeenCalledWith(expect.objectContaining({
        name: "North School",
        code: "NORTH",
        organization_type: "private",
        is_active: true
      }));
    });
  });

  it("shows email log details and allows a resend when permitted", async () => {
    fetchEmailDetails.mockResolvedValue({
      id: "email-1",
      to: "person@example.com",
      subject: "Welcome",
      status: "failed",
      attempts: 2,
      last_error: "Temporary delivery failure",
      created_at: "2026-11-12T10:00:00Z",
      sent_at: null
    });

    render(<EmailLogs />);
    fireEvent.click(screen.getByRole("button", { name: /details/i }));
    expect(await screen.findByText("Temporary delivery failure")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /resend/i }));
    expect(resendEmail).toHaveBeenCalledWith("email-1");
  });
});
