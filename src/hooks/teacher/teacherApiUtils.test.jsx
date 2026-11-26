import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useTeacherApi from "./teacherApiUtils";

describe("useTeacherApi", () => {
  // Callers build effects on hooks that wrap `request` (e.g. the exam form's
  // subject list); a new `request` every render re-ran those effects forever.
  it("keeps the same request function across renders", () => {
    const { result, rerender } = renderHook(() => useTeacherApi());
    const first = result.current.request;
    rerender();
    rerender();
    expect(result.current.request).toBe(first);
  });
});
