import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Globe,
  LogIn,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";
import { orgCounts, superAdminApi } from "@/api/superAdminApi";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { Skeleton, SkeletonRegion, StatCardsSkeleton } from "@/components/ui/Skeleton";
import { ActivePill, ErrorAlert, PageCard, SubscriptionPill, formatDay } from "@/components/admin/AdminUI";
import useOrganizationActions from "@/components/admin/useOrganizationActions";
import useResource from "@/hooks/superadmin/useResource";
import { subscriptionOf } from "./Organizations";

const results = (page) => (Array.isArray(page) ? page : page?.results || []);

function DetailSkeleton() {
  return (
    <SkeletonRegion label="Loading school" className="space-y-5">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>
      <StatCardsSkeleton count={5} className="xl:grid-cols-5" />
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

function Contact({ icon, label, children }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs text-gray-500">{label}</dt>
        <dd className="break-words text-sm text-gray-900">{children || "—"}</dd>
      </div>
    </div>
  );
}

export default function OrganizationDetail() {
  const { organizationId } = useParams();
  const org = useResource(() => superAdminApi.organization(organizationId), [organizationId]);
  const billing = useResource(async () => {
    try {
      return results(await superBillingApi.schools({ page_size: 200 }));
    } catch {
      return [];
    }
  }, []);
  const reload = () => {
    org.reload();
    billing.reload();
  };
  const actions = useOrganizationActions({ onChanged: reload, showViewDetails: false });

  const billingById = useMemo(
    () => Object.fromEntries((billing.data || []).map((row) => [row.organization_id, row])),
    [billing.data]
  );

  if (org.loading && !org.data) return <DetailSkeleton />;
  if (org.error && !org.data) {
    return (
      <div className="space-y-4">
        <Link to="/admin-dashboard/organizations" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All organizations
        </Link>
        <ErrorAlert message={apiErrorDetails(org.error).messages.join(" ")} onRetry={org.reload} />
      </div>
    );
  }

  const school = org.data || {};
  const counts = orgCounts(school);
  const sub = subscriptionOf(school, billingById);
  const admins = Array.isArray(school.admins) ? school.admins : [];
  const stats = [
    ["Students", counts.students],
    ["Teachers", counts.teachers],
    ["Parents", counts.parents],
    ["Admins", counts.admins ?? (admins.length || null)],
    ["Classes", counts.classes],
  ];

  return (
    <div className="space-y-5">
      <Link to="/admin-dashboard/organizations" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All organizations
      </Link>

      <section className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{school.name}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="font-mono">{school.code}</span>
              {school.organization_type && <span className="capitalize">· {school.organization_type}</span>}
              <ActivePill active={school.is_active} />
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => actions.manage(school)}
            disabled={!school.is_active}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" /> Manage school
          </button>
          <button
            type="button"
            onClick={() => actions.edit(school)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
          </button>
          <ActionsMenu label={`More actions for ${school.name}`} items={actions.itemsFor({ ...school, subscription: sub }).filter((i) => !["edit", "manage"].includes(i.id))} />
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <dt className="text-sm text-gray-500">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-5 lg:grid-cols-2">
        <PageCard title="Subscription" icon={CreditCard}>
          <div className="space-y-4 p-5">
            {sub ? (
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Status</dt>
                  <dd className="mt-1"><SubscriptionPill state={sub.state} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Plan</dt>
                  <dd className="mt-1 text-gray-900">{sub.plan_name || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Ends</dt>
                  <dd className="mt-1 text-gray-900">{sub.expires_at ? formatDay(sub.expires_at) : "No end date"}</dd>
                </div>
              </dl>
            ) : billing.loading ? (
              <Skeleton className="h-10 w-2/3" />
            ) : (
              <p className="text-sm text-gray-600">No subscription on record.</p>
            )}
            <button
              type="button"
              onClick={() => actions.renew({ organization_id: school.id, organization_name: school.name, state: sub?.state })}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              {sub && !["unmanaged", "none"].includes(sub.state) ? "Renew or extend" : "Grant a subscription"}
            </button>
          </div>
        </PageCard>

        <PageCard title="Contact" icon={Mail}>
          <dl className="grid gap-4 p-5 sm:grid-cols-2">
            <Contact icon={Mail} label="Email">{school.email}</Contact>
            <Contact icon={Phone} label="Phone">{school.phone_number}</Contact>
            <Contact icon={Globe} label="Website">{school.website}</Contact>
            <Contact icon={CalendarDays} label="Created">{formatDay(school.created_at)}</Contact>
            <div className="sm:col-span-2">
              <Contact icon={MapPin} label="Address">{school.address}</Contact>
            </div>
          </dl>
          {school.description && <p className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">{school.description}</p>}
        </PageCard>
      </div>

      <PageCard
        title="School admins"
        icon={Users}
        actions={
          <>
            <Link to={`/admin-dashboard/users?organization_id=${school.id}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Users className="h-4 w-4" aria-hidden="true" /> All users
            </Link>
            <Link to={`/admin-dashboard/users/new-user?organization_id=${school.id}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <UserPlus className="h-4 w-4" aria-hidden="true" /> Add user
            </Link>
          </>
        }
      >
        {admins.length ? (
          <ul className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <li key={admin.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{admin.full_name || admin.email}</p>
                  <p className="truncate text-sm text-gray-500">{admin.email}</p>
                </div>
                <ActivePill active={admin.is_active !== false} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-gray-500">
            {"admins" in school ? "This school has no admin yet. Add one with the School admin role." : "Admin details aren't available yet."}
          </p>
        )}
      </PageCard>

      {actions.dialogs}
    </div>
  );
}
