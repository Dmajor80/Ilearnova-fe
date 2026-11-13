import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { notify, linkParentStudent } = vi.hoisted(() => ({
  notify: vi.fn(),
  linkParentStudent: vi.fn()
}));

vi.mock("@/api/parent", () => ({
  linkParentStudent
}));

vi.mock("@/hooks/useNotification", () => ({
  default: () => ({ notify })
}));

vi.mock("@/lib/errorHandler", () => ({
  getNotificationType: () => "error",
  getUserFriendlyMessage: (error) => error.message,
  parseError: (error) => error
}));

import useLinkParentStudent from "../useLinkParentStudent";
import useParentQuery from "../useParentQuery";

const deferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useParentQuery", () => {
  it("ignores an older child response after the selected child changes", async () => {
    const firstRequest = deferred();
    const secondRequest = deferred();
    const firstQuery = vi.fn(() => firstRequest.promise);
    const secondQuery = vi.fn(() => secondRequest.promise);
    const initialData = [];

    const { result, rerender } = renderHook(
      ({ query }) => useParentQuery({
        action: "fetch_test_data",
        initialData,
        label: "Test data",
        query
      }),
      { initialProps: { query: firstQuery } }
    );

    await waitFor(() => expect(firstQuery).toHaveBeenCalledTimes(1));
    rerender({ query: secondQuery });
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);

    await act(async () => {
      secondRequest.resolve({ data: [{ id: "new-child" }] });
      await secondRequest.promise;
    });
    await waitFor(() => expect(result.current.data).toEqual([{ id: "new-child" }]));

    await act(async () => {
      firstRequest.resolve({ data: [{ id: "previous-child" }] });
      await firstRequest.promise;
    });
    expect(result.current.data).toEqual([{ id: "new-child" }]);
  });

  it("clears the previous child data when the query becomes disabled", async () => {
    const query = vi.fn().mockResolvedValue({ data: [{ id: "child-1" }] });
    const initialData = [];
    const { result, rerender } = renderHook(
      ({ enabled }) => useParentQuery({
        action: "fetch_test_data",
        enabled,
        initialData,
        label: "Test data",
        query
      }),
      { initialProps: { enabled: true } }
    );

    await waitFor(() => expect(result.current.data).toEqual([{ id: "child-1" }]));
    rerender({ enabled: false });

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});

describe("useLinkParentStudent", () => {
  it("describes a successful link as a request awaiting approval", async () => {
    linkParentStudent.mockResolvedValue({ data: { success: true } });
    const { result } = renderHook(() => useLinkParentStudent());

    await act(async () => {
      await result.current.linkStudent({ email: "student@example.com" });
    });

    expect(notify).toHaveBeenCalledWith("Student link request sent successfully", "success");
  });
});
