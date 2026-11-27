/**
 * Joining a school without a dropdown of every school: people type their
 * school's code on sign-up, open a personal invite link a school admin
 * emailed them, or open the school's shareable "open" link for a role.
 */
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/authApi", () => ({
  getOrganizations: vi.fn(() => Promise.resolve({ results: [] })),
  resendOtp: vi.fn(),
  registerTeacher: vi.fn(),
  registerStudent: vi.fn(),
  registerParent: vi.fn(),
  registerIndividualLearner: vi.fn(),
}));
vi.mock("@/api/auth", () => ({
  persistAuthResponse: vi.fn(),
  getTokens: () => ({ access: null }),
  getStoredUser: vi.fn(() => null),
}));

import { http } from "@/api/baseClient";
import * as authApi from "@/api/authApi";
import SignupForm from "../SignupForm";
import JoinSchool from "../JoinSchool";

const notFound = () => {
  const error = new Error("No school has that code. Check it with your school.");
  error.status = 404;
  error.data = { error: "No school has that code. Check it with your school." };
  return error;
};

const lookup = (path, opts) => {
  if (path === "/api/organizations/lookup/") {
    const code = String(opts?.params?.code || "").toUpperCase();
    return code === "SUN12345" ? Promise.resolve({ name: "Sunrise College", code: "SUN12345" }) : Promise.reject(notFound());
  }
  return Promise.resolve({});
};

