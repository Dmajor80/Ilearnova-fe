import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, FileBarChart, RefreshCw, Search } from "lucide-react";
import { fetchAll, orgCounts, superAdminApi } from "@/api/superAdminApi";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { downloadCsv } from "@/lib/csv";
import { SUBSCRIPTION_STATES, ActivePill, EmptyState, ErrorAlert, PageCard, SubscriptionPill, formatDay } from "@/components/admin/AdminUI";
import { TableSkeleton } from "@/components/ui/Skeleton";
import useResource from "@/hooks/superadmin/useResource";
import { subscriptionOf } from "./Organizations";

const results = (page) => (Array.isArray(page) ? page : page?.results || []);

/** Platform report: one row per school with people, classes and subscription. */
export default function Reports() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const data = useResource(async () => {
    const [orgs, schools] = await Promise.all([
      fetchAll(superAdminApi.organizations, { page_size: 100 }),
      superBillingApi.schools({ page_size: 200 }).then(results).catch(() => []),
    ]);
    const billingById = Object.fromEntries(schools.map((row) => [row.organization_id, row]));
    return orgs.map((org) => ({ ...org, counts: orgCounts(org), sub: subscriptionOf(org, billingById) }));
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data.data || []).filter(
      (r) =>
        (!q || `${r.name} ${r.code}`.toLowerCase().includes(q)) &&
        (!state || (r.sub?.state || "unmanaged") === state)
    );
  }, [data.data, search, state]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (t, r) => ({
          students: t.students + (r.counts.students || 0),
          teachers: t.teachers + (r.counts.teachers || 0),
          classes: t.classes + (r.counts.classes || 0),
        }),
        { students: 0, teachers: 0, classes: 0 }
      ),
    [rows]
  );

  const exportCsv = () =>
    downloadCsv(`schools-report-${new Date().toISOString().slice(0, 10)}.csv`, rows, [
      { header: "School", value: (r) => r.name },
      { header: "Code", value: (r) => r.code },
      { header: "Active", value: (r) => (r.is_active ? "Yes" : "No") },
      { header: "Students", value: (r) => r.counts.students ?? "" },
      { header: "Teachers", value: (r) => r.counts.teachers ?? "" },
      { header: "Parents", value: (r) => r.counts.parents ?? "" },
      { header: "Classes", value: (r) => r.counts.classes ?? "" },
      { header: "Subscription", value: (r) => (SUBSCRIPTION_STATES[r.sub?.state] || ["None"])[0] },
      { header: "Plan", value: (r) => r.sub?.plan_name || "" },
      { header: "Ends", value: (r) => (r.sub?.expires_at || "").slice(0, 10) },
      { header: "Created", value: (r) => (r.created_at || "").slice(0, 10) },
    ]);

  const states = [...new Set(Object.keys(SUBSCRIPTION_STATES).filter((s) => !["expiring_soon", "expired", "none"].includes(s)))];

  return (
    <div className="space-y-5">
      <PageCard
        title="Schools report"
        icon={FileBarChart}
        description="People, classes and subscription for every school. Export it to share or analyse."
        actions={
          <button type="button" onClick={exportCsv} disabled={!rows.length} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
          </button>
        }
      >
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="report-search" className="sr-only">Search schools</label>
            <input id="report-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or code" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
          </div>
          <label htmlFor="report-state" className="sr-only">Subscription</label>
          <select id="report-state" value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">All subscriptions</option>
            {states.map((s) => <option key={s} value={s}>{SUBSCRIPTION_STATES[s][0]}</option>)}
          </select>
          <button type="button" onClick={data.reload} disabled={data.loading} aria-label="Refresh report" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 sm:ml-auto">
            <RefreshCw className={`h-4 w-4 ${data.loading ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </PageCard>

      <ErrorAlert message={data.error && apiErrorDetails(data.error).messages.join(" ")} onRetry={data.reload} />

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {data.loading && !data.data ? (
          <TableSkeleton columns={7} label="Loading report" />
        ) : !rows.length ? (
          <EmptyState icon={FileBarChart} title="No schools match" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3">School</th>
                  <th scope="col" className="px-3 py-3 text-right">Students</th>
                  <th scope="col" className="px-3 py-3 text-right">Teachers</th>
                  <th scope="col" className="px-3 py-3 text-right">Classes</th>
                  <th scope="col" className="px-5 py-3">Subscription</th>
                  <th scope="col" className="px-3 py-3">Plan</th>
                  <th scope="col" className="px-3 py-3">Ends</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link to={`/admin-dashboard/organizations/${r.id}`} className="font-medium text-gray-900 hover:text-blue-700 hover:underline">{r.name}</Link>
                      <p className="text-xs text-gray-500">{r.code}</p>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.counts.students ?? "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.counts.teachers ?? "—"}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.counts.classes ?? "—"}</td>
                    <td className="px-5 py-3"><SubscriptionPill state={r.sub?.state || "none"} /></td>
                    <td className="px-3 py-3 text-gray-700">{r.sub?.plan_name || "—"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-700">{r.sub?.expires_at ? formatDay(r.sub.expires_at) : "—"}</td>
                    <td className="px-3 py-3"><ActivePill active={r.is_active} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50 font-semibold text-gray-900">
                <tr>
                  <td className="px-5 py-3">{rows.length} school{rows.length === 1 ? "" : "s"}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{totals.students}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{totals.teachers}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{totals.classes}</td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
