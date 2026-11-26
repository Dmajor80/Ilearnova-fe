import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Ban,
  Copy,
  CreditCard,
  Eye,
  LogIn,
  Pencil,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Send,
} from "lucide-react";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { startManagingSchool } from "@/lib/manageSchool";
import { toast } from "@/lib/toast";
import { formatDate, naira, planLength } from "@/features/billing/subscriptionUtils";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ActivePill, EmptyState, ErrorAlert, Pill, SUBSCRIPTION_STATES, SubscriptionPill } from "@/components/admin/AdminUI";
import RenewSubscriptionDialog from "@/components/admin/RenewSubscriptionDialog";
import PlanFormModal from "@/components/admin/PlanFormModal";
import useResource from "@/hooks/superadmin/useResource";

const STATES = ["active", "expiring", "grace", "read_only", "locked", "unmanaged"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const results = (page) => (Array.isArray(page) ? page : page?.results || []);
const errorText = (err) => apiErrorDetails(err).messages.join(" ");

function Notice({ message }) {
  if (!message) return null;
  return (
    <p role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
      {message.text}
    </p>
  );
}

const fail = (err) => ({ type: "error", text: errorText(err) });

function PlanSelect({ plans, value, onChange, label = "Plan", allowNone = true }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
        {allowNone && <option value="">No plan (set days)</option>}
        {plans.map((p) => (
          <option key={p.code} value={p.code}>{p.name} · {planLength(p.duration_days)}</option>
        ))}
      </select>
    </label>
  );
}

const tableHead = "bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500";

/* ---------------------------------------------------------------- Schools */

