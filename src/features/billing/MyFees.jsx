import { useCallback, useEffect, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { billingApi, feeTypeLabel } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { amountProblem, formatDate, naira } from "./subscriptionUtils";

const STATUS_STYLE = {
  paid: "bg-green-100 text-green-800",
  partial: "bg-blue-100 text-blue-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  waived: "bg-gray-100 text-gray-700",
};

function PayDialog({ fee, onClose }) {
  const [amount, setAmount] = useState(String(Number(fee.pending_amount)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const problem = amountProblem(amount, fee.pending_amount);

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const full = Number(amount) === Number(fee.pending_amount);
      const checkout = await billingApi.payFee(fee.id, full ? null : amount);
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setError(
        err?.status === 503
          ? "Online payment is not available yet. Please pay at the school."
          : apiErrorDetails(err).messages.join(" ")
      );
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="pay-fee-title" className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <h3 id="pay-fee-title" className="text-lg font-semibold text-gray-900">
          Pay {feeTypeLabel(fee.fee_type)} for {fee.student_name}
        </h3>
        <p className="text-sm text-gray-600">
          Balance: <span className="font-semibold">{naira(fee.pending_amount)}</span>. You can pay part of it now.
        </p>
        <label className="block text-sm font-medium text-gray-700">
          Amount (₦)
          <input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        {(problem || error) && <p role="alert" className="text-sm text-red-700">{problem || error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
          <button type="button" disabled={busy || Boolean(problem)} onClick={pay} className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">
            {busy ? "Opening Paystack…" : `Pay ${naira(amount) || ""}`}
          </button>
        </div>
      </section>
    </div>
  );
}

/**
 * Fees for the signed-in student, or for a parent's linked children (the
 * backend decides which). Pay online in full or in part through Paystack.
 */
export default function MyFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const page = await billingApi.myFees({ page_size: 100 });
      setFees(page?.results || []);
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const owed = fees.reduce((sum, f) => sum + Number(f.pending_amount || 0), 0);
  const students = new Set(fees.map((f) => f.student_id));

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <CreditCard className="h-5 w-5 text-green-600" /> School fees
          </h2>
          {!loading && fees.length > 0 && (
            <p className="text-sm text-gray-600">Outstanding: <span className="font-semibold">{naira(owed)}</span></p>
          )}
        </div>
        <button type="button" onClick={load} aria-label="Reload fees" className="rounded-lg border p-2 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" />
        </button>
      </header>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="py-8 text-center text-gray-500">Loading fees…</p>
      ) : fees.length ? (
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {students.size > 1 && <th scope="col" className="px-3 py-2 text-left">Child</th>}
                <th scope="col" className="px-3 py-2 text-left">Fee</th>
                <th scope="col" className="px-3 py-2 text-left">Session / term</th>
                <th scope="col" className="px-3 py-2 text-right">Amount</th>
                <th scope="col" className="px-3 py-2 text-right">Paid</th>
                <th scope="col" className="px-3 py-2 text-right">Balance</th>
                <th scope="col" className="px-3 py-2 text-left">Due</th>
                <th scope="col" className="px-3 py-2 text-left">Status</th>
                <th scope="col" className="px-3 py-2"><span className="sr-only">Pay</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((fee) => (
                <tr key={fee.id}>
                  {students.size > 1 && <td className="px-3 py-2">{fee.student_name}</td>}
                  <td className="px-3 py-2 font-medium">
                    {feeTypeLabel(fee.fee_type)}
                    <span className="block text-xs font-normal text-gray-500">{fee.organization_name}</span>
                  </td>
                  <td className="px-3 py-2">{[fee.academic_year, fee.semester].filter(Boolean).join(" · ")}</td>
                  <td className="px-3 py-2 text-right">{naira(fee.total_amount)}</td>
                  <td className="px-3 py-2 text-right">{naira(fee.paid_amount)}</td>
                  <td className="px-3 py-2 text-right font-semibold">{naira(fee.pending_amount)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{formatDate(fee.due_date)}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${STATUS_STYLE[fee.status] || STATUS_STYLE.pending}`}>{fee.status}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {fee.can_pay_online ? (
                      <button type="button" onClick={() => setPaying(fee)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                        Pay
                      </button>
                    ) : Number(fee.pending_amount) > 0 ? (
                      <span className="text-xs text-gray-500">Pay at school</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500">No fees have been billed yet.</p>
      )}

      {paying && <PayDialog fee={paying} onClose={() => setPaying(null)} />}
    </section>
  );
}
