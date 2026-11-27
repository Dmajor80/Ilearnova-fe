import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import SubjectEnrolmentModal from "../SubjectEnrolmentModal";

const SUBJECT = { id: "s1", name: "French", classname: null, student_count: 1 };
const ADA = { id: "u-ada", student_role_id: "r-ada", name: "Ada Obi", email: "ada@x.ng" };
const BAYO = { id: "u-bayo", student_role_id: "r-bayo", name: "Bayo Ade", email: "bayo@x.ng" };
const roster = (students) => ({
  success: true,
  data: { subject_id: "s1", classless: true, count: students.length, students },
});

beforeEach(() => {
  http.get.mockImplementation((url) => {
    if (url === "/api/admin/school/subjects/s1/students/") return Promise.resolve(roster([ADA]));
    if (url === "/api/admin/school/students/") {
      return Promise.resolve({
        success: true,
        data: {
          students: [
            { id: "u-ada", full_name: "Ada Obi", email: "ada@x.ng", class_name: "JSS1" },
            { id: "u-bayo", full_name: "Bayo Ade", email: "bayo@x.ng", class_name: "JSS3" },
          ],
        },
      });
    }
    return Promise.reject(new Error(`unexpected ${url}`));
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SubjectEnrolmentModal", () => {
  it("lists enrolled students with a count", async () => {
    render(<SubjectEnrolmentModal subject={SUBJECT} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Students taking French" })).toBeTruthy();
    const enrolled = await screen.findByRole("list", { name: "Enrolled students" });
    expect(within(enrolled).getByText("Ada Obi")).toBeTruthy();
    expect(screen.getByText("1 student enrolled")).toBeTruthy();
  });

  it("searches the school's students and enrols one", async () => {
    http.post.mockResolvedValue(roster([ADA, BAYO]));
    const onChanged = vi.fn();
    render(<SubjectEnrolmentModal subject={SUBJECT} onClose={() => {}} onChanged={onChanged} />);
    await screen.findByRole("list", { name: "Enrolled students" });

    fireEvent.change(screen.getByLabelText("Search students"), { target: { value: "bayo" } });
    await waitFor(() =>
      expect(http.get).toHaveBeenCalledWith(
        "/api/admin/school/students/",
        expect.objectContaining({ params: expect.objectContaining({ search: "bayo" }) })
      )
    );

    // Ada is already enrolled, so she cannot be added again.
    expect((await screen.findByRole("button", { name: "Add Ada Obi" })).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Add Bayo Ade" }));

    expect(await screen.findByText("2 students enrolled")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith(
      "/api/admin/school/subjects/s1/students/",
      { student_ids: ["u-bayo"] },
      { auth: true }
    );
    expect(onChanged).toHaveBeenCalledWith(2);
  });

  it("removes a student", async () => {
    http.del.mockResolvedValue(roster([]));
    const onChanged = vi.fn();
    render(<SubjectEnrolmentModal subject={SUBJECT} onClose={() => {}} onChanged={onChanged} />);
    fireEvent.click(await screen.findByRole("button", { name: "Remove Ada Obi" }));

    expect(await screen.findByText("0 students enrolled")).toBeTruthy();
    expect(http.del).toHaveBeenCalledWith("/api/admin/school/subjects/s1/students/u-ada/", { auth: true });
    expect(onChanged).toHaveBeenCalledWith(0);
  });

  it("shows why an enrolment failed", async () => {
    const error = new Error("Validation failed");
    error.data = { field_errors: { student_ids: ["Not students in this school: u-bayo"] } };
    http.post.mockRejectedValue(error);
    render(<SubjectEnrolmentModal subject={SUBJECT} onClose={() => {}} />);
    await screen.findByRole("list", { name: "Enrolled students" });
    fireEvent.click(await screen.findByRole("button", { name: "Add Bayo Ade" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/Not students in this school/);
  });
});