function SchoolsTab({ plans }) {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const [renewing, setRenewing] = useState(null);
  const list = useResource(async () => results(await superBillingApi.schools({ state: state || undefined, page_size: 200 })), [state]);
  const rows = list.data || [];

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <label className="text-sm font-medium text-gray-700">
          State
          <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 block rounded-lg border px-3 py-2">
            <option value="">All</option>
            {STATES.map((s) => <option key={s} value={s}>{SUBSCRIPTION_STATES[s][0]}</option>)}
          </select>
        </label>
        <button type="button" onClick={list.reload} disabled={list.loading} aria-label="Reload schools" className="rounded-lg border p-2.5 hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${list.loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      <ErrorAlert message={list.error && errorText(list.error)} onRetry={list.reload} />
      <div className="overflow-hidden rounded-lg border border-gray-100">
        {list.loading && !list.data ? (
          <TableSkeleton columns={4} rows={4} label="Loading schools" />
        ) : !rows.length ? (
          <EmptyState icon={CreditCard} title={state ? "No schools in this state" : "No schools yet"} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className={tableHead}>
                <tr>
                  <th scope="col" className="px-4 py-3">School</th>
                  <th scope="col" className="px-3 py-3">State</th>
                  <th scope="col" className="px-3 py-3">Ends</th>
                  <th scope="col" className="px-3 py-3">Days left</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.organization_id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.organization_name}</td>
                    <td className="px-3 py-3"><SubscriptionPill state={r.state} /></td>
                    <td className="whitespace-nowrap px-3 py-3 text-gray-700">{r.expires_at ? formatDate(r.expires_at) : "—"}</td>
                    <td className="px-3 py-3 tabular-nums text-gray-700">{r.expires_at && r.days_left != null ? r.days_left : "—"}</td>
                    <td className="px-3 py-3 text-right">
                      <ActionsMenu
                        label={`Actions for ${r.organization_name}`}
                        items={[
                          { id: "renew", label: r.state === "unmanaged" ? "Grant subscription" : "Renew", icon: CreditCard, onSelect: () => setRenewing(r) },
                          { id: "view", label: "View school", icon: Eye, onSelect: () => navigate(`/admin-dashboard/organizations/${r.organization_id}`) },
                          {
                            id: "manage",
                            label: "Manage school",
                            icon: LogIn,
                            onSelect: () => {
                              startManagingSchool({ id: r.organization_id, name: r.organization_name });
                              navigate("/organization-dashboard/overview");
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {renewing && (
        <RenewSubscriptionDialog
          school={renewing}
          plans={plans}
          onClose={() => setRenewing(null)}
          onDone={(text) => {
            setRenewing(null);
            toast(text);
            list.reload();
          }}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- Invite */

function InviteTab({ plans, onInvited }) {
  const [mode, setMode] = useState("code");
  const [form, setForm] = useState({ email: "", school_name: "", plan: "", duration_days: "", locked: true, message: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const ready = EMAIL_RE.test(form.email.trim()) && (form.plan || form.duration_days);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const email = form.email.trim();
    const length = {
      ...(form.plan ? { plan: form.plan } : {}),
      ...(form.duration_days ? { duration_days: Number(form.duration_days) } : {}),
    };
    try {
      if (mode === "code") {
        await superBillingApi.invite({
          issued_to: email,
          email_locked: form.locked,
          school_name: form.school_name.trim(),
          message: form.message,
          note: form.school_name.trim(),
          ...length,
        });
        setMessage({ type: "success", text: `Access code emailed to ${email}.` });
      } else {
        await superBillingApi.grant({ email, notes: form.school_name.trim(), ...length });
        setMessage({ type: "success", text: `${email} can now sign up and create a school.` });
      }
      setForm({ ...form, email: "", school_name: "", message: "" });
      onInvited();
    } catch (err) {
      setMessage(fail(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      <fieldset className="flex gap-4 text-sm">
        <legend className="sr-only">How to onboard</legend>
        <label className="flex items-center gap-2"><input type="radio" name="mode" checked={mode === "code"} onChange={() => setMode("code")} /> Email an access code</label>
        <label className="flex items-center gap-2"><input type="radio" name="mode" checked={mode === "grant"} onChange={() => setMode("grant")} /> Grant to an email</label>
      </fieldset>
      <p className="text-sm text-gray-600">
        {mode === "code"
          ? "They get a link to sign up with the code filled in."
          : "No code: signing up with this email is enough. They are emailed a sign-up link."}
      </p>
      <label className="block text-sm font-medium text-gray-700">
        Email of the person setting up the school
        <input type="email" value={form.email} onChange={set("email")} placeholder="principal@sunrise.ng" className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        School name
        <input value={form.school_name} onChange={set("school_name")} placeholder="Sunrise College" className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <PlanSelect plans={plans} value={form.plan} onChange={(plan) => setForm({ ...form, plan })} />
        <label className="text-sm font-medium text-gray-700">
          Days {form.plan && <span className="font-normal text-gray-500">(overrides the plan)</span>}
          <input type="number" min="1" value={form.duration_days} onChange={set("duration_days")} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
      </div>
      {mode === "code" && (
        <>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.locked} onChange={set("locked")} className="h-4 w-4" />
            Only this email can use the code
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Message (added to the email)
            <textarea value={form.message} onChange={set("message")} rows={2} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </>
      )}
      <Notice message={message} />
      <button type="submit" disabled={busy || !ready} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
        <Send className="h-4 w-4" /> {mode === "code" ? "Send invite" : "Grant subscription"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------ Access codes */

function CodesTab({ refreshKey }) {
  const [filter, setFilter] = useState("false");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const list = useResource(
    async () => results(await superBillingApi.codes({ redeemed: filter || undefined, search: search || undefined })),
    [filter, search, refreshKey]
  );
  const rows = list.data || [];

  const ask = (config) =>
    setConfirm({
      ...config,
      action: async () => {
        try {
          await config.run();
        } catch (err) {
          throw new Error(errorText(err));
        }
        toast(config.done);
        list.reload();
      },
    });

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast(`${code} copied.`);
    } catch {
      toast("Couldn't copy; select the code instead.", "error");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium text-gray-700">
          Show
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="mt-1 block rounded-lg border px-3 py-2">
            <option value="false">Not used yet</option>
            <option value="true">Used</option>
            <option value="">All</option>
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Search
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Code, email or note" className="mt-1 block rounded-lg border px-3 py-2" />
        </label>
      </div>
      <ErrorAlert message={list.error && errorText(list.error)} onRetry={list.reload} />
      <div className="overflow-hidden rounded-lg border border-gray-100">
        {list.loading && !list.data ? (
          <TableSkeleton columns={4} rows={4} label="Loading access codes" />
        ) : !rows.length ? (
          <EmptyState icon={Send} title="No codes" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className={tableHead}>
                <tr>
                  <th scope="col" className="px-4 py-3">Code</th>
                  <th scope="col" className="px-3 py-3">Sent to</th>
                  <th scope="col" className="px-3 py-3">Plan</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-mono text-xs">{c.code}</td>
                    <td className="px-3 py-3">
                      {c.issued_to || "—"}
                      {c.email_locked && <span className="ml-1 text-xs text-gray-500">(locked)</span>}
                      {c.school_name && <span className="block text-xs text-gray-500">{c.school_name}</span>}
                    </td>
                    <td className="px-3 py-3">{c.plan || "—"}</td>
                    <td className="px-3 py-3 text-xs">
                      {c.redeemed_at ? (
                        <span className="text-gray-700">Used by {c.redeemed_by_email} on {formatDate(c.redeemed_at)}</span>
                      ) : c.is_redeemable ? (
                        <Pill tone="green">Unused</Pill>
                      ) : (
                        <Pill>Deactivated or expired</Pill>
                      )}
                      {c.payment_reference && <span className="mt-0.5 block text-gray-500">Paid · {c.payment_reference}</span>}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <ActionsMenu
                        label={`Actions for ${c.code}`}
                        items={[
                          { id: "copy", label: "Copy code", icon: Copy, onSelect: () => copy(c.code) },
                          {
                            id: "resend",
                            label: "Resend",
                            icon: Send,
                            hidden: !c.is_redeemable || !c.issued_to,
                            onSelect: () =>
                              ask({
                                title: `Resend ${c.code}?`,
                                message: `We'll email the code and a sign-up link to ${c.issued_to} again.`,
                                confirmLabel: "Resend",
                                run: () => superBillingApi.sendCode(c.id),
                                done: `Code re-sent to ${c.issued_to}.`,
                              }),
                          },
                          {
                            id: "deactivate",
                            label: "Deactivate",
                            icon: Ban,
                            danger: true,
                            separatorBefore: true,
                            hidden: !c.is_redeemable,
                            onSelect: () =>
                              ask({
                                title: `Deactivate ${c.code}?`,
                                message: "Nobody will be able to use this code. This can't be undone; you can send a new one.",
                                confirmLabel: "Deactivate",
                                variant: "danger",
                                run: () => superBillingApi.deactivateCode(c.id),
                                done: `${c.code} deactivated.`,
                              }),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

/* ------------------------------------------------------------------ Plans */

function PlansTab({ plans, loading, error, onChanged, startCreating, onCreateHandled }) {
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(startCreating);
  const [confirm, setConfirm] = useState(null);

  const closeCreate = () => {
    setCreating(false);
    onCreateHandled?.();
  };

  const toggle = (plan) =>
    setConfirm(
      plan.is_active
        ? {
            title: `Stop selling ${plan.name}?`,
            message: "Schools can no longer buy or renew on this plan. Current subscriptions keep running.",
            confirmLabel: "Deactivate",
            variant: "danger",
            run: () => superBillingApi.deactivatePlan(plan.id),
            done: `${plan.name} is no longer on sale.`,
          }
        : {
            title: `Sell ${plan.name} again?`,
            message: "It will show on the pricing and billing pages.",
            confirmLabel: "Reactivate",
            run: () => superBillingApi.updatePlan(plan.id, { is_active: true }),
            done: `${plan.name} is on sale again.`,
          }
    );

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" aria-hidden="true" /> Create plan
        </button>
      </div>
      <ErrorAlert message={error && errorText(error)} onRetry={onChanged} />
      <div className="overflow-hidden rounded-lg border border-gray-100">
        {loading && !plans ? (
          <TableSkeleton columns={5} rows={3} label="Loading plans" />
        ) : !plans?.length ? (
          <EmptyState icon={CreditCard} title="No plans yet">Create one so schools can subscribe.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className={tableHead}>
                <tr>
                  <th scope="col" className="px-4 py-3">Plan</th>
                  <th scope="col" className="px-3 py-3">Code</th>
                  <th scope="col" className="px-3 py-3 text-right">Price</th>
                  <th scope="col" className="px-3 py-3">Length</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plans.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/60 ${p.is_active ? "" : "text-gray-500"}`}>
                    <td className="max-w-xs px-4 py-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      {p.description && <p className="truncate text-xs text-gray-500">{p.description}</p>}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{p.code}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{naira(p.amount)}</td>
                    <td className="px-3 py-3">{planLength(p.duration_days)}</td>
                    <td className="px-3 py-3"><ActivePill active={p.is_active} /></td>
                    <td className="px-3 py-3 text-right">
                      <ActionsMenu
                        label={`Actions for ${p.name}`}
                        items={[
                          { id: "edit", label: "Edit", icon: Pencil, onSelect: () => setEditing(p) },
                          p.is_active
                            ? { id: "deactivate", label: "Deactivate", icon: PowerOff, danger: true, separatorBefore: true, onSelect: () => toggle(p) }
                            : { id: "reactivate", label: "Reactivate", icon: Power, separatorBefore: true, onSelect: () => toggle(p) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(creating || editing) && (
        <PlanFormModal
          plan={editing}
          onClose={() => (editing ? setEditing(null) : closeCreate())}
          onSaved={(saved) => {
            toast(editing ? `${saved?.name || "Plan"} saved.` : `${saved?.name || "Plan"} created.`);
            if (editing) setEditing(null);
            else closeCreate();
            onChanged();
          }}
        />
      )}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        variant={confirm?.variant}
        onConfirm={async () => {
          try {
            await confirm.run();
          } catch (err) {
            throw new Error(errorText(err));
          }
          toast(confirm.done);
          onChanged();
        }}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

const TABS = [
  ["schools", "Schools"],
  ["invite", "Invite a school"],
  ["codes", "Access codes"],
  ["plans", "Plans"],
];

/** Platform owner: onboard schools and manage their subscriptions. */
export default function Subscriptions() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(([id]) => id === params.get("tab")) ? params.get("tab") : "schools";
  const [codesKey, setCodesKey] = useState(0);
  const plansList = useResource(async () => results(await superBillingApi.plans({ page_size: 100 })), []);
  const allPlans = plansList.data;
  const activePlans = (allPlans || []).filter((p) => p.is_active);

  const setTab = (id) => setParams(id === "schools" ? {} : { tab: id }, { replace: true });
  const clearNew = useCallback(() => {
    if (!params.get("new")) return;
    const next = new URLSearchParams(params);
    next.delete("new");
    setParams(next, { replace: true });
  }, [params, setParams]);

  const onTabKey = (event) => {
    const index = TABS.findIndex(([id]) => id === tab);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = TABS[(index + (event.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0];
      setTab(next);
      document.getElementById(`sub-tab-${next}`)?.focus();
    }
  };

  return (
    <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
      <header>
        <h2 className="text-xl font-semibold text-gray-900">Subscriptions</h2>
        <p className="text-sm text-gray-600">Onboard schools and keep their subscriptions running.</p>
      </header>
      <div role="tablist" aria-label="Subscriptions" className="flex flex-wrap gap-2 border-b" onKeyDown={onTabKey}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            id={`sub-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === id ? "border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:text-gray-900"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={`sub-tab-${tab}`}>
        {tab === "schools" && <SchoolsTab plans={allPlans ? activePlans : undefined} />}
        {tab === "invite" && <InviteTab plans={activePlans} onInvited={() => setCodesKey((k) => k + 1)} />}
        {tab === "codes" && <CodesTab refreshKey={codesKey} />}
        {tab === "plans" && (
          <PlansTab
            plans={allPlans}
            loading={plansList.loading}
            error={plansList.error}
            onChanged={plansList.reload}
            startCreating={params.get("new") === "1"}
            onCreateHandled={clearNew}
          />
        )}
      </div>
    </section>
  );
}
