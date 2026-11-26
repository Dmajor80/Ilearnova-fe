import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, UserPlus } from "lucide-react";
import { fetchAll, superAdminApi } from "@/api/superAdminApi";
import { fieldErrorsOf } from "@/lib/apiHelpers";
import { ASSIGNABLE_ROLES } from "@/lib/roles";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Field, PageCard } from "@/components/admin/AdminUI";
import useResource from "@/hooks/superadmin/useResource";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.first_name.trim()) errors.first_name = "Enter a first name.";
  if (!form.last_name.trim()) errors.last_name = "Enter a last name.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!form.organization_id && form.role !== "individual") errors.organization_id = "Choose a school.";
  if (!form.role) errors.role = "Choose a role.";
  if (form.password && form.password.length < 8) errors.password = "Use at least 8 characters, or leave it blank to send an invite.";
  if (form.username && !/^[\w.@+-]+$/.test(form.username.trim())) errors.username = "Letters, digits and @ . + - _ only.";
  return errors;
}

/** Superadmin: create a user in a school with a role. */
export default function NewUser() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    organization_id: params.get("organization_id") || "",
    role: params.get("role") || "teacher",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const organizations = useResource(() => fetchAll(superAdminApi.organizations, { page_size: 100 }), []);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const problems = validate(form);
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    const body = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      ...(form.organization_id ? { organization_id: form.organization_id } : {}),
      role: form.role,
      ...(form.username.trim() ? { username: form.username.trim() } : {}),
      ...(form.password ? { password: form.password } : {}),
    };
    try {
      await superAdminApi.createUser(body);
      toast(
        form.password
          ? `${body.first_name} ${body.last_name} can now sign in.`
          : `${body.first_name} ${body.last_name} was added and emailed an invite.`
      );
      navigate(form.organization_id && params.get("organization_id") ? `/admin-dashboard/users?organization_id=${form.organization_id}` : "/admin-dashboard/users");
    } catch (err) {
      setErrors(fieldErrorsOf(err));
      setBusy(false);
    }
  };

  const orgs = organizations.data || [];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/admin-dashboard/users" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Users
      </Link>
      <PageCard title="Add user" icon={UserPlus} description="Create an account in a school. They can belong to more schools later.">
        <form onSubmit={submit} noValidate className="space-y-6 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" required error={errors.first_name}>
              <input value={form.first_name} onChange={set("first_name")} autoComplete="off" />
            </Field>
            <Field label="Last name" required error={errors.last_name}>
              <input value={form.last_name} onChange={set("last_name")} autoComplete="off" />
            </Field>
            <Field label="Email" required error={errors.email} className="sm:col-span-2">
              <input type="email" value={form.email} onChange={set("email")} autoComplete="off" placeholder="name@school.ng" />
            </Field>
            {organizations.loading && !organizations.data ? (
              <div role="status" aria-label="Loading schools" className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : (
              <Field label="School" required={form.role !== "individual"} hint={form.role === "individual" ? "Optional for individual learners." : undefined} error={errors.organization_id || (organizations.error ? "Couldn't load schools. Refresh to try again." : undefined)}>
                <select value={form.organization_id} onChange={set("organization_id")}>
                  <option value="">Choose a school</option>
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="Role" required error={errors.role}>
              <select value={form.role} onChange={set("role")}>
                {ASSIGNABLE_ROLES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
            <legend className="px-1 text-sm font-medium text-gray-700">Sign-in (optional)</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Username" error={errors.username} hint="Leave blank to generate one from the email.">
                <input value={form.username} onChange={set("username")} autoComplete="off" />
              </Field>
              <Field label="Password" error={errors.password} hint="At least 8 characters.">
                <input type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
              </Field>
            </div>
            {!form.password && (
              <p className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                No password: we'll email them an invite to set their own.
              </p>
            )}
          </fieldset>

          {errors._general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors._general}</p>}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
            <Button onClick={() => navigate(-1)} disabled={busy}>Cancel</Button>
            <Button variant="primary" type="submit" loading={busy}>Create user</Button>
          </div>
        </form>
      </PageCard>
    </div>
  );
}
