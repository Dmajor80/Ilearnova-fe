import { useEffect, useState } from "react";
import { superBillingApi } from "@/api/billingApi";
import { superAdminApi } from "@/api/superAdminApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { naira, planLength } from "@/features/billing/subscriptionUtils";
import Modal, { Button } from "@/components/ui/Modal";
import { Field } from "./AdminUI";
import { Skeleton } from "@/components/ui/Skeleton";

const results = (page) => (Array.isArray(page) ? page : page?.results || []);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROUTES = [
  {
    id: "extend",
    label: "Extend now",
    help: "Adds the time straight away. Use it when they have already paid you, e.g. by bank transfer. The new period starts when the current one ends.",
  },
  {
    id: "code",
    label: "Email them a code",
    help: "We email an access code with a link. They apply it on their Billing page, and the time is added then. Use it when you want them to confirm, or to pass the code on.",
  },
];

/**
 * Manage a school's subscription: extend it now (e.g. after a bank
 * transfer) or email the school an access code to apply themselves.
 * `school`: { organization_id, organization_name, state? }. Loads plans
 * itself unless `plans` is given.
 */
export default function RenewSubscriptionDialog({ school, plans: givenPlans, onClose, onDone }) {
  const [plans, setPlans] = useState(givenPlans || null);
  const [plan, setPlan] = useState(givenPlans?.[0]?.code || "");
  const [days, setDays] = useState("");
  const [notes, setNotes] = useState("");
  const [route, setRoute] = useState("extend");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const granting = school?.state === "unmanaged" || school?.state === "none";
  const emailing = route === "code";

  // Prefill the recipient with the school's admin (editable).
  useEffect(() => {
    let live = true;
    superAdminApi
      .organization(school.organization_id)
      .then((org) => {
        const admin = (Array.isArray(org?.admins) ? org.admins : []).find((a) => a?.email && a.is_active !== false);
        if (live && admin) setEmail((current) => current || admin.email);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [school.organization_id]);

  useEffect(() => {
    if (givenPlans) return;
    let live = true;
    superBillingApi
      .plans({ page_size: 100 })
      .then((page) => {
        if (!live) return;
        const active = results(page).filter((p) => p.is_active !== false);
        setPlans(active);
        setPlan((current) => current || active[0]?.code || "");
      })
      .catch(() => live && setPlans([]));
    return () => {
      live = false;
    };
  }, [givenPlans]);

  const length = {
    ...(plan ? { plan } : {}),
    ...(days ? { duration_days: Number(days) } : {}),
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      if (emailing) {
        const to = email.trim();
        await superBillingApi.invite({
          organization: school.organization_id,
          issued_to: to,
          school_name: school.organization_name,
          note: notes,
          ...length,
        });
        onDone?.(`Access code emailed to ${to}. It's listed under Access codes.`);
      } else {
        await superBillingApi.grant({ organization: school.organization_id, ...length, notes });
        onDone?.(`${school.organization_name} ${granting ? "now has a subscription" : "renewed"}.`);
      }
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
      setBusy(false);
    }
  };

  const ready = plans && (plan || days) && (!emailing || EMAIL_RE.test(email.trim()));

  return (
    <Modal
      open
      onClose={onClose}
      closeDisabled={busy}
      size="sm"
      title={`${granting ? "Grant a subscription to" : "Renew"} ${school.organization_name}`}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" loading={busy} disabled={!ready} onClick={save}>
            {emailing ? "Email code" : granting ? "Grant subscription" : "Renew"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-gray-700">How</legend>
          {ROUTES.map((r) => (
            <label
              key={r.id}
              className={`flex cursor-pointer gap-3 rounded-lg border p-3 ${route === r.id ? "border-blue-500 bg-blue-50/60" : "border-gray-200 hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="renew-route"
                value={r.id}
                checked={route === r.id}
                onChange={() => setRoute(r.id)}
                aria-labelledby={`renew-route-${r.id}-label`}
                aria-describedby={`renew-route-${r.id}`}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span id={`renew-route-${r.id}-label`} className="block text-sm font-medium text-gray-900">{r.label}</span>
                <span id={`renew-route-${r.id}`} className="block text-xs text-gray-600">{r.help}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {emailing && (
          <Field label="Send the code to" hint="Prefilled with the school's admin. Change it if someone else handles billing.">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.ng" />
          </Field>
        )}
        {!plans ? (
          <div role="status" aria-label="Loading plans" className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <Field label="Plan">
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="">No plan (set days)</option>
              {plans.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} · {naira(p.amount)} · {planLength(p.duration_days)}
                </option>
              ))}
            </select>
          </Field>
        )}
        {!plan && (
          <Field label="Days" hint="How long the subscription runs.">
            <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} />
          </Field>
        )}
        <Field label="Note">
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Paid by transfer, ref 123" />
        </Field>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </Modal>
  );
}
