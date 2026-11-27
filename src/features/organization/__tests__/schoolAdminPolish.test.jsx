/**
 * Reproduces issues a school admin reported:
 * - Students, Teachers, Analytics, Messages (conversations and "New message"
 *   contacts), Results and Grading showed "Loading …" text instead of a
 *   skeleton.
 * - Results told the school admin "You are not assigned to any subject yet.
 *   Ask your school admin to assign you one."
 * - The section tabs (Exams / Results / Grading) grew a scrollbar.
 * - "Parents data unavailable: Something went wrong" flashed on Operations:
 *   the parents list asked for ordering=-date_joined, which the API rejects.
 * - Every API response was printed to the browser console.
 */
import { cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const { pending } = vi.hoisted(() => ({ pending: () => new Promise(() => {}) }));

vi.mock("@/hooks/organization/useSchoolMembers", () => ({
  default: () => ({ rows: [], counts: {}, pagination: {}, loading: true, mutating: false, error: null, reload: vi.fn() }),
  MEMBER_STATUSES: [],
}));
vi.mock("@/hooks/organization/useOrganizationClasses", () => ({ default: () => ({ classes: [] }) }));
vi.mock("@/hooks/messaging/useDirectMessages", () => ({
  default: () => ({
    contacts: [],
    conversations: [],
    messages: [],
    contactsLoading: true,
    conversationsLoading: true,
    messagesLoading: false,
    notification: { show: false, notify: vi.fn(), setShow: vi.fn() },
    fetchContacts: vi.fn(),
    fetchConversations: vi.fn(),
    refreshData: vi.fn(),
    selectContact: vi.fn(),
  }),
}));
vi.mock("@/hooks/organization/useOrganizationAnalytics", () => ({
  default: () => ({ loading: true, error: null, refreshData: vi.fn(), failedEndpoints: [] }),
}));
vi.mock("@/api/resultsApi", () => ({
  resultsApi: {
    mySubjects: vi.fn(pending),
    schoolPolicy: vi.fn(pending),
    myClasses: vi.fn(pending),
    myResults: vi.fn(pending),
    childResults: vi.fn(pending),
    myReports: vi.fn(pending),
    childReports: vi.fn(pending),
  },
}));
vi.mock("@/api/baseClient", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, http: { get: vi.fn().mockResolvedValue({ data: { parents: [] } }), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() } };
});

import { http } from "@/api/baseClient";
import { resultsApi } from "@/api/resultsApi";
import PeopleDirectory from "../components/PeopleDirectory";
import DirectMessages from "@/features/communication/DirectMessages";
import OrganizationAnalytics from "../pages/OrganizationAnalytics";
import TeacherResults from "@/features/results/TeacherResults";
import GradingPolicyPage from "@/features/results/GradingPolicyPage";
import ReportCards from "@/features/results/ReportCards";
import SectionTabs from "@/components/navigation/SectionTabs";
import useParentData from "@/hooks/organization/useParentData";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

/** A skeleton region is there, and no "Loading …" sentence is. */
function expectSkeleton() {
  const busy = document.querySelector('[aria-busy="true"]');
  expect(busy).toBeTruthy();
  const visibleText = [...document.querySelectorAll("p, span, div")]
    .filter((el) => !el.closest(".sr-only") && !el.classList.contains("sr-only") && el.children.length === 0)
    .map((el) => el.textContent.trim());
  expect(visibleText.filter((t) => /^Loading\b/i.test(t))).toEqual([]);
}

describe("loading states use skeletons", () => {
  it.each(["student", "teacher"])("%s list", (kind) => {
    inRouter(<PeopleDirectory kind={kind} />);
    expectSkeleton();
  });

  it("messages: conversations", () => {
    inRouter(<DirectMessages />);
    expectSkeleton();
  });

  it("analytics", () => {
    inRouter(<OrganizationAnalytics />);
    expectSkeleton();
  });

  it("results", () => {
    inRouter(<TeacherResults />);
    expectSkeleton();
  });

  it("grading policy", () => {
    inRouter(<GradingPolicyPage />);
    expectSkeleton();
  });

  it("report cards", () => {
    inRouter(<ReportCards />);
    expectSkeleton();
  });
});

describe("results for a school admin", () => {
  it("doesn't tell the admin to ask the school admin; points to adding subjects", async () => {
    resultsApi.mySubjects.mockResolvedValueOnce([]);
    resultsApi.schoolPolicy.mockResolvedValueOnce(null);
    inRouter(<TeacherResults forSchoolAdmin />);
    await waitFor(() => expect(document.querySelector('[aria-busy="true"]')).toBeNull());
    expect(screen.queryByText(/ask your school admin/i)).toBeNull();
    expect(screen.getByText(/no subjects yet/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /classes/i }).getAttribute("href")).toBe("/organization-dashboard/classes");
  });

  it("still tells a teacher to ask their school admin", async () => {
    resultsApi.mySubjects.mockResolvedValueOnce([]);
    resultsApi.schoolPolicy.mockResolvedValueOnce(null);
    inRouter(<TeacherResults />);
    expect(await screen.findByText(/ask your school admin/i)).toBeTruthy();
  });
});

describe("section tabs", () => {
  it("never shows a vertical scrollbar (the active underline overhangs by 1px)", () => {
    const group = { label: "Exams & results", tabs: [{ id: "a", label: "Exams" }, { id: "b", label: "Results" }] };
    render(<SectionTabs group={group} activeId="a" onSelect={() => {}} />);
    expect(screen.getByRole("navigation").className).toMatch(/\boverflow-y-hidden\b/);
  });
});

describe("parents list", () => {
  it("sorts by a field the API accepts", async () => {
    renderHook(() => useParentData());
    await waitFor(() => expect(http.get).toHaveBeenCalled());
    const [path, opts] = http.get.mock.calls.find(([p]) => p.includes("/parents/"));
    expect(path).toBe("/api/admin/school/parents/");
    expect(opts.params.ordering).toBe("-created_at");
  });
});
