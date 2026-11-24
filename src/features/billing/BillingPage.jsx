import { useEffect, useState } from "react";
import { Banknote, CreditCard, RefreshCw } from "lucide-react";
import { billingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { formatDate, naira, planLength } from "./subscriptionUtils";

const STATE_LABEL = {
  active: ["Active", "bg-green-100 text-green-800"],
  expiring: ["Ending soon", "bg-blue-100 text-blue-800"],
  grace: ["Ended — grace period", "bg-amber-100 text-amber-800"],
  read_only: ["Read-only", "bg-red-100 text-red-800"],
  locked: ["Locked", "bg-red-100 text-red-800"],
  unmanaged: ["No subscription on record", "bg-gray-100 text-gray-700"],
};

function Notice({ message }) {
  if (!message) return null;
  return (
    <div role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-3 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
      {message.lines.map((line, i) => <p key={i}>{line}</p>)}
    </div>
  );
}

const errorNotice = (err) => ({ type: "error", lines: apiErrorDetails(err).messages });

function SubscriptionSection() {
  const [info, setInfo] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const load = () =>
    Promise.all([billingApi.schoolSubscription(), billingApi.plans()])
      .then(([subscription, planList]) => {
        setInfo(subscription);
        const forSale = (planList || []).filter((p) => Number(p.amount) > 0);
        setPlans(forSale);
        setPlan((current) => current || forSale[0]?.code || "");
      })
      .catch((err) => setMessage(errorNotice(err)));

  useEffect(() => {
    load();
  }, []);

  const renew = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const checkout = await billingApi.renew(plan);
      // Paystack takes the payment, then sends the admin back to
      // /payments/callback, which confirms it.
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setMessage(
        err?.status === 503
          ? { type: "error", lines: ["Online payment is not set up yet. Contact iLearnova support to renew."] }
          : errorNotice(err)
      );
      setBusy(false);
    }
  };

  const [label, tone] = STATE_LABEL[info?.state] || ["…", "bg-gray-100 text-gray-700"];
  const chosen = plans.find((p) => p.code === plan);

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <CreditCard className="h-5 w-5 text-blue-600" /> Subscription
        </h2>
        <button type="button" onClick={load} aria-label="Reload subscription" className="rounded-lg border p-2 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" />
        </button>
      </header>

      <Notice message={message} />

      {info && (
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-gray-500">Status</dt>
            <dd className="mt-1"><span className={`rounded-full px-2 py-0.5 text-sm font-medium ${tone}`}>{label}</span></dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-gray-500">Ends</dt>
            <dd className="mt-1 font-semibold">{info.expires_at ? formatDate(info.expires_at) : "No end date"}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-gray-500">
              {info.state === "grace" ? "Read-only from" : info.state === "read_only" ? "Locks on" : "Days left"}
            </dt>
            <dd className="mt-1 font-semibold">
              {info.state === "grace"
                ? formatDate(info.grace_ends_at)
                : info.state === "read_only"
                  ? formatDate(info.locks_at)
                  : info.expires_at ? info.days_left : "—"}
            </dd>
          </div>
        </dl>
      )}

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900">Renew</h3>
        {plans.length ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-medium text-gray-700">
              Plan
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
                {plans.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} — {naira(p.amount)} / {planLength(p.duration_days).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" disabled={busy || !plan} onClick={renew} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {busy ? "Opening Paystack…" : `Pay ${chosen ? naira(chosen.amount) : ""} with Paystack`}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600">No plans are on sale right now. Contact iLearnova support to renew.</p>
        )}
        <p className="mt-2 text-xs text-gray-500">The new period starts when the current one ends, so renewing early loses nothing.</p>
      </div>

      {info?.history?.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="mb-2 font-semibold text-gray-900">History</h3>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left">Plan</th>
                <th scope="col" className="px-3 py-2 text-left">From</th>
                <th scope="col" className="px-3 py-2 text-left">To</th>
                <th scope="col" className="px-3 py-2 text-left">How</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {info.history.map((s) => (
                <tr key={s.id}>
                  <td className="px-3 py-2">{s.plan?.name || "—"}</td>
                  <td className="px-3 py-2">{formatDate(s.starts_at)}</td>
                  <td className="px-3 py-2">{s.expires_at ? formatDate(s.expires_at) : "No end date"}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {{ admin_grant: "Granted by iLearnova", access_code: "Access code", paystack: "Paystack" }[s.source] || s.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const EMPTY_ACCOUNT = { business_name: "", settlement_bank: "", account_number: "" };

function PayoutAccountSection() {
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(EMPTY_ACCOUNT);
  const [banks, setBanks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    billingApi
      .payoutAccount()
      .then((data) => {
        setAccount(data);
        if (data) setForm({ business_name: data.business_name, settlement_bank: data.settlement_bank, account_number: data.account_number });
      })
      .catch((err) => setMessage(errorNotice(err)));
    billingApi
      .banks()
      .then((list) => setBanks(Array.isArray(list) ? list : []))
      .catch(() => setBanks([]));
  }, []);

  const valid = form.business_name.trim() && form.settlement_bank && /^\d{10}$/.test(form.account_number);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const bank = banks.find((b) => b.code === form.settlement_bank);
    try {
      const saved = await billingApi.savePayoutAccount({ ...form, bank_name: bank?.name || "" });
      setAccount(saved);
      setMessage({ type: "success", lines: [`Saved. Paystack confirmed the account name: ${saved.account_name || "—"}.`] });
    } catch (err) {
      setMessage(
        err?.status === 503
          ? { type: "error", lines: ["Online payment is not set up on iLearnova yet."] }
          : err?.status === 502
            ? { type: "error", lines: ["Paystack could not confirm this account. Check the bank and account number."] }
            : errorNotice(err)
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Banknote className="h-5 w-5 text-green-600" /> School fees payout account
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Fees parents and students pay online settle straight into this account through Paystack.
        </p>
      </header>

      {account && (
        <p className={`rounded-lg p-3 text-sm ${account.can_receive ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
          {account.can_receive
            ? `Receiving payments into ${account.account_name || account.business_name} (${account.bank_name || account.settlement_bank}, ${account.account_number}).`
            : "This account is not active for payments yet."}
        </p>
      )}

      <Notice message={message} />

      <form onSubmit={save} className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium text-gray-700 sm:col-span-3">
          Business name (shown to payers)
          <input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-gray-700 sm:col-span-2">
          Bank
          <select value={form.settlement_bank} onChange={(e) => setForm({ ...form, settlement_bank: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="">{banks.length ? "Choose a bank" : "Loading banks…"}</option>
            {banks.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Account number
          <input inputMode="numeric" maxLength={10} value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value.replace(/\D/g, "") })} placeholder="10 digits" className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <div className="flex justify-end sm:col-span-3">
          <button type="submit" disabled={busy || !valid} className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            {busy ? "Checking with Paystack…" : account ? "Update account" : "Save account"}
          </button>
        </div>
      </form>
    </section>
  );
}

/** School admins: subscription and renewal, and the fees payout account. */
export default function BillingPage() {
  return (
    <div className="space-y-6">
      <SubscriptionSection />
      <PayoutAccountSection />
    </div>
  );
}
