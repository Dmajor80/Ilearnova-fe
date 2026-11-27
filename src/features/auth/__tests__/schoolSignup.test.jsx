import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));
vi.mock("@/api/auth", () => ({ persistAuthResponse: vi.fn(), getTokens: () => ({ access: null }) }));

import { http } from "@/api/baseClient";
import RegisterSchool from "../RegisterSchool";
import SchoolSetup from "../SchoolSetup";
import SignupForm from "../SignupForm";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function LoginStub() {
  const { state } = useLocation();
  return <p>login page {state?.info} {state?.username}</p>;
}

const at = (ui, path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<LoginStub />} />
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );

const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

const validationError = (fields) => {
  const error = new Error("Validation failed");
  error.status = 400;
  error.data = { success: false, error: "Request failed", field_errors: fields };
  return error;
};

describe("RegisterSchool (step 1)", () => {
  it("asks only for the school's email, name and access code", () => {
    at(<RegisterSchool />, "/register/school");
    expect(screen.getByLabelText("School email")).toBeTruthy();
    expect(screen.getByLabelText("School name")).toBeTruthy();
    expect(screen.getByLabelText("Access code")).toBeTruthy();
    for (const personal of [/first name/i, /last name/i, /username/i, /password/i, /date of birth/i]) {
      expect(screen.queryByLabelText(personal)).toBeNull();
    }
  });

  it("fills in the email and code from an invite link", () => {
    http.post.mockResolvedValue({ valid: true });
    at(<RegisterSchool />, "/register/school?code=iln-aaaa-bbbb-cccc&email=principal%40sunrise.ng");
    expect(screen.getByLabelText("School email").value).toBe("principal@sunrise.ng");
    expect(screen.getByLabelText("Access code").value).toBe("ILN-AAAA-BBBB-CCCC");
  });

  it("registers the school and says where the setup link went", async () => {
    http.post.mockImplementation((path) =>
      path === "/api/auth/register/school/"
        ? Promise.resolve({ email: "office@sunrise.ng", organization: { name: "Sunrise College", code: "AB12CD34" } })
        : Promise.resolve({ valid: true })
    );
    at(<RegisterSchool />, "/register/school");
    type("School email", "office@sunrise.ng");
    type("School name", "Sunrise College");
    type("Access code", "ILN-AAAA-BBBB-CCCC");
    fireEvent.click(screen.getByRole("button", { name: "Register school" }));

    expect(await screen.findByText("Check your email")).toBeTruthy();
    expect(screen.getByText("office@sunrise.ng")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith("/api/auth/register/school/", {
      body: { email: "office@sunrise.ng", organization_name: "Sunrise College", access_code: "ILN-AAAA-BBBB-CCCC" },
      auth: false,
    });

    fireEvent.click(screen.getByRole("button", { name: "Send it again" }));
    expect(await screen.findByText("A new link is on its way.")).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith("/api/auth/register/school/resend/", {
      body: { email: "office@sunrise.ng" },
      auth: false,
    });
  });

  it("shows the backend's reason next to the field", async () => {
    http.post.mockImplementation((path) =>
      path === "/api/auth/register/school/"
        ? Promise.reject(validationError({ access_code: ["This access code was issued to a different email address."] }))
        : Promise.resolve({ valid: true })
    );
    at(<RegisterSchool />, "/register/school");
    type("School email", "office@sunrise.ng");
    type("School name", "Sunrise College");
    fireEvent.click(screen.getByRole("button", { name: "Register school" }));
    expect(await screen.findByText("This access code was issued to a different email address.")).toBeTruthy();
    expect(screen.queryByText(/Request failed|Validation failed/)).toBeNull();
  });

  it("needs an email and a name before sending", () => {
    at(<RegisterSchool />, "/register/school");
    fireEvent.click(screen.getByRole("button", { name: "Register school" }));
    expect(screen.getByText("Enter the school's email address.")).toBeTruthy();
    expect(screen.getByText("Enter the school's name.")).toBeTruthy();
    expect(http.post).not.toHaveBeenCalledWith("/api/auth/register/school/", expect.anything());
  });
});

describe("SchoolSetup (step 2, the emailed link)", () => {
  const link = "/register/school/setup?token=tok-123";
  const school = { email: "office@sunrise.ng", organization_name: "Sunrise College", organization_code: "AB12CD34" };

  it("creates the admin account and sends them to log in", async () => {
    http.get.mockResolvedValue(school);
    http.post.mockResolvedValue({ username: "ada.obi" });
    at(<SchoolSetup />, link);

    expect(await screen.findByText("Set up Sunrise College")).toBeTruthy();
    expect(screen.getByText("office@sunrise.ng")).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith("/api/auth/register/school/setup/", { auth: false, params: { token: "tok-123" } });

    type("First name", "Ada");
    type("Last name", "Obi");
    type("Username", "ada.obi");
    type("Password", "Sunrise-Admin-2026");
    type("Confirm password", "Sunrise-Admin-2026");
    fireEvent.click(screen.getByRole("button", { name: "Create admin account" }));

    expect(await screen.findByText(/login page school_setup_done ada.obi/)).toBeTruthy();
    expect(http.post).toHaveBeenCalledWith("/api/auth/register/school/setup/", {
      body: { token: "tok-123", first_name: "Ada", last_name: "Obi", username: "ada.obi", password: "Sunrise-Admin-2026" },
      auth: false,
    });
  });

  it("checks the passwords match before sending", async () => {
    http.get.mockResolvedValue(school);
    at(<SchoolSetup />, link);
    await screen.findByText("Set up Sunrise College");
    type("First name", "Ada");
    type("Last name", "Obi");
    type("Username", "ada.obi");
    type("Password", "Sunrise-Admin-2026");
    type("Confirm password", "something-else");
    fireEvent.click(screen.getByRole("button", { name: "Create admin account" }));
    expect(screen.getByText("The passwords don't match.")).toBeTruthy();
    expect(http.post).not.toHaveBeenCalled();
  });

  it("shows a taken username next to the field", async () => {
    http.get.mockResolvedValue(school);
    http.post.mockRejectedValue(validationError({ username: ["This username is taken."] }));
    at(<SchoolSetup />, link);
    await screen.findByText("Set up Sunrise College");
    type("First name", "Ada");
    type("Last name", "Obi");
    type("Username", "taken");
    type("Password", "Sunrise-Admin-2026");
    type("Confirm password", "Sunrise-Admin-2026");
    fireEvent.click(screen.getByRole("button", { name: "Create admin account" }));
    expect(await screen.findByText("This username is taken.")).toBeTruthy();
  });

  it("offers a new link when this one has expired or was used", async () => {
    http.get.mockRejectedValue(validationError({ token: ["This setup link has expired. Ask for a new one."] }));
    http.post.mockResolvedValue({});
    at(<SchoolSetup />, link);
    expect(await screen.findByText("This setup link has expired. Ask for a new one.")).toBeTruthy();
    type("School email", "office@sunrise.ng");
    fireEvent.click(screen.getByRole("button", { name: "Email me a new link" }));
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith("/api/auth/register/school/resend/", {
        body: { email: "office@sunrise.ng" },
        auth: false,
      })
    );
    expect(await screen.findByText(/a new link is on its way/)).toBeTruthy();
  });
});

describe("SignupForm", () => {
  it("no longer creates schools and points to school registration instead", () => {
    http.get.mockResolvedValue({ results: [] });
    at(<SignupForm />, "/signup");
    expect(screen.queryByRole("button", { name: /Organization Admin/ })).toBeNull();
    expect(screen.queryByLabelText("Access code")).toBeNull();
    expect(screen.getByRole("link", { name: "Register your school" }).getAttribute("href")).toBe("/register/school");
  });
});
