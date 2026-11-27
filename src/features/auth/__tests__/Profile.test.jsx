import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const ctx = { user: null, loading: true, refreshUser: vi.fn() };
vi.mock("@/context/OrganizationContext", () => ({ useOrganization: () => ctx }));
vi.mock("@/api/baseClient", () => ({ http: { put: vi.fn() } }));
vi.mock("@/features/student/StudentIdCard", () => ({ default: () => null }));

import Profile from "../Profile";

afterEach(() => {
  cleanup();
  ctx.user = null;
  ctx.loading = true;
});

const ADMIN = {
  id: "u-1",
  username: "ada.obi",
  email: "ada@greenfield.example.com",
  first_name: "Ada",
  last_name: "Obi",
  date_joined: "2026-11-20T10:00:00Z",
  primary_role: { organization: { name: "Greenfield Academy" }, role: { code: "org_admin", name: "Organization Admin" } },
};

describe("Profile", () => {
  // Opening Settings showed "No user data / Unable to load profile
  // information" until the account finished loading.
  it("shows a skeleton, not 'No user data', while the account loads", () => {
    render(<Profile embedded />);
    expect(screen.queryByText(/no user data/i)).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it("still says so when loading finished without an account", () => {
    ctx.loading = false;
    render(<Profile embedded />);
    expect(screen.getByText(/no user data/i)).toBeTruthy();
  });

  // The header read "Role: User • Joined: Invalid Date".
  it("shows the real role and join date", () => {
    ctx.loading = false;
    ctx.user = ADMIN;
    render(<Profile embedded />);
    const line = screen.getByText(/Role:/).textContent;
    expect(line).toMatch(/Organization Admin/);
    expect(line).toMatch(/Greenfield Academy/);
    expect(line).not.toMatch(/Invalid Date|Role: User/);
    expect(line).toMatch(/2026/);
  });

  // On a phone the email ran off the edge of the blue header.
  it("lets a long email wrap instead of running off a phone screen", () => {
    ctx.loading = false;
    ctx.user = { ...ADMIN, email: "a.very.long.address.for.the.principal@greenfield-academy.example.com" };
    render(<Profile embedded />);
    const email = screen.getByText(ctx.user.email);
    expect(email.className).toMatch(/break-all|break-words/);
    expect(email.parentElement.className).toMatch(/min-w-0/);
  });
});
