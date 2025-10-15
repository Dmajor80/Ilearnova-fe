# iLearnova Frontend

A React + Vite frontend for a multi‑role school management platform. The app implements authentication with refresh tokens, role‑based routing, and organization‑aware access control, with a modern UI using Tailwind CSS and MUI.

## Tech Stack

- React 19 + React DOM 19
- Vite 6 (alias `@` → `src`)
- React Router 7
- Tailwind CSS 4
- MUI 7 (Material UI)
- Axios (optional, most HTTP uses native fetch via helpers)
- TanStack Query 5 (available to use)
- Recharts, Framer Motion, Lucide/FontAwesome Icons

## Quick Start

Prerequisites:
- Node.js ≥ 18.18 (Vite 6 recommends Node 18+)
- npm ≥ 9

Install and run:
- npm install
- npm run dev
- Optional: npm run build then npm run preview

Environment setup:
- Create a `.env.local` in the project root with the variables below.

## Environment Variables

Place these in `.env.local`:

- VITE_API_BASE_URL: Base URL for backend API, e.g. https://api.example.com
- VITE_CDN_BASE_URL: Base URL for CDN assets (optional)
- VITE_LOGO_URL: Logo URL for branding (optional)
- VITE_REFRESH_PATH: Optional override for the token refresh path (defaults to /api/auth/refresh/)

Example:
VITE_API_BASE_URL=https://api.example.com
VITE_CDN_BASE_URL=https://cdn.example.com
VITE_LOGO_URL=https://cdn.example.com/logo.png
VITE_REFRESH_PATH=/api/auth/refresh/

## Available Scripts

- npm run dev: Start Vite dev server
- npm run build: Build for production
- npm run preview: Preview the production build locally
- npm run lint: Run ESLint

## Routing Overview

All routes are defined in src/App.jsx. Guards:
- RequireAuth: Ensures the user has a valid access token (auto-refresh supported)
- RoleGate(anyOf=[...]): Restricts routes to specific roles
- OrgGate: Requires an organization context (selects or prompts if missing)

Public:
- / → HomePage
- /login, /signup, /forgot-password, /verify-otp, /reset-password
- /verify-success, /verify-failure
- /forbidden
- new/legacy login aliases redirect to /login:
  - /new-login → /login
  - /student-login, /parent-login, /Admin-login → /login

Authenticated:
- /home → RegisteredHomePage (RequireAuth)
- /post-login → PostLoginRedirect (RequireAuth)
- /select-user-type → SelectUserType (RequireAuth)
- /organization-details → OrganizationDetails (RequireAuth)

Role-gated dashboards:
- /teacher-dashboard
  - RequireAuth + RoleGate(anyOf=['teacher'])
- /student-dashboard
  - RequireAuth + RoleGate(anyOf=['student'])
  - Nested:
    - index, /overview → Overview
    - /IDcard → IdCard
    - /attendance → Attendance
    - /assignment → Assignments
    - /timetable → Timetable
    - /transcript → Grade
    - /courses → CoursesComponent
    - /courses/:courseId → CoursePage
    - /result → Result
    - /exam → Exam
- /admin-dashboard
  - RequireAuth + RoleGate(anyOf=['superadmin'])
  - Nested:
    - /dashboard → Admin Dashboard
    - /users → Users
    - /users/new-user → NewUser
    - /reports → Report
- /dashboard (School Admin)
  - RequireAuth + RoleGate(anyOf=['org_admin','admin']) + OrgGate

Fallback:
- Any unknown path → Error page

## Authentication and Tokens

Location: src/api/auth.js, src/features/auth/RequireAuth.jsx

- Tokens are stored under keys:
  - auth_access (access token)
  - auth_refresh (refresh token)
- Storage automatically prefers where tokens already exist (localStorage or sessionStorage) and keeps using it.
- Token Refresh:
  - POST join(VITE_API_BASE_URL, VITE_REFRESH_PATH || "/api/auth/refresh/")
  - On 401/403, an automatic refresh is attempted once. If it fails, tokens are cleared to trigger re‑login.
