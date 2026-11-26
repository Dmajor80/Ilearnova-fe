import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import ParentTimetable from "../Pages/ParentTimetable";
import Announcement from "../Pages/Announcement";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const CHILDREN = [
  { id: "c1", first_name: "Tolu", last_name: "Bello" },
  { id: "c2", first_name: "Kemi", last_name: "Bello" },
];
const day = (subject) => ({
  days: [{ day_of_week: 1, day_name: "Tuesday", entries: [{ id: subject, start_time: "09:00", end_time: "09:40", subject_name: subject, course_name: "JSS1" }] }],
});

describe("Parent timetable", () => {
  it("shows the chosen child's timetable", async () => {
    http.get.mockImplementation((url) =>
      Promise.resolve(
        url === "/api/parent/children/" ? CHILDREN : url.includes("/c1/") ? day("Maths") : day("Biology")
      )
    );
    render(<ParentTimetable />);
    expect(await screen.findByText("Maths")).toBeTruthy();
    expect(screen.getByText("Tolu Bello's lessons for the week.")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Child"), { target: { value: "c2" } });
    expect(await screen.findByText("Biology")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/parent/children/c2/timetable/", { auth: true });
  });

  it("asks to link a child when there are none", async () => {
    http.get.mockResolvedValue([]);
    render(<ParentTimetable />);
    expect(await screen.findByText(/Link your child/)).toBeTruthy();
  });
});

describe("Parent announcements", () => {
  it("lists the school's announcements and searches them", async () => {
    http.get.mockResolvedValue([
      { id: 1, title: "Sports day", message: "Friday at 10am", created_at: "2026-11-20T09:00:00Z", author_name: "Ada Obi", organization_name: "Bright School" },
      { id: 2, title: "Fees reminder", message: "Due Monday", created_at: "2026-11-18T09:00:00Z", author_name: null, organization_name: "Bright School" },
    ]);
    render(<Announcement />);
    expect(await screen.findByText("Sports day")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/parent/announcements/", { auth: true });
    fireEvent.change(screen.getByLabelText("Search announcements"), { target: { value: "fees" } });
    expect(screen.queryByText("Sports day")).toBeNull();
    expect(screen.getByText("Fees reminder")).toBeTruthy();
  });

  it("shows an empty state, not sample announcements", async () => {
    http.get.mockResolvedValue([]);
    render(<Announcement />);
    expect(await screen.findByText("No announcements from the school yet.")).toBeTruthy();
    expect(screen.queryByText(/Mid-Term Examination/)).toBeNull();
  });

  it("shows the error, not sample announcements, when loading fails", async () => {
    http.get.mockRejectedValue(new Error("Network down"));
    render(<Announcement />);
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.queryByText(/Mid-Term Examination/)).toBeNull();
  });
});
