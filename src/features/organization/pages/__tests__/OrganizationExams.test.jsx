// Bug: school (org) admins can't see their school's exams. The page showed a
// hardcoded "unavailable" notice even though the backend serves
// GET /api/admin/school/exams/ for org admins.
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const ADMIN_EXAMS_RESPONSE = {
  success: true,
  data: {
    exams: [
      {
        id: "7b6f1d2e-0000-4000-8000-000000000001",
        title: "Mid-term Mathematics",
        subject_name: "Mathematics",
        class_name: "JSS 1A",
        status: "published",
        duration_minutes: 60,
        attempt_count: 12,
        start_time: "2026-11-10T09:00:00Z",
        end_time: "2026-11-10T10:00:00Z",
      },
    ],
    pagination: { page: 1, page_size: 10, total: 1, total_pages: 1 },
  },
};

vi.mock("@/api/baseClient", async (importOriginal) => {
  const actual = await importOriginal();
  const respond = (path) =>
    Promise.resolve(
      String(path).includes("/api/admin/school/exams")
        ? ADMIN_EXAMS_RESPONSE
        : { success: true, data: {} }
    );
  return {
    ...actual,
    http: {
      get: vi.fn(respond),
      post: vi.fn(respond),
      put: vi.fn(respond),
      patch: vi.fn(respond),
      del: vi.fn(respond),
    },
  };
});

import { http } from "@/api/baseClient";
import OrganizationExams from "../OrganizationExams";

afterEach(cleanup);

describe("OrganizationExams (org admin)", () => {
  it("loads and lists the school's exams from the admin exams API", async () => {
    render(
      <MemoryRouter>
        <OrganizationExams />
      </MemoryRouter>
    );

    expect(await screen.findByText("Mid-term Mathematics")).toBeTruthy();
    expect(screen.queryByText(/exam management is unavailable/i)).toBeNull();
    expect(
      http.get.mock.calls.some(([path]) => String(path).includes("/api/admin/school/exams/"))
    ).toBe(true);
  });
});
