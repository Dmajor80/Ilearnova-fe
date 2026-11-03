import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import StudentAlertsPanel from "@/components/dashboard/StudentAlertsPanel";
import QuickActionsGrid from "@/components/dashboard/QuickActionsGrid";
import { useParentChildProgress, useParentChildren } from "@/hooks/parent";
import ParentAttendance from "./ParentAttendance";
import ParentMessages from "./ParentMessages";
import ParentPayment from "./ParentPayment";
import ParentResult from "./ParentResult";
import ParentTimetable from "./ParentTimetable";
import ParentTranscript from "./ParentTranscript";
import ParentSidebar from "../components/ParentSidebar";
import ParentHeader from "../components/ParentHeader";
import Announcement from "./Announcement";
import ParentChildrenPanel from "../components/ParentChildrenPanel";
import { getParentChildName } from "../components/parentDisplayUtils";

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
      <div className="flex-1 md:ml-64">
        <ParentHeader
          activeTab={activeTab}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          dashboardData={dashboardData}
        />
        <main className="m-4 mt-0 flex-1 p-6 md:m-6 md:mt-0 md:p-8">
          {(activeTab === "dashboard" || activeTab === "children") && (
            <div className="space-y-6">
              {activeTab === "dashboard" && (
                <>
                  <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="mb-2 text-3xl font-bold">
                          Welcome back, {dashboardData?.user?.first_name || "Parent"}!
                        </h2>
                        <p className="text-lg text-blue-100">
                          Here&apos;s an overview of your children&apos;s academic progress and activities.
                        </p>
                      </div>
                      <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-white/20 md:flex">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                      <section className="rounded-xl bg-white p-6 shadow-lg">
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
                        {progressLoading && <p className="py-5 text-slate-600">Loading progress…</p>}
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
                      <section className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Recent Activity</h3>
                        <RecentActivityFeed />
                      </section>
                    </div>
                    <div className="space-y-8">
                      <section className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">
                          Alerts &amp; Notifications
                        </h3>
                        <StudentAlertsPanel />
                      </section>
                      <section className="rounded-xl bg-white p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h3>
                        <QuickActionsGrid />
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
          {activeTab === "fees" && <ParentPayment />}
          {activeTab === "timetable" && <ParentTimetable />}
          {activeTab === "reports" && <ParentTranscript />}
        </main>
      </div>
    </div>
  );
}

function ProgressSummary({ progress }) {
  const metrics = Object.entries(progress).filter(([key, value]) =>
    !/^(id|child|student)$/i.test(key)
    && ["string", "number", "boolean"].includes(typeof value)
  );

  if (!metrics.length) {
    return (
      <pre className="overflow-auto rounded-lg bg-slate-50 p-4 text-sm">
        {JSON.stringify(progress, null, 2)}
      </pre>
    );
  }

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {metrics.map(([key, value]) => (
        <div key={key} className="rounded-lg bg-slate-50 p-4">
          <dt className="text-sm capitalize text-slate-500">{key.replaceAll("_", " ")}</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-800">
            {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
