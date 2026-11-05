export const CBT_EXAMS_KEY = "ilearnova.cbt.exams.v1";
export const CBT_ATTEMPTS_KEY = "ilearnova.cbt.attempts.v1";
export const CBT_UPDATED_EVENT = "ilearnova:cbt-updated";

export const DEMO_CLASSES = [
  { id: "demo-class-grade-8a", name: "Grade 8A", students: 28 },
  { id: "demo-class-grade-9b", name: "Grade 9B", students: 24 }
];

export const DEMO_STUDENTS = [
  { id: "demo-student-grade-8a", name: "Demo Student (Grade 8A)", classId: "demo-class-grade-8a", className: "Grade 8A" },
  { id: "demo-student-grade-9b", name: "Demo Student (Grade 9B)", classId: "demo-class-grade-9b", className: "Grade 9B" }
];

const demoExam = {
  id: "demo-cbt-science-8a",
  title: "Introduction to Life Science",
  subject: "Basic Science",
  classId: "demo-class-grade-8a",
  className: "Grade 8A",
  durationMinutes: 15,
  instructions: "Choose the best answer for each question. You can flag questions and return to them before submitting.",
  status: "published",
  shuffleQuestions: false,
  shuffleOptions: false,
  createdAt: "2026-10-01T09:00:00.000Z",
  questions: [
    {
      id: "demo-question-1",
      type: "single",
      prompt: "Which structure is the basic unit of life?",
      options: [
        { id: "option-cell", text: "Cell" },
        { id: "option-organ", text: "Organ" },
        { id: "option-tissue", text: "Tissue" },
        { id: "option-system", text: "Organ system" }
      ],
      correctOptionIds: ["option-cell"],
      points: 1
    },
    {
      id: "demo-question-2",
      type: "multi",
      prompt: "Which two are examples of vertebrates?",
      options: [
        { id: "option-frog", text: "Frog" },
        { id: "option-earthworm", text: "Earthworm" },
        { id: "option-eagle", text: "Eagle" },
        { id: "option-snail", text: "Snail" }
      ],
      correctOptionIds: ["option-frog", "option-eagle"],
      points: 2
    },
    {
      id: "demo-question-3",
      type: "text",
      prompt: "What is the process by which green plants make their food?",
      correctText: "photosynthesis",
      points: 1
    }
  ]
};

function readList(key, initialValue = []) {
  const saved = window.localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initialValue;
}

export function loadExams() {
  return readList(CBT_EXAMS_KEY, [demoExam]);
}

export function loadAttempts() {
  return readList(CBT_ATTEMPTS_KEY);
}

export function saveExams(exams) {
  window.localStorage.setItem(CBT_EXAMS_KEY, JSON.stringify(exams));
  window.dispatchEvent(new Event(CBT_UPDATED_EVENT));
}

export function saveAttempts(attempts) {
  window.localStorage.setItem(CBT_ATTEMPTS_KEY, JSON.stringify(attempts));
  window.dispatchEvent(new Event(CBT_UPDATED_EVENT));
}

export function subscribeToCbtUpdates(onUpdate) {
  window.addEventListener(CBT_UPDATED_EVENT, onUpdate);
  window.addEventListener("storage", onUpdate);
  return () => {
    window.removeEventListener(CBT_UPDATED_EVENT, onUpdate);
    window.removeEventListener("storage", onUpdate);
  };
}

export function createId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

export function scoreAttempt(exam, answers) {
  let earnedPoints = 0;
  const totalPoints = exam.questions.reduce((total, question) => total + (Number(question.points) || 1), 0);
  const review = exam.questions.map((question) => {
    let correct = false;
    if (question.type === "text") {
      const expected = String(question.correctText || "").trim().toLocaleLowerCase();
      const answer = String(answers[question.id] || "").trim().toLocaleLowerCase();
      correct = Boolean(expected) && answer === expected;
    } else {
      const expected = [...(question.correctOptionIds || [])].sort();
      const actual = [...(answers[question.id] || [])].sort();
      correct = expected.length === actual.length && expected.every((id, index) => id === actual[index]);
    }
    const points = correct ? Number(question.points) || 1 : 0;
    earnedPoints += points;
    return { questionId: question.id, correct, earnedPoints: points };
  });
  return {
    earnedPoints,
    totalPoints,
    percentage: totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    review
  };
}
