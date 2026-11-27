import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Building, CheckCircle, Mail } from "lucide-react";
import { registerSchool, resendSchoolSetup } from "@/api/authApi";
import AccessCodeField from "@/features/billing/AccessCodeField";
import { fieldErrorsOf, keepShown } from "@/lib/apiHelpers";

export const fieldClass =
  "w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-xl sm:p-8">{children}</div>
      </div>
    </main>
  );
}

export function TextField({ id, label, icon: Icon, error, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" aria-hidden="true" />}
        <input
          id={id}
          name={id}
          className={`${fieldClass} ${Icon ? "" : "pl-4"} ${error ? "border-red-500" : ""}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error || hint ? `${id}_note` : undefined}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p id={`${id}_note`} className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

/**
 * Registering a school, step 1: the school's email, name and access code.
 * The person who will run the school creates their own account from the
 * emailed link (SchoolSetup). Invite and payment emails link here with
 * ?code=…&email=… filled in.
 */
export default function RegisterSchool() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    email: params.get("email") || "",
    organization_name: "",
    access_code: (params.get("code") || "").toUpperCase(),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);
  const [resent, setResent] = useState(false);

  const set = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, _general: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const missing = {};
    if (!form.email.trim()) missing.email = "Enter the school's email address.";
    if (!form.organization_name.trim()) missing.organization_name = "Enter the school's name.";
    if (Object.keys(missing).length) return setErrors(missing);

    setSaving(true);
    try {
      const result = await registerSchool({
        email: form.email.trim(),
        organization_name: form.organization_name.trim(),
        access_code: form.access_code.trim(),
      });
      setDone({ email: result?.email || form.email.trim(), name: result?.organization?.name || form.organization_name.trim() });
    } catch (error) {
      setErrors(keepShown(fieldErrorsOf(error), ["email", "organization_name", "access_code", "subscription"]));
    } finally {
      setSaving(false);
    }
  };

  const resend = async () => {
    try {
      await resendSchoolSetup(done.email);
    } finally {
      setResent(true);
    }
  };

  if (done) {
    return (
      <AuthShell title="Check your email">
        <div className="space-y-4 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
          <p className="text-gray-700">
            <strong>{done.name}</strong> is registered. We sent a link to
          </p>
          <p className="break-all font-semibold text-blue-700">{done.email}</p>
          <p className="text-sm text-gray-600">
            Whoever opens it creates the school&apos;s admin account: their name, a username and a password. The link
            works once and expires in 7 days. Check the spam folder if it isn&apos;t there in a few minutes.
          </p>
          <p className="text-sm text-gray-600" aria-live="polite">
            {resent ? (
              "A new link is on its way."
            ) : (
              <>
                Didn&apos;t get it?{" "}
                <button type="button" onClick={resend} className="font-medium text-blue-600 hover:underline">
                  Send it again
                </button>
              </>
            )}
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Register your school"
      subtitle="Just the school's details for now. We'll email a link to create the admin account."
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField
          id="email"
          type="email"
          label="School email"
          icon={Mail}
          autoComplete="email"
          placeholder="office@yourschool.com"
          value={form.email}
          onChange={(e) => set("email")(e.target.value)}
          error={errors.email}
          hint="The setup link goes here. Use an address the school's admin can open."
        />
        <TextField
          id="organization_name"
          label="School name"
          icon={Building}
          autoComplete="organization"
          placeholder="e.g. Sunrise College"
          value={form.organization_name}
          onChange={(e) => set("organization_name")(e.target.value)}
          error={errors.organization_name}
        />
        <AccessCodeField
          value={form.access_code}
          email={form.email}
          onChange={set("access_code")}
          error={errors.access_code || errors.subscription}
        />
        {errors._general && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errors._general}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Registering…" : "Register school"}
        </button>
        <p className="text-center text-sm text-gray-600">
          Joining a school as a teacher, student or parent?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up here
          </Link>
          . Already registered?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
