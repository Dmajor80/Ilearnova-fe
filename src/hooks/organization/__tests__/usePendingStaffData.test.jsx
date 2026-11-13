import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    del: vi.fn()
  }
}));

import { http } from "@/api/baseClient";
import usePendingStaffData from "../usePendingStaffData";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("usePendingStaffData", () => {
  it("loads the teacher queue once and settles instead of refetching on rerender", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: {
        pending_staff: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
          has_next: false,
          has_prev: false
        }
      }
    });

    const { result } = renderHook(() => usePendingStaffData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => new Promise((resolve) => setTimeout(resolve, 25)));

    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/",
      { auth: true, params: { page: 1, page_size: 20, role: "teacher" } }
    );
    expect(result.current.pendingStaff).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("sends an empty JSON body when verifying a teacher", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: { pending_staff: [], pagination: { total: 0, pages: 0 } }
    });
    http.post.mockResolvedValue({ success: true, data: {} });

    const { result } = renderHook(() => usePendingStaffData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.verifyPendingStaff("teacher-role-id");
    });

    expect(http.post).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/teacher-role-id/verify/",
      {},
      { auth: true }
    );
  });
});
