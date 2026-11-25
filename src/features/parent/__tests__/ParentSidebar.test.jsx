import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ParentSidebar from "../components/ParentSidebar";

afterEach(cleanup);

function Where() {
  const location = useLocation();
  return <p data-testid="where">{`${location.pathname} ${location.state?.activeTab || ""}`}</p>;
}

const show = (activeTab, setActiveTab = vi.fn()) =>
  render(
    <MemoryRouter initialEntries={["/parent-attendance"]}>
      <ParentSidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={false} setIsMobileMenuOpen={vi.fn()} />
      <Routes>
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );

describe("ParentSidebar", () => {
  it("has six links, with timetable beside attendance and announcements beside messages", () => {
    show("dashboard");
    const nav = screen.getByRole("navigation", { name: "Parent dashboard" });
    expect(within(nav).getAllByRole("button").map((b) => b.title)).toEqual([
      "Dashboard",
      "My Children",
      "Attendance & timetable",
      "Results",
      "Messages",
      "Fees & Payments",
    ]);
    expect(screen.queryByTitle("Reports")).toBeNull();
  });

  it("marks the group of the open tab and opens a group's first tab on the dashboard", () => {
    const setActiveTab = vi.fn();
    show("timetable", setActiveTab);
    expect(screen.getByTitle("Attendance & timetable").getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByTitle("Messages"));
    expect(setActiveTab).toHaveBeenCalledWith("messages");
    expect(screen.getByTestId("where").textContent).toBe("/parent-dashboard messages");
  });
});
