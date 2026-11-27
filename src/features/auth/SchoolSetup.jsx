import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AtSign, Lock, Mail, User } from "lucide-react";
import { completeSchoolSetup, getSchoolSetup, resendSchoolSetup } from "@/api/authApi";
import { fieldErrorsOf, keepShown } from "@/lib/apiHelpers";
import { Skeleton } from "@/components/ui/Skeleton";
import { AuthShell, TextField } from "./RegisterSchool";

/** Link expired or used: ask for a fresh one by email. */
function ResendLink({ reason }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const send = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      await resendSchoolSetup(email.trim());
    } finally {
      setSent(true);
    }
  };
  return (
    <AuthShell title="This link can't be used" subtitle={reason}>
      {sent ? (
        <p className="text-center text-gray-700" aria-live="polite">
          If that email is waiting to set up a school, a new link is on its way.
        </p>
      ) : (
        <form onSubmit={send} className="space-y-4">
          <TextField
            id="resend_email"
            type="email"
            label="School email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="The email the school was registered with."
          />
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
            Email me a new link
          </button>
          <p className="text-center text-sm text-gray-600">
            Already set up?{" "}
            <Link to="/login" className="py-3 font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}

/**
 * Registering a school, step 2 (the emailed link): the person who opens it
 * creates the school's admin account and can then log in.
 */
export default function SchoolSetup() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [school, setSchool] = useState(null); // null while loading
  const [linkError, setLinkError] = useState(token ? "" : "The link is missing its code. Open it straight from the email.");
  const [form, setForm] = useState({ first_name: "", last_name: "", username: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    getSchoolSetup(token)
      .then((data) => active && setSchool(data))
      .catch((error) => active && setLinkError(fieldErrorsOf(error).token || "This setup link is not valid."));
    return () => {
      active = false;
    };
  }, [token]);

  if (linkError) return <ResendLink reason={linkError} />;
  if (!school) {
    return (
      <AuthShell title="Set up your school">
        <div className="space-y-4" aria-busy="true" aria-label="Loading">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </AuthShell>
    );
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((x) => ({ ...x, [field]: undefined, _general: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const missing = {};
    if (!form.first_name.trim()) missing.first_name = "Enter your first name.";
    if (!form.last_name.trim()) missing.last_name = "Enter your last name.";
    if (!form.username.trim()) missing.username = "Choose a username.";
    if (!form.password) missing.password = "Choose a password.";
    else if (form.password !== form.confirm) missing.confirm = "The passwords don't match.";
    if (Object.keys(missing).length) return setErrors(missing);

    setSaving(true);
    try {
      const result = await completeSchoolSetup({
        token,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        username: form.username.trim(),
        password: form.password,
      });
      navigate("/login", { state: { info: "school_setup_done", username: result?.username || form.username.trim() } });
    } catch (error) {
      const found = fieldErrorsOf(error);
      if (found.token) setLinkError(found.token);
      else setErrors(keepShown(found, ["first_name", "last_name", "username", "password", "confirm"]));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthShell
      title={`Set up ${school.organization_name || "your school"}`}
      subtitle="Create the account you'll use to run the school on iLearnova."
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
          <p>
            School email: <strong className="break-all">{school.email}</strong>
          </p>
          {school.organization_code && (
            <p>
              School code: <strong className="font-mono">{school.organization_code}</strong> (teachers, students and
              parents use it to join)
            </p>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="first_name" label="First name" icon={User} autoComplete="given-name" value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
          <TextField id="last_name" label="Last name" icon={User} autoComplete="family-name" value={form.last_name} onChange={set("last_name")} error={errors.last_name} />
        </div>
        <TextField id="username" label="Username" icon={AtSign} autoComplete="username" value={form.username} onChange={set("username")} error={errors.username} hint="You'll log in with this." />
        <TextField id="password" type="password" label="Password" icon={Lock} autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} hint="At least 8 characters, not only numbers." />
        <TextField id="confirm" type="password" label="Confirm password" icon={Lock} autoComplete="new-password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
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
          {saving ? "Creating account…" : "Create admin account"}
        </button>
      </form>
    </AuthShell>
  );
}
