import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  }
}));

import { http } from "@/api/baseClient";
import {
  getStudentCbtExams,
  saveStudentCbtAnswer,
  startStudentCbtAttempt,
  submitStudentCbtAttempt,
  startStudentExamSession,
  submitStudentExamSession
} from "../index";

afterEach(() => {
  vi.clearAllMocks();
});

describe("student exam action requests", () => {
  it("sends an empty JSON body for starting and submitting exam sessions", async () => {
    await startStudentExamSession("exam-id");
    await submitStudentExamSession("session-id");

    expect(http.post).toHaveBeenNthCalledWith(
      1,
      "/api/student/exams/exam-id/session/start/",
      {},
      { auth: true }
    );
    expect(http.post).toHaveBeenNthCalledWith(
      2,
      "/api/student/exams/session/session-id/submit/",
      {},
      { auth: true }
    );
  });

  it("uses the documented CBT routes and sends JSON bodies for POST and answer requests", async () => {
    await getStudentCbtExams({ page: 2 });
    await startStudentCbtAttempt("exam/id");
    await saveStudentCbtAnswer("attempt-id", "question-id", ["option-id"]);
    await submitStudentCbtAttempt("attempt-id");

    expect(http.get).toHaveBeenCalledWith(
      "/api/student/cbt/exams/",
      { auth: true, params: { page: 2 } }
    );
    expect(http.post).toHaveBeenNthCalledWith(
      1,
      "/api/student/cbt/exams/exam%2Fid/attempts/",
      {},
      { auth: true }
    );
    expect(http.put).toHaveBeenCalledWith(
      "/api/student/cbt/attempts/attempt-id/answers/question-id/",
      { answer: ["option-id"] },
      { auth: true }
    );
    expect(http.post).toHaveBeenNthCalledWith(
      2,
      "/api/student/cbt/attempts/attempt-id/submit/",
      {},
      { auth: true }
    );
  });
});
