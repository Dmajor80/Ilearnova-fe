import { fireEvent, render, screen } from "@testing-library/react";
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

describe("StudentDashboard navigation", () => {
  it("shows the hook-backed assignments page in the sidebar", () => {
    render(
      <MemoryRouter initialEntries={["/student-dashboard/overview"]}>
        <Routes>
          <Route path="/student-dashboard" element={<StudentDashboard />}>
            <Route path="overview" element={<p>Overview page</p>} />
            <Route path="assignment" element={<p>Assignments page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("link", { name: "Assignments" }));

    expect(screen.getByText("Assignments page")).toBeTruthy();
  });
});
