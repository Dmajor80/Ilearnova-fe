import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

vi.mock("@/hooks/useApiCircuitBreaker", () => ({
  default: () => ({
    shouldCallEndpoint: () => true,
    markEndpointFailed: vi.fn(),
    resetAllEndpoints: vi.fn(),
    failedEndpoints: new Set(),
    endpointErrors: {},
    endpointRetries: {}
  })
}));

import { http } from "@/api/baseClient";
import useStudentAssignments from "./useStudentAssignments";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useStudentAssignments", () => {
  it("rejects a submission without its required file before calling the API", async () => {
    http.get.mockResolvedValue({ count: 0, next: null, results: [] });
    const { result } = renderHook(() => useStudentAssignments());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(
        result.current.submitAssignment("assignment-id", "My answer", null)
      ).rejects.toThrow("attached file are required");
    });

    expect(http.post).not.toHaveBeenCalled();
  });
});
