import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Loader from "../Loader";

afterEach(cleanup);

describe("<style> blocks", () => {
  it("render without React's warning about the jsx attribute", () => {
    // Found clicking through: every page logged "Received `true` for a
    // non-boolean attribute `jsx`". styled-jsx is not installed, so
    // <style jsx> is just a global <style> with a stray attribute.
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Loader />);
    const warnings = error.mock.calls.filter((args) => args.join(" ").includes("jsx"));
    error.mockRestore();
    expect(warnings).toEqual([]);
  });

  it("are not written as <style jsx> anywhere", () => {
    const files = [
      "src/components/Loader.jsx",
      "src/features/landing/components/EducationLanding.jsx",
      "src/features/student/Overview.jsx",
      "src/features/student/StudentsTable.jsx",
    ];
    for (const file of files) {
      expect(readFileSync(file, "utf8"), file).not.toContain("<style jsx");
    }
  });
});
