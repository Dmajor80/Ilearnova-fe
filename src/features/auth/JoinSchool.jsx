import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Lock, Mail, User } from "lucide-react";
import { getInvite, JOIN_ROLES, lookupSchool, registerForSchool } from "@/api/joinApi";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { fieldErrorsOf, keepShown } from "@/lib/apiHelpers";
import { AuthShell, TextField } from "./RegisterSchool";

const BAD_LINK = "This join link isn't complete. Ask your school for a new one.";
const EMPTY_FORM = { first_name: "", last_name: "", username: "", email: "", password: "", confirm_password: "" };

/** Read the link: an emailed invite (?invite=) or a school's open link (?school=&role=). */
function readLink(params) {
  const invite = (params.get("invite") || "").trim();
  if (invite) return { mode: "invite", invite };
  const code = (params.get("school") || "").trim().toUpperCase();
  const role = (params.get("role") || "").trim().toLowerCase();
  if (code && JOIN_ROLES.includes(role)) return { mode: "open", code, role };
  return { mode: "bad" };
}

function linkError(error) {
  const errors = fieldErrorsOf(error);
  return errors.invite || errors.organization_code || errors.token || errors._general || "This link can't be used.";
}

/**
 * Joining a school from a link (route /join):
 * - `?invite=TOKEN`: a personal invite a school admin emailed. The email is
 *   fixed, and the person is approved straight away.
 * - `?school=CODE&role=teacher|student|parent`: the school's open link. It
 *   works like typing the school code on sign-up, so a school admin still
 *   has to approve them.
 */
export default function JoinSchool() {
  const [params] = useSearchParams();
  const link = readLink(params);
  const linkKey = `${link.mode}:${link.invite || ""}:${link.code || ""}:${link.role || ""}`;

  const [state, setState] = useState({ loading: link.mode !== "bad", info: null, error: link.mode === "bad" ? BAD_LINK : null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (link.mode === "bad") {
      setState({ loading: false, info: null, error: BAD_LINK });
      return undefined;
    }
    let live = true;
    setState({ loading: true, info: null, error: null });
    const load =
      link.mode === "invite"
        ? getInvite(link.invite).then((invite) => ({
            schoolName: invite?.organization_name || "your school",
            role: String(invite?.role || "").toLowerCase(),
            email: invite?.email || "",
          }))
        : lookupSchool(link.code).then((school) => ({
            schoolName: school?.name || "your school",
            code: String(school?.code || link.code).toUpperCase(),
            role: link.role,
            email: "",
          }));
    load
      .then((info) => {
        if (!live) return;
        if (!JOIN_ROLES.includes(info.role)) {
          setState({ loading: false, info: null, error: BAD_LINK });
          return;
        }
        setForm((f) => ({ ...f, email: info.email || f.email }));
        setState({ loading: false, info, error: null });
      })
      .catch((error) => {
        if (live) setState({ loading: false, info: null, error: linkError(error) });
      });
    return () => {
      live = false;
    };
    // linkKey captures everything read from the link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkKey]);

  const set = (field) => (event) => {
    const { value } = event.target;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined, _general: undefined }));
  };

  const isInvite = link.mode === "invite";
  const info = state.info;

  const submit = async (event) => {
    event.preventDefault();
    const missing = {};
    if (!form.first_name.trim()) missing.first_name = "Enter your first name.";
    if (!form.last_name.trim()) missing.last_name = "Enter your last name.";
    if (!form.username.trim()) missing.username = "Choose a username.";
    else if (form.username.trim().length < 3) missing.username = "Use at least 3 characters.";
    if (!isInvite) {
      if (!form.email.trim()) missing.email = "Enter your email address.";
      else if (!/\S+@\S+\.\S+/.test(form.email.trim())) missing.email = "Enter a valid email address.";
    }
    if (!form.password) missing.password = "Choose a password.";
    else if (form.password.length < 8) missing.password = "Use at least 8 characters.";
    if (form.password && form.confirm_password !== form.password) missing.confirm_password = "Passwords don't match.";
    if (Object.keys(missing).length) {
      setErrors(missing);
      return;
    }

    const body = {
      ...(isInvite ? { invite: link.invite } : { organization_code: info.code }),
      email: isInvite ? info.email : form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      username: form.username.trim(),
      password: form.password,
    };
    setSaving(true);
    setErrors({});
    try {
      await registerForSchool(info.role, body);
      setDone(true);
    } catch (error) {
      const found = fieldErrorsOf(error);
      const { invite, organization_code: code, ...rest } = found;
      const general = [invite, code, rest._general].filter(Boolean).join(" ");
      setErrors(
        keepShown({ ...rest, _general: general || undefined }, [
          "email",
          "first_name",
          "last_name",
          "username",
          "password",
          "confirm_password",
        ])
      );
    } finally {
      setSaving(false);
    }
  };

  if (state.loading) {
    return (
      <AuthShell title="Join your school">
        <FormSkeleton fields={6} label="Loading your link" className="sm:grid-cols-1" />
      </AuthShell>
    );
  }

  if (state.error || !info) {
    return (
      <AuthShell title="This link can't be used">
        <div className="space-y-4 text-center">
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {state.error || BAD_LINK}
          </p>
          <p className="text-sm text-gray-600">
            Have a school code instead?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell title={isInvite ? `Welcome to ${info.schoolName}` : "Registration successful"}>
        <div className="space-y-4 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
          {isInvite ? (
            <p className="text-gray-700">You&apos;re in! Log in to get started.</p>
          ) : (
            <>
              <p className="text-gray-700">
                Your account is waiting for {info.schoolName} to approve it. You can log in now; you&apos;ll see your
                school once a school admin approves you.
              </p>
              {info.role === "parent" && (
                <p className="text-sm text-gray-600">
                  After you log in, open <strong>My Children</strong> and ask to be linked to your child. Approving that
                  link approves your account.
                </p>
              )}
            </>
          )}
          <Link
            to="/login"
            className="inline-block w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={`Join ${info.schoolName} as a ${info.role}`}
      subtitle={
        isInvite
          ? "Create your account. Your school invited you, so you can start as soon as you log in."
          : "Create your account. A school admin approves new accounts before you can use them."
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField
          id="email"
          type="email"
          label="Email"
          icon={Mail}
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          readOnly={isInvite}
          aria-readonly={isInvite || undefined}
          className={isInvite ? "w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-3 pl-10 pr-4 text-gray-700" : undefined}
          error={errors.email}
          hint={isInvite ? "Your invite is for this address." : undefined}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="first_name" label="First name" icon={User} autoComplete="given-name" value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
          <TextField id="last_name" label="Last name" icon={User} autoComplete="family-name" value={form.last_name} onChange={set("last_name")} error={errors.last_name} />
        </div>
        <TextField id="username" label="Username" icon={User} autoComplete="username" value={form.username} onChange={set("username")} error={errors.username} />
        <TextField
          id="password"
          type="password"
          label="Password"
          icon={Lock}
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          hint="At least 8 characters."
        />
        <TextField
          id="confirm_password"
          type="password"
          label="Confirm password"
          icon={Lock}
          autoComplete="new-password"
          value={form.confirm_password}
          onChange={set("confirm_password")}
          error={errors.confirm_password}
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
          {saving ? "Joining…" : `Join ${info.schoolName}`}
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
