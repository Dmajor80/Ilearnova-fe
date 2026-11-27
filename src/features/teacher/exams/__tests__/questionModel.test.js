import { describe, expect, it } from "vitest";
import {
  QUESTION_TYPES,
  blankDraft,
  changeType,
  draftFromQuestion,
  draftToPayload,
  examTally,
  questionErrors,
  reorderUpdates,
  typeLabel,
  validateDraft
} from "../questionModel";

const mcq = (overrides = {}) => ({
  ...blankDraft("mcq"),
  question_text: "What is 2 + 2?",
  options: [
    { text: "3", correct: false },
    { text: "4", correct: true }
  ],
  ...overrides
});

describe("question types", () => {
  it("offers every type the backend accepts, with human labels", () => {
    expect(QUESTION_TYPES.map((t) => t.value)).toEqual([
      "mcq",
      "mcq_multi",
      "true_false",
      "short_answer",
      "fill_blank",
      "essay"
    ]);
    expect(typeLabel("mcq")).toBe("Multiple choice");
    expect(typeLabel("true_false")).toBe("True / False");
    expect(typeLabel("essay")).toBe("Essay / theory");
    expect(typeLabel("weird")).toBe("Question");
  });

  it("starts a multiple choice draft with four empty options", () => {
    const draft = blankDraft();
    expect(draft.question_type).toBe("mcq");
    expect(draft.marks).toBe("1");
    expect(draft.options).toHaveLength(4);
    expect(draft.options.every((o) => o.text === "" && !o.correct)).toBe(true);
  });

  it("keeps only one correct option when switching to single-answer choice", () => {
    const draft = changeType(
      { ...mcq(), question_type: "mcq_multi", options: [{ text: "a", correct: true }, { text: "b", correct: true }] },
      "mcq"
    );
    expect(draft.options.filter((o) => o.correct)).toHaveLength(1);
  });

  it("keeps typed options when switching between choice types", () => {
    const draft = changeType(mcq(), "mcq_multi");
    expect(draft.options.map((o) => o.text)).toEqual(["3", "4"]);
  });
});

describe("validateDraft", () => {
  it("accepts a complete multiple choice question", () => {
    expect(validateDraft(mcq())).toEqual({});
  });

  it("asks for the question text and positive marks", () => {
    const errors = validateDraft(mcq({ question_text: "  ", marks: "0" }));
    expect(errors.question_text).toBe("Type the question.");
    expect(errors.marks).toBe("Marks must be more than 0.");
  });

  it("needs at least two filled-in options", () => {
    const errors = validateDraft(mcq({ options: [{ text: "4", correct: true }, { text: " ", correct: false }] }));
    expect(errors.options).toBe("Add at least two options.");
  });

  it("asks to choose the correct option", () => {
    const errors = validateDraft(mcq({ options: [{ text: "3", correct: false }, { text: "4", correct: false }] }));
    expect(errors.correct).toBe("Choose the correct option.");
  });

  it("asks for at least one correct option on multiple select", () => {
    const errors = validateDraft(mcq({ question_type: "mcq_multi", options: [{ text: "3", correct: false }, { text: "4", correct: false }] }));
    expect(errors.correct).toBe("Tick at least one correct option.");
  });

  it("rejects duplicate options", () => {
    const errors = validateDraft(mcq({ options: [{ text: "Four", correct: true }, { text: "four ", correct: false }] }));
    expect(errors.options).toBe("Each option must be different.");
  });

  it("asks true/false questions for the right answer", () => {
    const draft = { ...blankDraft("true_false"), question_text: "The sun is a star." };
    expect(validateDraft(draft).correct).toBe("Choose whether the answer is True or False.");
    expect(validateDraft({ ...draft, trueFalse: "true" })).toEqual({});
  });

  it("lets short answers go without accepted answers but not with duplicates", () => {
    const draft = { ...blankDraft("short_answer"), question_text: "Capital of Nigeria?" };
    expect(validateDraft(draft)).toEqual({});
    expect(validateDraft({ ...draft, answers: ["Abuja", "abuja"] }).answers).toBe("Each accepted answer must be different.");
  });
});

