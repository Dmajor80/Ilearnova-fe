import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/hooks/student", () => ({
  useStudentAnnouncements: () => ({ loading: false, error: null, announcements: [] }),
  useStudentAssignments: () => ({ loading: false, error: null, pendingAssignments: [] }),
}));
vi.mock("./LiveCalendar", () => ({ default: () => null }));
vi.mock("./StudentsTable", () => ({ default: () => null }));
vi.mock("../auth/Profile", () => ({ default: () => null }));

import { http } from "@/api/baseClient";
import Overview from "./Overview";

const PROGRESS = [
  { course_id: "c1", course_name: "JSS2A", total_lessons: 4, completed_lessons: 1, completion_percentage: 25 },
  { course_id: "c2", course_name: "Coding club", total_lessons: 2, completed_lessons: 2, completion_percentage: 100 },
  { course_id: "c3", course_name: "Chess club", total_lessons: 0, completed_lessons: 0, completion_percentage: 0 },
];
const ATTENDANCE = { summary: { total: 5, attendance_percentage: 80 }, records: [] };
const TRANSCRIPT = {
  terms: [
    {
      term: "first",
      subjects: [{ subject_id: "s1", subject_name: "Maths", exams_taken: 2, average_percentage: 72.5, grade: "B" }],
      average_percentage: 72.5,
      grade: "B",
    },
  ],
  overall_average: 72.5,
  overall_grade: "B",
};

const ok = (data) => Promise.resolve({ success: true, data });
const routes = {
  "/api/student/courses/progress/": () => ok(PROGRESS),
  "/api/student/attendance/": () => ok(ATTENDANCE),
  "/api/student/transcript/": () => ok(TRANSCRIPT),
};

const show = () =>
  render(
    <MemoryRouter>
      <Overview />
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("student Overview", () => {
  it("shows skeletons while its data loads", () => {
    http.get.mockReturnValue(new Promise(() => {}));
    show();
    expect(screen.getByRole("status", { name: "Loading courses in progress" })).toBeTruthy();
    expect(screen.getByRole("status", { name: "Loading attendance" })).toBeTruthy();
    expect(screen.getByRole("status", { name: "Loading exam scores" })).toBeTruthy();
    expect(screen.queryByText(/Loading dashboard data/)).toBeNull();
  });

  it("loads from the student endpoints, not the missing /api/dashboard/student", async () => {
    http.get.mockImplementation((path) => routes[path]());
    show();
    // Coding club is finished, JSS2A is a quarter done, Chess club has no lessons.
    expect(await screen.findByText("1 of 4 lessons done")).toBeTruthy();
    expect(screen.queryByText("Coding club")).toBeNull();
    expect(screen.getByText("Courses Completed").parentElement.textContent).toContain("1");
    expect(await screen.findByText("72.5% (B)")).toBeTruthy();
    expect(screen.getByText("First term")).toBeTruthy();
    expect(screen.getByText("Maths")).toBeTruthy();
    expect(screen.getByText("Present")).toBeTruthy();
    expect(http.get.mock.calls.map(([path]) => path).sort()).toEqual(Object.keys(routes).sort());
  });

  it("keeps the other sections when one fails", async () => {
    http.get.mockImplementation((path) =>
      path === "/api/student/transcript/" ? Promise.reject(new Error("down")) : routes[path]()
    );
    show();
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(await screen.findByText("1 of 4 lessons done")).toBeTruthy();
    expect(screen.queryByText("No online exams have been graded yet.")).toBeNull();
  });
});
