import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

// Each page is a stub; this test is about navigation.
vi.mock("../TeacherDashboardOverview", () => ({ default: () => <p>Overview page</p> }));
vi.mock("../ClassManagement", () => ({ default: () => <p>Class management page</p> }));
vi.mock("../Attendance", () => ({ default: () => <p>Attendance page</p> }));
vi.mock("../Timetable", () => ({ default: () => <p>Timetable page</p> }));
vi.mock("../Assignments", () => ({ default: () => <p>Assignments page</p> }));
vi.mock("../Resources", () => ({ default: () => <p>Resources page</p> }));
vi.mock("../Examinations", () => ({ default: () => <p>Examinations page</p> }));
vi.mock("../../cbt/TeacherCbt", () => ({ default: () => <p>CBT page</p> }));
vi.mock("@/features/results/TeacherResults", () => ({ default: () => <p>Results page</p> }));
vi.mock("../TeacherAnalytics", () => ({ default: () => <p>Analytics page</p> }));
vi.mock("../Messages", () => ({ default: () => <p>Announcements page</p> }));
vi.mock("@/features/communication/DirectMessages", () => ({ default: () => <p>Direct messages page</p> }));
vi.mock("@/api/authApi", () => ({ logout: vi.fn() }));
vi.mock("@/api/auth", () => ({ clearAuth: vi.fn() }));

import TeacherDashboard from "../TeacherDashboard";

afterEach(cleanup);

const show = () =>
  render(
    <MemoryRouter>
      <TeacherDashboard />
    </MemoryRouter>
  );

describe("TeacherDashboard navigation", () => {
  it("has six sidebar links", () => {
    show();
    const sidebar = screen.getByRole("navigation", { name: "Teacher dashboard" });
    expect(within(sidebar).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Dashboard",
      "Classes",
      "Assignments",
      "Exams",
      "Results",
      "Messages",
    ]);
  });

  it("shows CBT exams as a tab of Exams", () => {
    show();
    const sidebar = screen.getByRole("navigation", { name: "Teacher dashboard" });
    fireEvent.click(within(sidebar).getByRole("button", { name: "Exams" }));
    expect(screen.getByText("Examinations page")).toBeTruthy();
    fireEvent.click(within(screen.getByRole("navigation", { name: "Exams" })).getByRole("button", { name: "CBT exams" }));
    expect(screen.getByText("CBT page")).toBeTruthy();
    expect(within(sidebar).getByRole("button", { name: "Exams" }).getAttribute("aria-current")).toBe("page");
  });
});
