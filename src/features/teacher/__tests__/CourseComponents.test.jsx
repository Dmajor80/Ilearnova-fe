import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import CoursesComponent from "../components/CourseComponents";

const SUBJECTS = [
  {
    id: "eng",
    name: "English",
    class_name: "JSS2A",
    organization_name: "Bright Future",
    components: [
      { key: "ca_1", label: "CA 1", max: "50.00" },
      { key: "exam", label: "Exam", max: "100.00" },
    ],
    total: "150.00",
  },
  { id: "bio", name: "Biology", class_name: "SS1B", organization_name: "Bright Future", components: [], total: "100.00" },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("teacher subjects list", () => {
  it("shows card skeletons, then the teacher's subjects from the results API", async () => {
    let answer;
    http.get.mockReturnValue(new Promise((resolve) => (answer = resolve)));
    render(<CoursesComponent page="Class Management" />);
    expect(screen.getByRole("status", { name: "Loading your subjects" })).toBeTruthy();
    // Was GET /api/courses, which the backend never had (404).
    expect(http.get.mock.calls[0][0]).toBe("/api/results/subjects/");

    answer({ success: true, data: SUBJECTS });
    expect(await screen.findByText("English")).toBeTruthy();
    expect(screen.getByText("CA 1 50 · Exam 100")).toBeTruthy();
    expect(screen.getByText("150")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Search your subjects"), { target: { value: "ss1" } });
    expect(screen.queryByText("English")).toBeNull();
    expect(screen.getByText("Biology")).toBeTruthy();
  });

  it("says when nothing is assigned and when loading fails", async () => {
    http.get.mockResolvedValueOnce({ success: true, data: [] });
    render(<CoursesComponent page="Assignments" />);
    expect(await screen.findByText("You have not been assigned any subjects yet")).toBeTruthy();
    cleanup();

    http.get.mockRejectedValueOnce(new Error("down"));
    render(<CoursesComponent page="Assignments" />);
    expect((await screen.findByRole("alert")).textContent).toContain("could not be loaded");
  });
});
