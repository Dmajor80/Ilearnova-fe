# Backend Support Needed

This document lists backend API work or clarification needed to complete the frontend integrations described in [FIXES.md](FIXES.md). I compared the current frontend usage with the endpoints and schemas in `Ilearnova School Management API (3).yaml`. Where a route or schema is not present in that file, this document describes it as **not documented in the specification**—that alone does not prove it is absent from the deployed backend.

## High priority: organization administrator

### 1. Organization-admin exam management API

The organization dashboard cannot safely manage exams because the specification contains no organization-admin exam routes. The available exam CRUD routes are teacher-scoped, so the frontend intentionally does not call them for organization administrators.

**Backend request:** provide organization-admin exam list, detail, create, update, delete, and submission/report endpoints, or confirm that these actions are intentionally unavailable to organization administrators. Document the required permissions and request/response schemas.

### 2. Document dashboard response contracts

The specification lists these endpoints but gives no response body schemas:

- `GET /api/admin/school/dashboard/metrics/`
- `GET /api/admin/school/dashboard/activities/`
- `GET /api/admin/school/dashboard/performance/`

The frontend currently accepts common response formats and uses live student, teacher, and class totals as fallbacks, but cannot guarantee that every backend response will map correctly.

**Backend request:** document each endpoint's response schema and provide representative JSON responses, including metric names/types, activity fields, and the performance data series.

### 3. Confirm class creation API and schema

Organization class listing now uses the paginated `GET /api/classes/` endpoint, which is documented as read-only. The organization class form still submits to the legacy `POST /api/admin/classes/create/` route. The specification labels that route as legacy and defines neither its request body nor its response.

**Backend request:** confirm the supported organization-admin create route and provide its request/response schema. If class creation should use `POST /api/classes/`, document that method and its organization/permission behavior; otherwise document the legacy route's accepted fields and validation rules.

## High priority: student exam contract

The student exam session routes are present, but the specification omits the answer request body and response schemas for session start, session retrieval, answer saving, submission, and results. The frontend currently saves an answer as `{ question_id, answer }` and handles common session/question response shapes.

**Backend request:** confirm the exact answer payload and document the session, question, save-answer, submit, and result response schemas. Include answer formats for each supported question type and explain how saved answers and final results are represented.

## Additional APIs needed for currently unsupported screens

These areas were left on existing mock or static UI because the current specification does not expose matching APIs for the required student/teacher data:

- **Student:** course catalogue/enrollment and progress, attendance history, transcript/results summary, and timetable.
- **Teacher:** messaging and timetable; grade/performance analytics if those dashboard views should use live data.

**Backend request:** provide the intended endpoints and permissions for any of these product areas that should be API-backed. The teacher API already includes class-material endpoints; the request here is only for additional capabilities not represented by those routes.

## Confirmation checklist

- Confirm the live API's organization-admin authorization and organization scoping behavior for dashboard and class endpoints.
- Publish complete request/response schemas (including pagination, error responses, and examples) for endpoints consumed by the frontend.
- Confirm whether the signup API accepts and persists `date_of_birth`. The repository specification includes this field in registration schemas, so this is a verification item rather than a known missing endpoint.
