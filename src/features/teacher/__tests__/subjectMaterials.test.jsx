import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* Mrs Okafor shares "Verb tables.pdf" with French, a subject without a class.
   She picks French from her subjects, can only choose documents, and sees the
   server's reason when a file is refused. */

const FRENCH = { id: "fr", name: "French", class_id: null, class_name: null };
const MATHS = { id: "ma", name: "Mathematics", class_id: "c1", class_name: "JSS1A" };

const subjectsApi = { subjects: [MATHS, FRENCH], loading: false, error: null, refreshData: vi.fn() };
const classesApi = {
  classes: [{ id: "c1", name: "JSS1A", organization: "org1" }],
  materials: [],
  loading: false,
  mutating: false,
  error: null,
  refreshData: vi.fn(),
  fetchMaterials: vi.fn(() => Promise.resolve([])),
  addMaterial: vi.fn(() => Promise.resolve({})),
  fetchSubjectMaterials: vi.fn(() => Promise.resolve([])),
  addSubjectMaterial: vi.fn(() => Promise.resolve({})),
};

vi.mock("@/hooks/teacher", () => ({
  useTeacherSubjects: () => subjectsApi,
  useTeacherClasses: () => classesApi,
}));
vi.mock("../components/CourseComponents", () => ({ default: () => null }));

import Resources from "../Resources";

const pdf = () => new File(["%PDF-1.4"], "Verb tables.pdf", { type: "application/pdf" });

const openForm = async () => {
  render(<Resources />);
  fireEvent.click(screen.getByRole("button", { name: /Add material/ }));
  fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Verb tables" } });
  fireEvent.change(screen.getByLabelText("Material type"), { target: { value: "file" } });
};

beforeEach(() => {
  classesApi.materials = [];
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Teacher course materials per subject", () => {
  it("lets the teacher pick one of their subjects, classless ones labelled", () => {
    render(<Resources />);
    const picker = screen.getByLabelText("Subject or class");
    const labels = [...picker.querySelectorAll("option")].map((o) => o.textContent);
    expect(labels).toContain("French (no class)");
    expect(labels).toContain("Mathematics — JSS1A");
    expect(labels).toContain("JSS1A (whole class)");
  });

  it("loads the chosen subject's materials", async () => {
    render(<Resources />);
    fireEvent.change(screen.getByLabelText("Subject or class"), { target: { value: "subject:fr" } });
    await waitFor(() => expect(classesApi.fetchSubjectMaterials).toHaveBeenCalledWith("fr"));
  });

  it("restricts the file picker to documents", async () => {
    await openForm();
    const accept = screen.getByLabelText("Document").getAttribute("accept");
    for (const ext of [".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".odt", ".csv"]) {
      expect(accept).toContain(ext);
    }
    expect(accept).not.toMatch(/image|\.png|\.exe/);
    expect(screen.getByText(/up to 20 MB/)).toBeTruthy();
  });

  it("uploads a PDF to a subject without a class", async () => {
    await openForm();
    fireEvent.change(screen.getByLabelText("Add to"), { target: { value: "subject:fr" } });
    fireEvent.change(screen.getByLabelText("Document"), { target: { files: [pdf()] } });
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));
    await waitFor(() => expect(classesApi.addSubjectMaterial).toHaveBeenCalled());
    const [subjectId, body] = classesApi.addSubjectMaterial.mock.calls[0];
    expect(subjectId).toBe("fr");
    expect(body.get("subject")).toBe("fr");
    expect(body.get("file").name).toBe("Verb tables.pdf");
    expect(body.has("class_obj")).toBe(false);
  });

  it("refuses a non-document before uploading", async () => {
    await openForm();
    const png = new File(["x"], "diagram.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Document"), { target: { files: [png] } });
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      expect.stringMatching(/Only documents/)
    );
    expect(classesApi.addSubjectMaterial).not.toHaveBeenCalled();
    expect(classesApi.addMaterial).not.toHaveBeenCalled();
  });

  it("shows the server's message when the upload is refused", async () => {
    const refused = Object.assign(new Error("Something went wrong. Please try again."), {
      context: { originalError: { status: 400, data: { file: ["This file's contents do not look like a .pdf document."] } } },
    });
    classesApi.addSubjectMaterial.mockRejectedValueOnce(refused);
    await openForm();
    fireEvent.change(screen.getByLabelText("Document"), { target: { files: [pdf()] } });
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));
    expect(await screen.findByText("This file's contents do not look like a .pdf document.")).toBeTruthy();
  });

  it("shows which subject each material belongs to", () => {
    classesApi.materials = [
      { id: "m1", title: "Verb tables", content_type: "file", subject_name: "French", class_name: null, is_published: true },
    ];
    render(<Resources />);
    expect(screen.getByText("French (no class)", { selector: "p" })).toBeTruthy();
  });
});
