import { useEffect, useState } from "react";
import Modal, { Button } from "@/components/ui/Modal";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { superAdminApi } from "@/api/superAdminApi";
import { fieldErrorsOf } from "@/lib/apiHelpers";
import { Field } from "./AdminUI";

const EMPTY = {
  name: "",
  code: "",
  organization_type: "private",
  email: "",
  phone_number: "",
  address: "",
  description: "",
  website: "",
  established_date: "",
  is_active: true,
};

const OPTIONAL = ["email", "phone_number", "address", "description", "website", "established_date"];
const TYPES = ["public", "private", "charter", "university", "college", "institute"];

function toPayload(form) {
  const data = { ...form, name: form.name.trim(), code: form.code.trim() };
  OPTIONAL.forEach((field) => {
    data[field] = String(data[field] ?? "").trim() || null;
  });
  return Object.fromEntries(Object.keys(EMPTY).map((k) => [k, data[k]]));
}

/**
 * Create (no `organizationId`) or edit a school. Calls `onSaved(org)`.
 */
export default function OrganizationFormModal({ organizationId, onClose, onSaved }) {
  const editing = Boolean(organizationId);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editing) return undefined;
    let live = true;
    superAdminApi
      .organization(organizationId)
      .then((org) => {
        if (!live) return;
        setForm({
          ...EMPTY,
          ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, org?.[k] ?? EMPTY[k]])),
          is_active: org?.is_active ?? true,
        });
      })
      .catch((err) => live && setErrors(fieldErrorsOf(err)))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [editing, organizationId]);

  const set = (field) => (event) =>
    setForm((f) => ({ ...f, [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const problems = {};
    if (!form.name.trim()) problems.name = "Enter the school's name.";
    if (!form.code.trim()) problems.code = "Enter a short code, e.g. GRNFLD.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      const payload = toPayload(form);
      const saved = editing
        ? await superAdminApi.updateOrganization(organizationId, payload)
        : await superAdminApi.createOrganization(payload);
      onSaved?.(saved || payload);
    } catch (err) {
      setErrors(fieldErrorsOf(err));
      setBusy(false);
    }
  };

  const title = editing ? "Edit school" : "Add school";
  return (
    <Modal
      open
      onClose={onClose}
      closeDisabled={busy}
      size="lg"
      title={title}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" type="submit" form="organization-form" loading={busy} disabled={loading}>
            {editing ? "Save changes" : "Create school"}
          </Button>
        </>
      }
    >
      {loading ? (
        <FormSkeleton fields={8} label="Loading school" />
      ) : (
        <form id="organization-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required error={errors.name}>
            <input maxLength={255} value={form.name} onChange={set("name")} autoComplete="off" />
          </Field>
          <Field label="Code" required error={errors.code} hint="Short and unique; people use it to find the school.">
            <input maxLength={20} value={form.code} onChange={set("code")} autoComplete="off" />
          </Field>
          <Field label="Type" error={errors.organization_type}>
            <select value={form.organization_type} onChange={set("organization_type")}>
              {TYPES.map((type) => (
                <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Email" error={errors.email}>
            <input type="email" value={form.email ?? ""} onChange={set("email")} />
          </Field>
          <Field label="Phone" error={errors.phone_number}>
            <input value={form.phone_number ?? ""} onChange={set("phone_number")} />
          </Field>
          <Field label="Website" error={errors.website}>
            <input type="url" value={form.website ?? ""} onChange={set("website")} placeholder="https://" />
          </Field>
          <Field label="Established" error={errors.established_date}>
            <input type="date" value={form.established_date ?? ""} onChange={set("established_date")} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={Boolean(form.is_active)} onChange={set("is_active")} />
            Active
          </label>
          <Field label="Address" error={errors.address} className="sm:col-span-2">
            <input value={form.address ?? ""} onChange={set("address")} />
          </Field>
          <Field label="Description" error={errors.description} className="sm:col-span-2">
            <textarea rows={3} value={form.description ?? ""} onChange={set("description")} />
          </Field>
          {errors._general && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{errors._general}</p>
          )}
        </form>
      )}
    </Modal>
  );
}
