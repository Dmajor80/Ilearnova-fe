import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import SchoolSubjectsPanel from "../SchoolSubjectsPanel";

const SUBJECTS = [
  { id: "s1", name: "Maths", classname: "c1", class_name: "JSS1", teacher_name: "Mr Bello", student_count: 30, is_active: true },
  { id: "s2", name: "French", classname: null, class_name: null, teacher_name: null, student_count: 4, is_active: true },
];

beforeEach(() => {
  http.get.mockImplementation((url) => {
    if (url === "/api/admin/school/subjects/") return Promise.resolve({ success: true, data: { subjects: SUBJECTS } });
    if (url === "/api/admin/school/classes/") return Promise.resolve({ success: true, data: { classes: [{ id: "c1", name: "JSS1" }] } });
    if (url === "/api/admin/school/teachers/") return Promise.resolve({ success: true, data: { teachers: [] } });
    if (url === "/api/admin/school/subjects/s2/students/") {
      return Promise.resolve({ success: true, data: { count: 0, students: [] } });
    }
    if (url === "/api/admin/school/students/") return Promise.resolve({ success: true, data: { students: [] } });
    return Promise.reject(new Error(`unexpected ${url}`));
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SchoolSubjectsPanel", () => {
  it("lists subjects without a class in their own section with a Students action", async () => {
    render(<SchoolSubjectsPanel />);
    const classless = await screen.findByRole("region", { name: "Subjects without a class" });
    expect(within(classless).getByText("French")).toBeTruthy();
    expect(within(classless).getByText("4 students")).toBeTruthy();
    expect(within(classless).queryByText("Maths")).toBeNull();

    const classed = screen.getByRole("region", { name: "Class subjects" });
    expect(within(classed).getByText("Maths")).toBeTruthy();
    expect(within(classed).getByText("JSS1")).toBeTruthy();

    fireEvent.click(within(classless).getByRole("button", { name: "Students in French" }));
    expect(await screen.findByRole("dialog", { name: "Students taking French" })).toBeTruthy();
  });

  it("creates a subject without a class", async () => {
    http.post.mockResolvedValue({ success: true, data: { id: "s3", name: "Music", classname: null } });
    render(<SchoolSubjectsPanel />);
    await screen.findByRole("region", { name: "Subjects without a class" });
    fireEvent.click(screen.getByRole("button", { name: "Add subject" }));
    fireEvent.change(screen.getByLabelText("Subject name"), { target: { value: "Music" } });
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "__none__" } });
    fireEvent.click(screen.getByRole("button", { name: "Save subject" }));
    await vi.waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/admin/school/subjects/",
        { name: "Music", classname: null, teacher_role: null, description: "" },
        { auth: true }
      )
    );
  });
});
