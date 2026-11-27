import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Download,
  Eye,
  KeyRound,
  Pencil,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";
import { asPage, fetchAll, superAdminApi, userFullName } from "@/api/superAdminApi";
import { getStoredUser } from "@/api/auth";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { downloadCsv } from "@/lib/csv";
import { ASSIGNABLE_ROLES } from "@/lib/roles";
import { toast } from "@/lib/toast";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DeleteDialog from "@/components/ui/DeleteDialog";
import { InitialsAvatar } from "@/components/ui/Avatar";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ActivePill, EmptyState, ErrorAlert, PageCard, Pagination, Pill, formatDay } from "@/components/admin/AdminUI";
import { BulkDeleteDialog, RowCheckbox, SelectPageCheckbox, SelectionBar } from "@/components/admin/BulkSelect";
import useSelection from "@/hooks/superadmin/useSelection";
import { UserDetailModal, UserEditModal, UserRolesModal, userRoleLabels, userSchools } from "@/components/admin/UserModals";
import useResource from "@/hooks/superadmin/useResource";
import useDebouncedValue from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 20;

const CSV_COLUMNS = [
  { header: "Name", value: (u) => userFullName(u) },
  { header: "Email", value: (u) => u.email },
  { header: "Username", value: (u) => u.username },
  { header: "Roles", value: (u) => userRoleLabels(u).join("; ") },
  { header: "Schools", value: (u) => userSchools(u).join("; ") },
  { header: "Status", value: (u) => (u.is_active ? "Active" : "Inactive") },
  { header: "Verified", value: (u) => (u.is_verified ? "Yes" : "No") },
  { header: "Joined", value: (u) => (u.date_joined || u.created_at || "").slice(0, 10) },
  { header: "Last sign-in", value: (u) => (u.last_login || "").slice(0, 10) },
];

const errorText = (err) => apiErrorDetails(err).messages.join(" ");

/** The signed-in superadmin themselves (never deletable from here). */
const isMe = (user) => {
  const me = getStoredUser();
  const myId = me?.id ?? me?.user_id ?? me?.user?.id;
  if (myId != null && String(myId) === String(user.id)) return true;
  const myEmail = me?.email ?? me?.user?.email;
  return Boolean(myEmail && user.email && myEmail.toLowerCase() === user.email.toLowerCase());
};

/** Superusers and yourself can only be deactivated, never deleted here. */
const canOfferDelete = (user) => !user.is_superuser && !isMe(user);

