import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* A teacher of a subject without a class (French) can pick it everywhere they
   set work, and its students come from the subject's own roster. */

const FRENCH = { id: "fr", name: "French", class_id: null, class_name: null, student_count: 1 };
const MATHS = { id: "ma", name: "Mathematics", class_id: "c1", class_name: "JSS1A", student_count: 2 };

const subjectsApi = {
  subjects: [MATHS, FRENCH],
  loading: false,
  error: null,
  refreshData: vi.fn(),
  fetchStudents: vi.fn((id) => Promise.resolve(
    id === "fr"
      ? [{ id: "u-ada", name: "Ada Obi", username: "ada" }]
      : [{ id: "u-ada", name: "Ada Obi", username: "ada" }, { id: "u-bayo", name: "Bayo Ade", username: "bayo" }]
  ))
};
const attendanceApi = {
  attendanceReport: [],
  loading: false,
  mutating: false,
  error: null,
  fetchAttendanceReport: vi.fn(() => Promise.resolve([])),
  signAttendance: vi.fn(() => Promise.resolve({}))
};
const examsApi = {
  examinations: [], submissions: [], loading: false, mutating: false, error: null,
  examinationPagination: null, submissionPagination: null,
  refreshData: vi.fn(), fetchSubmissions: vi.fn(), saveExamination: vi.fn(() => Promise.resolve()),
  removeExamination: vi.fn()
};
const assignmentsApi = {
  assignments: [{
    id: "a1", title: "Verbs", subject: "fr", subject_name: "French", class_name: null,
    is_active: true, submission_count: 1
  }],
  submissions: [], loading: false, mutating: false, error: null,
  assignmentPagination: null, submissionPagination: null,
  refreshData: vi.fn(), fetchSubmissions: vi.fn(), saveAssignment: vi.fn(() => Promise.resolve()),
  removeAssignment: vi.fn()
};
const cbtApi = {
  exams: [], questions: [], attempts: [], selectedExam: null, loading: false, mutating: false, error: null,
  examPagination: null, questionPagination: null, attemptPagination: null,
  refreshExams: vi.fn(() => Promise.resolve()), fetchExam: vi.fn(), fetchQuestions: vi.fn(),
  fetchAttempts: vi.fn(), saveExam: vi.fn(() => Promise.resolve({})), removeExam: vi.fn()
};
const classesApi = {
  classes: [{ id: "c1", name: "JSS1A", student_count: 2 }],
  subjects: [], topics: [], materials: [], loading: false, mutating: false, error: null,
  refreshData: vi.fn(), fetchSubjects: vi.fn(() => Promise.resolve([])), fetchClass: vi.fn(),
  fetchMaterials: vi.fn(), fetchTopics: vi.fn()
};

vi.mock("@/hooks/teacher", () => ({
  useTeacherSubjects: () => subjectsApi,
  useTeacherAttendance: () => attendanceApi,
  useTeacherExaminations: () => examsApi,
  useTeacherAssignments: () => assignmentsApi,
  useTeacherCbt: () => cbtApi,
  useTeacherClasses: () => classesApi,
  useTeacherAnnouncements: () => ({ mutating: false, publishAnnouncement: vi.fn() }),
  useTeacherStudents: () => ({ students: [], loading: false, error: null }),
  useTeacherPermissions: () => ({ permissions: [], classes: [], loading: false, has: () => false, reload: vi.fn() }),
  TEACHER_PERMISSIONS: {}
}));
vi.mock("@/context/OrganizationContext", () => ({ useOrganization: () => ({ currentOrgId: "org1" }) }));
vi.mock("../components/CourseComponents", () => ({ default: () => null }));
vi.mock("../exams/ExamQuestions", () => ({ default: () => null }));

import Attendance from "../Attendance";
import Examinations from "../Examinations";
import Assignments from "../Assignments";
import ClassManagement from "../ClassManagement";
import TeacherCbt from "@/features/cbt/TeacherCbt";

const optionLabels = (select) => within(select).getAllByRole("option").map((o) => o.textContent);

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("Teacher pages with a classless subject", () => {
  it("attendance lists only the students enrolled in a classless subject", async () => {
    render(<Attendance />);
    const picker = screen.getByLabelText("Subject");
    expect(optionLabels(picker)).toEqual(["Mathematics — JSS1A", "French (no class)"]);
    await screen.findByText("Bayo Ade");

    fireEvent.change(picker, { target: { value: "fr" } });
    await waitFor(() => expect(subjectsApi.fetchStudents).toHaveBeenCalledWith("fr"));
    await waitFor(() => expect(screen.queryByText("Bayo Ade")).toBeNull());
    expect(screen.getByText("Ada Obi")).toBeTruthy();
    expect(screen.queryByLabelText("Class")).toBeNull();

    fireEvent.change(screen.getByLabelText("Status for Ada Obi"), { target: { value: "present" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit attendance" }));
    await waitFor(() => expect(attendanceApi.signAttendance).toHaveBeenCalledWith("fr", {
      date: expect.any(String),
      records: [{ student_id: "u-ada", status: "present" }]
    }));
    expect(attendanceApi.fetchAttendanceReport).toHaveBeenCalledWith("fr", expect.objectContaining({ from: expect.any(String), to: expect.any(String) }));
  });

  it("examinations offer the classless subject in the subject picker", () => {
    render(<Examinations />);
    fireEvent.click(screen.getByRole("button", { name: /create examination/i }));
    const picker = screen.getByLabelText("Subject");
    expect(optionLabels(picker)).toEqual(["Choose a subject", "Mathematics — JSS1A", "French (no class)"]);
  });

  it("assignments offer the classless subject and count its enrolled students", () => {
    render(<Assignments />);
    expect(screen.getByText("1/1")).toBeTruthy();
    expect(screen.getByText("No class")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /create assignment/i }));
    const picker = screen.getByLabelText("Subject");
    expect(optionLabels(picker)).toEqual(["Choose a subject", "Mathematics — JSS1A", "French (no class)"]);
  });

  it("CBT exam form picks a subject directly, classless ones included", async () => {
    render(<TeacherCbt />);
    fireEvent.click(screen.getByRole("button", { name: /create exam/i }));
    const picker = screen.getByLabelText("Subject");
    expect(optionLabels(picker)).toEqual(["Choose a subject", "Mathematics — JSS1A", "French (no class)"]);
    const filter = screen.getByLabelText("Filter CBT exams by subject");
    expect(optionLabels(filter)).toEqual(["All subjects", "Mathematics — JSS1A", "French (no class)"]);
  });

  it("class management shows who is enrolled in a classless subject, read-only", async () => {
    render(<ClassManagement />);
    const section = screen.getByRole("region", { name: "Subjects without a class" });
    expect(within(section).queryByText(/Mathematics/)).toBeNull();
    fireEvent.click(within(section).getByRole("button", { name: /French/ }));
    await waitFor(() => expect(subjectsApi.fetchStudents).toHaveBeenCalledWith("fr"));
    expect(await within(section).findByText("Ada Obi")).toBeTruthy();
    expect(within(section).queryByRole("button", { name: /^(enrol|add|remove)/i })).toBeNull();
  });
});
