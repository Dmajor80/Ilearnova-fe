import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, UserCog } from "lucide-react";
import { forgotPassword, updateProfile } from "@/api/authApi";
import { getAuthStorage, getStoredUser } from "@/api/auth";
import { fieldErrorsOf } from "@/lib/apiHelpers";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Field, PageCard } from "@/components/admin/AdminUI";

/** The superadmin's own account: name, email and password. */
export default function Settings() {
  const navigate = useNavigate();
  const stored = getStoredUser() || {};
  const [form, setForm] = useState({
    first_name: stored.first_name || "",
    last_name: stored.last_name || "",
    email: stored.email || "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = async (event) => {
    event.preventDefault();
    const problems = {};
    if (!form.first_name.trim()) problems.first_name = "Enter your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) problems.email = "Enter a valid email address.";
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setBusy(true);
    try {
      const body = { first_name: form.first_name.trim(), last_name: form.last_name.trim(), email: form.email.trim() };
      const response = await updateProfile(body);
      const user = { ...stored, ...body, ...(response?.user || {}) };
      getAuthStorage()?.setItem("user_data", JSON.stringify(user));
      toast("Your details were saved.");
    } catch (err) {
      setErrors(fieldErrorsOf(err));
    } finally {
      setBusy(false);
    }
  };

  const sendReset = async () => {
    try {
      await forgotPassword(stored.email);
    } catch (err) {
      throw new Error(fieldErrorsOf(err)._general || "Couldn't send the code.");
    }
    sessionStorage.setItem("otp_email", stored.email);
    navigate("/verify-otp");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageCard title="Your profile" icon={UserCog} description="How you appear in emails and logs.">
        <form onSubmit={save} noValidate className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" required error={errors.first_name}><input value={form.first_name} onChange={set("first_name")} /></Field>
            <Field label="Last name" error={errors.last_name}><input value={form.last_name} onChange={set("last_name")} /></Field>
            <Field label="Email" required error={errors.email} className="sm:col-span-2"><input type="email" value={form.email} onChange={set("email")} /></Field>
            <Field label="Username" hint="Usernames can't be changed." className="sm:col-span-2">
              <input value={stored.username || ""} disabled className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500" />
            </Field>
          </div>
          {errors._general && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors._general}</p>}
          <div className="flex justify-end">
            <Button variant="primary" type="submit" loading={busy}>Save changes</Button>
          </div>
        </form>
      </PageCard>

      <PageCard title="Password" icon={KeyRound} description="We email you a 6-digit code, then you choose a new password.">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">The code goes to <span className="font-medium text-gray-900">{stored.email || "your email"}</span>.</p>
          <Button onClick={() => setConfirmReset(true)} disabled={!stored.email}>Change password</Button>
        </div>
      </PageCard>

      <ConfirmDialog
        open={confirmReset}
        title="Change your password?"
        message={`We'll email a code to ${stored.email} and take you to the page where you enter it.`}
        confirmLabel="Send code"
        onConfirm={sendReset}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
