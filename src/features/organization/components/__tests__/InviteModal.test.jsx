/**
 * School admins invite teachers, students and parents by email (a personal
 * link only that address can use), or share the school's open link/code.
 */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/hooks/organization/useOrganizationClasses", () => ({ default: () => ({ classes: [] }) }));

import { http } from "@/api/baseClient";
import { parseEmails } from "@/lib/inviteEmails";
import InviteModal from "../InviteModal";
import PeopleDirectory from "../PeopleDirectory";
import OrganizationOperations from "../../pages/OrganizationOperations";

const ADMIN = {
  id: "u1",
  roles: [{ id: "r1", role: { code: "org_admin", name: "School admin" }, organization: { id: "o1", name: "Sunrise College", code: "SUN12345" }, is_active: true }],
  primary_role: { role: { code: "org_admin" }, organization: { id: "o1", name: "Sunrise College", code: "SUN12345" } },
};

beforeEach(() => {
  window.localStorage.setItem("user_data", JSON.stringify(ADMIN));
  http.get.mockImplementation((path) =>
    Promise.resolve(
      path.startsWith("/api/admin/school/parents")
        ? { success: true, data: { parents: [], pagination: { total: 0 } } }
        : path.startsWith("/api/admin/school/parent-links")
          ? { success: true, data: { parent_links: [], pagination: { total: 0 } } }
          : { success: true, data: { students: [], teachers: [], pagination: { page: 1, pages: 1, total: 0 }, counts: {} } }
    )
  );
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("parseEmails", () => {
  it("splits on lines and commas, trims, dedupes (any case) and flags bad ones", () => {
    const { emails, invalid } = parseEmails(" a@x.ng,\nB@x.ng ; b@x.ng\n\nnot-an-email, a@x.ng ");
    expect(emails).toEqual(["a@x.ng", "B@x.ng"]);
    expect(invalid).toEqual(["not-an-email"]);
  });
});

function openModal(role = "teacher") {
  const onClose = vi.fn();
  render(<MemoryRouter><InviteModal open role={role} onClose={onClose} /></MemoryRouter>);
  return { onClose, dialog: screen.getByRole("dialog") };
}

describe("InviteModal", () => {
  it("sends the role, emails and message, then reports sent and skipped", async () => {
    http.post.mockResolvedValue({
      sent: ["a@x.ng", "b@x.ng", "c@x.ng"],
      skipped: [{ email: "d@x.ng", reason: "Already a teacher at this school." }],
    });
    const { dialog } = openModal("teacher");
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), {
      target: { value: "a@x.ng\nb@x.ng, c@x.ng\nd@x.ng\na@x.ng" },
    });
    fireEvent.change(within(dialog).getByLabelText(/Message/), { target: { value: "Welcome aboard" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invites/i }));
    expect(await within(dialog).findByText("Sent 3 invites")).toBeTruthy();
    expect(within(dialog).getByText("d@x.ng")).toBeTruthy();
    expect(within(dialog).getByText(/Already a teacher at this school\./)).toBeTruthy();
    const [path, opts] = http.post.mock.calls[0];
    expect(path).toBe("/api/admin/school/invites/");
    expect(opts.body).toEqual({ role: "teacher", emails: ["a@x.ng", "b@x.ng", "c@x.ng", "d@x.ng"], message: "Welcome aboard" });
  });

  it("leaves out an empty message", async () => {
    http.post.mockResolvedValue({ sent: ["a@x.ng"], skipped: [] });
    const { dialog } = openModal("parent");
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: "a@x.ng" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    expect(await within(dialog).findByText("Sent 1 invite")).toBeTruthy();
    expect(http.post.mock.calls[0][1].body).toEqual({ role: "parent", emails: ["a@x.ng"] });
  });

  it("won't send with no emails or with a bad address", async () => {
    const { dialog } = openModal();
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    expect(await within(dialog).findByText(/Enter at least one email address/i)).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: "a@x.ng, oops" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    expect((await within(dialog).findByRole("alert")).textContent).toMatch(/oops/);
    expect(http.post).not.toHaveBeenCalled();
  });

  it("won't send more than 100 at once", async () => {
    const { dialog } = openModal();
    const many = Array.from({ length: 101 }, (_, i) => `p${i}@x.ng`).join("\n");
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: many } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    expect((await within(dialog).findByRole("alert")).textContent).toMatch(/up to 100/i);
    expect(http.post).not.toHaveBeenCalled();
  });

  it("shows the API's error inline", async () => {
    const error = new Error("Bad request");
    error.status = 400;
    error.data = { field_errors: { emails: ["Too many invites today."] } };
    http.post.mockRejectedValue(error);
    const { dialog } = openModal();
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: "a@x.ng" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    expect(await within(dialog).findByText("Too many invites today.")).toBeTruthy();
  });

  it("offers the school's open link for the role and copies it", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { dialog } = openModal("teacher");
    const link = `${window.location.origin}/join?school=SUN12345&role=teacher`;
    expect(within(dialog).getByText("Or share an open link")).toBeTruthy();
    expect(within(dialog).getByDisplayValue(link)).toBeTruthy();
    expect(within(dialog).getByText("Anyone with this link can sign up as a teacher; you'll approve them under Pending.")).toBeTruthy();
    fireEvent.click(within(dialog).getByRole("button", { name: /copy link/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(link));
    expect(await within(dialog).findByRole("button", { name: /copied/i })).toBeTruthy();
  });

  it("selects the link text when copying isn't allowed", async () => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: vi.fn(() => Promise.reject(new Error("denied"))) }, configurable: true });
    const { dialog } = openModal("student");
    const input = within(dialog).getByDisplayValue(`${window.location.origin}/join?school=SUN12345&role=student`);
    const select = vi.spyOn(input, "select");
    fireEvent.click(within(dialog).getByRole("button", { name: /copy link/i }));
    await waitFor(() => expect(select).toHaveBeenCalled());
  });

  it("hides the open link when the school's code isn't known", () => {
    window.localStorage.clear();
    const { dialog } = openModal("teacher");
    expect(within(dialog).queryByText("Or share an open link")).toBeNull();
  });
});

