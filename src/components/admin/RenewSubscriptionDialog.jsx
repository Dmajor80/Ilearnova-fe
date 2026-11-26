import { useEffect, useState } from "react";
import { superBillingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { naira, planLength } from "@/features/billing/subscriptionUtils";
import Modal, { Button } from "@/components/ui/Modal";
import { Field } from "./AdminUI";
import { Skeleton } from "@/components/ui/Skeleton";

const results = (page) => (Array.isArray(page) ? page : page?.results || []);

/**
 * Grant or renew a school's subscription (e.g. after a bank transfer).
 * `school`: { organization_id, organization_name, state? }. Loads plans
 * itself unless `plans` is given.
 */
export default function RenewSubscriptionDialog({ school, plans: givenPlans, onClose, onDone }) {
  const [plans, setPlans] = useState(givenPlans || null);
  const [plan, setPlan] = useState(givenPlans?.[0]?.code || "");
  const [days, setDays] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const granting = school?.state === "unmanaged" || school?.state === "none";

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

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      await superBillingApi.grant({
        organization: school.organization_id,
        ...(plan ? { plan } : {}),
        ...(days ? { duration_days: Number(days) } : {}),
        notes,
      });
      onDone?.(`${school.organization_name} ${granting ? "now has a subscription" : "renewed"}.`);
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      closeDisabled={busy}
      size="sm"
      title={`${granting ? "Grant a subscription to" : "Renew"} ${school.organization_name}`}
      description="E.g. after a bank transfer. The new period starts when the current one ends."
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" loading={busy} disabled={!plans || (!plan && !days)} onClick={save}>
            {granting ? "Grant subscription" : "Renew"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
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
