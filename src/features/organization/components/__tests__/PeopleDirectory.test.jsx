import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/hooks/organization/useOrganizationClasses", () => ({
  default: () => ({ classes: [] }),
}));

import { http } from "@/api/baseClient";
import PeopleDirectory from "../PeopleDirectory";

const ADA = { id: "u-ada", full_name: "Ada Obi", email: "ada@x.ng", class_name: "JSS2A", status: "active", membership_id: "m-ada" };
const CHIDI = { id: "u-chidi", full_name: "Chidi Eze", email: "chidi@x.ng", class_name: null, status: "pending", membership_id: "m-chidi" };
const EMEKA = { id: "u-emeka", full_name: "Emeka Nwosu", email: "emeka@x.ng", class_name: null, status: "pending", membership_id: "m-emeka" };
const EFE = { id: "u-efe", full_name: "Efe Okon", email: "efe@x.ng", class_name: "JSS1A", status: "suspended", membership_id: "m-efe" };
const COUNTS = { all: 4, active: 1, pending: 2, suspended: 1 };

const page = (students, pagination = { page: 1, pages: 1, total: students.length, has_next: false, has_prev: false }) =>
  Promise.resolve({ success: true, data: { students, pagination, counts: COUNTS } });

const respond = (path, { params }) => {
  const byStatus = { all: [ADA, CHIDI, EMEKA, EFE], active: [ADA], pending: [CHIDI, EMEKA], suspended: [EFE] };
  return page(byStatus[params.status]);
};

const show = (url = "/organization-dashboard/students") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <PeopleDirectory kind="student" />
    </MemoryRouter>
  );

const ADMIN = {
  id: "me",
  roles: [{ role: { code: "org_admin" }, organization: { id: "o1", name: "Sunrise College", code: "SUN12345" } }],
};

