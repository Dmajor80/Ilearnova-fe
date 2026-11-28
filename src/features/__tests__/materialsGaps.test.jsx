/**
 * Gaps left after per-subject course documents:
 * 1. Course progress ignored subjects taken outside the student's class: Ada
 *    (JSS1) takes French (no class) and is an extra in JSS2 Science, and
 *    neither showed under My courses or on the Overview.
 * 2. School admins had no page to upload or delete course documents.
 * 3. Parents had no page for their child's documents.
 */
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/lib/apiHelpers", async (importOriginal) => ({ ...(await importOriginal()), saveBlob: vi.fn() }));

import { http } from "@/api/baseClient";
import { saveBlob } from "@/lib/apiHelpers";
import { CoursesComponent } from "@/features/student/CoursesComponent";
import ParentMaterials from "@/features/parent/Pages/ParentMaterials";
import OrganizationMaterials from "@/features/organization/pages/OrganizationMaterials";
import { PARENT_GROUPS } from "@/features/parent/parentNav";
import { ADMIN_GROUPS } from "@/features/organization/adminNav";

const ok = (data) => Promise.resolve({ success: true, data });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

describe("course progress counts subjects outside the class", () => {
  it("shows French and JSS2 Science as courses with their progress", async () => {
    http.get.mockImplementation((path) => {
      if (path === "/api/student/courses/") return ok([{ id: "jss1", name: "JSS1", teacher_name: "Mr Bello", subject_count: 3 }]);
      if (path === "/api/student/courses/progress/")
        return ok([
          { course_id: "jss1", course_name: "JSS1", kind: "class", class_name: null, total_lessons: 2, completed_lessons: 0, completion_percentage: 0 },
          { course_id: "fr", course_name: "French", kind: "subject", class_name: null, total_lessons: 2, completed_lessons: 1, completion_percentage: 50 },
          { course_id: "sci", course_name: "Science", kind: "subject", class_name: "JSS2", total_lessons: 1, completed_lessons: 0, completion_percentage: 0 },
        ]);
      throw new Error(`unexpected ${path}`);
    });
    render(
      <MemoryRouter initialEntries={["/student-dashboard/courses"]}>
        <Routes>
          <Route path="/student-dashboard/courses" element={<CoursesComponent />} />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    );
    const french = (await screen.findByText("French (no class)")).closest("article");
    expect(within(french).getByText("1 of 2 lessons done")).toBeTruthy();
    expect(screen.getByText("Science — JSS2").closest("article")).toBeTruthy();
    expect(screen.getByText("JSS1").closest("article")).toBeTruthy();

    fireEvent.click(within(french).getByRole("button", { name: /open documents/i }));
    expect(screen.getByTestId("where").textContent).toBe("/student-dashboard/materials");
  });
});

describe("parent course materials", () => {
  const CHILDREN = [
    { id: "c1", first_name: "Ada", last_name: "Eze" },
    { id: "c2", first_name: "Bayo", last_name: "Eze" },
  ];
  const doc = (id, subject) => ({
    id,
    title: `${subject} notes`,
    subject_id: subject,
    subject_name: subject,
    class_name: null,
    file: `http://x/media/${id}.pdf`,
    download_url: `http://x/api/parent/children/c1/materials/${id}/download/`,
    uploaded_by_name: "Mrs Okafor",
  });

  it("is in the parent's sidebar", () => {
    expect(PARENT_GROUPS.some((g) => g.tabs.some((t) => t.id === "materials"))).toBe(true);
  });

  it("lists the chosen child's documents and downloads through the parent endpoint", async () => {
    const blob = new Blob(["%PDF"]);
    http.get.mockImplementation((url) => {
      if (url === "/api/parent/children/") return Promise.resolve(CHILDREN);
      if (url === "/api/parent/children/c1/materials/") return Promise.resolve({ materials: [doc("m1", "French")] });
      if (url === "/api/parent/children/c2/materials/") return Promise.resolve({ materials: [] });
      if (url.endsWith("/download/")) return Promise.resolve(blob);
      throw new Error(`unexpected ${url}`);
    });
    render(<ParentMaterials />);
    const section = await screen.findByRole("region", { name: "French (no class)" });
    fireEvent.click(within(section).getByRole("button", { name: "Download French notes" }));
    await waitFor(() => expect(saveBlob).toHaveBeenCalledWith(blob, "m1.pdf"));
    expect(http.get).toHaveBeenCalledWith(
      "/api/parent/children/c1/materials/m1/download/",
      expect.objectContaining({ responseType: "blob" })
    );

    fireEvent.change(screen.getByLabelText("Child"), { target: { value: "c2" } });
    expect(await screen.findByText("No course materials yet")).toBeTruthy();
  });

  it("asks to link a child when there are none", async () => {
    http.get.mockResolvedValue([]);
    render(<ParentMaterials />);
    expect(await screen.findByText(/Link your child/)).toBeTruthy();
  });
});

