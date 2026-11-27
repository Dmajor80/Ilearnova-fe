import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/lib/apiHelpers", async (importOriginal) => ({
  ...(await importOriginal()),
  saveBlob: vi.fn(),
}));

import { http } from "@/api/baseClient";
import { saveBlob } from "@/lib/apiHelpers";
import StudentMaterials from "../StudentMaterials";

/* Ada takes French (no class) and is in JSS1A: she sees French's verb tables,
   Maths notes and JSS1A's class-wide notice, each under its own heading. */
const MATERIALS = [
  { id: "m1", title: "Verb tables", content_type: "file", subject_id: "fr", subject_name: "French", class_id: null, class_name: null, download_url: "http://api/api/student/materials/m1/download/", file: "http://api/media/verbs.pdf" },
  { id: "m2", title: "Fractions", content_type: "file", subject_id: "ma", subject_name: "Mathematics", class_id: "c1", class_name: "JSS1A", download_url: "http://api/api/student/materials/m2/download/", file: "http://api/media/fractions.pdf" },
  { id: "m3", title: "Term notice", content_type: "text", subject_id: null, subject_name: null, class_id: "c1", class_name: "JSS1A", download_url: null, file: null },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Student materials", () => {
  it("groups materials by subject, classless subjects labelled", async () => {
    http.get.mockResolvedValue({ success: true, data: { materials: MATERIALS } });
    render(<StudentMaterials />);
    const french = await screen.findByRole("region", { name: "French (no class)" });
    expect(within(french).getByText("Verb tables")).toBeTruthy();
    const maths = screen.getByRole("region", { name: "Mathematics — JSS1A" });
    expect(within(maths).getByText("Fractions")).toBeTruthy();
    const whole = screen.getByRole("region", { name: "JSS1A (whole class)" });
    expect(within(whole).getByText("Term notice")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/student/materials/", { auth: true, params: {} });
  });

  it("downloads through the API with the student's sign-in", async () => {
    http.get.mockImplementation((url) =>
      url === "/api/student/materials/"
        ? Promise.resolve({ success: true, data: { materials: MATERIALS } })
        : Promise.resolve(new Blob(["%PDF"]))
    );
    render(<StudentMaterials />);
    const french = await screen.findByRole("region", { name: "French (no class)" });
    fireEvent.click(within(french).getByRole("button", { name: "Download Verb tables" }));
    await waitFor(() => expect(saveBlob).toHaveBeenCalled());
    expect(http.get).toHaveBeenCalledWith("/api/student/materials/m1/download/", { auth: true, responseType: "blob" });
  });

  it("says so when there are no materials", async () => {
    http.get.mockResolvedValue({ success: true, data: { materials: [] } });
    render(<StudentMaterials />);
    expect(await screen.findByText("No course materials yet")).toBeTruthy();
  });
});