describe("where admins find Invite", () => {
  it.each([
    ["student", "student"],
    ["teacher", "teacher"],
  ])("on the %s list, with the school code", async (kind, role) => {
    http.post.mockResolvedValue({ sent: ["a@x.ng"], skipped: [] });
    render(<MemoryRouter><PeopleDirectory kind={kind} /></MemoryRouter>);
    expect(screen.getByText("Or share your school code: SUN12345")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^invite$/i }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: "a@x.ng" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    await within(dialog).findByText("Sent 1 invite");
    expect(http.post).toHaveBeenCalledWith("/api/admin/school/invites/", expect.objectContaining({ body: { role, emails: ["a@x.ng"] } }));
  });

  it("on the Parents tab of Operations", async () => {
    http.post.mockResolvedValue({ sent: ["a@x.ng"], skipped: [] });
    render(<MemoryRouter><OrganizationOperations /></MemoryRouter>);
    expect(screen.getByText("Or share your school code: SUN12345")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^invite$/i }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Email addresses"), { target: { value: "a@x.ng" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /send invite/i }));
    await within(dialog).findByText("Sent 1 invite");
    expect(http.post.mock.calls.find(([p]) => p === "/api/admin/school/invites/")[1].body.role).toBe("parent");
  });

  it("doesn't show a code line when there is no code", () => {
    window.localStorage.clear();
    render(<MemoryRouter><PeopleDirectory kind="student" /></MemoryRouter>);
    expect(screen.queryByText(/Or share your school code/)).toBeNull();
    expect(screen.getByRole("button", { name: /^invite$/i })).toBeTruthy();
  });
});
