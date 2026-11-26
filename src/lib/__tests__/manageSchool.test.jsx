import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { http } from "@/api/baseClient";
import { getManagedSchool, startManagingSchool, stopManagingSchool } from "@/lib/manageSchool";
import OrgAdminGate from "@/features/auth/OrgAdminGate";
import ManagingSchoolBanner from "@/components/admin/ManagingSchoolBanner";

const okJson = () =>
  vi.fn().mockImplementation(() =>
    Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }))
  );

const headersOf = (fetchMock) => fetchMock.mock.calls.at(-1)[1].headers;

// A non-expiring JWT so authorizedFetch does not try to refresh.
const token = `x.${btoa(JSON.stringify({ exp: 4102444800 }))}.y`;

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  window.sessionStorage.setItem("auth_access", token);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.sessionStorage.clear();
});

describe("manage-school header", () => {
  it("adds X-Org-Id to authenticated requests while managing a school", async () => {
    const fetchMock = okJson();
    vi.stubGlobal("fetch", fetchMock);

    await http.get("/api/admin/school/students/");
    expect(headersOf(fetchMock)["X-Org-Id"]).toBeUndefined();

    startManagingSchool({ id: "org-1", name: "Greenfield Academy" });
    await http.get("/api/admin/school/students/");
    expect(headersOf(fetchMock)["X-Org-Id"]).toBe("org-1");
    expect(headersOf(fetchMock).Authorization).toBe(`Bearer ${token}`);

    stopManagingSchool();
    await http.get("/api/admin/school/students/");
    expect(headersOf(fetchMock)["X-Org-Id"]).toBeUndefined();
  });

  it("the managed school beats the user's own selected org", async () => {
    const fetchMock = okJson();
    vi.stubGlobal("fetch", fetchMock);
    window.sessionStorage.setItem("user_data", JSON.stringify({ selectedOrgId: "own-org" }));
    startManagingSchool({ id: "org-1", name: "Greenfield Academy" });
    await http.get("/api/admin/school/students/");
    expect(headersOf(fetchMock)["X-Org-Id"]).toBe("org-1");
  });

  it("never sends it on unauthenticated requests", async () => {
    const fetchMock = okJson();
    vi.stubGlobal("fetch", fetchMock);
    startManagingSchool({ id: "org-1", name: "Greenfield Academy" });
    await http.get("/api/billing/plans/", { auth: false });
    expect(headersOf(fetchMock)["X-Org-Id"]).toBeUndefined();
  });
});

const renderGate = () =>
  render(
    <MemoryRouter initialEntries={["/organization-dashboard/overview"]}>
      <Routes>
        <Route path="/organization-dashboard/overview" element={<OrgAdminGate><p>org dashboard</p></OrgAdminGate>} />
        <Route path="/admin-dashboard/organizations" element={<p>superadmin orgs</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("org dashboard guard", () => {
  it("sends a superuser who is not managing a school back to Organizations", () => {
    window.sessionStorage.setItem("user_data", JSON.stringify({ is_superuser: true, roles: [] }));
    renderGate();
    expect(screen.getByText("superadmin orgs")).toBeTruthy();
  });

  it("lets a superuser in while managing a school", () => {
    window.sessionStorage.setItem("user_data", JSON.stringify({ is_superuser: true, roles: [] }));
    startManagingSchool({ id: "org-1", name: "Greenfield Academy" });
    renderGate();
    expect(screen.getByText("org dashboard")).toBeTruthy();
  });

  it("still lets an org admin in", () => {
    window.sessionStorage.setItem("user_data", JSON.stringify({ roles: [{ role: { code: "org_admin" } }] }));
    renderGate();
    expect(screen.getByText("org dashboard")).toBeTruthy();
  });
});

describe("managing banner", () => {
  it("names the school and Exit clears manage mode and returns to Organizations", () => {
    startManagingSchool({ id: "org-1", name: "Greenfield Academy" });
    render(
      <MemoryRouter initialEntries={["/organization-dashboard/overview"]}>
        <Routes>
          <Route path="/organization-dashboard/overview" element={<ManagingSchoolBanner />} />
          <Route path="/admin-dashboard/organizations" element={<p>superadmin orgs</p>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/You're managing/).textContent).toMatch(/Greenfield Academy as platform admin/);
    fireEvent.click(screen.getByRole("button", { name: /exit/i }));
    expect(getManagedSchool()).toBeNull();
    expect(screen.getByText("superadmin orgs")).toBeTruthy();
  });
});
