import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import ImportStudentsModal from "../ImportStudentsModal";

const sheet = () => new File(["first_name,last_name,email\nAda,Obi,ada@x.ng\n"], "jss1.csv", { type: "text/csv" });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ImportStudentsModal", () => {
  it("checks the file first, then adds the students", async () => {
    const preview = {
      created: 0,
      dry_run: true,
      students: [{ row: 1, email: "ada@x.ng", name: "Ada Obi", class: "JSS1A", account: "new" }],
    };
    http.post
      .mockResolvedValueOnce({ success: true, data: preview })
      .mockResolvedValueOnce({ success: true, data: { ...preview, created: 1, dry_run: false } });
    const onImported = vi.fn();
    render(<ImportStudentsModal onClose={() => {}} onImported={onImported} />);

    fireEvent.change(screen.getByLabelText("Student sheet"), { target: { files: [sheet()] } });
    fireEvent.click(screen.getByRole("button", { name: /Check file/ }));

    expect(await screen.findByText("Ready to add 1 student(s):")).toBeTruthy();
    const firstForm = http.post.mock.calls[0][1];
    expect(http.post.mock.calls[0][0]).toBe("/api/admin/school/students/import/");
    expect(firstForm.get("dry_run")).toBe("true");
    expect(firstForm.get("send_email")).toBe("true");
    expect(screen.getByText("JSS1A")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Add 1 student/ }));
    expect(await screen.findByText(/Added 1 student\(s\)/)).toBeTruthy();
    expect(http.post.mock.calls[1][1].get("dry_run")).toBe("false");
    expect(onImported).toHaveBeenCalled();
  });

  it("reports bad rows by sheet line and adds nobody", async () => {
    const error = new Error("Validation failed");
    error.data = {
      message: "Validation failed",
      field_errors: { rows: [{ 2: ['no class named "JSS9" in this school'] }] },
    };
    http.post.mockRejectedValue(error);
    render(<ImportStudentsModal onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Student sheet"), { target: { files: [sheet()] } });
    fireEvent.click(screen.getByRole("button", { name: /Check file/ }));

    expect(await screen.findByText(/Nothing was added/)).toBeTruthy();
    expect(screen.getByText('Line 3: no class named "JSS9" in this school')).toBeTruthy();
  });
});
