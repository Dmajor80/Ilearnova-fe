# iLearnova Application Fixes

This document summarizes the application improvements and fixes made across the organization administrator, student, teacher, and registration experiences. iLearnova is a multi-role school management frontend built with React and Vite; its dashboards use role-specific pages and API integrations where the backend exposes matching endpoints.

## Organization Administrator

- Added organization-specific hooks under `src/hooks/organization/` for overview data, analytics, classes, students, teachers, users, parents, calendar events, food menus and orders, notifications, unpaid tuition, reports, and school dashboard data. The organization barrel exports these local hooks while the original admin hooks remain available.
- Added organization overview, analytics, and classes hooks, and grouped the other organization-admin hooks in the organization index.
- Corrected the shared HTTP client so request bodies, query parameters, and multipart uploads are sent appropriately.
- Used API-spec paths for the copied admin hooks, including `/api/admin/school/calendar/events/` and `/api/admin/school/food/menu/`.
- Connected organization dashboard pages to API-backed hooks for overview metrics and activity, events and alerts, student and teacher management, class listing, analytics, report export, and notification broadcasts. Relevant views now surface API errors, and the alert button displays the notification count.
- Updated organization class listing to use the paginated `GET /api/classes/` endpoint with organization filtering, search, and server-side pagination. The page displays the class fields returned by the endpoint.
- Improved overview data handling: it prefers metrics from the metrics endpoint, falls back to counts from live student, teacher, and class endpoints, accepts common response wrappers for metrics and activity, and refreshes all overview data sources together. Removed hard-coded sample values and the generic “Activity update” fallback.
- Removed hard-coded teacher and unpaid-tuition fallback data from the organization dashboard hook. Student and teacher statuses display “Unknown” when the API provides no status, and the static profile image was replaced with a neutral icon.
- Kept the organization dashboard shell/layout intact while wiring its pages to the organization hooks.

### Organization API limitations

- The API specification does not define organization-admin exam endpoints; its exam CRUD routes are teacher-scoped. Organization exam controls therefore remain disconnected and display a notice explaining that the admin API is unavailable.
- The API specification does not document response schemas for dashboard metrics, activities, or performance. The overview handles common response formats and uses live endpoint counts as a fallback, but the live backend response could not be confirmed in this environment.

## Student

- Added authenticated API functions under `src/api/student/` for the documented student routes: announcements, assignments, classes, exams and exam sessions, topics, and submissions. Exported them through `src/api/index.js`.
- Added student hooks under `src/hooks/student/` for announcements, assignments, and exams.
- Connected the hooks to the student overview, assignments, and exams screens. The overview displays API announcements and derives its pending-assignment count from assignments and submissions.
- Replaced mock exam data and local question grading with server-provided examinations, sessions, answers, submissions, and results. The assignments screen now lists API data and supports submissions.
- Left course progress, attendance, transcript, timetable, and other unsupported mock sections unchanged because the documented student endpoints do not provide that data.

### Student API limitation

- The API specification does not define the exam-answer request body or the session and result response schemas. The exam UI accommodates common session and question shapes and currently submits answers as `{ question_id, answer }`; that payload still needs confirmation against the backend.

## Teacher

- Added teacher API wrappers under `src/api/teacher/` and seven focused hooks under `src/hooks/teacher/`, exported through `src/hooks/teacher/index.js`.
- The hooks cover assignments, exams and submissions, classes and course content, attendance, students, announcements, and question-bank items. They provide shared response handling, notifications, loading and error state, and circuit-breaker support.
- Connected teacher hooks to the dashboard and related screens. Dashboard counts for students, classes, assignments, submissions, and exams now use live data.
- Added API-backed workflows for creating, editing, deleting, and reviewing assignment submissions; managing class subjects, topics, materials, and announcements; and reviewing and submitting attendance records.
- Added an Examinations screen for exam management, submissions, and question-bank operations. The legacy Attendance Page now uses the API-backed attendance screen.
- Left messaging, timetable, and grade analytics on their existing mock data because no matching teacher endpoints are available.

## Authentication, Organization Context, and Registration

- Fixed the organization context so newly updated user data can be displayed, including after refreshing user information.
- Added a date-of-birth field to the sign-up form.
- Fixed organization listings so organizations appear when registering as a student, teacher, or parent.

## Validation and Remaining Notes

- The production build passes.
- Organization pages pass ESLint with no errors. The copied hooks still report existing React effect-dependency warnings.
- The student and teacher API integrations depend on backend response and request shapes where the API specification is incomplete; those assumptions should be confirmed against the live API.
