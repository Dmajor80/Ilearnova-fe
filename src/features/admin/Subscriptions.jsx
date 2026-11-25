import { useCallback, useEffect, useState } from "react";
import { Ban, RefreshCw, Send } from "lucide-react";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { formatDate, naira, planLength } from "@/features/billing/subscriptionUtils";

const STATES = ["active", "expiring", "grace", "read_only", "locked", "unmanaged"];
const STATE_STYLE = {
  active: "bg-green-100 text-green-800",
  expiring: "bg-blue-100 text-blue-800",
  grace: "bg-amber-100 text-amber-800",
  read_only: "bg-red-100 text-red-800",
  locked: "bg-red-100 text-red-800",
  unmanaged: "bg-gray-100 text-gray-700",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const results = (page) => (Array.isArray(page) ? page : page?.results || []);

function Notice({ message }) {
  if (!message) return null;
  return (
    <p role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
      {message.text}
    </p>
  );
}

const fail = (err) => ({ type: "error", text: apiErrorDetails(err).messages.join(" ") });

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

/* ---------------------------------------------------------------- Schools */

function RenewDialog({ school, plans, onClose, onDone }) {
  const [plan, setPlan] = useState(plans[0]?.code || "");
  const [days, setDays] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const save = async () => {
    setBusy(true);
    try {
      await superBillingApi.grant({
        organization: school.organization_id,
        ...(plan ? { plan } : {}),
        ...(days ? { duration_days: Number(days) } : {}),
        notes,
      });
      onDone(`${school.organization_name} renewed.`);
    } catch (err) {
      setMessage(fail(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="renew-title" className="w-full max-w-md space-y-3 rounded-xl bg-white p-6 shadow-xl">
        <h3 id="renew-title" className="text-lg font-semibold">Renew {school.organization_name}</h3>
        <p className="text-sm text-gray-600">E.g. after a bank transfer. The new period starts when the current one ends.</p>
        <PlanSelect plans={plans} value={plan} onChange={setPlan} />
        {!plan && (
          <label className="block text-sm font-medium text-gray-700">
            Days
            <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        )}
        <label className="block text-sm font-medium text-gray-700">
          Note
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Paid by transfer, ref 123" className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <Notice message={message} />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
          <button type="button" disabled={busy || (!plan && !days)} onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Renew</button>
        </div>
      </section>
    </div>
  );
}

function SchoolsTab({ plans }) {
  const [state, setState] = useState("");
  const [rows, setRows] = useState([]);
  const [renewing, setRenewing] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(() => {
    superBillingApi
      .schools({ state, page_size: 100 })
      .then((page) => setRows(results(page)))
      .catch((err) => setMessage(fail(err)));
  }, [state]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <label className="text-sm font-medium text-gray-700">
          State
          <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 block rounded-lg border px-3 py-2">
            <option value="">All</option>
            {STATES.map((s) => <option key={s} value={s}>{s.replace("_", "-")}</option>)}
          </select>
        </label>
        <button type="button" onClick={load} aria-label="Reload schools" className="rounded-lg border p-2 hover:bg-gray-50"><RefreshCw className="h-4 w-4" /></button>
      </div>
      <Notice message={message} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">School</th>
              <th scope="col" className="px-3 py-2 text-left">State</th>
              <th scope="col" className="px-3 py-2 text-left">Ends</th>
              <th scope="col" className="px-3 py-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.organization_id}>
                <td className="px-3 py-2 font-medium">{r.organization_name}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATE_STYLE[r.state] || ""}`}>{r.state.replace("_", "-")}</span>
                </td>
                <td className="px-3 py-2">{r.expires_at ? formatDate(r.expires_at) : "—"}</td>
                <td className="px-3 py-2 text-right">
                  <button type="button" onClick={() => setRenewing(r)} className="text-xs font-medium text-blue-700 hover:underline">
                    {r.state === "unmanaged" ? "Grant subscription" : "Renew"}
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={4} className="py-6 text-center text-gray-500">No schools.</td></tr>}
          </tbody>
        </table>
      </div>
      {renewing && (
        <RenewDialog
          school={renewing}
          plans={plans}
          onClose={() => setRenewing(null)}
          onDone={(text) => {
            setRenewing(null);
            setMessage({ type: "success", text });
            load();
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
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState(null);

  const load = useCallback(() => {
    superBillingApi
      .codes({ redeemed: filter || undefined, search: search || undefined })
      .then((page) => setRows(results(page)))
      .catch((err) => setMessage(fail(err)));
  }, [filter, search]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const act = async (fn, text) => {
    try {
      await fn();
      setMessage({ type: "success", text });
      load();
    } catch (err) {
      setMessage(fail(err));
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
      <Notice message={message} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">Code</th>
              <th scope="col" className="px-3 py-2 text-left">Sent to</th>
              <th scope="col" className="px-3 py-2 text-left">Plan</th>
              <th scope="col" className="px-3 py-2 text-left">Status</th>
              <th scope="col" className="px-3 py-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-3 py-2 font-mono text-xs">{c.code}</td>
                <td className="px-3 py-2">
                  {c.issued_to || "—"}
                  {c.email_locked && <span className="ml-1 text-xs text-gray-500">(locked)</span>}
                  {c.school_name && <span className="block text-xs text-gray-500">{c.school_name}</span>}
                </td>
                <td className="px-3 py-2">{c.plan || "—"}</td>
                <td className="px-3 py-2 text-xs">
                  {c.redeemed_at ? `Used by ${c.redeemed_by_email} on ${formatDate(c.redeemed_at)}` : c.is_redeemable ? "Unused" : "Deactivated or expired"}
                  {c.payment_reference && <span className="block text-gray-500">Paid · {c.payment_reference}</span>}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  {c.is_redeemable && (
                    <span className="inline-flex gap-3">
                      {c.issued_to && (
                        <button type="button" onClick={() => act(() => superBillingApi.sendCode(c.id), `Code re-sent to ${c.issued_to}.`)} className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline">
                          <Send className="h-3 w-3" /> Resend
                        </button>
                      )}
                      <button type="button" onClick={() => act(() => superBillingApi.deactivateCode(c.id), `${c.code} deactivated.`)} className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline">
                        <Ban className="h-3 w-3" /> Deactivate
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={5} className="py-6 text-center text-gray-500">No codes.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Plans */

function PlansTab({ plans, onChanged }) {
  const [form, setForm] = useState({ name: "", code: "", amount: "", duration_days: "", description: "" });
  const [message, setMessage] = useState(null);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const create = async (event) => {
    event.preventDefault();
    try {
      await superBillingApi.createPlan({
        ...form,
        code: form.code.trim().toLowerCase(),
        duration_days: form.duration_days ? Number(form.duration_days) : null,
      });
      setForm({ name: "", code: "", amount: "", duration_days: "", description: "" });
      setMessage({ type: "success", text: "Plan created." });
      onChanged();
    } catch (err) {
      setMessage(fail(err));
    }
  };

  const remove = async (plan) => {
    try {
      await superBillingApi.deactivatePlan(plan.id);
      setMessage({ type: "success", text: `${plan.name} is no longer on sale.` });
      onChanged();
    } catch (err) {
      setMessage(fail(err));
    }
  };

  return (
    <div className="space-y-4">
      <Notice message={message} />
      <ul className="divide-y rounded-lg border">
        {plans.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <span>
              <span className="font-medium">{p.name}</span> <span className="text-gray-500">({p.code})</span> · {naira(p.amount)} · {planLength(p.duration_days)}
            </span>
            <button type="button" onClick={() => remove(p)} className="text-xs text-red-700 hover:underline">Stop selling</button>
          </li>
        ))}
        {!plans.length && <li className="p-3 text-sm text-gray-500">No plans yet.</li>}
      </ul>
      <form onSubmit={create} className="grid max-w-xl gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">Name<input value={form.name} onChange={set("name")} placeholder="Annual" className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700">Code<input value={form.code} onChange={set("code")} placeholder="annual" className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700">Price (₦)<input type="number" min="0" value={form.amount} onChange={set("amount")} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700">Days (blank = no end)<input type="number" min="1" value={form.duration_days} onChange={set("duration_days")} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <label className="text-sm font-medium text-gray-700 sm:col-span-2">Description<input value={form.description} onChange={set("description")} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={!form.name || !form.code || form.amount === ""} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Add plan</button>
        </div>
      </form>
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
  const [tab, setTab] = useState("schools");
  const [plans, setPlans] = useState([]);
  const [codesKey, setCodesKey] = useState(0);

  const loadPlans = useCallback(() => {
    superBillingApi
      .plans({ page_size: 100 })
      .then((page) => setPlans(results(page).filter((p) => p.is_active)))
      .catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-600">Onboard schools and keep their subscriptions running.</p>
      </header>
      <div role="tablist" className="flex flex-wrap gap-2 border-b">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === id ? "border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:text-gray-900"}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === "schools" && <SchoolsTab plans={plans} />}
      {tab === "invite" && <InviteTab plans={plans} onInvited={() => setCodesKey((k) => k + 1)} />}
      {tab === "codes" && <CodesTab refreshKey={codesKey} />}
      {tab === "plans" && <PlansTab plans={plans} onChanged={loadPlans} />}
    </section>
  );
}
