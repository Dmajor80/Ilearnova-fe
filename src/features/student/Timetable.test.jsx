import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import Timetable from "./Timetable";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const DAYS = [
  {
    day_of_week: 0,
    day_name: "Monday",
    entries: [
      { id: "a", start_time: "08:00:00", end_time: "08:40:00", subject_name: "Maths", course_name: "JSS1", teacher_name: "Ada Obi", room: "Lab 1" },
      { id: "b", start_time: "13:00:00", end_time: "13:40:00", subject_name: "English", course_name: "JSS1", teacher_name: null, room: "", meeting_link: "https://meet.example.com/x" },
    ],
  },
];

describe("Student timetable", () => {
  it("shows the school's timetable from the API", async () => {
    http.get.mockResolvedValue({ success: true, data: { days: DAYS } });
    render(<Timetable />);
    const monday = await screen.findByRole("region", { name: "Monday" });
    expect(http.get).toHaveBeenCalledWith("/api/student/timetable/", { auth: true });
    expect(within(monday).getByText("Maths")).toBeTruthy();
    expect(within(monday).getByText("JSS1 · Ada Obi · Lab 1")).toBeTruthy();
    expect(within(monday).getByText("8:00 AM")).toBeTruthy();
    expect(within(monday).getByText("1:40 PM")).toBeTruthy();
    expect(within(monday).getByRole("link", { name: /Join online/ }).getAttribute("href")).toBe("https://meet.example.com/x");
  });

  it("says so when there's no timetable, with no sample lessons", async () => {
    http.get.mockResolvedValue({ success: true, data: { days: [] } });
    render(<Timetable />);
    expect(await screen.findByText("No timetable yet")).toBeTruthy();
    expect(screen.queryByText(/Mathematics|Stephen Hill/)).toBeNull();
  });

  it("shows a subject without a class as \"No class\"", async () => {
    const days = [{
      day_of_week: 1,
      day_name: "Tuesday",
      entries: [{ id: "f", start_time: "10:00:00", end_time: "11:00:00", subject_name: "French", course_id: null, course_name: null, teacher_name: "Mrs Okafor", room: "Room 4" }],
    }];
    http.get.mockResolvedValue({ success: true, data: { days } });
    render(<Timetable />);
    const tuesday = await screen.findByRole("region", { name: "Tuesday" });
    expect(within(tuesday).getByText("French")).toBeTruthy();
    expect(within(tuesday).getByText("No class · Mrs Okafor · Room 4")).toBeTruthy();
  });
});
