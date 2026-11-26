import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import { CoursesComponent } from "./CoursesComponent";
import CoursePage from "./CoursePage";

const ok = (data) => Promise.resolve({ success: true, data });

const CATALOGUE = [
  { id: "jss2a", name: "JSS2A", description: "", teacher_name: "Musa Bello", subject_count: 2, is_enrolled: true },
  { id: "club", name: "Coding club", description: "After school", teacher_name: null, subject_count: 1, is_enrolled: true },
];
const PROGRESS = [
  { course_id: "jss2a", course_name: "JSS2A", total_lessons: 4, completed_lessons: 1, completion_percentage: 25 },
  { course_id: "club", course_name: "Coding club", total_lessons: 0, completed_lessons: 0, completion_percentage: 0 },
];
const MATERIALS = {
  class: { id: "jss2a", name: "JSS2A", teacher_name: "Musa Bello" },
  materials: [
    { id: "m1", title: "Whole numbers", content_type: "youtube", link: "https://youtu.be/x", file: null, topic_name: "Number", estimated_duration_minutes: 20, uploaded_by_name: "Musa Bello", description: "", is_completed: true },
    { id: "m2", title: "Fractions", content_type: "text", link: null, file: null, topic_name: null, estimated_duration_minutes: null, uploaded_by_name: "Musa Bello", description: "Halves and quarters.", is_completed: false },
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("student courses", () => {
  it("lists the student's classes with progress, with no sample courses", async () => {
    http.get.mockImplementation((path, opts) => {
      if (path === "/api/student/courses/") {
        expect(opts.params).toEqual({ enrolled: "true" });
        return ok(CATALOGUE);
      }
      if (path === "/api/student/courses/progress/") return ok(PROGRESS);
      throw new Error(`unexpected ${path}`);
    });
    render(<MemoryRouter><CoursesComponent /></MemoryRouter>);
    expect(screen.getByRole("status", { name: "Loading your courses" })).toBeTruthy();

    const jss2a = (await screen.findByText("JSS2A")).closest("article");
    expect(within(jss2a).getByText("1 of 4 lessons done")).toBeTruthy();
    expect(within(jss2a).getByText("Musa Bello")).toBeTruthy();
    expect(within(jss2a).getByRole("button").textContent).toContain("Continue learning");
    const club = screen.getByText("Coding club").closest("article");
    expect(within(club).getByText("No lessons published yet")).toBeTruthy();
    expect(screen.queryByText("Advanced Mathematics")).toBeNull();

    fireEvent.change(screen.getByLabelText("Search your courses"), { target: { value: "musa" } });
    expect(screen.queryByText("Coding club")).toBeNull();
  });

  it("shows an error instead of made-up courses when loading fails", async () => {
    http.get.mockRejectedValue(new Error("down"));
    render(<MemoryRouter><CoursesComponent /></MemoryRouter>);
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
  });

  it("opens a class's lessons and marks one done", async () => {
    http.get.mockImplementation((path) =>
      path === "/api/student/classes/jss2a/materials/" ? ok(MATERIALS) : Promise.reject(new Error(path))
    );
    http.post.mockResolvedValue({ success: true });
    render(
      <MemoryRouter initialEntries={["/student-dashboard/courses/jss2a"]}>
        <Routes>
          <Route path="/student-dashboard/courses/:courseId" element={<CoursePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole("status", { name: "Loading lessons" })).toBeTruthy();
    expect(await screen.findByRole("heading", { name: "JSS2A" })).toBeTruthy();
    expect(screen.getByText("1 of 2 lessons done")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Watch/ }).getAttribute("href")).toBe("https://youtu.be/x");
    expect(screen.getByText("Halves and quarters.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Mark as done Fractions" }));
    await waitFor(() => expect(screen.getByText("2 of 2 lessons done")).toBeTruthy());
    expect(http.post.mock.calls[0][0]).toBe("/api/student/materials/m2/complete/");
  });
});
