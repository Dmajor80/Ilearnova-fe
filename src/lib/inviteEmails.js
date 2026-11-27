/** Turning a pasted list of email addresses into invites. */

export const MAX_INVITES = 100;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Emails typed one per line or separated by commas: trimmed, duplicates
 * (any case) dropped, and anything that isn't an email set aside.
 */
export function parseEmails(text) {
  const seen = new Set();
  const emails = [];
  const invalid = [];
  String(text || "")
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      (EMAIL_RE.test(part) ? emails : invalid).push(part);
    });
  return { emails, invalid };
}
