import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const api = {
  pendingStaff: [
    { id: "s1", user: { name: "Ada Obi", email: "ada@x.ng" }, assigned_at: "2026-11-20T09:00:00Z" },
    { id: "s2", user: { name: "Bayo Ade", email: "bayo@x.ng" }, assigned_at: "2026-11-20T09:05:00Z" },
  ],
  totalPendingStaff: 2,
  totalPages: 1,
  loading: false,
  mutating: false,
  error: null,
  refreshData: vi.fn(),
  verifyPendingStaff: vi.fn().mockResolvedValue({}),
  rejectPendingStaff: vi.fn().mockResolvedValue({}),
  bulkVerifyPendingStaff: vi.fn().mockResolvedValue({ verified: 2, not_found: [] }),
  setCurrentPage: vi.fn(),
};

vi.mock("react-router-dom", () => ({ useOutletContext: () => ({ pendingStudentsApi: api }) }));

import OrganizationPendingStudents from "../OrganizationPendingStudents";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("OrganizationPendingStudents", () => {
  it("verifies every selected student in one request", async () => {
    render(<OrganizationPendingStudents />);
    const verifySelected = screen.getByRole("button", { name: /Verify selected \(0\)/ });
    expect(verifySelected.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText("Select all on this page"));
    fireEvent.click(screen.getByRole("button", { name: /Verify selected \(2\)/ }));
    expect(api.bulkVerifyPendingStaff).toHaveBeenCalledWith(["s1", "s2"]);
  });

  it("verifies or rejects one student", async () => {
    render(<OrganizationPendingStudents />);
    fireEvent.click(screen.getAllByRole("button", { name: /^Verify$/ })[0]);
    expect(api.verifyPendingStaff).toHaveBeenCalledWith("s1");

    fireEvent.click(screen.getAllByRole("button", { name: /^Reject$/ })[1]);
    expect(screen.getByRole("dialog").textContent).toContain("Reject Bayo Ade?");
    fireEvent.click(screen.getAllByRole("button", { name: "Reject" }).at(-1));
    expect(api.rejectPendingStaff).toHaveBeenCalledWith("s2");
  });
});
