import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import SchoolTimetablePanel from "../SchoolTimetablePanel";

/* The admin timetables Maths for JSS1 and French, which has no class. */
const SUBJECTS = [
  { id: "ma", name: "Maths", classname: "c1", class_name: "JSS1" },
  { id: "fr", name: "French", classname: null, class_name: null },
];
const ENTRIES = [
  { id: "e1", class_obj: "c1", class_name: "JSS1", subject: "ma", subject_name: "Maths", day_of_week: 0, day_name: "Monday", start_time: "09:00:00", end_time: "10:00:00", room: "Lab" },
  { id: "e2", class_obj: null, class_name: null, subject: "fr", subject_name: "French", day_of_week: 1, day_name: "Tuesday", start_time: "10:00:00", end_time: "11:00:00", room: "Room 4" },
];

beforeEach(() => {
  http.get.mockImplementation((url) => {
    if (url === "/api/admin/school/timetable/") return Promise.resolve({ success: true, data: { entries: ENTRIES } });
    if (url === "/api/admin/school/subjects/") return Promise.resolve({ success: true, data: { subjects: SUBJECTS } });
    if (url === "/api/admin/school/classes/") return Promise.resolve({ success: true, data: { classes: [{ id: "c1", name: "JSS1" }] } });
    return Promise.reject(new Error(`unexpected ${url}`));
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const fillTimes = () => {
  fireEvent.change(screen.getByLabelText("Day"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Starts"), { target: { value: "10:00" } });
  fireEvent.change(screen.getByLabelText("Ends"), { target: { value: "11:00" } });
};

describe("SchoolTimetablePanel", () => {
  it("lists slots, a classless subject's with \"No class\"", async () => {
    render(<SchoolTimetablePanel />);
    const french = await screen.findByRole("row", { name: /French/ });
    expect(within(french).getByText("No class")).toBeTruthy();
    expect(within(screen.getByRole("row", { name: /Maths/ })).getByText("JSS1")).toBeTruthy();
  });

  it("offers subjects without a class, labelled clearly", async () => {
    render(<SchoolTimetablePanel />);
    await screen.findByRole("row", { name: /French/ });
    fireEvent.click(screen.getByRole("button", { name: "Add slot" }));
    const labels = [...screen.getByLabelText("Slot for").querySelectorAll("option")].map((o) => o.textContent);
    expect(labels).toEqual(
      expect.arrayContaining(["JSS1 (whole class)", "Maths — JSS1", "French (no class)"])
    );
  });

  it("creates a slot for a subject without a class, with no class", async () => {
    http.post.mockResolvedValue({ success: true, data: { id: "e3" } });
    render(<SchoolTimetablePanel />);
    await screen.findByRole("row", { name: /French/ });
    fireEvent.click(screen.getByRole("button", { name: "Add slot" }));
    fireEvent.change(screen.getByLabelText("Slot for"), { target: { value: "subject:fr" } });
    fillTimes();
    fireEvent.click(screen.getByRole("button", { name: "Save slot" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/admin/school/timetable/",
        expect.objectContaining({ class_obj: null, subject: "fr", day_of_week: 1, start_time: "10:00", end_time: "11:00" }),
        { auth: true }
      )
    );
  });

  it("sends a class subject with its class", async () => {
    http.post.mockResolvedValue({ success: true, data: { id: "e3" } });
    render(<SchoolTimetablePanel />);
    await screen.findByRole("row", { name: /French/ });
    fireEvent.click(screen.getByRole("button", { name: "Add slot" }));
    fireEvent.change(screen.getByLabelText("Slot for"), { target: { value: "subject:ma" } });
    fillTimes();
    fireEvent.click(screen.getByRole("button", { name: "Save slot" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/admin/school/timetable/",
        expect.objectContaining({ class_obj: "c1", subject: "ma" }),
        { auth: true }
      )
    );
  });

  it("shows the server's reason when a slot clashes", async () => {
    http.post.mockRejectedValue(Object.assign(new Error("Request failed"), {
      status: 400,
      data: { success: false, field_errors: { start_time: ["Clashes with the teacher's German (no class) slot, 10:30-11:30."] } },
    }));
    render(<SchoolTimetablePanel />);
    await screen.findByRole("row", { name: /French/ });
    fireEvent.click(screen.getByRole("button", { name: "Add slot" }));
    fireEvent.change(screen.getByLabelText("Slot for"), { target: { value: "subject:fr" } });
    fillTimes();
    fireEvent.click(screen.getByRole("button", { name: "Save slot" }));
    expect(await screen.findByText(/Clashes with the teacher's German/)).toBeTruthy();
  });

  it("edits a slot", async () => {
    http.patch.mockResolvedValue({ success: true, data: { id: "e2" } });
    render(<SchoolTimetablePanel />);
    const french = await screen.findByRole("row", { name: /French/ });
    fireEvent.click(within(french).getByRole("button", { name: "Edit French Tuesday slot" }));
    expect(screen.getByLabelText("Slot for").value).toBe("subject:fr");
    fireEvent.change(screen.getByLabelText("Room"), { target: { value: "Hall" } });
    fireEvent.click(screen.getByRole("button", { name: "Save slot" }));
    await waitFor(() =>
      expect(http.patch).toHaveBeenCalledWith(
        "/api/admin/school/timetable/e2/",
        expect.objectContaining({ room: "Hall", class_obj: null, subject: "fr" }),
        { auth: true }
      )
    );
  });
});
