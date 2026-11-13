import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    del: vi.fn()
  }
}));

vi.mock("@/hooks/useApiCircuitBreaker", () => ({
  default: () => ({
    shouldCallEndpoint: () => true,
    markEndpointFailed: vi.fn(),
    resetAllEndpoints: vi.fn(),
    resetEndpoint: vi.fn(),
    getEndpointStatus: vi.fn(),
    failedEndpoints: new Set(),
    endpointErrors: {},
    endpointRetries: {}
  })
}));

import { http } from "@/api/baseClient";
import useTeacherData from "../useTeacherData";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useTeacherData", () => {
  it("excludes teachers with pending organization roles", async () => {
    http.get.mockImplementation((path, options = {}) => {
      if (path.includes("/pending-staff/")) {
        const page = options.params.page;
        const staff = page === 1
          ? [{ user: { email: "pending-one@example.com" } }]
          : [{ user: { email: "pending-two@example.com" } }];
        return Promise.resolve({
          success: true,
          data: {
            pending_staff: staff,
            pagination: { pages: 2, total: 2 }
          }
        });
      }

      return Promise.resolve({
        success: true,
        data: {
          teachers: [
            { id: "1", email: "verified@example.com", full_name: "Verified Teacher" },
            { id: "2", email: "PENDING-ONE@example.com", full_name: "Pending One" },
            { id: "3", email: "pending-two@example.com", full_name: "Pending Two" }
          ],
          pagination: { total: 3 }
        }
      });
    });

    const { result } = renderHook(() => useTeacherData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => new Promise((resolve) => setTimeout(resolve, 25)));

    expect(result.current.teachers.map((teacher) => teacher.email)).toEqual([
      "verified@example.com"
    ]);
    expect(result.current.totalTeachers).toBe(1);
    expect(http.get).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/",
      { auth: true, params: { page: 1, page_size: 100, role: "teacher" } }
    );
    expect(http.get).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/",
      { auth: true, params: { page: 2, page_size: 100, role: "teacher" } }
    );
  });
});