export default function Users() {
  const [params, setParams] = useSearchParams();
  const organizationId = params.get("organization_id") || "";
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(params.get("role") || "");
  const [status, setStatus] = useState("");
  const query = useDebouncedValue(search.trim(), 300);
  const filters = {
    search: query || undefined,
    role: role || undefined,
    organization_id: organizationId || undefined,
    is_active: status || undefined,
  };
  const filtersKey = JSON.stringify(filters);
  // The page resets to 1 whenever the filters change.
  const [pageState, setPageState] = useState({ key: filtersKey, page: 1 });
  const page = pageState.key === filtersKey ? pageState.page : 1;
  const setPage = (next) => setPageState({ key: filtersKey, page: next });

  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [rolesFor, setRolesFor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const selection = useSelection(filtersKey);

  const list = useResource(async () => {
    const result = asPage(await superAdminApi.users({ ...filters, page, page_size: PAGE_SIZE }));
    if (!result.paginated) {
      // Unpaginated API: page through the array here.
      return { ...result, items: result.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
    }
    return result;
  }, [filtersKey, page]);

  const organizations = useResource(async () => {
    try {
      return await fetchAll(superAdminApi.organizations, { page_size: 100 });
    } catch {
      return [];
    }
  }, []);

  const setSchool = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set("organization_id", value);
    else next.delete("organization_id");
    setParams(next, { replace: true });
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const rows = await fetchAll(superAdminApi.users, { ...filters, page_size: 100 });
      const school = organizations.data?.find((o) => String(o.id) === organizationId);
      const slug = school ? `-${school.code || school.name}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-") : "";
      downloadCsv(`users${slug}-${new Date().toISOString().slice(0, 10)}.csv`, rows, CSV_COLUMNS);
      toast(`Exported ${rows.length} user${rows.length === 1 ? "" : "s"}.`);
    } catch (err) {
      toast(`Export failed: ${errorText(err)}`, "error");
    } finally {
      setExporting(false);
    }
  };

  const confirmAction = (user, kind) => {
    const name = userFullName(user);
    const configs = {
      reset: {
        title: `Send a password reset to ${name}?`,
        message: `We'll email ${user.email} a link to choose a new password. Their current password keeps working until they do.`,
        confirmLabel: "Send reset email",
        run: () => superAdminApi.resetUserPassword(user.id),
        done: `Password reset sent to ${user.email}.`,
      },
      deactivate: {
        title: `Deactivate ${name}?`,
        message: "They won't be able to sign in until you activate them again. Nothing is deleted.",
        confirmLabel: "Deactivate",
        variant: "danger",
        run: () => superAdminApi.deactivateUser(user.id),
        done: `${name} deactivated.`,
      },
      activate: {
        title: `Activate ${name}?`,
        message: "They'll be able to sign in again.",
        confirmLabel: "Activate",
        run: () => superAdminApi.activateUser(user.id),
        done: `${name} activated.`,
      },
    };
    const config = configs[kind];
    setConfirm({
      ...config,
      action: async () => {
        try {
          await config.run();
        } catch (err) {
          throw new Error(errorText(err));
        }
        toast(config.done);
        if (kind !== "reset") list.reload();
      },
    });
  };

  const itemsFor = (user) => [
    { id: "view", label: "View", icon: Eye, onSelect: () => setViewing(user) },
    { id: "edit", label: "Edit", icon: Pencil, onSelect: () => setEditing(user) },
    { id: "roles", label: "Change role / add to school", icon: ShieldCheck, onSelect: () => setRolesFor(user) },
    { id: "reset", label: "Send password reset", icon: KeyRound, disabled: !user.email, onSelect: () => confirmAction(user, "reset") },
    user.is_active
      ? { id: "deactivate", label: "Deactivate", icon: PowerOff, danger: true, separatorBefore: true, hidden: user.is_superuser, onSelect: () => confirmAction(user, "deactivate") }
      : { id: "activate", label: "Activate", icon: Power, separatorBefore: true, onSelect: () => confirmAction(user, "activate") },
    {
      id: "delete",
      label: "Delete permanently…",
      icon: Trash2,
      danger: true,
      separatorBefore: true,
      hidden: !canOfferDelete(user),
      onSelect: () => setDeleting(user),
    },
  ];

  const items = list.data?.items || [];
  const total = list.data?.total || 0;
  const pageIds = items.map((u) => String(u.id));
  const filtered = Boolean(query || role || organizationId || status);
  const selectClass = "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

  return (
    <div className="space-y-5">
      <PageCard
        title="Users"
        icon={UsersIcon}
        description="Everyone on the platform, across all schools."
        actions={
          <>
            <button
              type="button"
              onClick={exportCsv}
              disabled={exporting || !total}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> {exporting ? "Exporting…" : "Export CSV"}
            </button>
            <Link
              to={`/admin-dashboard/users/new-user${organizationId ? `?organization_id=${organizationId}` : ""}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" /> Add user
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-end">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="user-search" className="sr-only">Search users</label>
            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email or username"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <label className="text-xs font-medium text-gray-500">
              <span className="mb-1 block">School</span>
              <select aria-label="School" value={organizationId} onChange={(e) => setSchool(e.target.value)} className={`${selectClass} w-full lg:w-52`}>
                <option value="">All schools</option>
                {(organizations.data || []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                {organizationId && organizations.data && !organizations.data.some((o) => String(o.id) === organizationId) && (
                  <option value={organizationId}>Selected school</option>
                )}
              </select>
            </label>
            <label className="text-xs font-medium text-gray-500">
              <span className="mb-1 block">Role</span>
              <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value)} className={`${selectClass} w-full lg:w-44`}>
                <option value="">All roles</option>
                {ASSIGNABLE_ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-gray-500">
              <span className="mb-1 block">Status</span>
              <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectClass} w-full lg:w-36`}>
                <option value="">Any status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={list.reload}
            disabled={list.loading}
            aria-label="Refresh users"
            className="inline-flex h-10 w-10 items-center justify-center self-end rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 lg:ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${list.loading ? "animate-spin" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </PageCard>

      <ErrorAlert message={list.error && errorText(list.error)} onRetry={list.reload} />

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 text-sm text-gray-500">
          <span aria-live="polite">{list.data ? `${total} user${total === 1 ? "" : "s"}${filtered ? " match" : ""}` : " "}</span>
        </div>
        <SelectionBar
          selection={selection}
          pageIds={pageIds}
          total={total}
          noun="user"
          loadAllIds={() => superAdminApi.ids("users", filters)}
          onDelete={() => setBulkDeleting(true)}
        />
        {list.loading && !list.data ? (
          <TableSkeleton columns={7} label="Loading users" />
        ) : !items.length ? (
          <EmptyState icon={UsersIcon} title={filtered ? "No users match these filters" : "No users yet"}>
            {filtered ? "Try clearing a filter." : "Add the first one with “Add user”."}
          </EmptyState>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${list.loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="w-10 py-3 pl-5 pr-0">
                    <SelectPageCheckbox selection={selection} pageIds={pageIds} label="Select all users on this page" />
                  </th>
                  <th scope="col" className="px-5 py-3">User</th>
                  <th scope="col" className="px-3 py-3">School</th>
                  <th scope="col" className="px-3 py-3">Role</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3">Joined</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((user) => {
                  const name = userFullName(user);
                  const schools = userSchools(user);
                  const roles = userRoleLabels(user);
                  return (
                    <tr key={user.id} className={selection.has(user.id) ? "bg-blue-50/60" : "hover:bg-gray-50/60"}>
                      <td className="w-10 py-3 pl-5 pr-0">
                        <RowCheckbox selection={selection} id={user.id} label={`Select ${name}`} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={name} size="h-9 w-9" />
                          <div className="min-w-0">
                            <button type="button" onClick={() => setViewing(user)} className="truncate text-left font-medium text-gray-900 hover:text-blue-700 hover:underline">
                              {name}
                            </button>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[14rem] px-3 py-3 text-gray-700">
                        {schools.length ? (
                          <span title={schools.join(", ")} className="block truncate">
                            {schools[0]}
                            {schools.length > 1 && <span className="text-gray-500"> +{schools.length - 1}</span>}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {roles.length ? roles.map((label) => <Pill key={label} tone={label === "Platform admin" ? "blue" : "gray"}>{label}</Pill>) : <span className="text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          <ActivePill active={user.is_active} />
                          {user.is_verified === false && <Pill tone="amber">Unverified</Pill>}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-gray-600">{formatDay(user.date_joined || user.created_at)}</td>
                      <td className="px-3 py-3 text-right">
                        <ActionsMenu label={`Actions for ${name}`} items={itemsFor(user)} />
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

      {viewing && (
        <UserDetailModal
          user={viewing}
          onClose={() => setViewing(null)}
          onDelete={
            canOfferDelete(viewing)
              ? () => {
                  setDeleting(viewing);
                  setViewing(null);
                }
              : undefined
          }
        />
      )}
      <DeleteDialog
        open={Boolean(deleting)}
        title={deleting ? `Delete ${userFullName(deleting)} permanently?` : ""}
        message="Their account, school roles and everything they submitted (assignments, exam attempts, attendance…) will be removed."
        confirmText={deleting?.email || deleting?.username}
        loadCheck={deleting ? () => superAdminApi.userDeleteCheck(deleting.id) : undefined}
        onDelete={() => superAdminApi.deleteUser(deleting.id)}
        onDeactivate={
          deleting?.is_active
            ? async () => {
                await superAdminApi.deactivateUser(deleting.id);
                toast(`${userFullName(deleting)} deactivated.`);
                list.reload();
              }
            : undefined
        }
        onDeleted={() => {
          toast(`${userFullName(deleting)} was deleted.`);
          list.reload();
        }}
        onClose={() => setDeleting(null)}
      />
      <BulkDeleteDialog
        open={bulkDeleting}
        resource="users"
        ids={[...selection.ids]}
        noun="user"
        warning="Each account goes with its school roles and everything it submitted. Users with payments, your own account and the last superuser are kept."
        onClose={() => setBulkDeleting(false)}
        onDone={(done) => {
          if (done.deleted.length) toast(`${done.deleted.length} user${done.deleted.length === 1 ? "" : "s"} deleted.`);
          selection.set(done.skipped.map((s) => s.id));
          list.reload();
        }}
      />
      {editing && (
        <UserEditModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            list.reload();
          }}
        />
      )}
      {rolesFor && (
        <UserRolesModal user={rolesFor} organizations={organizations.data} onClose={() => setRolesFor(null)} onChanged={list.reload} />
      )}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        onConfirm={confirm?.action}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
