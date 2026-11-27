import { cleanup, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* Mr Bello leads JSS1A and teaches a subject in JSS3C. With permissions from
   his school admin he gets extra controls for his own classes and subjects;
   without them, none show. The class list holds only his own classes. */

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

const FRENCH = { id: "fr", name: "French", class_id: null, class_name: null, student_count: 1 };
const OWN = [
  { id: "c1", name: "JSS1A", leads: true },
  { id: "c3", name: "JSS3C", leads: false },
];
let granted = [];
const permissionsApi = {
  get permissions() { return granted; },
  classes: OWN,
  loading: false,
  has: (code) => granted.includes(code),
  reload: vi.fn(),
};
const subjectsApi = {
  subjects: [FRENCH],
  refreshData: vi.fn(),
  fetchStudents: vi.fn(() => Promise.resolve([{ id: "u-ada", name: "Ada Obi", username: "ada" }])),
};
const classesApi = {
  classes: [{ id: "c1", name: "JSS1A", student_count: 1 }, { id: "c3", name: "JSS3C", student_count: 0 }],
  subjects: [], topics: [], materials: [], loading: false, mutating: false, error: null,
  refreshData: vi.fn(), fetchSubjects: vi.fn(() => Promise.resolve([])), fetchClass: vi.fn(() => Promise.resolve()),
  fetchMaterials: vi.fn(() => Promise.resolve()), fetchTopics: vi.fn(),
};

vi.mock("@/hooks/teacher", async (importOriginal) => ({
  ...(await importOriginal()),
  useTeacherSubjects: () => subjectsApi,
  useTeacherClasses: () => classesApi,
  useTeacherAnnouncements: () => ({ mutating: false, publishAnnouncement: vi.fn() }),
  useTeacherPermissions: () => permissionsApi,
}));
vi.mock("@/context/OrganizationContext", () => ({ useOrganization: () => ({ currentOrgId: "org1" }) }));
vi.mock("../components/CourseComponents", () => ({ default: () => null }));

import { http } from "@/api/baseClient";
import ClassManagement from "../ClassManagement";
import useTeacherPermissions from "@/hooks/teacher/useTeacherPermissions";

const ADA = { id: "u-ada", student_role_id: "r-ada", name: "Ada Obi", email: "ada@x.ng" };
const BAYO = { id: "u-bayo", name: "Bayo Ade", email: "bayo@x.ng", admission_number: null, classes: ["JSS2B"] };

beforeEach(() => {
  granted = [];
  http.get.mockImplementation((url) => {
    if (url === "/api/teacher/classes/c1/students/") {
      return Promise.resolve({ success: true, data: { class_id: "c1", count: 1, students: [ADA] } });
    }
    if (url === "/api/teacher/subjects/fr/students/") return Promise.resolve({ success: true, data: [ADA] });
    if (url === "/api/teacher/students/search/") return Promise.resolve({ success: true, data: [ADA, BAYO] });
    return Promise.reject(new Error(`unexpected ${url}`));
  });
  http.post.mockImplementation((url) => {
    if (url === "/api/teacher/classes/c1/students/") {
      return Promise.resolve({ success: true, data: { class_id: "c1", count: 2, students: [ADA, BAYO] } });
    }
    if (url === "/api/teacher/subjects/fr/students/") return Promise.resolve({ success: true, data: [ADA, BAYO] });
    if (url === "/api/teacher/subjects/") {
      return Promise.resolve({ success: true, data: { id: "s9", name: "Art", classname: "c1", class_name: "JSS1A" } });
    }
    if (url === "/api/teacher/students/import/") {
      return Promise.resolve({ success: true, data: { created: 0, dry_run: true, students: [] } });
    }
    return Promise.reject(new Error(`unexpected ${url}`));
  });
  http.del.mockResolvedValue({ success: true, data: { class_id: "c1", count: 0, students: [] } });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const openClass = async (name) => {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${name}`) }));
  await screen.findByRole("heading", { name, level: 2 });
};

describe("teacher controls from permissions", () => {
  it("shows none of the extra controls when nothing is granted", async () => {
    render(<ClassManagement />);
    await openClass("JSS1A");
    expect(screen.queryByRole("button", { name: /New subject/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Import students/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Manage students/ })).toBeNull();
    const section = screen.getByRole("region", { name: "Subjects without a class" });
    fireEvent.click(within(section).getByRole("button", { name: /French/ }));
    await within(section).findByText("Ada Obi");
    expect(within(section).queryByRole("button", { name: /Enrol students/ })).toBeNull();
  });

  it("manages students of an own class", async () => {
    granted = ["manage_class_students"];
    render(<ClassManagement />);
    // A class he only teaches a subject in is his own too.
    await openClass("JSS3C");
    expect(screen.getByRole("button", { name: /Manage students/ })).toBeTruthy();
    await openClass("JSS1A");
    fireEvent.click(screen.getByRole("button", { name: /Manage students/ }));

    const dialog = await screen.findByRole("dialog", { name: "Students in JSS1A" });
    const roster = await within(dialog).findByRole("list", { name: "Current students" });
    expect(within(roster).getByText("Ada Obi")).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText("Search students"), { target: { value: "bayo" } });
    await waitFor(() =>
      expect(http.get).toHaveBeenCalledWith("/api/teacher/students/search/", { auth: true, params: { q: "bayo" } })
    );
    const results = within(dialog).getByRole("list", { name: "School students" });
    fireEvent.click(await within(results).findByRole("button", { name: "Add Bayo Ade" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/teacher/classes/c1/students/", { student_ids: ["u-bayo"] }, { auth: true })
    );
    expect(await within(roster).findByText("Bayo Ade")).toBeTruthy();

    fireEvent.click(within(roster).getByRole("button", { name: "Remove Ada Obi" }));
    await waitFor(() =>
      expect(http.del).toHaveBeenCalledWith("/api/teacher/classes/c1/students/", {
        auth: true,
        body: { student_ids: ["u-ada"] },
      })
    );
  });

  it("enrols students in an own classless subject", async () => {
    granted = ["manage_subject_students"];
    render(<ClassManagement />);
    const section = screen.getByRole("region", { name: "Subjects without a class" });
    fireEvent.click(within(section).getByRole("button", { name: /French/ }));
    fireEvent.click(await within(section).findByRole("button", { name: /Enrol students/ }));
    const dialog = await screen.findByRole("dialog", { name: "Students in French" });
    const results = await within(dialog).findByRole("list", { name: "School students" });
    fireEvent.click(await within(results).findByRole("button", { name: "Add Bayo Ade" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/teacher/subjects/fr/students/", { student_ids: ["u-bayo"] }, { auth: true })
    );
  });

  it("creates a subject in a class they lead, or with no class", async () => {
    granted = ["create_subjects"];
    render(<ClassManagement />);
    fireEvent.click(screen.getByRole("button", { name: /New subject/ }));
    const dialog = screen.getByRole("dialog", { name: "New subject" });
    const picker = within(dialog).getByLabelText("Class");
    // Only classes he leads, plus "No class".
    expect(within(picker).getAllByRole("option").map((o) => o.textContent)).toEqual(["No class", "JSS1A"]);
    fireEvent.change(within(dialog).getByLabelText("Subject name"), { target: { value: "Art" } });
    fireEvent.change(picker, { target: { value: "c1" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create subject" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/teacher/subjects/",
        { name: "Art", description: "", classname: "c1" },
        { auth: true }
      )
    );
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "New subject" })).toBeNull());
    expect(subjectsApi.refreshData).toHaveBeenCalled();
  });

  it("hides the class page's add-subject control without create_subjects", async () => {
    render(<ClassManagement />);
    await openClass("JSS1A");
    expect(screen.queryByRole("button", { name: "Add subject to JSS1A" })).toBeNull();
    expect(screen.queryByRole("button", { name: /^\s*Subject$/ })).toBeNull();
  });

  it("offers add-subject only on a class he leads, through the one New subject form", async () => {
    granted = ["create_subjects"];
    render(<ClassManagement />);
    await openClass("JSS3C");
    expect(screen.queryByRole("button", { name: /Add subject to/ })).toBeNull();
    await openClass("JSS1A");
    fireEvent.click(screen.getByRole("button", { name: "Add subject to JSS1A" }));
    const dialog = screen.getByRole("dialog", { name: "New subject" });
    expect(within(dialog).getByLabelText("Class").value).toBe("c1");
    fireEvent.change(within(dialog).getByLabelText("Subject name"), { target: { value: "Art" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create subject" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/teacher/subjects/",
        { name: "Art", description: "", classname: "c1" },
        { auth: true }
      )
    );
    expect(http.post).not.toHaveBeenCalledWith("/api/teacher/classes/c1/subjects/", expect.anything(), expect.anything());
    await waitFor(() => expect(classesApi.fetchSubjects).toHaveBeenCalledWith("c1"));
  });

  it("imports students through the teacher endpoints", async () => {
    granted = ["import_students"];
    render(<ClassManagement />);
    fireEvent.click(screen.getByRole("button", { name: /Import students/ }));
    const dialog = screen.getByRole("dialog", { name: "Import students" });
    expect(within(dialog).getByText(/JSS1A, JSS3C/)).toBeTruthy();
    const sheet = new File(["first_name,last_name,email,class\n"], "s.csv", { type: "text/csv" });
    fireEvent.change(within(dialog).getByLabelText("Student sheet"), { target: { files: [sheet] } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Check file/ }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/teacher/students/import/", expect.any(FormData), { auth: true })
    );
  });
});

describe("useTeacherPermissions", () => {
  it("loads the teacher's codes and own classes", async () => {
    http.get.mockResolvedValueOnce({
      success: true,
      data: { permissions: ["create_subjects"], available: [], classes: OWN },
    });
    const { result } = renderHook(() => useTeacherPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(http.get).toHaveBeenCalledWith("/api/teacher/permissions/", { auth: true });
    expect(result.current.permissions).toEqual(["create_subjects"]);
    expect(result.current.has("create_subjects")).toBe(true);
    expect(result.current.has("import_students")).toBe(false);
    expect(result.current.classes).toEqual(OWN);
  });

  it("grants nothing when the request fails", async () => {
    http.get.mockRejectedValueOnce(Object.assign(new Error("Forbidden"), { status: 403 }));
    const { result } = renderHook(() => useTeacherPermissions());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.permissions).toEqual([]);
    expect(result.current.has("create_subjects")).toBe(false);
  });
});
