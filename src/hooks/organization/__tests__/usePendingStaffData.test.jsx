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

  it("lists pending students and verifies a whole intake at once", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: { pending_staff: [{ id: "s1" }, { id: "s2" }], pagination: { total: 2, pages: 1 } }
    });
    http.post.mockResolvedValue({ success: true, data: { verified: 2, not_found: [] } });

    const { result } = renderHook(() => usePendingStaffData("student"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(http.get).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/",
      { auth: true, params: { page: 1, page_size: 20, role: "student" } }
    );

    let outcome;
    await act(async () => {
      outcome = await result.current.bulkVerifyPendingStaff(["s1", "s2"]);
    });
    expect(http.post).toHaveBeenCalledWith(
      "/api/admin/school/pending-staff/bulk-verify/",
      { ids: ["s1", "s2"] },
      { auth: true }
    );
    expect(outcome).toEqual({ verified: 2, not_found: [] });
    expect(http.get).toHaveBeenCalledTimes(2); // reloaded after verifying
  });

  it("loads the next page when the page changes", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: { pending_staff: [], pagination: { total: 40, pages: 2, has_next: true } }
    });
    const { result } = renderHook(() => usePendingStaffData("student"));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setCurrentPage(2));
    await waitFor(() =>
      expect(http.get).toHaveBeenLastCalledWith(
        "/api/admin/school/pending-staff/",
        { auth: true, params: { page: 2, page_size: 20, role: "student" } }
      )
    );
  });
});