describe("school admin course materials", () => {
  const SUBJECTS = [
    { id: "fr", name: "French", classname: null, class_name: null },
    { id: "ma", name: "Maths", classname: "jss1", class_name: "JSS1" },
  ];
  const ROWS = [
    { id: "m1", title: "Verb tables", subject: "fr", subject_name: "French", class_obj: null, class_name: null, is_published: true, file: "http://x/verbs.pdf", uploaded_by: { first_name: "Ngozi", last_name: "Okafor" } },
  ];

  const serve = (materials = ROWS, pagination = { page: 1, total: materials.length, has_next: false }) =>
    http.get.mockImplementation((url) => {
      if (url === "/api/admin/school/materials/") return ok({ materials, pagination });
      if (url === "/api/admin/school/subjects/") return ok({ subjects: SUBJECTS });
      if (url === "/api/admin/school/classes/") return ok({ classes: [{ id: "jss1", name: "JSS1" }] });
      throw new Error(`unexpected ${url}`);
    });

  it("is in the admin sidebar", () => {
    expect(ADMIN_GROUPS.some((g) => g.tabs.some((t) => t.id === "materials"))).toBe(true);
  });

  it("lists the school's documents and filters on the server", async () => {
    serve();
    render(<OrganizationMaterials />);
    const row = (await screen.findByText("Verb tables")).closest("li");
    expect(within(row).getByText("French (no class)")).toBeTruthy();
    expect(screen.getByText("Uploaded by Ngozi Okafor")).toBeTruthy();

    await screen.findByRole("option", { name: "Maths — JSS1" });
    fireEvent.change(screen.getByLabelText("Subject or class"), { target: { value: "subject:ma" } });
    await waitFor(() =>
      expect(http.get).toHaveBeenCalledWith(
        "/api/admin/school/materials/",
        expect.objectContaining({ params: expect.objectContaining({ subject_id: "ma" }) })
      )
    );
  });

  it("uploads a document to a subject", async () => {
    serve([]);
    http.post.mockResolvedValue({ success: true, data: { id: "m2" } });
    render(<OrganizationMaterials />);
    await screen.findByText("No course materials yet.");
    fireEvent.click(screen.getByRole("button", { name: /upload document/i }));
    const form = screen.getByRole("form", { name: "Upload document" });
    await within(form).findByRole("option", { name: "French (no class)" });
    fireEvent.change(within(form).getByLabelText("Add to"), { target: { value: "subject:fr" } });
    fireEvent.change(within(form).getByLabelText("Title"), { target: { value: "Week 3" } });
    const file = new File(["%PDF"], "week3.pdf", { type: "application/pdf" });
    fireEvent.change(within(form).getByLabelText("Document"), { target: { files: [file] } });
    fireEvent.submit(form);

    await waitFor(() => expect(http.post).toHaveBeenCalled());
    const [path, data] = http.post.mock.calls[0];
    expect(path).toBe("/api/admin/school/materials/");
    expect(data.get("subject")).toBe("fr");
    expect(data.get("class_obj")).toBeNull();
    expect(data.get("title")).toBe("Week 3");
    expect(data.get("content_type")).toBe("file");
    expect(data.get("file").name).toBe("week3.pdf");
    await waitFor(() => expect(screen.queryByRole("form", { name: "Upload document" })).toBeNull());
  });

  it("refuses a picture before uploading", async () => {
    serve([]);
    render(<OrganizationMaterials />);
    await screen.findByText("No course materials yet.");
    fireEvent.click(screen.getByRole("button", { name: /upload document/i }));
    const form = screen.getByRole("form", { name: "Upload document" });
    await within(form).findByRole("option", { name: "French (no class)" });
    fireEvent.change(within(form).getByLabelText("Add to"), { target: { value: "subject:fr" } });
    fireEvent.change(within(form).getByLabelText("Title"), { target: { value: "Photo" } });
    fireEvent.change(within(form).getByLabelText("Document"), {
      target: { files: [new File(["x"], "photo.png", { type: "image/png" })] },
    });
    fireEvent.submit(form);
    expect((await within(form).findByRole("alert")).textContent).toMatch(/only documents/i);
    expect(http.post).not.toHaveBeenCalled();
  });

  it("shows the server's reason when an upload is refused", async () => {
    serve([]);
    http.post.mockRejectedValue({ data: { file: ["This file's contents do not look like a .pdf document."] } });
    render(<OrganizationMaterials />);
    await screen.findByText("No course materials yet.");
    fireEvent.click(screen.getByRole("button", { name: /upload document/i }));
    const form = screen.getByRole("form", { name: "Upload document" });
    await within(form).findByRole("option", { name: "French (no class)" });
    fireEvent.change(within(form).getByLabelText("Add to"), { target: { value: "subject:fr" } });
    fireEvent.change(within(form).getByLabelText("Title"), { target: { value: "Fake" } });
    fireEvent.change(within(form).getByLabelText("Document"), {
      target: { files: [new File(["MZ"], "fake.pdf", { type: "application/pdf" })] },
    });
    fireEvent.submit(form);
    expect((await within(form).findByRole("alert")).textContent).toMatch(/do not look like a \.pdf/);
  });

  it("deletes a document after confirming", async () => {
    serve();
    http.del.mockResolvedValue({ success: true });
    render(<OrganizationMaterials />);
    fireEvent.click(await screen.findByRole("button", { name: "Delete Verb tables" }));
    const dialog = await screen.findByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete document" }));
    await waitFor(() => expect(http.del).toHaveBeenCalledWith("/api/admin/school/materials/m1/", { auth: true }));
  });

  it("loads more than one page", async () => {
    http.get.mockImplementation((url, opts) => {
      if (url === "/api/admin/school/materials/") {
        return opts.params.page === 1
          ? ok({ materials: ROWS, pagination: { page: 1, total: 2, has_next: true } })
          : ok({ materials: [{ ...ROWS[0], id: "m9", title: "Nouns" }], pagination: { page: 2, total: 2, has_next: false } });
      }
      return ok({ subjects: [], classes: [] });
    });
    render(<OrganizationMaterials />);
    fireEvent.click(await screen.findByRole("button", { name: /load more \(1 of 2\)/i }));
    expect(await screen.findByText("Nouns")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();
  });
});
