import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() }
}));

vi.mock("@/hooks/useApiCircuitBreaker", () => ({
  default: () => ({
    shouldCallEndpoint: () => true,
    markEndpointFailed: vi.fn(),
    resetAllEndpoints: vi.fn(),
    failedEndpoints: new Set(),
    endpointErrors: {},
    endpointRetries: {}
  })
}));

import { http } from "@/api/baseClient";
import useTeacherSubjects from "../useTeacherSubjects";
import { teacherSubjectLabel } from "../teacherSubjects";

const FRENCH = { id: "fr", name: "French", class_id: null, class_name: null, student_count: 3 };
const MATHS = { id: "ma", name: "Mathematics", class_id: "c1", class_name: "JSS1A", student_count: 30 };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("teacherSubjectLabel", () => {
  it("names the class, or says the subject has none", () => {
    expect(teacherSubjectLabel(MATHS)).toBe("Mathematics — JSS1A");
    expect(teacherSubjectLabel(FRENCH)).toBe("French (no class)");
  });
});

describe("useTeacherSubjects", () => {
  it("loads the teacher's subjects, including ones without a class", async () => {
    http.get.mockResolvedValue({ success: true, data: [MATHS, FRENCH] });
    const { result } = renderHook(() => useTeacherSubjects());
    await waitFor(() => expect(result.current.subjects).toHaveLength(2));
    expect(http.get).toHaveBeenCalledWith("/api/teacher/subjects/", { auth: true });
    expect(result.current.subjects.map((s) => s.name)).toEqual(["Mathematics", "French"]);
  });

  it("fetches the students taking a subject from its roster endpoint", async () => {
    http.get.mockImplementation((path) => Promise.resolve(
      path.endsWith("/students/")
        ? { success: true, data: [{ id: "u1", name: "Ada Obi" }] }
        : { success: true, data: [FRENCH] }
    ));
    const { result } = renderHook(() => useTeacherSubjects());
    await waitFor(() => expect(result.current.subjects).toHaveLength(1));
    let students;
    await act(async () => { students = await result.current.fetchStudents("fr"); });
    expect(http.get).toHaveBeenCalledWith("/api/teacher/subjects/fr/students/", { auth: true });
    expect(students).toEqual([{ id: "u1", name: "Ada Obi" }]);
  });
});
