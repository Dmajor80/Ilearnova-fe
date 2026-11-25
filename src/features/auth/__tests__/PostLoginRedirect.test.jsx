import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({ http: { get: vi.fn() } }));
vi.mock("../../../api/baseClient", () => ({ http: { get: vi.fn() } }));
vi.mock("../../../api/auth", () => ({ getTokens: () => ({ store: window.localStorage }) }));

import PostLoginRedirect from "../PostLoginRedirect";

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

const signInAs = (user) => {
  window.localStorage.setItem("user_data", JSON.stringify(user));
  render(
    <MemoryRouter initialEntries={["/post-login"]}>
      <Routes>
        <Route path="/post-login" element={<PostLoginRedirect />} />
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => vi.spyOn(console, "log").mockImplementation(() => {}));
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("PostLoginRedirect", () => {
  it("sends the platform owner (a superuser with no school role) to the admin dashboard", async () => {
    // Found clicking through: "root" landed on /home.
    signInAs({ username: "root", is_superuser: true, roles: [] });
    expect((await screen.findByTestId("where")).textContent).toBe("/admin-dashboard/dashboard");
  });

  it("still sends a school admin to their school", async () => {
    signInAs({ username: "head", is_superuser: false, roles: [{ role: { code: "org_admin" } }] });
    expect((await screen.findByTestId("where")).textContent).toBe("/organization-dashboard");
  });
});
