import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/context/OrganizationContext", () => ({
  useOrganization: () => ({ user: null })
}));

vi.mock("@/api/authApi", () => ({
  logout: vi.fn()
}));

import StudentDashboard from "./StudentDashboard";

afterEach(() => {
  vi.clearAllMocks();
});

const show = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route path="*" element={<p>Some page</p>} />
          <Route path="overview" element={<p>Overview page</p>} />
          <Route path="assignment" element={<p>Assignments page</p>} />
          <Route path="result" element={<p>Report cards page</p>} />
          <Route path="transcript" element={<p>Online exam scores page</p>} />
          <Route path="cbt" element={<p>CBT page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("StudentDashboard navigation", () => {
  afterEach(cleanup);

  it("keeps the sidebar short: related pages share a link", () => {
    show("/student-dashboard/overview");
    const links = screen.getAllByRole("link").map((a) => a.title);
    expect(links).toEqual([
      "Overview",
      "Courses",
      "Classwork",
      "Exams",
      "Results",
      "Fees",
      "Messages",
      "Forums",
      "Video Calls",
    ]);
    // ID card moved to the profile; transcript and CBT are tabs.
    expect(screen.queryByRole("link", { name: /ID Card|Transcript|CBT/ })).toBeNull();
  });

  it("opens the group's first page and shows the rest as tabs", () => {
    show("/student-dashboard/overview");
    fireEvent.click(screen.getByRole("link", { name: "Classwork" }));
    expect(screen.getByText("Assignments page")).toBeTruthy();
    const tabs = screen.getByRole("navigation", { name: "Classwork" });
    expect(within(tabs).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Assignments",
      "Timetable",
      "Attendance",
    ]);
  });

  it("puts report cards and online exam scores under Results", () => {
    show("/student-dashboard/result");
    expect(screen.getByRole("link", { name: "Results" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Online exam scores" }));
    expect(screen.getByText("Online exam scores page")).toBeTruthy();
  });

  it("puts CBT exams under Exams", () => {
    show("/student-dashboard/cbt");
    expect(screen.getByRole("link", { name: "Exams" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "CBT exams" }).getAttribute("aria-current")).toBe("page");
  });

  it("opens the sidebar from the menu button on phones", () => {
    show("/student-dashboard/overview");
    const sidebar = screen.getByRole("link", { name: "Overview" }).closest("div.fixed");
    expect(sidebar.className).toContain("-translate-x-full");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(sidebar.className).toContain("translate-x-0");
    expect(sidebar.className).not.toContain("-translate-x-full");
  });
});
