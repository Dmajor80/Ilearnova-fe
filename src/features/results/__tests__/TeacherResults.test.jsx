import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import TeacherResults from "../TeacherResults";

const MATHS = {
  id: "maths-1",
  name: "Maths",
  class_name: "JSS2A",
  components_source: "school",
  components: [
    { key: "ca_1", label: "CA 1", max: "50.00" },
    { key: "ca_2", label: "CA 2", max: "50.00" },
    { key: "exam", label: "Exam", max: "100.00" },
  ],
  total: "200.00",
};

const SHEET = {
  subject_id: "maths-1",
  subject_name: "Maths",
  class_name: "JSS2A",
  components: MATHS.components,
  total: "200.00",
  students: [
    { student_id: "ada", student_name: "Ada Obi", email: "ada@x.ng", result: null },
    { student_id: "bayo", student_name: "Bayo Ade", email: "bayo@x.ng", result: null },
  ],
};

const respond = (path) => {
  if (path === "/api/results/subjects/") return Promise.resolve({ success: true, data: [MATHS] });
  if (path === "/api/results/school/grading-policy/")
    return Promise.resolve({
      success: true,
      data: { grade_bands: [{ grade: "A", min: "70" }, { grade: "F", min: "0" }] },
    });
  if (path.endsWith("/scores/")) return Promise.resolve({ success: true, data: SHEET });
  return Promise.resolve({ success: true, data: {} });
};

beforeEach(() => {
  http.get.mockImplementation(respond);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TeacherResults", () => {
  it("shows the subject's components and a live total out of 200", async () => {
    render(<TeacherResults />);
    expect(await screen.findByText(/CA 1 \(50\) \+ CA 2 \(50\) \+ Exam \(100\) = 200/)).toBeTruthy();

    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "40" } });
    fireEvent.change(screen.getByLabelText("Ada Obi CA 2"), { target: { value: "35" } });
    fireEvent.change(screen.getByLabelText("Ada Obi Exam"), { target: { value: "75" } });

    const row = screen.getByLabelText("Ada Obi CA 1").closest("tr");
    expect(row.textContent).toContain("150"); // total
    expect(row.textContent).toContain("75"); // percent
    expect(row.textContent).toContain("A"); // preview grade
  });

  it("saves only the changed students", async () => {
    http.post.mockResolvedValue({ success: true, data: [] });
    render(<TeacherResults />);
    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /Save \(1\)/ }));

    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe("/api/results/subjects/maths-1/scores/");
    expect(body.term).toBe("first");
    expect(body.results).toEqual([
      { student_id: "ada", scores: { ca_1: "8", ca_2: null, exam: null }, remark: "" },
    ]);
  });

  it("highlights the row the backend rejected", async () => {
    const error = new Error("Validation failed");
    error.status = 400;
    error.data = { field_errors: { rows: [{ 2: ["student is not enrolled in this subject's class"] }] } };
    http.post.mockRejectedValue(error);

    render(<TeacherResults />);
    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Bayo Ade CA 1"), { target: { value: "9" } });
    fireEvent.click(screen.getByRole("button", { name: /Save \(2\)/ }));

    expect(await screen.findByText(/Nothing was saved/)).toBeTruthy();
    const bayoRow = screen.getByLabelText("Bayo Ade CA 1").closest("tr");
    expect(bayoRow.textContent).toContain("not enrolled");
  });

  it("does not blame the rows when the school is read-only", async () => {
    // Found clicking through a lapsed school: the message said "Fix the
    // highlighted rows" although nothing was highlighted.
    const error = new Error("Payment Required");
    error.status = 402;
    error.data = {
      success: false,
      code: "SUBSCRIPTION_READ_ONLY",
      error: "This school's subscription has expired, so it is read-only. An admin can renew it under Billing.",
    };
    http.post.mockRejectedValue(error);

    render(<TeacherResults />);
    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: /Save \(1\)/ }));

    const alert = await screen.findByText(/subscription has expired/);
    expect(alert.closest('[role="alert"]').textContent).not.toMatch(/highlighted rows/);
  });

  it("tells the teacher an edited published result needs publishing again", async () => {
    const result = (published) => ({
      id: "r-ada",
      scores: { ca_1: "40", ca_2: "35", exam: "75" },
      remark: "",
      is_published: published,
    });
    let adaPublished = true;
    http.get.mockImplementation((path) =>
      path.endsWith("/scores/")
        ? Promise.resolve({
            success: true,
            data: {
              ...SHEET,
              students: [
                { ...SHEET.students[0], result: result(adaPublished) },
                { ...SHEET.students[1], result: { ...result(true), id: "r-bayo" } },
              ],
            },
          })
        : respond(path)
    );
    http.post.mockImplementation(() => {
      adaPublished = false; // the backend unpublished Ada's edited result
      return Promise.resolve({ success: true, message: "Saved 1 result(s).", unpublished: 1, data: [] });
    });

    render(<TeacherResults />);
    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: /Save \(1\)/ }));

    expect(await screen.findByText(/won't see the change until you publish again/)).toBeTruthy();
    const adaRow = (await screen.findByLabelText("Ada Obi CA 1")).closest("tr");
    await waitFor(() => expect(adaRow.textContent).toContain("Edited, publish again"));
    expect(screen.getByLabelText("Bayo Ade CA 1").closest("tr").textContent).toContain("Published");
    expect(screen.getByText(/1 result is hidden from students and parents/)).toBeTruthy();
  });

  it("blocks saving a score above the component maximum", async () => {
    render(<TeacherResults />);
    fireEvent.change(await screen.findByLabelText("Ada Obi CA 1"), { target: { value: "51" } });
    expect(screen.getByRole("button", { name: /Save/ }).disabled).toBe(true);
  });

  it("explains when the teacher has no subjects", async () => {
    http.get.mockImplementation((path) =>
      path === "/api/results/subjects/" ? Promise.resolve({ success: true, data: [] }) : respond(path)
    );
    render(<TeacherResults />);
    expect(await screen.findByText(/not assigned to any subject/)).toBeTruthy();
  });
});
