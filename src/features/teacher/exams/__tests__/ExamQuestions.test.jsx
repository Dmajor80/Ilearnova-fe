import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() }
}));
vi.mock("@/lib/toast", () => ({ toast: vi.fn() }));

import { http } from "@/api/baseClient";
import { toast } from "@/lib/toast";
import ExamQuestions from "../ExamQuestions";

const EXAM = { id: "exam-1", title: "Mathematics mid-term test", total_marks: 10, num_of_questions: 3 };
const LIST = "/api/teacher/examinations/exam-1/bank-questions/";

const Q1 = {
  id: "q1",
  question_text: "What is 2 + 2?",
  question_type: "mcq",
  marks: 2,
  order: 0,
  explanation: "",
  options: [
    { id: "o1", option_text: "3", is_correct: false, order: 0 },
    { id: "o2", option_text: "4", is_correct: true, order: 1 }
  ]
};
const Q2 = {
  id: "q2",
  question_text: "The sun is a star.",
  question_type: "true_false",
  marks: 1,
  order: 1,
  explanation: "",
  options: [
    { id: "o3", option_text: "True", is_correct: true, order: 0 },
    { id: "o4", option_text: "False", is_correct: false, order: 1 }
  ]
};

let questions;

beforeEach(() => {
  questions = [Q1, Q2];
  http.get.mockImplementation((path) => {
    if (path === LIST) return Promise.resolve({ success: true, data: questions });
    if (path.startsWith("/api/teacher/bank-questions/")) {
      const id = path.split("/")[4];
      return Promise.resolve({ success: true, data: questions.find((q) => q.id === id) });
    }
    return Promise.reject(new Error(`unexpected GET ${path}`));
  });
  http.post.mockResolvedValue({ success: true, data: { id: "new" } });
  http.put.mockResolvedValue({ success: true, data: {} });
  http.del.mockResolvedValue({ success: true });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const show = () => render(<ExamQuestions exam={EXAM} open onClose={() => {}} />);
const dialog = () => screen.getByRole("dialog", { name: /questions/i });
const editor = () => screen.getByRole("dialog", { name: /question$/i });

describe("ExamQuestions list", () => {
  it("shows a skeleton, then readable question cards", async () => {
    show();
    expect(screen.getByRole("status", { name: "Loading questions" })).toBeTruthy();
    const first = await screen.findByRole("article", { name: "Question 1" });
    expect(within(first).getByText("What is 2 + 2?")).toBeTruthy();
    expect(within(first).getByText("Multiple choice")).toBeTruthy();
    expect(within(first).getByText("2 marks")).toBeTruthy();
    expect(within(first).getByText("4").closest("li").textContent).toMatch(/correct/i);
    expect(within(first).getByText("3").closest("li").textContent).not.toMatch(/correct/i);
    const second = screen.getByRole("article", { name: "Question 2" });
    expect(within(second).getByText("True / False")).toBeTruthy();
    expect(within(second).getByText("1 mark")).toBeTruthy();
    expect(dialog().textContent).not.toMatch(/json/i);
    expect(dialog().querySelector("textarea")).toBeNull();
  });

  it("compares the questions with the exam's count and total marks", async () => {
    show();
    await screen.findByRole("article", { name: "Question 1" });
    expect(screen.getByText(/2 of 3 questions/)).toBeTruthy();
    expect(screen.getByText(/3 of 10 marks/)).toBeTruthy();
    expect(screen.getByText("The exam is set to 3 questions, but 2 have been added.")).toBeTruthy();
    expect(screen.getByText("The questions add up to 3 marks, but the exam's total is 10.")).toBeTruthy();
  });

  it("has a friendly empty state", async () => {
    questions = [];
    show();
    expect(await screen.findByText("No questions yet — add the first one")).toBeTruthy();
  });
});

describe("adding a question", () => {
  it("validates inline, then posts a multiple choice question at the end", async () => {
    show();
    await screen.findByRole("article", { name: "Question 2" });
    fireEvent.click(screen.getByRole("button", { name: "Add question" }));
    const form = editor();
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    expect(within(form).getByText("Type the question.")).toBeTruthy();
    expect(within(form).getByText("Add at least two options.")).toBeTruthy();
    expect(http.post).not.toHaveBeenCalled();

    fireEvent.change(within(form).getByLabelText("Question"), { target: { value: "Which is prime?" } });
    fireEvent.change(within(form).getByLabelText("Option 1"), { target: { value: "4" } });
    fireEvent.change(within(form).getByLabelText("Option 2"), { target: { value: "7" } });
    fireEvent.change(within(form).getByLabelText("Marks"), { target: { value: "3" } });
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    expect(within(form).getByText("Choose the correct option.")).toBeTruthy();

    fireEvent.click(within(form).getByRole("radio", { name: "Option 2 is correct" }));
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));

    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, body] = http.post.mock.calls[0];
    expect(path).toBe(LIST);
    expect(body).toEqual({
      question_text: "Which is prime?",
      question_type: "mcq",
      marks: 3,
      explanation: "",
      order: 2,
      options: [
        { option_text: "4", is_correct: false, order: 0 },
        { option_text: "7", is_correct: true, order: 1 }
      ]
    });
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Question added."));
    expect(screen.queryByRole("dialog", { name: /question$/i })).toBeNull();
  });

  it("adds and removes options between two and six", async () => {
    show();
    await screen.findByRole("article", { name: "Question 1" });
    fireEvent.click(screen.getByRole("button", { name: "Add question" }));
    const form = editor();
    expect(within(form).getAllByLabelText(/^Option \d$/)).toHaveLength(4);
    fireEvent.click(within(form).getByRole("button", { name: "Add option" }));
    fireEvent.click(within(form).getByRole("button", { name: "Add option" }));
    expect(within(form).getAllByLabelText(/^Option \d$/)).toHaveLength(6);
    expect(within(form).queryByRole("button", { name: "Add option" })).toBeNull();
    for (let i = 0; i < 4; i += 1) fireEvent.click(within(form).getByRole("button", { name: "Remove option 1" }));
    expect(within(form).getAllByLabelText(/^Option \d$/)).toHaveLength(2);
    expect(within(form).queryByRole("button", { name: "Remove option 1" })).toBeNull();
  });

  it("builds true/false and short answer questions without option rows", async () => {
    show();
    await screen.findByRole("article", { name: "Question 1" });
    fireEvent.click(screen.getByRole("button", { name: "Add question" }));
    let form = editor();
    fireEvent.change(within(form).getByLabelText("Question type"), { target: { value: "true_false" } });
    fireEvent.change(within(form).getByLabelText("Question"), { target: { value: "Lagos is in Nigeria." } });
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    expect(within(form).getByText("Choose whether the answer is True or False.")).toBeTruthy();
    fireEvent.click(within(form).getByRole("radio", { name: "True" }));
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    await waitFor(() => expect(http.post).toHaveBeenCalledTimes(1));
    expect(http.post.mock.calls[0][1].options).toEqual([
      { option_text: "True", is_correct: true, order: 0 },
      { option_text: "False", is_correct: false, order: 1 }
    ]);

    await waitFor(() => expect(screen.queryByRole("dialog", { name: /question$/i })).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Add question" }));
    form = editor();
    fireEvent.change(within(form).getByLabelText("Question type"), { target: { value: "short_answer" } });
    fireEvent.change(within(form).getByLabelText("Question"), { target: { value: "Capital of Nigeria?" } });
    fireEvent.change(within(form).getByLabelText("Accepted answer 1"), { target: { value: "Abuja" } });
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    await waitFor(() => expect(http.post).toHaveBeenCalledTimes(2));
    expect(http.post.mock.calls[1][1]).toMatchObject({
      question_type: "short_answer",
      options: [{ option_text: "Abuja", is_correct: true, order: 0 }]
    });
  });

  it("shows server errors next to the fields", async () => {
    http.post.mockRejectedValueOnce(
      Object.assign(new Error("Request failed"), {
        status: 400,
        data: { success: false, errors: { question_text: ["This field may not be blank."], options: ["Option texts must be unique."] } }
      })
    );
    show();
    await screen.findByRole("article", { name: "Question 1" });
    fireEvent.click(screen.getByRole("button", { name: "Add question" }));
    const form = editor();
    fireEvent.change(within(form).getByLabelText("Question type"), { target: { value: "essay" } });
    fireEvent.change(within(form).getByLabelText("Question"), { target: { value: "Discuss." } });
    fireEvent.click(within(form).getByRole("button", { name: "Add question" }));
    expect(await within(form).findByText("This field may not be blank.")).toBeTruthy();
    expect(within(form).getByText("Option texts must be unique.")).toBeTruthy();
    expect(toast).not.toHaveBeenCalled();
  });
});

