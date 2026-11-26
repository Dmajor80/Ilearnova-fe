import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/teacher", () => ({
  useTeacherClasses: () => ({ classes: [], error: null }),
  useTeacherAnalytics: () => ({
    loading: false,
    error: null,
    refreshData: vi.fn(),
    analytics: {
      summary: { subject_count: 1, student_count: 12 },
      subjects: [
        {
          subject_id: "s1",
          subject_name: "Mathematics",
          class_name: "JSS1 Gold",
          student_count: 12,
          attendance_rate: 94.7,
          exams: { average_percentage: null, pass_rate: null },
          assignments: { submission_rate: 80 },
        },
      ],
    },
  }),
}));

import TeacherAnalytics from "./TeacherAnalytics";

afterEach(cleanup);

describe("Teacher analytics", () => {
  it("shows a table per subject, not raw JSON", () => {
    render(<TeacherAnalytics />);
    const row = screen.getByRole("row", { name: /Mathematics/ });
    expect(within(row).getByText("JSS1 Gold")).toBeTruthy();
    expect(within(row).getByText("94.7%")).toBeTruthy();
    expect(within(row).getByText("80%")).toBeTruthy();
    expect(within(row).getAllByText("—")).toHaveLength(2);
    expect(screen.queryByText(/subject_id/)).toBeNull();
  });
});
