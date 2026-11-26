import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Attendance from "./Attendance";
import { attendanceBy } from "./attendanceUtils";

const rec = (date, status, subject_id = "maths", subject_name = "Maths") => ({
  date,
  status,
  subject_id,
  subject_name,
  course_name: "JSS2A",
});
const RECORDS = [
  rec("2026-10-02", "absent"),
  rec("2026-10-01", "present"),
  rec("2026-09-30", "late", "eng", "English"),
  rec("2026-09-29", "excused", "eng", "English"),
];
const DATA = {
  summary: { total: 4, present: 1, late: 1, absent: 1, excused: 1, attendance_percentage: 50 },
  records: RECORDS,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("attendanceBy", () => {
  it("counts present and late as attended, like the backend", () => {
    const rows = attendanceBy(RECORDS, (r) => r.subject_id, (r) => r.subject_name);
    expect(rows.map((r) => [r.label, r.attended, r.total, r.percentage])).toEqual([
      ["Maths", 1, 2, 50],
      ["English", 1, 2, 50],
    ]);
  });
});

describe("student Attendance page", () => {
  it("shows the real summary, subject and month bars, and the days", async () => {
    http.get.mockResolvedValue({ success: true, data: DATA });
    render(<Attendance />);
    expect(screen.getByRole("status", { name: "Loading attendance summary" })).toBeTruthy();

    expect(await screen.findByRole("heading", { name: "Days" })).toBeTruthy();
    expect(screen.getByText("Attendance", { selector: "dt" }).nextSibling.textContent).toBe("50%");
    expect(http.get).toHaveBeenCalledWith("/api/student/attendance/", { auth: true, params: {} });
    const bySubject = screen.getByRole("region", { name: "By subject" });
    expect(within(bySubject).getByText("English")).toBeTruthy();
    const byMonth = screen.getByRole("region", { name: "By month" });
    expect(within(byMonth).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(5);
    // The old page's invented data is gone.
    expect(screen.queryByText(/John Doe/)).toBeNull();
    expect(screen.queryByText("Geo")).toBeNull();
  });

  it("sends the subject filter to the API and keeps the subject list", async () => {
    http.get.mockResolvedValue({ success: true, data: DATA });
    render(<Attendance />);
    await screen.findByRole("heading", { name: "Days" });
    http.get.mockResolvedValue({
      success: true,
      data: { summary: { ...DATA.summary, total: 2 }, records: RECORDS.slice(2) },
    });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "eng" } });
    await screen.findByRole("button", { name: "Clear" });
    expect(http.get).toHaveBeenLastCalledWith("/api/student/attendance/", { auth: true, params: { subject_id: "eng" } });
    expect(within(screen.getByLabelText("Subject")).getAllByRole("option")).toHaveLength(3);
  });

  it("says when no attendance has been taken", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: { summary: { total: 0, present: 0, late: 0, absent: 0, excused: 0, attendance_percentage: 0 }, records: [] },
    });
    render(<Attendance />);
    expect(await screen.findByText("Your teachers haven't taken attendance yet.")).toBeTruthy();
  });
});
