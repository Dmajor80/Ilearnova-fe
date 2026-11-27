import { useEffect, useId, useRef, useState } from "react";
import Modal, { Button } from "@/components/ui/Modal";
import { sendInvites } from "@/api/joinApi";
import { fieldErrorsOf } from "@/lib/apiHelpers";
import { openJoinLink, storedSchoolCode } from "@/lib/schoolCode";
import { MAX_INVITES, parseEmails } from "@/lib/inviteEmails";

const PLURAL = { teacher: "teachers", student: "students", parent: "parents" };

function OpenLink({ code, role }) {
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const link = openJoinLink(code, role);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("No clipboard");
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Copying isn't allowed here: select the link so they can copy it.
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  return (
    <section aria-labelledby="invite-open-link-title" className="mt-6 border-t border-gray-100 pt-5">
      <h3 id="invite-open-link-title" className="text-sm font-semibold text-gray-900">Or share an open link</h3>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          readOnly
          value={link}
          aria-label={`Open sign-up link for ${PLURAL[role] || role}`}
          onFocus={(event) => event.target.select()}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
        />
        <Button onClick={copy} aria-live="polite">{copied ? "Copied" : "Copy link"}</Button>
      </div>
      <p className="mt-2 text-xs text-gray-600">
        Anyone with this link can sign up as a {role}; you&apos;ll approve them under Pending.
      </p>
    </section>
  );
}

/**
 * School admin: email personal invite links to teachers, students or
 * parents (the role is fixed by the page it was opened from). Each link
 * only works for the address it was sent to. Also offers the school's open
 * sign-up link when the school code is known.
 */
export default function InviteModal({ open, role, onClose, onSent }) {
  const emailsId = useId();
  const messageId = useId();
  const textareaRef = useRef(null);
  const [emailsText, setEmailsText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const code = open ? storedSchoolCode() : null;
  const plural = PLURAL[role] || `${role}s`;

  const close = () => {
    setEmailsText("");
    setMessage("");
    setError("");
    setResult(null);
    onClose?.();
  };

  const submit = async (event) => {
    event?.preventDefault?.();
    const { emails, invalid } = parseEmails(emailsText);
    if (invalid.length) {
      setError(`These don't look like email addresses: ${invalid.join(", ")}`);
      return;
    }
    if (!emails.length) {
      setError("Enter at least one email address.");
      return;
    }
    if (emails.length > MAX_INVITES) {
      setError(`You can send up to ${MAX_INVITES} invites at a time. You entered ${emails.length}.`);
      return;
    }
    setError("");
    setSending(true);
    try {
      const response = await sendInvites({ role, emails, message: message.trim() });
      const sent = Array.isArray(response?.sent) ? response.sent : [];
      const skipped = Array.isArray(response?.skipped) ? response.skipped : [];
      setResult({ sent, skipped });
      setEmailsText("");
      onSent?.({ sent, skipped });
    } catch (err) {
      const found = fieldErrorsOf(err);
      setError(Object.values(found).filter(Boolean).join(" ") || "The invites could not be sent.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={`Invite ${plural}`}
      description={`Each person gets an email with a link that only works for their address. They're approved as soon as they sign up.`}
      initialFocusRef={textareaRef}
      closeDisabled={sending}
      footer={
        <>
          <Button onClick={close} disabled={sending}>{result ? "Done" : "Cancel"}</Button>
          <Button variant="primary" onClick={submit} loading={sending}>
            Send invites
          </Button>
        </>
      }
    >
      {result && (
        <div role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          <p className="font-medium">{`Sent ${result.sent.length} invite${result.sent.length === 1 ? "" : "s"}`}</p>
          {result.skipped.length > 0 && (
            <div className="mt-2 text-amber-800">
              <p>Not sent:</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {result.skipped.map((item) => (
                  <li key={item.email}>
                    <span className="font-medium">{item.email}</span> — {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor={emailsId} className="mb-1 block text-sm font-medium text-gray-700">Email addresses</label>
          <textarea
            ref={textareaRef}
            id={emailsId}
            rows={5}
            value={emailsText}
            onChange={(event) => {
              setEmailsText(event.target.value);
              if (error) setError("");
            }}
            placeholder={"ada@example.com\nchidi@example.com"}
            aria-describedby={`${emailsId}-hint`}
            aria-invalid={error ? "true" : undefined}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p id={`${emailsId}-hint`} className="mt-1 text-xs text-gray-500">
            One per line, or separated by commas. Up to {MAX_INVITES} at a time.
          </p>
        </div>
        <div>
          <label htmlFor={messageId} className="mb-1 block text-sm font-medium text-gray-700">Message (optional)</label>
          <textarea
            id={messageId}
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Added to the email, e.g. a welcome from the principal."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
      </form>
      {code && <OpenLink code={code} role={role} />}
    </Modal>
  );
}

/** "Or share your school code: XXXX" when the signed-in admin's code is known. */
export function SchoolCodeNote({ className = "" }) {
  const code = storedSchoolCode();
  if (!code) return null;
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {`Or share your school code: ${code}`}
    </p>
  );
}
