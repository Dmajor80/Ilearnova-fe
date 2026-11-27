import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Check, FileQuestion, Pencil, Plus, Trash2 } from "lucide-react";
import Modal, { Button } from "@/components/ui/Modal";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { toast } from "@/lib/toast";
import {
  addTeacherExaminationBankQuestions,
  deleteTeacherBankQuestion,
  getTeacherBankQuestion,
  getTeacherExaminationBankQuestions,
  updateTeacherBankQuestion
} from "@/api/teacher";
import QuestionEditor from "./QuestionEditor";
import {
  blankDraft,
  draftFromQuestion,
  draftToPayload,
  examTally,
  isChoice,
  isText,
  questionErrors,
  reorderUpdates,
  typeLabel
} from "./questionModel";

const unwrap = (response) => response?.data ?? response;
const marksText = (marks) => `${Number(marks)} mark${Number(marks) === 1 ? "" : "s"}`;
const sortQuestions = (list) =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.created_at || "").localeCompare(String(b.created_at || "")));
const failure = (error, fallback) => questionErrors(error)._general || fallback;

function QuestionCard({ question, number, total, busy, onEdit, onDelete, onMove }) {
  const options = [...(question.options || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const type = question.question_type;
  return (
    <article aria-label={`Question ${number}`} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap font-medium text-gray-900">{question.question_text}</p>
        <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">{typeLabel(type)}</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">{marksText(question.marks)}</span>
        </div>
        {(isChoice(type) || type === "true_false") && options.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm">
            {options.map((option) => (
              <li
                key={option.id || option.option_text}
                className={`flex items-center gap-2 rounded-md px-2 py-1 ${option.is_correct ? "bg-green-50 text-green-800" : "text-gray-700"}`}
              >
                {option.is_correct ? (
                  <Check className="h-4 w-4 flex-shrink-0 text-green-600" aria-hidden="true" />
                ) : (
                  <span className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                )}
                <span>{option.option_text}</span>
                {option.is_correct && <span className="ml-auto text-xs font-medium">Correct</span>}
              </li>
            ))}
          </ul>
        )}
        {isText(type) && (
          <p className="mt-2 text-sm text-gray-600">
            {options.length
              ? `Accepted answers: ${options.map((o) => o.option_text).join(", ")}`
              : "No accepted answers: you mark this by hand."}
          </p>
        )}
        {type === "essay" && <p className="mt-2 text-sm text-gray-600">You mark this by hand.</p>}
        {question.explanation && <p className="mt-2 text-sm italic text-gray-500">Explanation: {question.explanation}</p>}
      </div>
      <div className="flex flex-shrink-0 flex-col items-center gap-1">
        <ActionsMenu
          label={`Actions for question ${number}`}
          items={[
            { id: "edit", label: "Edit", icon: Pencil, onSelect: onEdit, disabled: busy },
            { id: "delete", label: "Delete", icon: Trash2, onSelect: onDelete, danger: true, separatorBefore: true, disabled: busy }
          ]}
        />
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={busy || number === 1}
          aria-label={`Move question ${number} up`}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={busy || number === total}
          aria-label={`Move question ${number} down`}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/** The questions students answer in an exam: list, add, edit, delete, reorder. */
export default function ExamQuestions({ exam, open, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState(null); // { mode, question?, draft }
  const [deleting, setDeleting] = useState(null); // { question, number }
  const examId = exam?.id;

  const load = useCallback(async () => {
    if (!examId) return;
    try {
      const list = unwrap(await getTeacherExaminationBankQuestions(examId));
      setQuestions(sortQuestions(Array.isArray(list) ? list : list?.results || []));
      setLoadError("");
    } catch (error) {
      setLoadError(failure(error, "Couldn't load the questions. Try again."));
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setQuestions([]);
    load();
  }, [open, load]);

  const startAdd = () => setEditor({ mode: "add", draft: blankDraft() });

  const startEdit = async (question) => {
    if (Array.isArray(question.options)) {
      setEditor({ mode: "edit", question, draft: draftFromQuestion(question) });
      return;
    }
    setEditor({ mode: "edit", question, draft: null });
    try {
      const full = unwrap(await getTeacherBankQuestion(question.id));
      setEditor((current) => (current?.question?.id === question.id ? { ...current, question: full, draft: draftFromQuestion(full) } : current));
    } catch (error) {
      setEditor(null);
      toast(failure(error, "Couldn't open that question. Try again."), "error");
    }
  };

  const save = async (draft) => {
    if (editor.mode === "edit") {
      await updateTeacherBankQuestion(editor.question.id, draftToPayload(draft));
      toast("Question updated.");
    } else {
      const next = questions.reduce((max, q) => Math.max(max, (q.order ?? 0) + 1), questions.length);
      await addTeacherExaminationBankQuestions(examId, draftToPayload(draft, { order: next }));
      toast("Question added.");
    }
    setEditor(null);
    await load();
  };

  const remove = async () => {
    try {
      await deleteTeacherBankQuestion(deleting.question.id);
    } catch (error) {
      throw new Error(failure(error, "Couldn't delete the question. Try again."));
    }
    toast("Question deleted.");
    await load();
  };

  const move = async (index, delta) => {
    const updates = reorderUpdates(questions, index, delta);
    if (!updates.length) return;
    const next = [...questions];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setQuestions(next.map((q, order) => ({ ...q, order })));
    setBusy(true);
    try {
      for (const { id, order } of updates) {
        await updateTeacherBankQuestion(id, { order });
      }
    } catch (error) {
      toast(failure(error, "Couldn't move the question. Try again."), "error");
    } finally {
      setBusy(false);
      await load();
    }
  };

  const tally = examTally(questions, exam);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="xl"
        title="Questions"
        description={exam?.title}
        footer={<Button onClick={onClose}>Done</Button>}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {!loading && !loadError ? (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-800">
                {tally.expectedCount ? `${tally.count} of ${tally.expectedCount} questions` : `${tally.count} questions`}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-800">
                {tally.expectedMarks ? `${tally.marks} of ${tally.expectedMarks} marks` : `${tally.marks} marks`}
              </span>
            </div>
          ) : <span />}
          <Button variant="primary" onClick={startAdd} disabled={loading || Boolean(loadError)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add question
          </Button>
        </div>

        {!loading && !loadError && questions.length > 0 && tally.warnings.length > 0 && (
          <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <div className="space-y-1">
              {tally.warnings.map((w) => <p key={w}>{w}</p>)}
              <p className="text-amber-800">You can change the exam's settings with Edit on the exam card.</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <ListSkeleton rows={3} label="Loading questions" />
          ) : loadError ? (
            <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {loadError}{" "}
              <button type="button" onClick={() => { setLoading(true); load(); }} className="font-medium underline">Try again</button>
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <FileQuestion className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
              <p className="mt-2 font-medium text-gray-800">{"No questions yet — add the first one"}</p>
              <p className="mt-1 text-sm text-gray-500">Students only see questions you add here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  number={index + 1}
                  total={questions.length}
                  busy={busy}
                  onEdit={() => startEdit(question)}
                  onDelete={() => setDeleting({ question, number: index + 1 })}
                  onMove={(delta) => move(index, delta)}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <QuestionEditor
        open={Boolean(editor)}
        mode={editor?.mode}
        draft={editor?.draft ?? null}
        onSave={save}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={deleting ? `Delete question ${deleting.number}?` : ""}
        message={deleting ? `"${deleting.question.question_text}" will be removed from this exam. Students won't see it.` : ""}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