describe("draftToPayload", () => {
  it("sends trimmed choice options in order, ignoring blank rows", () => {
    const payload = draftToPayload(
      mcq({ marks: "2.5", explanation: " Basic sums ", options: [{ text: " 3 ", correct: false }, { text: "", correct: false }, { text: "4", correct: true }] }),
      { order: 3 }
    );
    expect(payload).toEqual({
      question_text: "What is 2 + 2?",
      question_type: "mcq",
      marks: 2.5,
      explanation: "Basic sums",
      order: 3,
      options: [
        { option_text: "3", is_correct: false, order: 0 },
        { option_text: "4", is_correct: true, order: 1 }
      ]
    });
  });

  it("turns a true/false choice into the two options the backend expects", () => {
    const payload = draftToPayload({ ...blankDraft("true_false"), question_text: "Water is wet.", trueFalse: "false" });
    expect(payload.options).toEqual([
      { option_text: "True", is_correct: false, order: 0 },
      { option_text: "False", is_correct: true, order: 1 }
    ]);
    expect(payload).not.toHaveProperty("order");
  });

  it("sends short answer accepted answers as correct options", () => {
    const payload = draftToPayload({ ...blankDraft("short_answer"), question_text: "Capital?", answers: ["Abuja", " "] });
    expect(payload.options).toEqual([{ option_text: "Abuja", is_correct: true, order: 0 }]);
  });

  it("sends essays without options", () => {
    const payload = draftToPayload({ ...blankDraft("essay"), question_text: "Discuss." });
    expect(payload.options).toEqual([]);
  });
});

describe("draftFromQuestion", () => {
  it("prefills a choice question from the API", () => {
    const draft = draftFromQuestion({
      id: "q1",
      question_text: "Pick 4",
      question_type: "mcq",
      marks: 2,
      explanation: "",
      options: [
        { id: "b", option_text: "4", is_correct: true, order: 1 },
        { id: "a", option_text: "3", is_correct: false, order: 0 }
      ]
    });
    expect(draft.marks).toBe("2");
    expect(draft.options).toEqual([
      { text: "3", correct: false },
      { text: "4", correct: true }
    ]);
  });

  it("prefills true/false and short answer questions", () => {
    expect(
      draftFromQuestion({
        question_text: "x",
        question_type: "true_false",
        marks: 1,
        options: [{ option_text: "True", is_correct: false }, { option_text: "False", is_correct: true }]
      }).trueFalse
    ).toBe("false");
    expect(
      draftFromQuestion({ question_text: "x", question_type: "short_answer", marks: 1, options: [{ option_text: "Abuja", is_correct: true }] }).answers
    ).toEqual(["Abuja"]);
  });
});

describe("examTally", () => {
  const questions = [{ marks: 2 }, { marks: 3 }];

  it("adds up marks and compares them with the exam", () => {
    const tally = examTally(questions, { total_marks: 5, num_of_questions: 2 });
    expect(tally).toMatchObject({ count: 2, marks: 5, warnings: [] });
  });

  it("warns gently when count or marks differ from the exam", () => {
    const tally = examTally(questions, { total_marks: 100, num_of_questions: 10 });
    expect(tally.warnings).toEqual([
      "The exam is set to 10 questions, but 2 have been added.",
      "The questions add up to 5 marks, but the exam's total is 100."
    ]);
  });

  it("does not warn about a count of 0 (not set)", () => {
    expect(examTally(questions, { total_marks: 5, num_of_questions: 0 }).warnings).toEqual([]);
  });
});

describe("reorderUpdates", () => {
  const list = [
    { id: "a", order: 0 },
    { id: "b", order: 0 },
    { id: "c", order: 0 }
  ];

  it("returns the new order for every question whose position changed", () => {
    expect(reorderUpdates(list, 2, -1)).toEqual([
      { id: "c", order: 1 },
      { id: "b", order: 2 }
    ]);
  });

  it("does nothing past either end", () => {
    expect(reorderUpdates(list, 0, -1)).toEqual([]);
    expect(reorderUpdates(list, 2, 1)).toEqual([]);
  });
});

describe("questionErrors", () => {
  it("maps the bank endpoint's errors onto form fields", () => {
    const err = { data: { success: false, errors: { options: ["Exactly one option must be correct."], marks: ["A valid number is required."] } } };
    expect(questionErrors(err)).toEqual({
      options: "Exactly one option must be correct.",
      marks: "A valid number is required."
    });
  });

  it("turns the locked-exam message into plain words", () => {
    const err = {
      message: "['Questions are locked: students have started.']",
      data: { success: false, error: "Request failed", message: "['Questions are locked: students have started.']" }
    };
    expect(questionErrors(err)._general).toBe(
      "Questions can't be changed because students have already started this exam."
    );
  });
});
