import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Mail,
  Plus,
  RefreshCw,
  Send,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { superAdminApi } from "@/api/superAdminApi";
import { getStoredUser } from "@/api/auth";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { naira } from "@/features/billing/subscriptionUtils";
import { Skeleton, SkeletonRegion, StatCardsSkeleton } from "@/components/ui/Skeleton";
import { ErrorAlert, PageCard, formatDay } from "@/components/admin/AdminUI";
import SignupsChart from "@/components/admin/SignupsChart";
import useResource from "@/hooks/superadmin/useResource";

const plural = (n, one, many = `${one}s`) => `${n ?? 0} ${n === 1 ? one : many}`;
const num = (v) => (typeof v === "number" ? v : typeof v === "object" && v ? v.total ?? v.count ?? null : v == null ? null : Number(v));
const fmt = (v) => (v == null || Number.isNaN(v) ? "—" : Number(v).toLocaleString());

function money(amount, currency = "NGN") {
  if (amount == null) return "—";
  if (!currency || currency === "NGN") return naira(amount) || "₦0";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount));
  } catch {
    return String(amount);
  }
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function StatCard({ label, value, detail, icon, to }) {
  const Icon = icon;
  const body = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-gray-900">{fmt(value)}</p>
      {detail && <p className="mt-1 text-sm text-gray-500">{detail}</p>}
    </>
  );
  const className = "block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition";
  return (
    <div role="group" aria-label={label}>
      {to ? (
        <Link to={to} className={`${className} hover:border-blue-200 hover:shadow-md`}>{body}</Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </div>
  );
}

const SUBSCRIPTION_ROWS = [
  ["active", "Active", "bg-green-500"],
  ["expiring_soon", "Ending soon", "bg-amber-400"],
  ["expired", "Expired or locked", "bg-red-500"],
  ["none", "No subscription", "bg-gray-300"],
];

function SubscriptionsCard({ data }) {
  const total = data ? SUBSCRIPTION_ROWS.reduce((sum, [key]) => sum + (Number(data[key]) || 0), 0) : 0;
  return (
    <PageCard title="Subscriptions" icon={CreditCard} actions={<Link to="/admin-dashboard/subscriptions" className="text-sm font-medium text-blue-700 hover:underline">Manage</Link>}>
      <div className="p-5">
        {!data ? (
          <p className="text-sm text-gray-500">Subscription figures aren't available yet.</p>
        ) : (
          <>
            {total > 0 && (
              <div className="mb-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
                {SUBSCRIPTION_ROWS.map(([key, , color]) =>
                  Number(data[key]) > 0 ? <span key={key} className={`${color} rounded-sm`} style={{ flexGrow: Number(data[key]) }} /> : null
                )}
              </div>
            )}
            <dl className="space-y-2 text-sm">
              {SUBSCRIPTION_ROWS.map(([key, label, color]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color}`} aria-hidden="true" />
                  <dt className="text-gray-600">{label}</dt>
                  <dd className="ml-auto font-semibold tabular-nums text-gray-900">{fmt(Number(data[key]) || 0)}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </PageCard>
  );
}

function RevenueCard({ data }) {
  const thisMonth = data ? Number(data.this_month) || 0 : null;
  const lastMonth = data ? Number(data.last_month) || 0 : null;
  const change = data && lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null;
  const up = change != null && change >= 0;
  return (
    <PageCard title="Revenue" icon={Wallet}>
      <div className="p-5">
        {!data ? (
          <p className="text-sm text-gray-500">Revenue figures aren't available yet.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">This month</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">{money(thisMonth, data.currency)}</p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {change != null && (
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {up ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
                  {up ? "+" : ""}{change}%
                </span>
              )}
              <span>vs {money(lastMonth, data.currency)} last month</span>
            </p>
            {data.by_purpose && Object.keys(data.by_purpose).length > 0 && (
              <dl className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
                {Object.entries(data.by_purpose).map(([purpose, amount]) => (
                  <div key={purpose} className="flex justify-between">
                    <dt className="capitalize text-gray-600">{purpose.replace(/_/g, " ")}</dt>
                    <dd className="tabular-nums text-gray-900">{money(typeof amount === "object" ? amount?.this_month ?? amount?.amount : amount, data.currency)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        )}
      </div>
    </PageCard>
  );
}

const QUICK_ACTIONS = [
  { label: "Add school", to: "/admin-dashboard/organizations?new=1", icon: Building2, hint: "Create a school directly" },
  { label: "Add user", to: "/admin-dashboard/users/new-user", icon: UserPlus, hint: "Put someone in a school" },
  { label: "Invite a school", to: "/admin-dashboard/subscriptions?tab=invite", icon: Send, hint: "Email an access code" },
  { label: "Create plan", to: "/admin-dashboard/subscriptions?tab=plans&new=1", icon: Plus, hint: "Sell a new subscription" },
];

function DashboardSkeleton() {
  return (
    <SkeletonRegion label="Loading dashboard" className="space-y-5">
      <StatCardsSkeleton count={4} label="Loading figures" />
      <div className="grid gap-5 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-64 w-full rounded-lg" />
        </div>
        <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export default function Dashboard() {
  const metrics = useResource(() => superAdminApi.metrics(), []);
  const user = getStoredUser();
  const firstName = user?.first_name || user?.username || "there";
  const m = metrics.data || {};
  const orgs = m.organizations || {};
  const users = m.users || {};
  const failedEmails = Number(m.emails?.failed) || 0;
  const signups = Array.isArray(m.signups) ? m.signups : [];
  const recent = Array.isArray(m.recent_organizations) ? m.recent_organizations : null;

  const orgTotal = num(orgs);
  const inactive = orgTotal != null && typeof orgs.active === "number" ? orgTotal - orgs.active : 0;
  const usersDetail = typeof users === "object"
    ? [
        plural(users.students, "student"),
        plural(users.teachers, "teacher"),
        plural(users.parents, "parent"),
        plural(users.org_admins, "admin"),
      ].join(" · ")
    : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{greeting()}, {firstName}</h2>
          <p className="text-sm text-gray-500">
            How the platform is doing{metrics.data ? ` · updated ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}` : ""}.
          </p>
        </div>
        <button
          type="button"
          onClick={metrics.reload}
          disabled={metrics.loading}
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${metrics.loading ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh
        </button>
      </div>

      <ErrorAlert message={metrics.error && `Couldn't load the figures: ${apiErrorDetails(metrics.error).messages.join(" ")}`} onRetry={metrics.reload} />

      {metrics.loading && !metrics.data ? (
        <DashboardSkeleton />
      ) : metrics.data ? (
        <>
          {failedEmails > 0 && (
            <Link
              to="/admin-dashboard/emails?status=failed"
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden="true" />
              <span className="flex-1">
                <span className="font-semibold">{plural(failedEmails, "email")} failed to send.</span> Review and resend them in Email Logs.
              </span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}

          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 transition-opacity ${metrics.loading ? "opacity-60" : ""}`}>
            <StatCard
              label="Schools"
              icon={Building2}
              value={orgTotal}
              detail={typeof orgs.active === "number" ? `${orgs.active} active${inactive > 0 ? ` · ${inactive} inactive` : ""}` : null}
              to="/admin-dashboard/organizations"
            />
            <StatCard label="Users" icon={Users} value={num(users)} detail={usersDetail} to="/admin-dashboard/users" />
            <StatCard label="Classes" icon={BookOpen} value={num(m.classes)} detail="Across all schools" />
            <StatCard label="Exams" icon={ClipboardList} value={num(m.exams)} detail="Set up on the platform" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <RevenueCard data={m.revenue} />
            <SubscriptionsCard data={m.subscriptions} />
            <PageCard title="Quick actions">
              <ul className="divide-y divide-gray-100">
                {QUICK_ACTIONS.map(({ label, to, icon: ActionIcon, hint }) => (
                  <li key={label}>
                    <Link to={to} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {ActionIcon && <ActionIcon className="h-4 w-4" aria-hidden="true" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-gray-900">{label}</span>
                        <span className="block text-xs text-gray-500">{hint}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </PageCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <PageCard title="Sign-ups, last 30 days" className="lg:col-span-2">
              <div className="p-5">
                {signups.length ? <SignupsChart data={signups} /> : <p className="py-16 text-center text-sm text-gray-500">No sign-up data yet.</p>}
              </div>
            </PageCard>
            <PageCard
              title="Newest schools"
              icon={Building2}
              actions={<Link to="/admin-dashboard/organizations" className="text-sm font-medium text-blue-700 hover:underline">All</Link>}
            >
              {recent && recent.length ? (
                <ul className="divide-y divide-gray-100">
                  {recent.map((org) => (
                    <li key={org.id}>
                      <Link to={`/admin-dashboard/organizations/${org.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-gray-900">{org.name}</span>
                          <span className="block text-xs text-gray-500">
                            {[formatDay(org.created_at), org.students != null && plural(org.students, "student"), org.teachers != null && plural(org.teachers, "teacher")].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-6 text-sm text-gray-500">{recent ? "No schools yet." : "Recent schools aren't available yet."}</p>
              )}
            </PageCard>
          </div>

          {m.emails && (
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email queue: {plural(Number(m.emails.pending) || 0, "pending email")}, {plural(failedEmails, "failed email")}.{" "}
              <Link to="/admin-dashboard/emails" className="text-blue-700 hover:underline">Email Logs</Link>
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
