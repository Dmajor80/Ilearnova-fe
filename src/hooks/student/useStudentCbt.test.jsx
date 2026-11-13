import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }));

vi.mock("@/api/student", () => ({
  createStudentCbtIntegrityEvent: vi.fn(),
  getStudentCbtAttempt: vi.fn(),
  getStudentCbtExam: vi.fn(),
  getStudentCbtExams: vi.fn(),
  getStudentCbtResult: vi.fn(),
  saveStudentCbtAnswer: vi.fn(),
  startStudentCbtAttempt: vi.fn(),
  submitStudentCbtAttempt: vi.fn()
}));

vi.mock("@/hooks/useNotification", () => ({
  default: () => ({ notify })
}));

vi.mock("@/lib/errorHandler", () => ({
  getNotificationType: () => "error",
  getUserFriendlyMessage: (error) => error.message,
  parseError: (error) => error
}));

import {
  getStudentCbtAttempt,
  getStudentCbtExams,
  getStudentCbtResult,
  saveStudentCbtAnswer,
  startStudentCbtAttempt,
  submitStudentCbtAttempt
} from "@/api/student";
import useStudentCbt from "./useStudentCbt";

const attempt = {
  id: "attempt-1",
  exam_id: "exam-1",
  exam_title: "Biology",
  status: "in_progress",
  time_remaining_seconds: 120,
  questions: [{
    id: "question-1",
    question_text: "Explain photosynthesis",
    question_type: "short_answer",
    options: [],
    answer: null,
    saved_at: null
  }]
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useStudentCbt", () => {
  it("loads exams and completes the start, autosave, and submit flow", async () => {
    getStudentCbtExams.mockResolvedValue({
      data: { results: [{ id: "exam-1", title: "Biology" }], next: null }
    });
    startStudentCbtAttempt.mockResolvedValue({ data: attempt });
    saveStudentCbtAnswer.mockResolvedValue({ data: { answer: "Plants use light" } });
    submitStudentCbtAttempt.mockResolvedValue({
      data: {
        attempt_id: "attempt-1",
        exam_title: "Biology",
        status: "submitted",
        score: 1,
        total_marks: 1,
        percentage: 100,
        pending_manual_grading: false,
        review_available: false,
        answers: []
      }
    });

    const { result } = renderHook(() => useStudentCbt());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.exams).toEqual([{ id: "exam-1", title: "Biology" }]);

    await act(async () => {
      await result.current.startAttempt("exam-1");
    });
    expect(result.current.attempt.id).toBe("attempt-1");

    await act(async () => {
      await result.current.saveAnswer("attempt-1", "question-1", "Plants use light");
    });
    expect(saveStudentCbtAnswer).toHaveBeenCalledWith(
      "attempt-1",
      "question-1",
      "Plants use light"
    );
    expect(result.current.attempt.questions[0].answer).toBe("Plants use light");

    await act(async () => {
      await result.current.submitAttempt("attempt-1");
    });
    expect(result.current.result.status).toBe("submitted");
    expect(result.current.attempt.status).toBe("submitted");
  });

  it("resumes a finalized attempt and loads its result", async () => {
    getStudentCbtExams.mockResolvedValue({ data: { results: [], next: null } });
    getStudentCbtAttempt.mockResolvedValue({
      data: { ...attempt, status: "timed_out" }
    });
    getStudentCbtResult.mockResolvedValue({
      data: { attempt_id: "attempt-1", status: "timed_out", answers: [] }
    });

    const { result } = renderHook(() => useStudentCbt());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.resumeAttempt("attempt-1");
    });

    expect(getStudentCbtAttempt).toHaveBeenCalledWith("attempt-1");
    expect(getStudentCbtResult).toHaveBeenCalledWith("attempt-1");
    expect(result.current.result.status).toBe("timed_out");
  });
});
