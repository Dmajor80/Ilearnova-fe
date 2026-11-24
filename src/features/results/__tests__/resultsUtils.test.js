import { describe, expect, it } from "vitest";
import {
  apiErrorDetails,
  averageText,
  bandsProblem,
  componentsProblem,
  currentSession,
  draftsFromSheet,
  gradeFor,
  rowTotals,
  rowsToSave,
  scoreProblem,
  sessionOptions,
} from "../resultsUtils";

const TWO_HUNDRED = [
  { key: "ca_1", label: "CA 1", max: "50.00" },
  { key: "ca_2", label: "CA 2", max: "50.00" },
  { key: "exam", label: "Exam", max: "100.00" },
];

describe("sessions", () => {
  it("starts the academic session in September", () => {
    expect(currentSession(new Date(2026, 10, 24))).toBe("2026/2027"); // Nov
    expect(currentSession(new Date(2027, 2, 1))).toBe("2026/2027"); // Mar
    expect(sessionOptions(new Date(2026, 10, 24), 2)).toEqual(["2026/2027", "2025/2026"]);
  });
});

describe("live row totals", () => {
  it("adds entered scores and works out the percentage of a 200 total", () => {
    const totals = rowTotals({ ca_1: "40", ca_2: "35", exam: "75" }, TWO_HUNDRED);
    expect(totals).toEqual({ total: 150, outOf: 200, percentage: 75, complete: true });
    expect(gradeFor(totals.percentage, [{ grade: "A", min: "70" }, { grade: "F", min: "0" }])).toBe("A");
  });

  it("treats blanks as not entered yet", () => {
    expect(rowTotals({ ca_1: "40", ca_2: "", exam: undefined }, TWO_HUNDRED)).toMatchObject({
      total: 40,
      complete: false,
    });
  });

  it("flags scores above the component maximum", () => {
    expect(scoreProblem("51", "50.00")).toBe("0 to 50");
    expect(scoreProblem("abc", "50")).toBe("Not a number");
    expect(scoreProblem("", "50")).toBe("");
  });
});

describe("saving a sheet", () => {
  const sheet = {
    components: TWO_HUNDRED,
    students: [
      { student_id: "ada", result: { scores: { ca_1: "40.00", ca_2: null, exam: null }, remark: "Good" } },
      { student_id: "bayo", result: null },
    ],
  };

  it("sends only changed students and clears blank boxes with null", () => {
    const drafts = draftsFromSheet(sheet);
    expect(drafts.ada).toEqual({ scores: { ca_1: "40", ca_2: "", exam: "" }, remark: "Good" });
    drafts.ada.scores.ca_2 = "35";
    expect(rowsToSave(sheet, drafts, new Set(["ada"]))).toEqual([
      { student_id: "ada", scores: { ca_1: "40", ca_2: "35", exam: null }, remark: "Good" },
    ]);
  });
});

describe("validation", () => {
  it("allows any total up to 1000", () => {
    expect(componentsProblem([{ label: "CA", max: "50" }, { label: "Exam", max: "150" }])).toBe("");
    expect(componentsProblem([{ label: "Exam", max: "1001" }])).toMatch(/most allowed is 1000/);
    expect(componentsProblem([{ label: "", max: "10" }])).toMatch(/name/);
  });

  it("needs a band starting at 0%", () => {
    expect(bandsProblem([{ grade: "A", min: "70" }, { grade: "F", min: "0" }])).toBe("");
    expect(bandsProblem([{ grade: "A", min: "70" }, { grade: "B", min: "50" }])).toMatch(/0%/);
  });
});

describe("api errors", () => {
  it("reads per-row problems and messages from the backend envelope", () => {
    const error = {
      data: {
        success: false,
        field_errors: {
          rows: [{ 2: ["exam must be between 0 and 100"] }],
          incomplete: ["Ada Obi"],
        },
      },
    };
    expect(apiErrorDetails(error)).toEqual({
      rows: { 2: ["exam must be between 0 and 100"] },
      messages: ["Missing scores: Ada Obi"],
    });
  });
});

describe("average text", () => {
  it("shows a plain average out of 100 and a percentage otherwise", () => {
    expect(averageText({ average: "72.50", average_out_of: "100.00" })).toBe("72.5");
    expect(averageText({ average: "80.00", average_score: "160.00", average_out_of: "200.00" })).toBe(
      "80% (160 / 200)"
    );
    expect(averageText({ average: "65.00", average_score: null, average_out_of: null })).toBe("65%");
  });
});
