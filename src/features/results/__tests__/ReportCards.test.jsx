import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import ReportCards from "../ReportCards";

const REPORT = {
  organization_id: "org-1",
  organization_name: "Sunrise College",
  student_name: "Ada Obi",
  class_name: "JSS2A",
  session: "2026/2027",
  term: "first",
  term_label: "First Term",
  subjects: [
    {
      id: "r1",
      subject_name: "Mathematics",
      scores: [
        { key: "ca_1", label: "CA 1", max: "50", score: "40" },
        { key: "exam", label: "Exam", max: "150", score: "110" },
      ],
      total: "150.00",
      max_total: "200.00",
      percentage: "75.00",
      grade: "A",
      remark: "Well done",
    },
  ],
  subject_count: 1,
  total_score: "150.00",
  total_possible: "200.00",
  average: "75.00",
  average_score: "150.00",
  average_out_of: "200.00",
  average_grade: "A",
  average_remark: "Excellent",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ReportCards", () => {
  it("shows the student's own report card with average and no position", async () => {
    http.get.mockResolvedValue({ success: true, data: [REPORT] });
    render(<ReportCards />);

    expect(await screen.findByText("First Term, 2026/2027")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/results/me/", { auth: true, params: undefined });
    // One column per CA / exam, maxima in the headings.
    const headings = screen.getAllByRole("columnheader").map((th) => th.textContent);
    expect(headings).toEqual(["Subject", "CA 1 (50)", "Exam (150)", "Total", "%", "Grade", "Remark"]);
    const row = screen.getByText("Mathematics").closest("tr");
    expect([...row.cells].map((td) => td.textContent)).toEqual(["Mathematics", "40", "110", "150/200", "75", "A", "Well done"]);
    expect(screen.getByText("75% (150 / 200)")).toBeTruthy();
    expect(screen.queryByText(/position|rank/i)).toBeNull();
    expect(screen.getByRole("button", { name: /Download PDF/ })).toBeTruthy();
  });

  it("loads a parent's child by id and handles none published", async () => {
    http.get.mockResolvedValue({ success: true, data: [] });
    render(<ReportCards childId="child-9" emptyText="Nothing yet for this child." />);
    expect(await screen.findByText("Nothing yet for this child.")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/results/children/child-9/", {
      auth: true,
      params: undefined,
    });
  });
});
