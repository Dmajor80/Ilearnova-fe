/**
 * Exam questions as the teacher edits them, and how they map to the
 * question bank API (teacher_app QuestionBank + QuestionOption):
 *
 * - mcq / true_false: options, exactly one is_correct
 * - mcq_multi: options, one or more is_correct
 * - short_answer / fill_blank: options are accepted answers (all is_correct,
 *   never shown to students); none means the teacher marks it by hand
 * - essay: no options, always marked by hand
 */
import { fieldErrorsOf } from "@/lib/apiHelpers";

export const QUESTION_TYPES = [
  { value: "mcq", label: "Multiple choice", hint: "Students pick one answer." },
  { value: "mcq_multi", label: "Multiple select", hint: "Students tick every correct answer. Partly right earns part marks." },
  { value: "true_false", label: "True / False", hint: "Students pick True or False." },
  { value: "short_answer", label: "Short answer", hint: "Students type a word or phrase." },
  { value: "fill_blank", label: "Fill in the blank", hint: "Students type the missing word." },
  { value: "essay", label: "Essay / theory", hint: "Students write a longer answer. You mark it by hand." }
];

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

const CHOICE = new Set(["mcq", "mcq_multi"]);
const TEXT = new Set(["short_answer", "fill_blank"]);

export const isChoice = (type) => CHOICE.has(type);
export const isText = (type) => TEXT.has(type);

export const typeLabel = (value) => QUESTION_TYPES.find((t) => t.value === value)?.label || "Question";

const squash = (text) => String(text ?? "").split(/\s+/).filter(Boolean).join(" ");
const hasDuplicates = (texts) => new Set(texts.map((t) => t.toLowerCase())).size !== texts.length;
const emptyOptions = (n) => Array.from({ length: n }, () => ({ text: "", correct: false }));

export function blankDraft(type = "mcq") {
  return {
    question_text: "",
    question_type: type,
    marks: "1",
    explanation: "",
    options: emptyOptions(4),
    trueFalse: "",
    answers: [""]
  };
}

/** Switch type, keeping whatever still makes sense. */
export function changeType(draft, type) {
  let { options } = draft;
  if (type === "mcq") {
    let seen = false;
    options = options.map((o) => {
      const correct = o.correct && !seen;
      if (correct) seen = true;
      return { ...o, correct };
    });
  }
  return { ...draft, question_type: type, options };
}

const byOrder = (options = []) => [...options].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function draftFromQuestion(question) {
  const type = question.question_type || "mcq";
  const options = byOrder(question.options);
  const draft = {
    ...blankDraft(type),
    question_text: question.question_text || "",
    marks: String(question.marks ?? 1),
    explanation: question.explanation || ""
  };
  if (isChoice(type)) {
    draft.options = options.map((o) => ({ text: o.option_text, correct: Boolean(o.is_correct) }));
    while (draft.options.length < MIN_OPTIONS) draft.options.push({ text: "", correct: false });
  } else if (type === "true_false") {
    const right = options.find((o) => o.is_correct);
    draft.trueFalse = right ? (squash(right.option_text).toLowerCase() === "false" ? "false" : "true") : "";
  } else if (isText(type)) {
    draft.answers = options.length ? options.map((o) => o.option_text) : [""];
  }
  return draft;
}

export function validateDraft(draft) {
  const errors = {};
  const type = draft.question_type;
  if (!squash(draft.question_text)) errors.question_text = "Type the question.";
  const marks = Number(draft.marks);
  if (draft.marks === "" || !Number.isFinite(marks)) errors.marks = "Enter the marks for this question.";
  else if (marks <= 0) errors.marks = "Marks must be more than 0.";

  if (isChoice(type)) {
    const filled = draft.options.filter((o) => squash(o.text));
    if (filled.length < MIN_OPTIONS) errors.options = "Add at least two options.";
    else if (hasDuplicates(filled.map((o) => squash(o.text)))) errors.options = "Each option must be different.";
    else if (!filled.some((o) => o.correct)) {
      errors.correct = type === "mcq" ? "Choose the correct option." : "Tick at least one correct option.";
    }
  } else if (type === "true_false") {
    if (!["true", "false"].includes(draft.trueFalse)) errors.correct = "Choose whether the answer is True or False.";
  } else if (isText(type)) {
    const answers = draft.answers.map(squash).filter(Boolean);
    if (hasDuplicates(answers)) errors.answers = "Each accepted answer must be different.";
  }
  return errors;
}

const toOptions = (rows) => rows.map((o, order) => ({ option_text: o.text, is_correct: o.correct, order }));

/** Request body for POST/PUT. `order` only when given (new questions). */
export function draftToPayload(draft, { order } = {}) {
  const type = draft.question_type;
  let rows = [];
  if (isChoice(type)) {
    rows = draft.options.map((o) => ({ text: squash(o.text), correct: Boolean(o.correct) })).filter((o) => o.text);
  } else if (type === "true_false") {
    rows = [
      { text: "True", correct: draft.trueFalse === "true" },
      { text: "False", correct: draft.trueFalse === "false" }
    ];
  } else if (isText(type)) {
    rows = draft.answers.map(squash).filter(Boolean).map((text) => ({ text, correct: true }));
  }
  const payload = {
    question_text: String(draft.question_text).trim(),
    question_type: type,
    marks: Number(draft.marks),
    explanation: String(draft.explanation || "").trim()
  };
  if (order !== undefined) payload.order = order;
  payload.options = toOptions(rows);
  return payload;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const round = (n) => Math.round(n * 100) / 100;

/** Questions added vs what the exam says, with gentle warnings. */
export function examTally(questions, exam = {}) {
  const count = questions.length;
  const marks = round(questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0));
  const expectedCount = Number(exam?.num_of_questions) || 0;
  const expectedMarks = Number(exam?.total_marks) || 0;
  const warnings = [];
  if (expectedCount && count !== expectedCount) {
    warnings.push(`The exam is set to ${plural(expectedCount, "question")}, but ${count} ${count === 1 ? "has" : "have"} been added.`);
  }
  if (expectedMarks && count && marks !== expectedMarks) {
    warnings.push(`The questions add up to ${plural(marks, "mark")}, but the exam's total is ${expectedMarks}.`);
  }
  return { count, marks, expectedCount, expectedMarks, warnings };
}

/**
 * Move questions[index] by delta (-1 up, +1 down). Returns
 * [{ id, order }] for each question whose stored order must change, so the
 * list ends up numbered 0..n-1 in its new sequence.
 */
export function reorderUpdates(questions, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= questions.length || index < 0 || index >= questions.length) return [];
  const next = [...questions];
  [next[index], next[target]] = [next[target], next[index]];
  return next
    .map((q, order) => ({ id: q.id, order, changed: q.order !== order }))
    .filter((q) => q.changed)
    .map(({ id, order }) => ({ id, order }));
}

const LOCKED = /questions are locked/i;

/** Server errors as { field: message, _general }. */
export function questionErrors(error) {
  const out = fieldErrorsOf(error);
  if (out._general) {
    const general = out._general
      .replace(/^Request failed\s*/, "")
      .replace(/\[\s*'([^']*)'\s*\]/g, "$1")
      .trim();
    if (LOCKED.test(general)) out._general = "Questions can't be changed because students have already started this exam.";
    else if (general) out._general = general;
    else if (Object.keys(out).length > 1) delete out._general;
    else out._general = "That didn't work. Try again.";
  }
  return out;
}