- Authorization:
  - Authorization: Bearer <access>
  - Optional organization scoping header X-Org-Id is attached when available.

RequireAuth flow:
- If no tokens → redirect to /login
- If access expired but refresh exists → attempts refresh → proceed or redirect to /login

## Organization Context

Location: src/context/OrganizationContext.jsx, src/features/auth/OrgGate.jsx

- OrganizationProvider initializes from user_data in storage.
  - Supports multiple shapes (user.organizations or user.orgs).
  - selectedOrgId is persisted back to user_data.
- Auto-picks the only org when there is exactly one.
- OrgGate behavior:
  - While loading: shows a minimal spinner
  - 0 orgs: redirect to /organization-details
  - 1+ orgs but none selected: prompts selection or navigation
  - With selected org: renders children

## HTTP Client

Location: src/api/baseClient.js

- apiUrl(path): Joins path to VITE_API_BASE_URL safely
- authorizedFetch(): Ensures valid access token, attaches Authorization (and X-Org-Id), retries once on 401/403 after refresh
- http helpers:
  - http.get(path, opts)
  - http.post(path, { body, headers, ... })
  - http.put/patch/del(...)

Example:
import { http } from "@/api/baseClient";

async function loadProfile() {
  return http.get("/api/profile/");
}

## Error Handling

Locations: src/lib/errorHandler.js, src/components/ui/ErrorBoundary.jsx, src/main.jsx

- AppError with categories and severities
- Central parseError/getUserFriendlyMessage utilities
- withRetry to wrap async ops
- setupGlobalErrorHandling() attaches listeners for unhandled promise rejections and global errors
- Root ErrorBoundary wraps the app with a friendly fallback

## Styling

- Tailwind CSS 4 imported via @import "tailwindcss" in src/index.css
- Google Fonts: DM Sans (default), Poppins available
- Example theme token in @theme
- MUI 7 and custom components are used where needed

## Project Structure (selected)

- src/
  - App.jsx: Routes and guards
  - main.jsx: App bootstrap, Router, OrganizationProvider, ErrorBoundary
  - index.css: Tailwind + global styles
  - api/
    - config.js: VITE_* config and refresh path
    - auth.js: tokens, refresh, authorizedFetch
    - baseClient.js: http helpers
  - components/
    - ui/: ErrorBoundary, InputField, NotificationBar, etc.
    - layout/: Navbar
    - admin/: dashboard UI pieces
  - context/OrganizationContext.jsx
  - features/
    - auth/: Login, Signup, Reset, RequireAuth, RoleGate, OrgGate, onboarding
    - student/: dashboard and pages
    - teacher/: dashboard and pages
    - admin/: dashboard and pages
    - school-admin/: org admin area
    - landing/: marketing/registered home
  - lib/errorHandler.js
  - pages/: HomePage, Forbidden, Error

Vite Config:
- Alias @ → src (vite.config.js)

## Development Notes

- ESLint 9 is configured (eslint.config.js). Run npm run lint.
- React Router v7 patterns are used (Routes/Route, Navigate).
- When changing token/role/org shapes from the backend, verify OrgGate/RoleGate/RequireAuth assumptions and storage keys.
- For multi‑org users, ensure user_data contains organizations and selectedOrgId as expected by OrganizationContext.

## Troubleshooting

- 401/403 loops: Clear tokens (localStorage/sessionStorage) and re‑login. Verify VITE_API_BASE_URL and VITE_REFRESH_PATH are correct and CORS is enabled on the API.
- Refresh fails: Backend must return a JSON with at least an access token key (access, token, or access_token).
- Organization required: If you see the org selection screen, ensure user_data contains organizations or go to /organization-details to create/link one.
- Dev server logs: Vite logLevel is set to "info". You can adjust in vite.config.js.

## License

Proprietary. All rights reserved.
