import { useEffect, useId, useState } from "react";
import { Plus, X } from "lucide-react";
import Modal, { Button } from "@/components/ui/Modal";
import { FormSkeleton } from "@/components/ui/Skeleton";
import {
  MAX_OPTIONS,
  MIN_OPTIONS,
  QUESTION_TYPES,
  changeType,
  isChoice,
  isText,
  questionErrors,
  validateDraft
} from "./questionModel";

const inputClass = (invalid) =>
  `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${invalid ? "border-red-400" : "border-gray-300"}`;

function FieldError({ id, children }) {
  if (!children) return null;
  return <p id={id} className="mt-1 text-sm text-red-600">{children}</p>;
}

/**
 * Add/edit one exam question. `draft` is null while an existing question
 * loads. `onSave(draft)` resolves on success; a rejection's field errors
 * show next to the fields.
 */
export default function QuestionEditor({ open, mode = "add", draft: initial, onSave, onClose }) {
  const formId = useId();
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(initial);
    setErrors({});
    setTried(false);
  }, [initial, open]);

  const update = (next) => {
    setDraft(next);
    if (tried) setErrors(validateDraft(next));
  };
  const set = (field) => (event) => update({ ...draft, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setTried(true);
    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSave(draft);
    } catch (error) {
      setErrors(questionErrors(error));
    } finally {
      setSaving(false);
    }
  };

  const type = draft?.question_type;
  const typeInfo = QUESTION_TYPES.find((t) => t.value === type);
  const err = (field) => `${formId}-${field}-error`;

  const setOption = (index, patch) => {
    const options = draft.options.map((o, i) => {
      if (i === index) return { ...o, ...patch };
      if (patch.correct && type === "mcq") return { ...o, correct: false };
      return o;
    });
    update({ ...draft, options });
  };

  const setAnswer = (index, value) => update({ ...draft, answers: draft.answers.map((a, i) => (i === index ? value : a)) });

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      closeDisabled={saving}
      size="lg"
      title={mode === "edit" ? "Edit question" : "Add question"}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form={formId} variant="primary" loading={saving} disabled={!draft}>
            {mode === "edit" ? "Save changes" : "Add question"}
          </Button>
        </>
      }
    >
      {!draft ? (
        <FormSkeleton fields={4} label="Loading question" />
      ) : (
        <form id={formId} onSubmit={submit} noValidate className="space-y-5">
          {errors._general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors._general}</p>}

          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <div>
              <label htmlFor={`${formId}-type`} className="block text-sm font-medium text-gray-700">Question type</label>
              <select
                id={`${formId}-type`}
                value={type}
                onChange={(event) => update(changeType(draft, event.target.value))}
                className={inputClass(errors.question_type)}
              >
                {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {typeInfo && <p className="mt-1 text-xs text-gray-500">{typeInfo.hint}</p>}
              <FieldError>{errors.question_type}</FieldError>
            </div>
            <div>
              <label htmlFor={`${formId}-marks`} className="block text-sm font-medium text-gray-700">Marks</label>
              <input
                id={`${formId}-marks`}
                type="number"
                min="0.5"
                step="0.5"
                inputMode="decimal"
                value={draft.marks}
                onChange={set("marks")}
                aria-invalid={Boolean(errors.marks)}
                aria-describedby={errors.marks ? err("marks") : undefined}
                className={inputClass(errors.marks)}
              />
              <FieldError id={err("marks")}>{errors.marks}</FieldError>
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-text`} className="block text-sm font-medium text-gray-700">Question</label>
            <textarea
              id={`${formId}-text`}
              rows={3}
              value={draft.question_text}
              onChange={set("question_text")}
              placeholder="e.g. What is the value of x if 2x + 3 = 11?"
              aria-invalid={Boolean(errors.question_text)}
              aria-describedby={errors.question_text ? err("question_text") : undefined}
              className={inputClass(errors.question_text)}
            />
            <FieldError id={err("question_text")}>{errors.question_text}</FieldError>
          </div>

          {isChoice(type) && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">Options</legend>
              <p className="text-xs text-gray-500">
                {type === "mcq" ? "Select the circle next to the correct answer." : "Tick every correct answer."}
              </p>
              <ul className="mt-2 space-y-2">
                {draft.options.map((option, index) => {
                  const n = index + 1;
                  return (
                    <li key={index} className={`flex items-center gap-2 rounded-lg border p-2 ${option.correct ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
                      <input
                        type={type === "mcq" ? "radio" : "checkbox"}
                        name={`${formId}-correct`}
                        checked={option.correct}
                        onChange={(event) => setOption(index, { correct: event.target.checked })}
                        aria-label={`Option ${n} is correct`}
                        className="h-4 w-4 flex-shrink-0 accent-green-600"
                      />
                      <input
                        type="text"
                        maxLength={500}
                        value={option.text}
                        onChange={(event) => setOption(index, { text: event.target.value })}
                        aria-label={`Option ${n}`}
                        placeholder={`Option ${n}`}
                        className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {draft.options.length > MIN_OPTIONS && (
                        <button
                          type="button"
                          onClick={() => update({ ...draft, options: draft.options.filter((_, i) => i !== index) })}
                          aria-label={`Remove option ${n}`}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              {draft.options.length < MAX_OPTIONS && (
                <button
                  type="button"
                  onClick={() => update({ ...draft, options: [...draft.options, { text: "", correct: false }] })}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add option
                </button>
              )}
            </fieldset>
          )}

          {type === "true_false" && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">Correct answer</legend>
              <div className="mt-2 flex gap-3">
                {["true", "false"].map((value) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm ${draft.trueFalse === value ? "border-green-300 bg-green-50" : "border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name={`${formId}-tf`}
                      checked={draft.trueFalse === value}
                      onChange={() => update({ ...draft, trueFalse: value })}
                      className="accent-green-600"
                    />
                    {value === "true" ? "True" : "False"}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {isText(type) && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-700">Accepted answers (optional)</legend>
              <p className="text-xs text-gray-500">
                Answers matching one of these are marked right automatically (capital letters and extra spaces are ignored). Leave empty to mark by hand.
              </p>
              <ul className="mt-2 space-y-2">
                {draft.answers.map((answer, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={500}
                      value={answer}
                      onChange={(event) => setAnswer(index, event.target.value)}
                      aria-label={`Accepted answer ${index + 1}`}
                      className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {draft.answers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => update({ ...draft, answers: draft.answers.filter((_, i) => i !== index) })}
                        aria-label={`Remove accepted answer ${index + 1}`}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {draft.answers.length < MAX_OPTIONS && (
                <button
                  type="button"
                  onClick={() => update({ ...draft, answers: [...draft.answers, ""] })}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add another accepted answer
                </button>
              )}
            </fieldset>
          )}

          {type === "essay" && (
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              Students write their answer in a text box. You mark it by hand after the exam, from the exam's attempts.
            </p>
          )}

          {[errors.options, errors.correct, errors.answers].filter(Boolean).map((message) => (
            <p key={message} className="text-sm text-red-600">{message}</p>
          ))}

          <div>
            <label htmlFor={`${formId}-explanation`} className="block text-sm font-medium text-gray-700">Explanation (optional)</label>
            <textarea
              id={`${formId}-explanation`}
              rows={2}
              value={draft.explanation}
              onChange={set("explanation")}
              placeholder="Why the answer is right. Students see it after the exam if you allow review."
              className={inputClass(errors.explanation)}
            />
            <FieldError>{errors.explanation}</FieldError>
          </div>
        </form>
      )}
    </Modal>
  );
}