describe("editing, deleting and reordering", () => {
  const openMenu = (n) =>
    fireEvent.click(within(screen.getByRole("article", { name: `Question ${n}` })).getByRole("button", { name: `Actions for question ${n}` }));

  it("opens the same form prefilled and saves with PUT", async () => {
    show();
    await screen.findByRole("article", { name: "Question 1" });
    openMenu(1);
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    const form = await screen.findByRole("dialog", { name: "Edit question" });
    expect(within(form).getByLabelText("Question").value).toBe("What is 2 + 2?");
    expect(within(form).getByLabelText("Option 2").value).toBe("4");
    expect(within(form).getByRole("radio", { name: "Option 2 is correct" }).checked).toBe(true);
    fireEvent.change(within(form).getByLabelText("Question"), { target: { value: "What is two plus two?" } });
    fireEvent.click(within(form).getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(http.put).toHaveBeenCalled());
    const [path, body] = http.put.mock.calls[0];
    expect(path).toBe("/api/teacher/bank-questions/q1/");
    expect(body.question_text).toBe("What is two plus two?");
    expect(body.options).toHaveLength(2);
    expect(body).not.toHaveProperty("order");
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Question updated."));
  });

  it("fetches the question when the list has no options", async () => {
    questions = [{ ...Q1, options: undefined }];
    http.get.mockImplementation((path) =>
      path === LIST
        ? Promise.resolve({ success: true, data: questions })
        : Promise.resolve({ success: true, data: Q1 })
    );
    show();
    await screen.findByRole("article", { name: "Question 1" });
    openMenu(1);
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    const form = await screen.findByRole("dialog", { name: "Edit question" });
    await waitFor(() => expect(within(form).getByLabelText("Option 2").value).toBe("4"));
    expect(http.get).toHaveBeenCalledWith("/api/teacher/bank-questions/q1/", { auth: true });
  });

  it("deletes after confirming in a dialog", async () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    show();
    await screen.findByRole("article", { name: "Question 2" });
    openMenu(2);
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    const confirm = screen.getByRole("alertdialog", { name: "Delete question 2?" });
    fireEvent.click(within(confirm).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(http.del).toHaveBeenCalledWith("/api/teacher/bank-questions/q2/", { auth: true }));
    await waitFor(() => expect(toast).toHaveBeenCalledWith("Question deleted."));
    expect(confirmSpy).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("moves a question up by saving the new order", async () => {
    show();
    await screen.findByRole("article", { name: "Question 2" });
    expect(screen.getByRole("button", { name: "Move question 1 up" }).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Move question 2 up" }));
    await waitFor(() => expect(http.put).toHaveBeenCalledTimes(2));
    expect(http.put).toHaveBeenCalledWith("/api/teacher/bank-questions/q1/", { order: 1 }, { auth: true });
    expect(http.put).toHaveBeenCalledWith("/api/teacher/bank-questions/q2/", { order: 0 }, { auth: true });
  });
});