beforeEach(() => {
  window.localStorage.setItem("user_data", JSON.stringify(ADMIN));
  http.get.mockImplementation(respond);
  http.post.mockResolvedValue({ success: true, data: {} });
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

const lastParams = () => http.get.mock.calls.at(-1)[1].params;
const rowOf = async (name) => (await screen.findByText(name)).closest("tr");
const menuItems = (row) => {
  fireEvent.click(within(row).getByRole("button", { name: /^Actions for/ }));
  return screen.getAllByRole("menuitem").map((item) => item.textContent);
};
const choose = (row, label) => {
  fireEvent.click(within(row).getByRole("button", { name: /^Actions for/ }));
  fireEvent.click(screen.getByRole("menuitem", { name: label }));
};

describe("PeopleDirectory", () => {
  it("lists everyone with a count on each pill", async () => {
    show();
    expect(await screen.findByText("Ada Obi")).toBeTruthy();
    expect(screen.getByText("Efe Okon")).toBeTruthy();
    expect(lastParams()).toMatchObject({ status: "all", page: 1, page_size: 20 });
    const pending = screen.getByRole("button", { name: /Pending/ });
    expect(pending.textContent).toContain("2");
  });

  it("filters by pill and opens on the pill named in the link", async () => {
    show("/organization-dashboard/students?status=pending");
    expect(await screen.findByText("Chidi Eze")).toBeTruthy();
    expect(screen.queryByText("Ada Obi")).toBeNull();
    expect(screen.getByRole("button", { name: /Pending/ }).getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /Suspended/ }));
    expect(await screen.findByText("Efe Okon")).toBeTruthy();
    expect(lastParams().status).toBe("suspended");
  });

  it("searches after typing pauses", async () => {
    show();
    await screen.findByText("Ada Obi");
    fireEvent.change(screen.getByPlaceholderText("Search by name or email"), { target: { value: "ada" } });
    await waitFor(() => expect(lastParams().search).toBe("ada"));
  });

  it("verifies ticked pending students together", async () => {
    show("/organization-dashboard/students?status=pending");
    await screen.findByText("Chidi Eze");
    fireEvent.click(screen.getByLabelText("Select Chidi Eze"));
    fireEvent.click(screen.getByLabelText("Select Emeka Nwosu"));
    fireEvent.click(screen.getByRole("button", { name: "Verify selected (2)" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/admin/school/pending-staff/bulk-verify/",
        { ids: ["m-chidi", "m-emeka"] },
        { auth: true }
      )
    );
    expect(await screen.findByText("Verified 2 students.")).toBeTruthy();
  });

  it("asks before suspending, then suspends", async () => {
    show();
    choose(await rowOf("Ada Obi"), "Suspend…");
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Suspend Ada Obi?");
    fireEvent.click(within(dialog).getByRole("button", { name: "Suspend" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/admin/school/students/u-ada/suspend/", {}, { auth: true })
    );
    expect(await screen.findByText("Ada Obi is suspended.")).toBeTruthy();
  });

  it("reinstates a suspended student", async () => {
    show("/organization-dashboard/students?status=suspended");
    choose(await rowOf("Efe Okon"), "Reinstate");
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/admin/school/students/u-efe/reinstate/", {}, { auth: true })
    );
  });

  it("pages through results", async () => {
    http.get.mockImplementation((path, { params }) =>
      page([params.page === 1 ? ADA : EFE], { page: params.page, pages: 2, total: 21, has_next: params.page === 1, has_prev: params.page === 2 })
    );
    show();
    await screen.findByText("Ada Obi");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Efe Okon")).toBeTruthy();
    expect(lastParams().page).toBe(2);
    expect(screen.getByText("Page 2 of 2")).toBeTruthy();
  });

  it("shows the server's message when an action fails", async () => {
    const error = new Error("Bad Request");
    error.data = { non_field_errors: ["This student is already verified."] };
    http.post.mockRejectedValue(error);
    show("/organization-dashboard/students?status=pending");
    const row = (await screen.findByText("Chidi Eze")).closest("tr");
    fireEvent.click(within(row).getByRole("button", { name: "Verify" }));
    expect(await screen.findByText("This student is already verified.")).toBeTruthy();
  });
});

describe("taking someone out of the school", () => {
  const CHECK_OK = { can_delete: true, reason: null, blockers: {}, related: { "school roles": 1 } };
  const CHECK_BLOCKED = {
    can_delete: false,
    reason: "This account has records at the school (3 results, 2 submissions). Remove them from the school instead.",
    blockers: { results: 3, submissions: 2 },
    related: { "school roles": 1, results: 3, submissions: 2 },
  };
  const withCheck = (check) =>
    http.get.mockImplementation((path, opts) =>
      path.endsWith("/delete-check/") ? Promise.resolve(check) : respond(path, opts)
    );

  it("offers each status the actions that fit it", async () => {
    show();
    expect(menuItems(await rowOf("Ada Obi"))).toEqual(["Edit", "Suspend…", "Remove from school…", "Delete permanently…"]);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(menuItems(await rowOf("Efe Okon"))).toEqual(["Reinstate", "Remove from school…", "Delete permanently…"]);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    // A pending sign-up keeps Verify / Reject on the row; a wrong one can be deleted.
    const chidi = await rowOf("Chidi Eze");
    expect(within(chidi).getByRole("button", { name: "Verify" })).toBeTruthy();
    expect(menuItems(chidi)).toEqual(["Delete permanently…"]);
  });

  it("removes from the school after saying what is kept", async () => {
    http.del.mockResolvedValue({ success: true, message: "Ada Obi was removed from Sunrise College." });
    show();
    choose(await rowOf("Ada Obi"), "Remove from school…");
    const dialog = screen.getByRole("alertdialog");
    expect(dialog.textContent).toContain("Remove Ada Obi from the school?");
    expect(dialog.textContent).toContain(
      "Their account and the school's records are kept; they lose access to Sunrise College. You can add them again later."
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Remove from school" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/admin/school/students/u-ada/", { auth: true })
    );
    expect(await screen.findByText("Ada Obi was removed from Sunrise College.")).toBeTruthy();
  });

  it("deletes a mistaken account permanently once the name is typed", async () => {
    withCheck(CHECK_OK);
    http.del.mockResolvedValue(null);
    show();
    choose(await rowOf("Ada Obi"), "Delete permanently…");
    const dialog = screen.getByRole("alertdialog");
    await waitFor(() =>
      expect(http.get).toHaveBeenCalledWith("/api/admin/school/students/u-ada/delete-check/", { auth: true })
    );
    expect(await within(dialog).findByText("1 school role")).toBeTruthy();
    const button = within(dialog).getByRole("button", { name: "Delete permanently" });
    expect(button.disabled).toBe(true);
    fireEvent.change(within(dialog).getByLabelText(/to confirm/), { target: { value: "Ada Obi" } });
    fireEvent.click(button);
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/admin/school/students/u-ada/", {
        auth: true,
        params: { permanent: true },
      })
    );
    expect(await screen.findByText("Ada Obi was deleted permanently.")).toBeTruthy();
  });

  it("explains why it can't delete and offers to remove instead", async () => {
    withCheck(CHECK_BLOCKED);
    http.del.mockResolvedValue({ success: true, message: "Ada Obi was removed from Sunrise College." });
    show();
    choose(await rowOf("Ada Obi"), "Delete permanently…");
    const dialog = screen.getByRole("alertdialog");
    const alert = await within(dialog).findByRole("alert");
    expect(alert.textContent).toContain("Remove them from the school instead.");
    expect(within(dialog).getByRole("button", { name: "Delete permanently" }).disabled).toBe(true);
    fireEvent.click(within(dialog).getByRole("button", { name: "Remove from school instead" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/admin/school/students/u-ada/", { auth: true })
    );
    expect(http.del.mock.calls.some(([, opts]) => opts?.params?.permanent)).toBe(false);
  });

  it("shows the refusal when the delete is blocked at the last moment (409)", async () => {
    withCheck(CHECK_OK);
    const conflict = new Error("Conflict");
    conflict.status = 409;
    conflict.data = { error: "This account has records at the school (1 result). Remove them from the school instead.", blockers: { results: 1 } };
    http.del.mockRejectedValue(conflict);
    show();
    choose(await rowOf("Ada Obi"), "Delete permanently…");
    const dialog = screen.getByRole("alertdialog");
    await within(dialog).findByText("1 school role");
    fireEvent.change(within(dialog).getByLabelText(/to confirm/), { target: { value: "Ada Obi" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete permanently" }));
    expect(await within(dialog).findByText(/\(1 result\)\. Remove them from the school instead\./)).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Remove from school instead" })).toBeTruthy();
  });
});
