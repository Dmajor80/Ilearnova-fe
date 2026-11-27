import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { http } from "@/api/baseClient";
import { persistAuthResponse, clearAuth } from "@/api/auth";
import { logout } from "@/api/authApi";
import { Skeleton, SkeletonRegion } from "@/components/ui/Skeleton";
import ParentChildrenPanel from "@/features/parent/components/ParentChildrenPanel";

const ROLE_LABELS = { teacher: "a teacher", student: "a student", parent: "a parent" };

function unwrapUser(response) {
  if (response && typeof response === "object" && "data" in response && response.data && typeof response.data === "object") {
    return response.data.user || response.data;
  }
  return response?.user || response || null;
}

/**
 * Decide what a signed-in teacher/student/parent should see:
 * "approved" when they hold a verified, active role of `role`;
 * "pending" when every active role of `role` is still unverified;
 * "open" otherwise (no such role, or the profile could not be read), so
 * errors never lock anyone out.
 */
function approvalState(user, role) {
  const matching = (Array.isArray(user?.roles) ? user.roles : []).filter(
    (r) => r?.role?.code === role && r?.is_active !== false
  );
  if (matching.length === 0) return { status: "open" };
  if (matching.some((r) => r.is_verified)) return { status: "approved" };
  return { status: "pending", schoolName: matching[0]?.organization?.name || "your school" };
}

/**
 * Wraps a teacher/student/parent dashboard. Until the school approves the
 * person's role every API call they make returns 403, so instead of a
 * broken dashboard they see that they're waiting for the school.
 */
export default function PendingApprovalGate({ role, children }) {
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "loading" });
  const [checking, setChecking] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await http.get("/api/auth/profile/", { auth: true });
      const user = unwrapUser(response);
      if (user && typeof user === "object" && Array.isArray(user.roles)) {
        try {
          persistAuthResponse({ user });
        } catch {
          // Saving the fresher profile is best effort.
        }
      }
      return approvalState(user, role);
    } catch {
      return { status: "open" };
    }
  }, [role]);

  useEffect(() => {
    let active = true;
    load().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const recheck = useCallback(async () => {
    setChecking(true);
    const next = await load();
    setState(next);
    setChecking(false);
  }, [load]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // Log out locally even if the server call fails.
    }
    clearAuth();
    navigate("/login", { replace: true });
  };

  if (state.status === "loading") {
    return (
      <SkeletonRegion label="Loading your account" className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </SkeletonRegion>
    );
  }

  if (state.status !== "pending") return children;

  const { schoolName } = state;
  const isParent = role === "parent";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Waiting for {schoolName} to approve you
              </h1>
              <p className="mt-1 text-gray-600">
                You've joined {schoolName} as {ROLE_LABELS[role] || role}, but the school hasn't approved your account yet.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">What happens next</h2>
            {isParent ? (
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
                <li>Request a link to your child below, using their student email.</li>
                <li>{schoolName} reviews the request. Approving the link approves your account.</li>
                <li>Come back and press "Check again" to open your dashboard.</li>
              </ol>
            ) : (
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
                <li>A school admin at {schoolName} reviews and approves your account.</li>
                <li>Once approved, you'll see your classes on your dashboard.</li>
                <li>Press "Check again" any time to see if you've been approved.</li>
              </ol>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={recheck}
              disabled={checking}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} aria-hidden="true" />
              {checking ? "Checking…" : "Check again"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </section>

        {isParent && (
          <section className="space-y-2">
            <p className="text-sm text-gray-600">
              Link your child to your account. When {schoolName} approves the link, your account is approved too.
            </p>
            <ParentChildrenPanel
              children={[]}
              loading={false}
              error={null}
              refreshData={recheck}
              onSelectChild={() => {}}
            />
          </section>
        )}
      </div>
    </main>
  );
}
