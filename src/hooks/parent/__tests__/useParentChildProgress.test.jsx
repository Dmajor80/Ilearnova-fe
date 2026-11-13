import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { getParentChildProgress, notify } = vi.hoisted(() => ({
  getParentChildProgress: vi.fn(),
  notify: vi.fn()
}));

vi.mock("@/api/parent", () => ({
  getParentChildProgress
}));

vi.mock("@/hooks/useNotification", () => ({
  default: () => ({ notify })
}));

vi.mock("@/lib/errorHandler", () => ({
  getNotificationType: () => "error",
  getUserFriendlyMessage: (error) => error.message,
  parseError: (error) => error
}));

import useParentChildProgress from "../useParentChildProgress";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useParentChildProgress", () => {
  it("waits for a child selection before loading progress", async () => {
    getParentChildProgress.mockResolvedValue({ data: { attendance: 90 } });
    const { result, rerender } = renderHook(
      ({ childId }) => useParentChildProgress(childId),
      { initialProps: { childId: null } }
    );

    expect(getParentChildProgress).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.progress).toBe(null);

    rerender({ childId: "child-1" });
    await waitFor(() => {
      expect(getParentChildProgress).toHaveBeenCalledWith("child-1");
      expect(result.current.progress).toEqual({ attendance: 90 });
    });
  });
});
