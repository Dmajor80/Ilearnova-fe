import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const subscription = { status: null, loaded: true };
vi.mock("@/features/billing/useSubscriptionStatus", () => ({ default: () => subscription }));

const alerts = vi.fn();
const pending = vi.fn();
vi.mock("@/hooks/organization/useNotificationsData", () => ({
  default: (options) => {
    alerts(options);
    return { totalNotifications: 0, loading: false };
  },
}));
vi.mock("@/hooks/organization", () => ({
  useOrganizationPendingStaff: (role, options) => {
    pending(role, options);
    return { totalPendingStaff: role === "student" ? 3 : 0 };
  },
}));
vi.mock("@/api/authApi", () => ({ logout: vi.fn() }));
vi.mock("@/api/auth", () => ({ clearAuth: vi.fn() }));

import OrganizationDashboard from "../OrganizationDashboard";
import { act } from "react";
import { toast } from "@/lib/toast";

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

const show = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/organization-dashboard/*" element={<OrganizationDashboard />}>
          <Route path="*" element={<Where />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

const sidebar = () => screen.getAllByRole("navigation")[0];

beforeEach(() => {
  subscription.status = null;
  subscription.loaded = true;
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OrganizationDashboard navigation", () => {
  it("groups related pages under one sidebar link", () => {
    show("/organization-dashboard/overview");
    const links = within(sidebar()).getAllByRole("button").map((b) => b.title);
    expect(links).toEqual([
      "Overview",
      "Students",
      "Teachers",
      "Classes",
      "Exams & results",
      "Reports",
      "Messages",
      "Announcements",
      "Operations",
      "Fees & billing",
      "Settings",
    ]);
  });

  it("shows the group's pages as tabs and switches between them", () => {
    show("/organization-dashboard/grading");
    const tabs = screen.getByRole("navigation", { name: "Exams & results" });
    expect(within(tabs).getByRole("button", { name: "Grading" }).getAttribute("aria-current")).toBe("page");
    expect(within(sidebar()).getByTitle("Exams & results").getAttribute("aria-current")).toBe("page");

    fireEvent.click(within(tabs).getByRole("button", { name: "Results" }));
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/results");
  });

  it("badges Students with the number waiting for verification", () => {
    show("/organization-dashboard/overview");
    expect(within(sidebar()).getByTitle("Students").textContent).toContain("3");
  });

  it("loads no alerts or pending counts while the school is locked", () => {
    subscription.status = { mode: "billing_only" };
    show("/organization-dashboard/students");
    expect(screen.getByText("Your subscription has expired")).toBeTruthy();
    expect(alerts).toHaveBeenCalledWith({ enabled: false });
    expect(pending).toHaveBeenCalledWith("student", { enabled: false });
    // Billing stays one tab away.
    fireEvent.click(within(sidebar()).getByTitle("Fees & billing"));
    fireEvent.click(screen.getByRole("button", { name: "Subscription" }));
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/billing");
  });

  it("waits for the subscription answer before loading", () => {
    subscription.loaded = false;
    show("/organization-dashboard/overview");
    expect(alerts).toHaveBeenCalledWith({ enabled: false });
    // Found clicking through a locked school: the page itself rendered for a
    // moment and fired requests the API refused (402) before the lock screen.
    expect(screen.queryByTestId("where")).toBeNull();
    expect(screen.getByRole("status", { name: "Loading your school" })).toBeTruthy();
  });

  it("shows toasts fired by its pages", () => {
    show("/organization-dashboard/billing");
    act(() => toast("Subscription extended."));
    expect(screen.getByText("Subscription extended.")).toBeTruthy();
  });
});

// Bug: "Edit Profile" sent school admins to the bare /profile page, outside
// the dashboard (no sidebar, no way back), and there was no
// /organization-dashboard/profile.
describe("OrganizationDashboard profile", () => {
  it("opens the admin's profile inside the dashboard", () => {
    show("/organization-dashboard/overview");
    fireEvent.click(screen.getByLabelText("Profile").closest("button"));
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/profile");
    expect(sidebar()).toBeTruthy(); // still in the dashboard layout
  });

  it("keeps the profile reachable while the school is locked", () => {
    subscription.status = { mode: "billing_only" };
    show("/organization-dashboard/profile");
    expect(screen.queryByText("Your subscription has expired")).toBeNull();
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/profile");
  });
});

// The profile opened "on a new page" with no obvious way back: it had no
// place in the sidebar, and the header's gear icon did nothing.
describe("OrganizationDashboard settings", () => {
  it("has a Settings sidebar link that opens the admin's profile", () => {
    show("/organization-dashboard/overview");
    fireEvent.click(within(sidebar()).getByTitle("Settings"));
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/profile");
  });

  it("opens Settings from the header's gear icon", () => {
    show("/organization-dashboard/overview");
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByTestId("where").textContent).toBe("/organization-dashboard/profile");
  });

  it("highlights Settings in the sidebar while on the profile", () => {
    show("/organization-dashboard/profile");
    expect(within(sidebar()).getByTitle("Settings").getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/profile|settings/i);
  });
});
