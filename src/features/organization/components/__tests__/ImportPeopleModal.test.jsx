import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/hooks/organization/useOrganizationClasses", () => ({
  default: () => ({ classes: [] }),
}));
vi.mock("@/lib/apiHelpers", async (importOriginal) => ({
  ...(await importOriginal()),
  saveBlob: vi.fn(),
}));

import { http } from "@/api/baseClient";
import { saveBlob } from "@/lib/apiHelpers";
import ImportPeopleModal from "../ImportPeopleModal";
import PeopleDirectory from "../PeopleDirectory";

const sheet = () =>
  new File(["first_name,last_name,email,subjects\nAda,Obi,ada@x.ng,Mathematics@JSS1A\n"], "staff.csv", {
    type: "text/csv",
  });

const PREVIEW = {
  created: 0,
  dry_run: true,
  teachers: [
    {
      row: 1,
      email: "ada@x.ng",
      name: "Ada Obi",
      subjects: ["Mathematics@JSS1A", "Physics@SS2B"],
      class: "SS2B",
      account: "new",
    },
    { row: 2, email: "bayo@x.ng", name: "Bayo Ade", subjects: [], class: null, account: "existing" },
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ImportPeopleModal (teachers)", () => {
  it("downloads the teacher template as .xlsx and .csv", async () => {
    const blob = new Blob(["x"]);
    http.get.mockResolvedValue(blob);
    render(<ImportPeopleModal kind="teacher" onClose={() => {}} />);

    expect(screen.getByRole("heading", { name: "Import teachers" })).toBeTruthy();
    expect(screen.getByText("class_teacher_of")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /\.xlsx/ }));
    await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledWith(blob, "teachers-template.xlsx"));
    expect(http.get).toHaveBeenLastCalledWith("/api/admin/school/teachers/import-template/", {
      auth: true,
      params: { file_format: "xlsx" },
      responseType: "blob",
    });

    fireEvent.click(screen.getByRole("button", { name: /\.csv/ }));
    await vi.waitFor(() => expect(saveBlob).toHaveBeenCalledWith(blob, "teachers-template.csv"));
    expect(http.get.mock.calls.at(-1)[1].params).toEqual({ file_format: "csv" });
  });

  it("previews the teachers (dry run) then imports them", async () => {
    http.post
      .mockResolvedValueOnce({ success: true, data: PREVIEW })
      .mockResolvedValueOnce({ success: true, data: { ...PREVIEW, created: 2, dry_run: false } });
    const onImported = vi.fn();
    render(<ImportPeopleModal kind="teacher" onClose={() => {}} onImported={onImported} />);

    fireEvent.change(screen.getByLabelText("Teacher sheet"), { target: { files: [sheet()] } });
    fireEvent.click(screen.getByRole("checkbox", { name: /Email new teachers/ }));
    fireEvent.click(screen.getByRole("button", { name: /Check file/ }));

    expect(await screen.findByText("Ready to add 2 teacher(s):")).toBeTruthy();
    expect(http.post.mock.calls[0][0]).toBe("/api/admin/school/teachers/import/");
    const form = http.post.mock.calls[0][1];
    expect(form.get("dry_run")).toBe("true");
    expect(form.get("send_email")).toBe("false");
    expect(form.get("file").name).toBe("staff.csv");

    const table = screen.getByRole("table");
    const headers = within(table).getAllByRole("columnheader").map((th) => th.textContent);
    expect(headers).toEqual(["Line", "Name", "Email", "Subjects", "Class", "Account"]);
    const [, first, second] = within(table).getAllByRole("row");
    expect(within(first).getByText("Ada Obi")).toBeTruthy();
    expect(within(first).getByText("Mathematics@JSS1A, Physics@SS2B")).toBeTruthy();
    expect(within(first).getByText("SS2B")).toBeTruthy();
    expect(within(second).getAllByText("—")).toHaveLength(2);
    expect(within(second).getByText("Already on iLearnova")).toBeTruthy();
    expect(onImported).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Add 2 teacher/ }));
    expect(await screen.findByText(/Added 2 teacher\(s\)/)).toBeTruthy();
    expect(http.post.mock.calls[1][0]).toBe("/api/admin/school/teachers/import/");
    expect(http.post.mock.calls[1][1].get("dry_run")).toBe("false");
    expect(onImported).toHaveBeenCalledWith(expect.objectContaining({ created: 2 }));
  });

  it("shows errors by sheet line and adds nobody", async () => {
    const error = new Error("Validation failed");
    error.data = {
      message: "Validation failed",
      field_errors: {
        rows: [
          {
            1: ['no subject "Biology" in class "JSS1A" in this school'],
            3: ["email is missing or invalid", 'no class named "JSS9" in this school'],
          },
        ],
      },
    };
    http.post.mockRejectedValue(error);
    render(<ImportPeopleModal kind="teacher" onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Teacher sheet"), { target: { files: [sheet()] } });
    fireEvent.click(screen.getByRole("button", { name: /Check file/ }));

    expect(await screen.findByText(/Nothing was added/)).toBeTruthy();
    expect(screen.getByText('Line 2: no subject "Biology" in class "JSS1A" in this school')).toBeTruthy();
    expect(
      screen.getByText('Line 4: email is missing or invalid; no class named "JSS9" in this school')
    ).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
    expect(http.post).toHaveBeenCalledTimes(1);
  });
});

describe("Teachers page import button", () => {
  it("opens the teacher import from the Teachers directory", async () => {
    http.get.mockResolvedValue({
      success: true,
      data: {
        teachers: [],
        pagination: { page: 1, pages: 1, total: 0, has_next: false, has_prev: false },
        counts: { all: 0, active: 0, pending: 0, suspended: 0 },
      },
    });
    render(
      <MemoryRouter initialEntries={["/organization-dashboard/teachers"]}>
        <PeopleDirectory kind="teacher" />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: "Import" }));
    expect(screen.getByRole("heading", { name: "Import teachers" })).toBeTruthy();
    expect(screen.getByLabelText("Teacher sheet")).toBeTruthy();
  });
});
