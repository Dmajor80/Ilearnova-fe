import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

/* Mrs Okafor teaches Maths to JSS1A and French, which has no class. */
const timetableApi = {
  timetable: {
    days: [{
      day_of_week: 1,
      day_name: "Tuesday",
      entries: [
        { id: "a", start_time: "09:00:00", end_time: "10:00:00", subject_name: "Mathematics", class_id: "c1", class_name: "JSS1A", room: "Lab" },
        { id: "b", start_time: "10:00:00", end_time: "11:00:00", subject_name: "French", class_id: null, class_name: null, room: "Room 4" },
      ],
    }],
  },
  loading: false,
  error: null,
  refreshData: vi.fn(),
};

vi.mock("@/hooks/teacher", () => ({ useTeacherTimetable: () => timetableApi }));

import Timetable from "../Timetable";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Teacher timetable", () => {
  it("shows a classless subject's slot with \"No class\" and can filter to it", () => {
    render(<Timetable />);
    expect(screen.getByText("French")).toBeTruthy();
    expect(screen.getByText("No class", { selector: "p" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "No class" } });
    expect(screen.getByText("French")).toBeTruthy();
    expect(screen.queryByText("Mathematics")).toBeNull();
  });
});
