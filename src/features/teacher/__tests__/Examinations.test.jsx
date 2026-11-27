import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const EXAM = {
  id: "exam-1",
  title: "Mathematics mid-term test",
  subject: "sub-1",
  subject_name: "Mathematics",
  total_marks: 10,
  num_of_questions: 2,
  duration_minutes: 30,
  is_published: true
};

const examsApi = {
  examinations: [EXAM],
  submissions: [],
  loading: false,
  mutating: false,
  error: null,
  examinationPagination: null,
  submissionPagination: null,
  refreshData: vi.fn(),
  fetchSubmissions: vi.fn(() => Promise.resolve()),
  saveExamination: vi.fn(() => Promise.resolve()),
  removeExamination: vi.fn(() => Promise.resolve())
};

vi.mock("@/hooks/teacher", () => ({
  useTeacherExaminations: () => examsApi,
  useTeacherSubjects: () => ({ subjects: [], error: null })
}));
vi.mock("../components/CourseComponents", () => ({ default: () => null }));
vi.mock("../exams/ExamQuestions", () => ({
  default: ({ exam, open }) => (open ? <p>Question manager for {exam.title}</p> : null)
}));

import Examinations from "../Examinations";

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("Examinations", () => {
  it("opens the question manager for an exam, with no raw data editors", () => {
    render(<Examinations />);
    fireEvent.click(screen.getByRole("button", { name: /questions/i }));
    expect(screen.getByText("Question manager for Mathematics mid-term test")).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/json/i);
  });

  it("deletes an exam through a confirmation dialog, not window.confirm", async () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    render(<Examinations />);
    fireEvent.click(screen.getByRole("button", { name: "Delete examination" }));
    const dialog = screen.getByRole("alertdialog", { name: "Delete this examination?" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(examsApi.removeExamination).toHaveBeenCalledWith("exam-1", { page: 1 }));
    expect(confirmSpy).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
