/**
 * Joining a school as a teacher, student or parent, end to end
 * (reproduced in the browser against a fresh school):
 * 1. The parent's "Link student" request sent `email`; the API wants
 *    `student_email`, so it always failed ("student_email is required.").
 * 2. School admins had no screen to approve parent link requests, which is
 *    the only way a self-registered parent gets approved.
 * 3. After signing up, people were sent straight to Login; the "your school
 *    must approve you" message never showed (and the success screen talks
 *    about an email that isn't sent to them).
 * 4. Logging in before approval landed on a broken dashboard ("Some ...
 *    data could not be loaded", dozens of 403s) instead of saying they're
 *    waiting for the school.
 */
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(() => Promise.resolve({})), post: vi.fn(() => Promise.resolve({})), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/authApi", () => ({
  getOrganizations: vi.fn(() => Promise.resolve({ results: [{ id: "o1", code: "SUN123", name: "Sunrise College" }] })),
  resendOtp: vi.fn(),
  registerTeacher: vi.fn(),
  registerStudent: vi.fn(),
  registerParent: vi.fn(),
  registerIndividualLearner: vi.fn(),
}));
vi.mock("@/api/auth", () => ({
  persistAuthResponse: vi.fn(),
  getTokens: () => ({ access: "t" }),
  getStoredUser: vi.fn(() => null),
}));

import { http } from "@/api/baseClient";
import * as authApi from "@/api/authApi";
import ParentChildrenPanel from "@/features/parent/components/ParentChildrenPanel";
import OrganizationOperations from "@/features/organization/pages/OrganizationOperations";
import SignupForm from "../SignupForm";
import PendingApprovalGate from "../PendingApprovalGate";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

describe("parent asks to be linked to their child", () => {
  it("sends the field the API expects", async () => {
    render(<ParentChildrenPanel children={[]} loading={false} error={null} refreshData={vi.fn()} onSelectChild={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Student email"), { target: { value: "chidi@sunrise.example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /link student/i }));
    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe("/api/parent/link-student/");
    expect(body).toMatchObject({ student_email: "chidi@sunrise.example.com" });
  });
});

describe("school admin approves parent link requests", () => {
  const LINK = {
    id: "l1",
    parent: { id: "p1", name: "Ngozi Eze", email: "ngozi@sunrise.example.com" },
    student: { id: "s1", name: "Chidi Eze", email: "chidi@sunrise.example.com" },
    relationship: "mother",
    status: "pending",
    created_at: "2026-11-27T10:00:00Z",
  };

  beforeEach(() => {
    http.get.mockImplementation((path) =>
      Promise.resolve(
        path.startsWith("/api/admin/school/parent-links")
          ? { success: true, data: { parent_links: [LINK], pagination: { total: 1 } } }
          : path.startsWith("/api/admin/school/parents")
            ? { success: true, data: { parents: [], pagination: { total: 0 } } }
            : {}
      )
    );
    http.post.mockResolvedValue({ success: true, data: { ...LINK, status: "approved" } });
  });

  it("lists pending requests on the Parents tab and approves one", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    const request = await screen.findByRole("region", { name: /link requests/i });
    expect(within(request).getByText("Ngozi Eze")).toBeTruthy();
    expect(within(request).getByText("Chidi Eze")).toBeTruthy();
    expect(within(request).getByText(/mother/i)).toBeTruthy();
    expect(http.get.mock.calls.some(([p, o]) => p.startsWith("/api/admin/school/parent-links") && (p.includes("status=pending") || o?.params?.status === "pending"))).toBe(true);

    fireEvent.click(within(request).getByRole("button", { name: /approve/i }));
    await waitFor(() =>
      expect(http.post.mock.calls.some(([p]) => p === "/api/admin/school/parent-links/l1/approve/")).toBe(true)
    );
  });

  it("can reject a request", async () => {
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    const request = await screen.findByRole("region", { name: /link requests/i });
    fireEvent.click(within(request).getByRole("button", { name: /reject/i }));
    const confirm = screen.queryByRole("dialog") || screen.queryByRole("alertdialog");
    if (confirm) fireEvent.click(within(confirm).getByRole("button", { name: /reject/i }));
    await waitFor(() =>
      expect(http.post.mock.calls.some(([p]) => p === "/api/admin/school/parent-links/l1/reject/")).toBe(true)
    );
  });
});

