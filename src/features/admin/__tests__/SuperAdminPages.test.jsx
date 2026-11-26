import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { paginated, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import EmailLogs from "../EmailLogs";

const EMAIL = {
  id: "email-1",
  to: "person@example.com",
  subject: "Welcome",
  status: "failed",
  attempts: 2,
  can_resend: true,
  created_at: "2026-11-12T10:00:00Z",
  sent_at: null,
};

beforeEach(() => {
  routeGets(http, {
    "/api/superadmin/emails/email-1/": { ...EMAIL, last_error: "Temporary delivery failure" },
    "/api/superadmin/emails/": paginated([EMAIL]),
  });
  http.post.mockResolvedValue({});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const renderLogs = (url = "/admin-dashboard/emails") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <EmailLogs />
    </MemoryRouter>
  );

describe("Email logs", () => {
  it("shows details from the actions menu", async () => {
    renderLogs();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for email to person@example.com" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Details" }));
    expect(await screen.findByText("Temporary delivery failure")).toBeTruthy();
  });

  it("resends only after confirming", async () => {
    renderLogs();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for email to person@example.com" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Resend" }));
    expect(http.post).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Resend" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/superadmin/emails/email-1/resend/", {}, { auth: true })
    );
  });

  it("filters by status from the URL (dashboard's failed-email link)", async () => {
    renderLogs("/admin-dashboard/emails?status=failed");
    await screen.findByText("person@example.com");
    const call = http.get.mock.calls.find(([path]) => path === "/api/superadmin/emails/");
    expect(call[1].params).toMatchObject({ status: "failed", page: 1 });
    expect(screen.getByLabelText("Filter by status").value).toBe("failed");
  });
});

describe("ActionsMenu keyboard", () => {
  it("opens with ArrowDown, moves with arrows and closes on Escape", async () => {
    renderLogs();
    const button = await screen.findByRole("button", { name: "Actions for email to person@example.com" });
    fireEvent.keyDown(button, { key: "ArrowDown" });
    const menu = screen.getByRole("menu");
    const [details, resend] = within(menu).getAllByRole("menuitem");
    expect(document.activeElement).toBe(details);
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(resend);
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(details);
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute("aria-haspopup")).toBe("menu");
  });

  it("closes on an outside click", async () => {
    renderLogs();
    fireEvent.click(await screen.findByRole("button", { name: "Actions for email to person@example.com" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
