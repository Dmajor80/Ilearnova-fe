import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import { useParentAnnouncements, useParentChildProgress, useParentChildren } from "@/hooks/parent";
import ParentAttendance from "./ParentAttendance";
import ParentMessages from "./ParentMessages";
import MyFees from "@/features/billing/MyFees";
import ParentResult from "./ParentResult";
import ParentTimetable from "./ParentTimetable";
import ParentMaterials from "./ParentMaterials";
import SectionTabs from "@/components/navigation/SectionTabs";
import { groupOf } from "@/components/navigation/navGroups";
import { PARENT_GROUPS } from "../parentNav";
import ParentSidebar from "../components/ParentSidebar";
import ParentHeader from "../components/ParentHeader";
import Announcement from "./Announcement";
import ParentChildrenPanel from "../components/ParentChildrenPanel";
import { getParentChildName } from "../components/parentDisplayUtils";
import { ListSkeleton } from "@/components/ui/Skeleton";

export default function ParentDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const { children, loading: childrenLoading, error: childrenError, refreshData } =
    useParentChildren();
  const selectedChild = children.find((child) => String(child.id) === String(selectedChildId));
  const {
    progress,
    loading: progressLoading,
    error: progressError,
    refreshData: refreshProgress
  } = useParentChildProgress(selectedChildId);
  const dashboardData = useMemo(() => {
    try {
      const raw = localStorage.getItem("user_data") || sessionStorage.getItem("user_data");
      const user = raw ? JSON.parse(raw) : null;
      return { user };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (children.length
      && !children.some((child) => String(child.id) === String(selectedChildId))) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (location.state?.activeTab) setActiveTab(location.state.activeTab);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ParentSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="min-w-0 flex-1 md:ml-64">
        <ParentHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          dashboardData={dashboardData}
        />
        <main className="m-4 mt-0 flex-1 px-0 py-6 md:m-6 md:mt-0 md:p-8">
          <SectionTabs group={groupOf(PARENT_GROUPS, activeTab)} activeId={activeTab} onSelect={setActiveTab} className="mb-6" />
          {(activeTab === "dashboard" || activeTab === "children") && (
            <div className="space-y-6">
              {activeTab === "dashboard" && (
                <>
                  <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white shadow-lg md:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="mb-2 break-words text-2xl font-bold md:text-3xl">
                          Welcome back, {dashboardData?.user?.first_name || "Parent"}!
                        </h2>
                        <p className="text-base text-blue-100 md:text-lg">
                          Here&apos;s an overview of your children&apos;s academic progress and activities.
                        </p>
                      </div>
                      <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-white/20 md:flex">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
                    <div className="min-w-0 space-y-6 md:space-y-8 lg:col-span-2">
                      <section className="rounded-xl bg-white p-4 shadow-lg md:p-6">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">Progress overview</h3>
                            <p className="text-sm text-gray-500">
                              {selectedChild ? getParentChildName(selectedChild) : "Select a linked child"}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {children.map((child) => (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => setSelectedChildId(child.id)}
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  String(child.id) === String(selectedChildId)
                                    ? "bg-blue-700 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {getParentChildName(child)}
                              </button>
                            ))}
                          </div>
                        </div>
                        {progressLoading && <ListSkeleton rows={3} label="Loading progress" />}
                        {!progressLoading && progressError && (
                          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
                            Progress is currently unavailable.
                            <button
                              className="ml-2 underline"
                              type="button"
                              onClick={refreshProgress}
                            >
                              Try again
                            </button>
                          </div>
                        )}
                        {!progressLoading && !progressError && progress && (
                          <ProgressSummary progress={progress} />
                        )}
                        {!progressLoading && !progressError && !progress && (
                          <p className="py-5 text-slate-600">
                            {selectedChild
                              ? "No progress summary is available yet."
                              : "Link a child to view progress."}
                          </p>
                        )}
                      </section>
                    </div>
                    <div className="min-w-0 space-y-6 md:space-y-8">
                      <section className="rounded-xl bg-white p-4 shadow-lg md:p-6">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">From the school</h3>
                        <LatestAnnouncements onSeeAll={() => setActiveTab("announcement")} />
                      </section>
                      <section className="rounded-xl bg-white p-4 shadow-lg md:p-6">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Quick links</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {QUICK_LINKS.map((link) => (
                            <button
                              key={link.tab}
                              type="button"
                              onClick={() => setActiveTab(link.tab)}
                              className="rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
                            >
                              {link.label}
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </>
              )}
              {activeTab === "children" && (
                <ParentChildrenPanel
                  children={children}
                  loading={childrenLoading}
                  error={childrenError}
                  refreshData={refreshData}
                  selectedChildId={selectedChildId}
                  onSelectChild={(child) => {
                    setSelectedChildId(child.id);
                    setActiveTab("dashboard");
                  }}
                />
              )}
            </div>
          )}
          {activeTab === "announcement" && <Announcement />}
          {activeTab === "attendance" && <ParentAttendance isStandalone={false} />}
          {activeTab === "grades" && <ParentResult isStandalone={false} />}
          {activeTab === "messages" && <ParentMessages />}
          {activeTab === "fees" && <MyFees />}
          {activeTab === "timetable" && <ParentTimetable />}
          {activeTab === "materials" && <ParentMaterials />}
        </main>
      </div>
    </div>
  );
}

const attended = (row) => (row.present || 0) + (row.late || 0);
const counted = (row) => attended(row) + (row.absent || 0) + (row.excused || 0);
const pct = (num, den) => (den ? Math.round((num / den) * 1000) / 10 : 0);

/** The child's attendance by subject, latest exam scores and graded work. */
export function ProgressSummary({ progress }) {
  const subjects = progress.attendance_summary || [];
  const exams = progress.exam_results || [];
  const graded = progress.graded_submissions || [];
  const total = subjects.reduce((n, row) => n + counted(row), 0);
  const present = subjects.reduce((n, row) => n + attended(row), 0);
  const absent = subjects.reduce((n, row) => n + (row.absent || 0), 0);

  if (!subjects.length && !exams.length && !graded.length) {
    return <p className="py-5 text-slate-600">Nothing recorded yet. Attendance and scores appear here as teachers add them.</p>;
  }
  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-4">
          <dt className="text-sm text-slate-600">Attendance</dt>
          <dd className="mt-1 text-2xl font-bold text-slate-900">{pct(present, total)}%</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-sm text-slate-600">Lessons missed</dt>
          <dd className="mt-1 text-2xl font-bold text-slate-900">{absent}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <dt className="text-sm text-slate-600">Graded work</dt>
          <dd className="mt-1 text-2xl font-bold text-slate-900">{graded.length + exams.length}</dd>
        </div>
      </dl>
      {subjects.length > 0 && (
        <div>
          <h4 className="mb-3 font-semibold text-slate-800">Attendance by subject</h4>
          <ul className="space-y-3">
            {subjects.map((row) => {
              const value = pct(attended(row), counted(row));
              return (
                <li key={row.subject_name} className="grid grid-cols-[minmax(4rem,10rem)_1fr_auto] items-center gap-2 text-sm sm:gap-3">
                  <span className="truncate text-slate-700">{row.subject_name}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <span className="block h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-slate-900 sm:w-28">
                    {value}% <span className="text-slate-500">({attended(row)}/{counted(row)})</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {exams.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-slate-800">Online exams</h4>
          <ul className="divide-y text-sm">
            {exams.map((exam) => (
              <li key={exam.exam} className="flex justify-between gap-3 py-2">
                <span className="min-w-0 break-words text-slate-700">{exam.title}</span>
                <span className="shrink-0 tabular-nums text-slate-900">{exam.score}/{exam.total_marks}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short" });

/** The three newest school announcements. */
function LatestAnnouncements({ onSeeAll }) {
  const { announcements, loading } = useParentAnnouncements();
  if (loading) return <ListSkeleton rows={3} label="Loading announcements" />;
  if (!announcements.length) return <p className="text-sm text-slate-500">No announcements yet.</p>;
  return (
    <>
      <ul className="space-y-4">
        {announcements.slice(0, 3).map((a) => (
          <li key={a.id}>
            <p className="font-medium text-slate-900">{a.title}</p>
            <p className="text-xs text-slate-500">{formatDate(a.created_at)}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{a.message}</p>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onSeeAll} className="mt-4 text-sm font-medium text-blue-700 hover:underline">
        All announcements
      </button>
    </>
  );
}

const QUICK_LINKS = [
  { tab: "attendance", label: "Attendance" },
  { tab: "grades", label: "Results" },
  { tab: "timetable", label: "Timetable" },
  { tab: "fees", label: "Pay school fees" },
];
