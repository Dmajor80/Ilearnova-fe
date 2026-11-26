import { useState } from "react";
import Modal, { Button } from "@/components/ui/Modal";
import { superBillingApi } from "@/api/billingApi";
import { fieldErrorsOf } from "@/lib/apiHelpers";
import { naira, planLength } from "@/features/billing/subscriptionUtils";
import { Field } from "./AdminUI";

export const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

/** Create (no `plan`) or edit a subscription plan. */
export default function PlanFormModal({ plan, onClose, onSaved }) {
  const editing = Boolean(plan);
  const [form, setForm] = useState({
    name: plan?.name || "",
    code: plan?.code || "",
    amount: plan ? String(Number(plan.amount)) : "",
    duration_days: plan?.duration_days ? String(plan.duration_days) : "",
    description: plan?.description || "",
  });
  const [codeTouched, setCodeTouched] = useState(editing);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const setName = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, code: codeTouched ? f.code : slugify(name) }));
  };
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const problems = {};
    if (!form.name.trim()) problems.name = "Give the plan a name.";
    if (!/^[a-z0-9-_]+$/.test(form.code)) problems.code = "Lowercase letters, digits and dashes only.";
    if (form.amount === "" || Number(form.amount) < 0 || Number.isNaN(Number(form.amount))) problems.amount = "Enter a price of ₦0 or more.";
    if (form.duration_days && (!Number.isInteger(Number(form.duration_days)) || Number(form.duration_days) < 1)) problems.duration_days = "Whole days, 1 or more.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    const body = {
      name: form.name.trim(),
      code: form.code,
      amount: String(form.amount),
      duration_days: form.duration_days ? Number(form.duration_days) : null,
      description: form.description.trim(),
    };
    try {
      const saved = editing ? await superBillingApi.updatePlan(plan.id, body) : await superBillingApi.createPlan(body);
      onSaved?.(saved || body);
    } catch (err) {
      setErrors(fieldErrorsOf(err));
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      closeDisabled={busy}
      title={editing ? `Edit ${plan.name}` : "Create plan"}
      description="Schools see active plans with a price above ₦0 on the pricing and billing pages."
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" type="submit" form="plan-form" loading={busy}>{editing ? "Save plan" : "Create plan"}</Button>
        </>
      }
    >
      <form id="plan-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input value={form.name} onChange={setName} placeholder="School annual" />
        </Field>
        <Field label="Code" required error={errors.code} hint={editing ? "Codes can't change once schools use them." : "Made from the name; edit if you like."}>
          <input
            value={form.code}
            disabled={editing}
            onChange={(e) => {
              setCodeTouched(true);
              setForm((f) => ({ ...f, code: slugify(e.target.value) || e.target.value.toLowerCase() }));
            }}
          />
        </Field>
        <Field label="Price (₦)" required error={errors.amount} hint={form.amount !== "" && !errors.amount ? naira(form.amount) : undefined}>
          <input type="number" min="0" step="any" inputMode="decimal" value={form.amount} onChange={set("amount")} />
        </Field>
        <Field label="Length in days" error={errors.duration_days} hint={form.duration_days ? planLength(Number(form.duration_days)) : "Blank = no end date"}>
          <input type="number" min="1" value={form.duration_days} onChange={set("duration_days")} />
        </Field>
        <Field label="Description" error={errors.description} className="sm:col-span-2">
          <textarea rows={3} value={form.description} onChange={set("description")} placeholder="What the school gets" />
        </Field>
        {errors._general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{errors._general}</p>}
      </form>
    </Modal>
  );
}