describe("after signing up to a school", () => {
  it("says the school must approve them and doesn't rush them to Login", async () => {
    authApi.registerTeacher.mockResolvedValue({
      message: "Teacher registration successful. Your account is pending verification by your school; you will get access once a school admin approves it.",
      user: { id: "u1", username: "tunde", email: "tunde@sunrise.example.com", is_verified: false },
    });
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /^teacher/i }));
    const fill = (name, value) => fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { value } });
    fill("first_name", "Tunde");
    fill("last_name", "Bello");
    fill("username", "tunde");
    fill("email", "tunde@sunrise.example.com");
    fill("date_of_birth", "1990-05-01");
    fill("phone", "08031234567");
    // People type their school's code (no dropdown of every school).
    http.get.mockImplementation((path) =>
      Promise.resolve(path === "/api/organizations/lookup/" ? { name: "Sunrise College", code: "SUN123" } : {})
    );
    fill("organization_code", "sun123");
    await screen.findByText("✓ Sunrise College");
    fill("password", "Joiner-Pass-2026");
    fill("password_confirmation", "Joiner-Pass-2026");
    fireEvent.submit(document.querySelector("form"));

    expect(await screen.findByText(/waiting for Sunrise College to approve/i)).toBeTruthy();
    expect(screen.queryByText(/check your email/i)).toBeNull();
    await act(() => new Promise((r) => setTimeout(r, 1600)));
    expect(screen.queryByTestId("where")).toBeNull(); // still on the confirmation
    expect(screen.getByRole("link", { name: /log in|sign in/i }).getAttribute("href")).toBe("/login");
  });
});

describe("logging in before the school approves", () => {
  const profile = (code, verified) => ({
    id: "u1",
    username: "someone",
    first_name: "Tunde",
    roles: [{ id: "r1", role: { code, name: code }, organization: { id: "o1", name: "Sunrise College" }, is_active: true, is_verified: verified }],
  });

  it("shows a waiting screen instead of the dashboard", async () => {
    http.get.mockResolvedValue(profile("teacher", false));
    render(<MemoryRouter><PendingApprovalGate role="teacher"><p>teacher dashboard</p></PendingApprovalGate></MemoryRouter>);
    expect(await screen.findByText(/waiting for Sunrise College to approve/i)).toBeTruthy();
    expect(screen.queryByText("teacher dashboard")).toBeNull();
    expect(http.get).toHaveBeenCalledWith("/api/auth/profile/", expect.anything());
  });

  it("lets an approved person straight through", async () => {
    http.get.mockResolvedValue({ success: true, data: profile("student", true) });
    render(<MemoryRouter><PendingApprovalGate role="student"><p>student dashboard</p></PendingApprovalGate></MemoryRouter>);
    expect(await screen.findByText("student dashboard")).toBeTruthy();
  });

  it("gives a waiting parent the form to link their child (that is how they get approved)", async () => {
    http.get.mockResolvedValue(profile("parent", false));
    render(<MemoryRouter><PendingApprovalGate role="parent"><p>parent dashboard</p></PendingApprovalGate></MemoryRouter>);
    expect(await screen.findByText(/waiting for Sunrise College/i)).toBeTruthy();
    expect(screen.getByLabelText("Student email")).toBeTruthy();
    expect(screen.queryByText("parent dashboard")).toBeNull();
  });

  it("can check again without logging out", async () => {
    http.get.mockResolvedValueOnce(profile("teacher", false)).mockResolvedValueOnce(profile("teacher", true));
    render(<MemoryRouter><PendingApprovalGate role="teacher"><p>teacher dashboard</p></PendingApprovalGate></MemoryRouter>);
    fireEvent.click(await screen.findByRole("button", { name: /check again/i }));
    expect(await screen.findByText("teacher dashboard")).toBeTruthy();
  });
});
