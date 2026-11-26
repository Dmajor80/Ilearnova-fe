import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Modal, { Button } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { superAdminApi, userFullName } from "@/api/superAdminApi";
import { apiErrorDetails, fieldErrorsOf } from "@/lib/apiHelpers";
import { ASSIGNABLE_ROLES, roleLabel } from "@/lib/roles";
import { toast } from "@/lib/toast";
import { ActivePill, Field, Pill, formatDateTime, formatDay } from "./AdminUI";

export function userRoleLabels(user) {
  const labels = (user?.roles || []).map((r) => roleLabel(r.role || r.role_code));
  if (user?.is_superuser) labels.unshift("Platform admin");
  return [...new Set(labels.filter(Boolean))];
}

export function userSchools(user) {
  return [...new Set((user?.roles || []).map((r) => r.organization_name).filter(Boolean))];
}

/** Read-only view of one user. */
export function UserDetailModal({ user, onClose }) {
  const roles = user.roles || [];
  return (
    <Modal open onClose={onClose} title={userFullName(user)} description={user.email} size="md">
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div><dt className="text-xs text-gray-500">Username</dt><dd className="mt-0.5 break-all text-gray-900">{user.username || "—"}</dd></div>
        <div><dt className="text-xs text-gray-500">Status</dt><dd className="mt-1 flex flex-wrap gap-1"><ActivePill active={user.is_active} />{user.is_verified === false && <Pill tone="amber">Unverified</Pill>}</dd></div>
        <div><dt className="text-xs text-gray-500">Joined</dt><dd className="mt-0.5 text-gray-900">{formatDay(user.date_joined || user.created_at)}</dd></div>
        <div><dt className="text-xs text-gray-500">Last sign-in</dt><dd className="mt-0.5 text-gray-900">{user.last_login ? formatDateTime(user.last_login) : "Never"}</dd></div>
      </dl>
      <h3 className="mt-6 text-sm font-semibold text-gray-900">Roles</h3>
      {user.is_superuser && <p className="mt-2 text-sm text-gray-700">Platform admin (full access to every school)</p>}
      {roles.length ? (
        <ul className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-100">
          {roles.map((r, i) => (
            <li key={r.id || i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span><span className="font-medium text-gray-900">{roleLabel(r.role)}</span> <span className="text-gray-500">at {r.organization_name || "—"}</span></span>
              {r.is_active === false ? <Pill>Inactive</Pill> : r.is_verified === false ? <Pill tone="amber">Pending</Pill> : <Pill tone="green">Active</Pill>}
            </li>
          ))}
        </ul>
      ) : (
        !user.is_superuser && <p className="mt-2 text-sm text-gray-500">No school roles.</p>
      )}
    </Modal>
  );
}

/** Edit name, email and active flag. */
export function UserEditModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    is_active: user.is_active !== false,
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const problems = {};
    if (!form.first_name.trim()) problems.first_name = "Enter a first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) problems.email = "Enter a valid email address.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      await superAdminApi.updateUser(user.id, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        is_active: form.is_active,
      });
      toast(`${form.first_name.trim()}'s details saved.`);
      onSaved?.();
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
      title={`Edit ${userFullName(user)}`}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant="primary" type="submit" form="user-edit-form" loading={busy}>Save changes</Button>
        </>
      }
    >
      <form id="user-edit-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" required error={errors.first_name}><input value={form.first_name} onChange={set("first_name")} /></Field>
        <Field label="Last name" error={errors.last_name}><input value={form.last_name} onChange={set("last_name")} /></Field>
        <Field label="Email" required error={errors.email} className="sm:col-span-2"><input type="email" value={form.email} onChange={set("email")} /></Field>
        <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={form.is_active} onChange={set("is_active")} />
          Account active (can sign in)
        </label>
        {errors._general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{errors._general}</p>}
      </form>
    </Modal>
  );
}

/** See a user's school roles, remove one, or add them to a school. */
export function UserRolesModal({ user, organizations, onClose, onChanged }) {
  const [roles, setRoles] = useState(user.roles || []);
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("teacher");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => setRoles(user.roles || []), [user]);

  const refresh = async () => {
    try {
      const fresh = await superAdminApi.user(user.id);
      if (fresh?.roles) setRoles(fresh.roles);
    } catch {
      // The list reload will catch up.
    }
    onChanged?.();
  };

  const add = async (event) => {
    event.preventDefault();
    if (!org) {
      setError("Choose a school.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await superAdminApi.addRole(user.id, { organization_id: org, role });
      const school = organizations?.find((o) => String(o.id) === String(org));
      toast(`${userFullName(user)} is now ${roleLabel(role).toLowerCase()} at ${school?.name || "the school"}.`);
      setOrg("");
      await refresh();
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (assignment) => {
    setRemoving(assignment.id);
    setError("");
    try {
      await superAdminApi.removeRole(user.id, assignment.id);
      toast(`Removed ${roleLabel(assignment.role).toLowerCase()} role at ${assignment.organization_name}.`);
      setRoles((list) => list.filter((r) => r.id !== assignment.id));
      await refresh();
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Roles for ${userFullName(user)}`} description="A person can hold different roles in different schools." size="md">
      <div className="space-y-5">
        {roles.length ? (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
            {roles.map((r, i) => (
              <li key={r.id || i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{roleLabel(r.role)}</span>{" "}
                  <span className="text-gray-500">at {r.organization_name || "—"}</span>
                </span>
                {r.id && (
                  <button
                    type="button"
                    onClick={() => remove(r)}
                    disabled={removing === r.id}
                    aria-label={`Remove ${roleLabel(r.role)} at ${r.organization_name}`}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">{user.is_superuser ? "Platform admin; no school roles." : "No school roles yet."}</p>
        )}
        <form onSubmit={add} className="space-y-3 rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Add to a school</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {organizations ? (
              <Field label="School">
                <select value={org} onChange={(e) => setOrg(e.target.value)}>
                  <option value="">Choose a school</option>
                  {organizations.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </Field>
            ) : (
              <div role="status" aria-label="Loading schools" className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            )}
            <Field label="Role">
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {ASSIGNABLE_ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <Button variant="primary" type="submit" loading={busy}>Add role</Button>
        </form>
      </div>
    </Modal>
  );
}