beforeEach(() => {
  http.get.mockImplementation(lookup);
  http.post.mockResolvedValue({});
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const fill = (name, value) => fireEvent.change(document.querySelector(`[name="${name}"]`), { target: { value } });

function showSignup() {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole("button", { name: /^teacher/i }));
}

function fillTeacher() {
  fill("first_name", "Tunde");
  fill("last_name", "Bello");
  fill("username", "tunde");
  fill("email", "tunde@sunrise.example.com");
  fill("date_of_birth", "1990-05-01");
  fill("password", "Joiner-Pass-2026");
  fill("password_confirmation", "Joiner-Pass-2026");
}

describe("signing up with a school code", () => {
  it("asks for the school's code instead of listing every school", async () => {
    showSignup();
    expect(document.querySelector('select[name="organization_id"]')).toBeNull();
    const input = screen.getByLabelText(/School code/);
    expect(input.getAttribute("name")).toBe("organization_code");
    expect(screen.getByText("Ask your school for its code, or use the invite link they emailed you.")).toBeTruthy();
    expect(authApi.getOrganizations).not.toHaveBeenCalled();
  });

  it("uppercases the code and shows the school it belongs to", async () => {
    showSignup();
    fireEvent.change(screen.getByLabelText(/School code/), { target: { value: "sun12345" } });
    expect(screen.getByLabelText(/School code/).value).toBe("SUN12345");
    expect(await screen.findByText("✓ Sunrise College")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/organizations/lookup/", expect.objectContaining({ auth: false, params: { code: "SUN12345" } }));
  });

  it("waits until at least 4 characters before looking up", async () => {
    showSignup();
    fireEvent.change(screen.getByLabelText(/School code/), { target: { value: "SUN" } });
    await new Promise((r) => setTimeout(r, 600));
    expect(http.get.mock.calls.some(([p]) => p === "/api/organizations/lookup/")).toBe(false);
  });

  it("only looks up once the person stops typing", async () => {
    showSignup();
    const input = screen.getByLabelText(/School code/);
    for (const value of ["SUN1", "SUN12", "SUN123", "SUN1234", "SUN12345"]) {
      fireEvent.change(input, { target: { value } });
    }
    await screen.findByText("✓ Sunrise College");
    expect(http.get.mock.calls.filter(([p]) => p === "/api/organizations/lookup/")).toHaveLength(1);
  });

  it("says so when no school has that code, and won't submit", async () => {
    showSignup();
    fillTeacher();
    fireEvent.change(screen.getByLabelText(/School code/), { target: { value: "NOPE9999" } });
    expect(await screen.findByText("No school has that code. Check it with your school.")).toBeTruthy();
    fireEvent.submit(document.querySelector("form"));
    await new Promise((r) => setTimeout(r, 50));
    expect(authApi.registerTeacher).not.toHaveBeenCalled();
  });

  it("requires a code", async () => {
    showSignup();
    fillTeacher();
    fireEvent.submit(document.querySelector("form"));
    expect(await screen.findByText("Enter your school's code.")).toBeTruthy();
    expect(authApi.registerTeacher).not.toHaveBeenCalled();
  });

  it("sends organization_code and names the school on the waiting screen", async () => {
    authApi.registerTeacher.mockResolvedValue({ user: { email: "tunde@sunrise.example.com", is_verified: false } });
    showSignup();
    fillTeacher();
    fireEvent.change(screen.getByLabelText(/School code/), { target: { value: "sun12345" } });
    await screen.findByText("✓ Sunrise College");
    fireEvent.submit(document.querySelector("form"));
    await waitFor(() => expect(authApi.registerTeacher).toHaveBeenCalled());
    const body = authApi.registerTeacher.mock.calls[0][0];
    expect(body.organization_code).toBe("SUN12345");
    expect(body).not.toHaveProperty("organization_id");
    expect(await screen.findByText(/waiting for Sunrise College to approve/i)).toBeTruthy();
  });

  it("shows the server's reason next to the code field (plain DRF shape)", async () => {
    const error = new Error("Bad request");
    error.status = 400;
    error.data = { organization_code: ["This school isn't taking sign-ups right now."] };
    authApi.registerTeacher.mockRejectedValue(error);
    showSignup();
    fillTeacher();
    fireEvent.change(screen.getByLabelText(/School code/), { target: { value: "SUN12345" } });
    await screen.findByText("✓ Sunrise College");
    fireEvent.submit(document.querySelector("form"));
    // Next to the field, and as the notification's reason.
    expect((await screen.findAllByText("This school isn't taking sign-ups right now.")).length).toBeGreaterThan(0);
  });
});

const INVITE = {
  email: "ada@sunrise.example.com",
  role: "teacher",
  role_label: "Teacher",
  organization_name: "Sunrise College",
  organization_code: "SUN12345",
};

function showJoin(search) {
  render(
    <MemoryRouter initialEntries={[`/join${search}`]}>
      <Routes>
        <Route path="/join" element={<JoinSchool />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("joining from an emailed invite link", () => {
  beforeEach(() => {
    http.get.mockImplementation((path, opts) =>
      path === "/api/auth/invite/" ? Promise.resolve(INVITE) : lookup(path, opts)
    );
  });

  it("shows a skeleton, then who the invite is for with the email locked", async () => {
    showJoin("?invite=tok-1");
    expect(screen.getByRole("status", { name: /loading/i })).toBeTruthy();
    expect(await screen.findByText(/Join Sunrise College as a teacher/i)).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/auth/invite/", expect.objectContaining({ auth: false, params: { token: "tok-1" } }));
    const email = screen.getByLabelText(/Email/);
    expect(email.value).toBe("ada@sunrise.example.com");
    expect(email.readOnly).toBe(true);
    for (const label of [/First name/, /Last name/, /Username/, /^Password/, /Confirm password/]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it("registers with the invite and says they're in", async () => {
    http.post.mockResolvedValue({ user: { email: INVITE.email } });
    showJoin("?invite=tok-1");
    await screen.findByText(/Join Sunrise College as a teacher/i);
    fireEvent.change(screen.getByLabelText(/First name/), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText(/Last name/), { target: { value: "Obi" } });
    fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "adaobi" } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.change(screen.getByLabelText(/Confirm password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.click(screen.getByRole("button", { name: /join/i }));
    expect(await screen.findByText("You're in! Log in to get started.")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/register/teacher/",
      expect.objectContaining({
        auth: false,
        body: {
          invite: "tok-1",
          email: INVITE.email,
          first_name: "Ada",
          last_name: "Obi",
          username: "adaobi",
          password: "Joiner-Pass-2026",
        },
      })
    );
    expect(screen.getByRole("link", { name: /log in/i }).getAttribute("href")).toBe("/login");
  });

  it("checks the passwords match before sending", async () => {
    showJoin("?invite=tok-1");
    await screen.findByText(/Join Sunrise College as a teacher/i);
    fireEvent.change(screen.getByLabelText(/First name/), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText(/Last name/), { target: { value: "Obi" } });
    fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "adaobi" } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.change(screen.getByLabelText(/Confirm password/), { target: { value: "Different-2026" } });
    fireEvent.click(screen.getByRole("button", { name: /join/i }));
    expect(await screen.findByText(/don't match/i)).toBeTruthy();
    expect(http.post).not.toHaveBeenCalled();
  });

  it("explains an expired or used link and offers sign-up and log-in", async () => {
    const error = new Error("Bad request");
    error.status = 400;
    error.data = { field_errors: { invite: ["This invite link has already been used. Log in with adaobi instead."] } };
    http.get.mockRejectedValue(error);
    showJoin("?invite=old");
    expect(await screen.findByText("This invite link has already been used. Log in with adaobi instead.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /sign up here/i }).getAttribute("href")).toBe("/signup");
    expect(screen.getByText(/Have a school code instead\?/)).toBeTruthy();
    expect(screen.getByRole("link", { name: /log in/i }).getAttribute("href")).toBe("/login");
  });

  it("shows field errors from the register call", async () => {
    const error = new Error("Bad request");
    error.status = 400;
    error.data = { username: ["A user with that username already exists."] };
    http.post.mockRejectedValue(error);
    showJoin("?invite=tok-1");
    await screen.findByText(/Join Sunrise College as a teacher/i);
    fireEvent.change(screen.getByLabelText(/First name/), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText(/Last name/), { target: { value: "Obi" } });
    fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "adaobi" } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.change(screen.getByLabelText(/Confirm password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.click(screen.getByRole("button", { name: /join/i }));
    expect(await screen.findByText("A user with that username already exists.")).toBeTruthy();
  });
});

describe("joining from a school's open link", () => {
  it("looks the school up and registers with its code; they wait for approval", async () => {
    http.post.mockResolvedValue({ user: { email: "emeka@x.ng" } });
    showJoin("?school=sun12345&role=student");
    expect(await screen.findByText(/Join Sunrise College as a student/i)).toBeTruthy();
    const email = screen.getByLabelText(/Email/);
    expect(email.readOnly).toBe(false);
    fireEvent.change(screen.getByLabelText(/First name/), { target: { value: "Emeka" } });
    fireEvent.change(screen.getByLabelText(/Last name/), { target: { value: "Nwosu" } });
    fireEvent.change(screen.getByLabelText(/Username/), { target: { value: "emeka" } });
    fireEvent.change(email, { target: { value: "emeka@x.ng" } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.change(screen.getByLabelText(/Confirm password/), { target: { value: "Joiner-Pass-2026" } });
    fireEvent.click(screen.getByRole("button", { name: /join/i }));
    expect(await screen.findByText(/waiting for Sunrise College to approve it/i)).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith(
      "/api/auth/register/student/",
      expect.objectContaining({
        body: expect.objectContaining({ organization_code: "SUN12345", email: "emeka@x.ng", username: "emeka" }),
      })
    );
    expect(http.post.mock.calls[0][1].body).not.toHaveProperty("invite");
    expect(screen.getByRole("link", { name: /log in/i }).getAttribute("href")).toBe("/login");
  });

  it("explains an unknown school code", async () => {
    showJoin("?school=NOPE9999&role=teacher");
    expect(await screen.findByText("No school has that code. Check it with your school.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /sign up here/i }).getAttribute("href")).toBe("/signup");
  });

  it("explains a link with a bad role without calling the API", async () => {
    showJoin("?school=SUN12345&role=admin");
    expect(await screen.findByText(/link isn't complete|isn't valid/i)).toBeTruthy();
    expect(http.get).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: /log in/i }).getAttribute("href")).toBe("/login");
  });

  it("explains a link with nothing in it", async () => {
    showJoin("");
    expect(await screen.findByText(/link isn't complete|isn't valid/i)).toBeTruthy();
  });
});
