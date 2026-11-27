import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import TeacherPermissionsModal from "../TeacherPermissionsModal";
import PeopleDirectory from "../PeopleDirectory";

const AVAILABLE = [
  { code: "manage_class_students", label: "Manage class students", description: "Add or remove students in their classes." },
  { code: "manage_subject_students", label: "Manage subject students", description: "Enrol students in subjects without a class." },
  { code: "create_subjects", label: "Create subjects", description: "Add subjects to classes they lead." },
  { code: "import_students", label: "Import students", description: "Add students from a spreadsheet." },
];
const BELLO = { id: "u-bello", full_name: "Musa Bello", email: "bello@x.ng", status: "active", membership_id: "m-b", permissions: ["create_subjects", "import_students"] };
const COLE = { id: "u-cole", full_name: "Ann Cole", email: "cole@x.ng", status: "active", membership_id: "m-c", permissions: [] };
const URL = "/api/admin/school/teachers/u-bello/permissions/";

beforeEach(() => {
  http.get.mockImplementation((url) => {
    if (url === URL) {
      return Promise.resolve({ success: true, data: { permissions: ["create_subjects"], available: AVAILABLE } });
    }
    if (url === "/api/admin/school/teachers/") {
      return Promise.resolve({
        success: true,
        data: {
          teachers: [BELLO, COLE],
          pagination: { page: 1, pages: 1, total: 2, has_next: false, has_prev: false },
          counts: { all: 2, active: 2, pending: 0, suspended: 0 },
        },
      });
    }
    return Promise.reject(new Error(`unexpected ${url}`));
  });
  http.put.mockImplementation((url, body) =>
    Promise.resolve({ success: true, data: { permissions: body.permissions, available: AVAILABLE } })
  );
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TeacherPermissionsModal", () => {
  it("shows each permission, off unless granted, and saves the full list", async () => {
    const onSaved = vi.fn();
    render(<TeacherPermissionsModal teacher={BELLO} onClose={() => {}} onSaved={onSaved} />);
    const dialog = screen.getByRole("dialog", { name: "Permissions for Musa Bello" });
    const create = await within(dialog).findByRole("checkbox", { name: /Create subjects/ });
    expect(create.checked).toBe(true);
    const manage = within(dialog).getByRole("checkbox", { name: /Manage class students/ });
    expect(manage.checked).toBe(false);
    expect(within(dialog).getByText("Add or remove students in their classes.")).toBeTruthy();
    expect(within(dialog).getByText(/only to their own classes and subjects/i)).toBeTruthy();

    fireEvent.click(manage);
    fireEvent.click(create);
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(http.put).toHaveBeenCalledWith(URL, { permissions: ["manage_class_students"] }, { auth: true })
    );
    expect(onSaved).toHaveBeenCalledWith(["manage_class_students"]);
  });

  it("reports a failed save and keeps the dialog open", async () => {
    http.put.mockRejectedValueOnce(Object.assign(new Error("Unknown permission: fly."), { status: 400 }));
    const onSaved = vi.fn();
    render(<TeacherPermissionsModal teacher={BELLO} onClose={() => {}} onSaved={onSaved} />);
    await screen.findByRole("checkbox", { name: /Create subjects/ });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});

describe("Teachers directory", () => {
  const show = () =>
    render(
      <MemoryRouter initialEntries={["/organization-dashboard/teachers"]}>
        <PeopleDirectory kind="teacher" />
      </MemoryRouter>
    );

  it("shows how many extra permissions a teacher has", async () => {
    show();
    const row = (await screen.findByText("Musa Bello")).closest("tr");
    expect(within(row).getByText("2 permissions")).toBeTruthy();
    const cole = screen.getByText("Ann Cole").closest("tr");
    expect(within(cole).queryByText(/permission/)).toBeNull();
  });

  it("opens the permissions dialog from the row menu", async () => {
    show();
    const row = (await screen.findByText("Musa Bello")).closest("tr");
    fireEvent.click(within(row).getByRole("button", { name: /^Actions for/ }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Permissions…" }));
    expect(await screen.findByRole("dialog", { name: "Permissions for Musa Bello" })).toBeTruthy();
    await waitFor(() => expect(http.get).toHaveBeenCalledWith(URL, { auth: true }));
  });

  it("students have no permissions item", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: {
        students: [{ id: "u-ada", full_name: "Ada Obi", email: "ada@x.ng", status: "active" }],
        pagination: { page: 1, pages: 1, total: 1, has_next: false, has_prev: false },
        counts: { all: 1, active: 1, pending: 0, suspended: 0 },
      },
    });
    render(
      <MemoryRouter>
        <PeopleDirectory kind="student" />
      </MemoryRouter>
    );
    const row = (await screen.findByText("Ada Obi")).closest("tr");
    fireEvent.click(within(row).getByRole("button", { name: /^Actions for/ }));
    expect(screen.queryByRole("menuitem", { name: "Permissions…" })).toBeNull();
  });
});
