import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { ProgressSummary } from "../Pages/ParentDashboard";

afterEach(cleanup);

describe("Parent progress summary", () => {
  it("shows attendance by subject instead of raw data", () => {
    render(
      <ProgressSummary
        progress={{
          child: { id: "c1", first_name: "Tolu" },
          exam_results: [{ exam: "e1", title: "Maths quiz", score: 18, total_marks: 20 }],
          graded_submissions: [],
          attendance_summary: [
            { subject_name: "Mathematics", present: 8, late: 1, absent: 1, excused: 0 },
            { subject_name: "English", present: 10, late: 0, absent: 0, excused: 0 },
          ],
        }}
      />
    );
    expect(screen.getByText("95%")).toBeTruthy(); // 19 of 20 attended
    expect(screen.getByText("Mathematics")).toBeTruthy();
    expect(screen.getByText("(9/10)")).toBeTruthy();
    expect(screen.getByText("18/20")).toBeTruthy();
    expect(screen.queryByText(/"child"/)).toBeNull();
  });

  it("says nothing is recorded yet when empty", () => {
    render(<ProgressSummary progress={{ child: {}, exam_results: [], graded_submissions: [], attendance_summary: [] }} />);
    expect(screen.getByText(/Nothing recorded yet/)).toBeTruthy();
  });
});
