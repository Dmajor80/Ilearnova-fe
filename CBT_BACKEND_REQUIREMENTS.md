# CBT backend implementation requirements

The current CBT feature is a local-only frontend prototype. It calls no API endpoints and stores exams, attempts, answers, timer deadlines, focus warnings, and demo grades in `localStorage`. Browser storage and client-side grading are editable and must not be used as the authority for real exams or official results.

## Authentication, class membership, and authorization

- Derive the authenticated teacher/student from the access token; never accept a client-supplied role or student identity as proof of authorization.
- A teacher may manage only classes assigned to that teacher and within the active organization. Validate class, subject, and organization relationships on every create/read/update/delete.
- A student may list or start only exams published to a class where the backend confirms the student's active enrollment/verified status.
- Scope all list and detail responses by organization and membership. Return appropriate 401/403/404 responses without leaking exam content or enrollment data.
- Keep correct answers and scoring data out of student exam delivery responses until the submission is finalized and review is allowed.

## Suggested resources and routes

Use the following as a starting contract, adjusted to the project's existing API conventions:

| Route | Role | Purpose |
|---|---|---|
| `GET /api/teacher/cbt/exams/` | Teacher | List exams for the teacher's authorized classes; support pagination and class/status filters. |
| `POST /api/teacher/cbt/exams/` | Teacher | Create an exam and its questions as a draft or publish it to one authorized class. |
| `GET /api/teacher/cbt/exams/{exam_id}/` | Teacher | Retrieve exam configuration and answer keys for teacher review. |
| `PATCH /api/teacher/cbt/exams/{exam_id}/` | Teacher | Edit a draft or update allowed published-exam metadata. Define whether edits are blocked after attempts begin. |
| `DELETE /api/teacher/cbt/exams/{exam_id}/` | Teacher | Delete/archive an exam according to retention rules. |
| `GET /api/student/cbt/exams/` | Student | List only exams available to the authenticated student, with availability and prior-attempt status. |
| `GET /api/student/cbt/exams/{exam_id}/` | Student | Retrieve instructions, duration, and questions/options without correct answers. |
| `POST /api/student/cbt/exams/{exam_id}/attempts/` | Student | Start or resume an authorized attempt; return attempt ID, server start/deadline timestamps, and the student's question/option order. |
| `PUT /api/student/cbt/attempts/{attempt_id}/answers/{question_id}/` | Student | Validate and autosave one answer; idempotent for retries. |
| `POST /api/student/cbt/attempts/{attempt_id}/submit/` | Student | Finalize the attempt once, enforce the server deadline, and calculate/persist the score. |
| `GET /api/student/cbt/attempts/{attempt_id}/` | Student | Resume an attempt without disclosing answers or grading keys. |
| `GET /api/student/cbt/attempts/{attempt_id}/result/` | Student | Return the authorized result and, if policy permits, answer review/explanations. |
| `GET /api/teacher/cbt/exams/{exam_id}/attempts/` | Teacher | List attempts and grading summaries only for an exam owned by that teacher. |
| `GET /api/teacher/cbt/attempts/{attempt_id}/` | Teacher | Review an attempt, responses, score, timestamps, and integrity events. |

## Data and validation

Persist at least:

- **Exam:** organization, class, subject, creator, title, instructions, status, duration, availability window, shuffle settings, timestamps, and version.
- **Question:** exam/version, stable question identifier, interaction type, prompt/media references, options, points, answer key, and optional explanation.
- **Attempt:** exam version, student, status, server start/deadline/submission timestamps, question/option order, autosaved answers, score, and integrity event metadata.

Validate question payloads server-side: supported interaction type, non-empty prompt/options, unique IDs, valid answer keys, positive points, and class/organization consistency. Define whether an exam can be changed once an attempt exists. Use an immutable exam version or snapshot in each attempt to ensure question edits do not change a live test.

## Timing, autosave, scoring, and integrity

- The server must set and enforce attempt deadlines; do not trust browser clocks, `localStorage`, countdowns, or a client-provided `automatic`/`submitted` flag.
- Make attempt start and final submission idempotent. Prevent unauthorized duplicate attempts and define resumption rules for interrupted sessions.
- Autosave answers after each change, return a saved-at timestamp, and support safe retry after temporary network loss. The frontend should treat the server's attempt state as canonical.
- Grade objective items on the server. Define partial-credit rules for multiple-select questions and manual grading/feedback for free-response questions. Persist score and grading audit data.
- Record focus/fullscreen events only as advisory integrity signals; browsers cannot reliably prevent tab changes or guarantee fullscreen. Define retention and teacher visibility for such events.
- Rate-limit and audit attempt start, answer, submit, result, and teacher review operations. Protect answer keys from student APIs and logs.

## QTI interoperability

The frontend prototype imports standalone QTI 2.x/3.x XML item files and parses choice and text-entry interactions. For production interoperability, define supported QTI version/profile and whether the backend accepts individual XML items, full QTI content packages (ZIP), or both. Validate imported packages server-side, reject unsafe XML/entities and unsupported interactions clearly, retain source/version metadata, and return structured import errors. Do not rely on the browser importer as a trust boundary.

Reference: [1EdTech QTI](https://www.1edtech.org/standards/qti) and [QTI 3.0 implementation guide](https://www.imsglobal.org/spec/qti/v3p0/impl).
