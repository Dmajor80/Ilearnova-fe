import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Outlet } from "react-router-dom";

const overview = { metrics: {}, activities: [], loading: false, error: null, refreshData: vi.fn() };
const calendar = { events: [], loading: false, error: null, refreshData: vi.fn() };

vi.mock("@/hooks/organization", () => ({
  useOrganizationOverview: () => overview,
  useOrganizationCalendar: () => calendar,
}));

import OrganizationOverview from "../OrganizationOverview";

const alertsApi = { notifications: [], loading: false, error: null, refreshData: vi.fn() };

function renderOverview() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<Outlet context={{ alertsApi }} />}>
          <Route index element={<OrganizationOverview />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("OrganizationOverview load errors", () => {
  afterEach(cleanup);

  beforeEach(() => {
    overview.error = { message: "Network Error" };
    vi.clearAllMocks();
  });

  // School admins saw: "Some dashboard data could not be loaded. Refresh to
  // retry, or check the affected API request in the browser network panel."
  it("speaks to the school admin, not a developer", () => {
    renderOverview();
    const alert = screen.getByRole("alert");
    expect(alert.textContent).not.toMatch(/network panel|API request/i);
    expect(alert.textContent).toMatch(/couldn't load|could not load/i);
  });

  it("offers a retry that reloads the overview", () => {
    renderOverview();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(overview.refreshData).toHaveBeenCalled();
    expect(calendar.refreshData).toHaveBeenCalled();
    expect(alertsApi.refreshData).toHaveBeenCalled();
  });
});
