import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({ http: { get: vi.fn() } }));

import { http } from "@/api/baseClient";
import OnlineExamScores from "../OnlineExamScores";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OnlineExamScores", () => {
  it("lists graded online exams by term", async () => {
    http.get.mockResolvedValue({
      terms: [
        {
          term: "first",
          average_percentage: 81.5,
          grade: "A",
          subjects: [{ subject_id: "s1", subject_name: "Maths", exams_taken: 2, average_percentage: 81.5, grade: "A" }],
        },
      ],
      overall_average: 81.5,
      overall_grade: "A",
    });
    render(<OnlineExamScores />);
    expect(await screen.findByText("First term")).toBeTruthy();
    expect(screen.getByText("Maths").closest("tr").textContent).toContain("81.5");
    expect(http.get).toHaveBeenCalledWith("/api/student/transcript/", { auth: true, params: undefined });
  });

  it("says when nothing has been graded", async () => {
    http.get.mockResolvedValue({ terms: [], overall_average: null, overall_grade: null });
    render(<OnlineExamScores />);
    expect(await screen.findByText("No online exams have been graded yet.")).toBeTruthy();
  });
});
