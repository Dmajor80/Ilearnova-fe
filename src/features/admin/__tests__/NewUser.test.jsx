import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ORG, paginated, routeGets } from "./testUtils";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import NewUser from "../NewUser";

const renderPage = (url = "/admin-dashboard/users/new-user") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/admin-dashboard/users/new-user" element={<NewUser />} />
        <Route path="/admin-dashboard/users" element={<p>Users list</p>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => routeGets(http, { "/api/superadmin/organizations/": paginated([ORG]) }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe("Add user (superadmin)", () => {
  it("is not a fake prefilled form", async () => {
    renderPage();
    await screen.findByRole("option", { name: "Greenfield Academy" });
    expect(document.body.textContent).not.toMatch(/Prisicilla/);
    expect(screen.getByLabelText(/First name/).value).toBe("");
  });

  it("validates before sending", async () => {
    renderPage();
    await screen.findByRole("option", { name: "Greenfield Academy" });
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    expect(await screen.findByText("Enter a first name.")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
    expect(screen.getByText("Choose a school.")).toBeTruthy();
    expect(http.post).not.toHaveBeenCalled();
  });

  it("creates the user and returns to Users", async () => {
    http.post.mockResolvedValue({ id: "u-9" });
    renderPage();
    await screen.findByRole("option", { name: "Greenfield Academy" });
    fill(/First name/, "Bola");
    fill(/Last name/, "Ade");
    fill(/Email/, "bola@greenfield.example.com");
    fill(/School/, "org-1");
    fill(/Role/, "teacher");
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(
        "/api/superadmin/users/",
        {
          first_name: "Bola",
          last_name: "Ade",
          email: "bola@greenfield.example.com",
          organization_id: "org-1",
          role: "teacher",
        },
        { auth: true }
      )
    );
    expect(await screen.findByText("Users list")).toBeTruthy();
  });

  it("shows server field errors inline", async () => {
    const error = new Error("Bad Request");
    error.status = 400;
    error.data = { email: ["A user with that email already exists."] };
    http.post.mockRejectedValue(error);
    renderPage("/admin-dashboard/users/new-user?organization_id=org-1");
    await screen.findByRole("option", { name: "Greenfield Academy" });
    expect(screen.getByLabelText(/School/).value).toBe("org-1");
    fill(/First name/, "Bola");
    fill(/Last name/, "Ade");
    fill(/Email/, "taken@greenfield.example.com");
    fireEvent.click(screen.getByRole("button", { name: "Create user" }));
    expect(await screen.findByText("A user with that email already exists.")).toBeTruthy();
    expect(screen.getByLabelText(/Email/).getAttribute("aria-invalid")).toBe("true");
  });
});
