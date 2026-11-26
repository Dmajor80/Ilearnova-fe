import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Building2, Plus, RefreshCw, Search } from "lucide-react";
import { asPage, orgCounts, superAdminApi } from "@/api/superAdminApi";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { toast } from "@/lib/toast";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { TableSkeleton } from "@/components/ui/Skeleton";
import {
  ActivePill,
  EmptyState,
  ErrorAlert,
  PageCard,
  Pagination,
  SubscriptionPill,
  formatDay,
} from "@/components/admin/AdminUI";
import OrganizationFormModal from "@/components/admin/OrganizationFormModal";
import useOrganizationActions from "@/components/admin/useOrganizationActions";
import useResource from "@/hooks/superadmin/useResource";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 20;
const results = (page) => (Array.isArray(page) ? page : page?.results || []);

/** A school's subscription: from the org itself, else from billing's list. */
export function subscriptionOf(org, billingById = {}) {
  if (org?.subscription) return org.subscription;
  const row = billingById[org?.id];
  return row ? { state: row.state, plan_name: row.plan_name || null, expires_at: row.expires_at } : null;
}

export default function Organizations() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(params.get("new") === "1");
  const query = useDebouncedValue(search.trim(), 350);

  useEffect(() => setPage(1), [query, status]);

  const list = useResource(
    async () =>
      asPage(
        await superAdminApi.organizations({
          page,
          page_size: PAGE_SIZE,
          search: query || undefined,
          is_active: status || undefined,
        })
      ),
    [page, query, status]
  );

  // Subscription state per school (until the org list carries it itself).
  const billing = useResource(async () => {
    try {
      return results(await superBillingApi.schools({ page_size: 200 }));
    } catch {
      return [];
    }
  }, []);
  const billingById = useMemo(
    () => Object.fromEntries((billing.data || []).map((row) => [row.organization_id, row])),
    [billing.data]
  );

  const reload = () => {
    list.reload();
    billing.reload();
  };
  const actions = useOrganizationActions({ onChanged: reload });

  const closeCreate = () => {
    setCreating(false);
    if (params.get("new")) {
      params.delete("new");
      setParams(params, { replace: true });
    }
  };

  const items = list.data?.items || [];
  const total = list.data?.total || 0;
  const firstLoad = list.loading && !list.data;

  return (
    <div className="space-y-5">
      <PageCard
        title="Organizations"
        icon={Building2}
        description="Every school on the platform. Open a school's menu to edit it, manage it as its admin, or handle its subscription."
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add school
          </button>
        }
      >
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="organization-search" className="sr-only">Search schools</label>
            <input
              id="organization-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <label htmlFor="organization-status" className="sr-only">Status</label>
          <select
            id="organization-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            type="button"
            onClick={reload}
            disabled={list.loading}
            aria-label="Refresh schools"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 sm:ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${list.loading ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </PageCard>

      <ErrorAlert message={list.error && apiErrorDetails(list.error).messages.join(" ")} onRetry={list.reload} />

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {firstLoad ? (
          <TableSkeleton columns={7} label="Loading schools" />
        ) : !items.length ? (
          <EmptyState icon={Building2} title={query || status ? "No schools match" : "No schools yet"}>
            {query || status ? "Try a different search." : "Add a school or invite one from Subscriptions."}
          </EmptyState>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${list.loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3">School</th>
                  <th scope="col" className="px-3 py-3 text-right">Students</th>
                  <th scope="col" className="px-3 py-3 text-right">Teachers</th>
                  <th scope="col" className="px-5 py-3">Subscription</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3">Created</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((org) => {
                  const counts = orgCounts(org);
                  const sub = subscriptionOf(org, billingById);
                  return (
                    <tr key={org.id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <Link to={`/admin-dashboard/organizations/${org.id}`} className="font-medium text-gray-900 hover:text-blue-700 hover:underline">
                          {org.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {org.code}
                          {org.organization_type ? ` · ${org.organization_type[0].toUpperCase()}${org.organization_type.slice(1)}` : ""}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{counts.students ?? "—"}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{counts.teachers ?? "—"}</td>
                      <td className="px-5 py-3">
                        {sub ? (
                          <div className="space-y-0.5">
                            <SubscriptionPill state={sub.state} />
                            <p className="text-xs text-gray-500">
                              {[sub.plan_name, sub.expires_at && `ends ${formatDay(sub.expires_at)}`].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        ) : billing.loading ? (
                          <span className="inline-block h-4 w-16 animate-pulse rounded bg-slate-200" aria-hidden="true" />
                        ) : (
                          <SubscriptionPill state="none" />
                        )}
                      </td>
                      <td className="px-3 py-3"><ActivePill active={org.is_active} /></td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-600">{formatDay(org.created_at)}</td>
                      <td className="px-3 py-3 text-right">
                        <ActionsMenu label={`Actions for ${org.name}`} items={actions.itemsFor({ ...org, subscription: sub })} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPage={setPage} disabled={list.loading} />
      </section>

      {creating && (
        <OrganizationFormModal
          onClose={closeCreate}
          onSaved={(org) => {
            closeCreate();
            toast(`${org?.name || "School"} created.`);
            reload();
          }}
        />
      )}
      {actions.dialogs}
    </div>
  );
}
