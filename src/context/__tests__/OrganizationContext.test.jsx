import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { OrganizationProvider, useOrganization } from "../OrganizationContext";
import { clearAuth, persistAuthResponse } from "@/api/auth";

function Who() {
  const { user, loading } = useOrganization();
  return <p data-testid="who">{loading ? "loading" : user?.username || "nobody"}</p>;
}

const loginAs = (username) =>
  persistAuthResponse({ access: "a.b.c", refresh: "d.e.f", user: { id: username, username } }, window.localStorage);

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});
afterEach(cleanup);

// The account was read once when the app started: logging in without a
// reload left the profile on "No user data", and logging out then in as
// someone else in the same tab kept showing the previous person.
describe("OrganizationProvider follows log in and log out", () => {
  it("picks up the account after logging in", () => {
    render(<OrganizationProvider><Who /></OrganizationProvider>);
    expect(screen.getByTestId("who").textContent).toBe("nobody");
    act(() => loginAs("ada.obi"));
    expect(screen.getByTestId("who").textContent).toBe("ada.obi");
  });

  it("forgets the account on log out and shows the next person", () => {
    loginAs("ada.obi");
    render(<OrganizationProvider><Who /></OrganizationProvider>);
    expect(screen.getByTestId("who").textContent).toBe("ada.obi");
    act(() => clearAuth());
    expect(screen.getByTestId("who").textContent).toBe("nobody");
    act(() => loginAs("bayo"));
    expect(screen.getByTestId("who").textContent).toBe("bayo");
  });
});
