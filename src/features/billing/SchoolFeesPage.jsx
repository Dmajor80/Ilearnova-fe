import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { billingApi, FEE_TYPES, feeTypeLabel } from "@/api/billingApi";
import { resultsApi } from "@/api/resultsApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { TERMS, currentSession, sessionOptions } from "@/features/results/resultsUtils";
import { amountProblem, formatDate, naira } from "./subscriptionUtils";
import StudentPicker from "./StudentPicker";

const PAGE_SIZE = 20;
const STATUSES = ["pending", "partial", "paid", "overdue", "waived"];

/** Bill a whole class, or one student (e.g. transport for Bayo only). */
function BillForm({ classes, onBilled }) {
  const [target, setTarget] = useState("class");
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({
    class_id: "",
    fee_type: "tuition",
    academic_year: currentSession(),
    semester: TERMS[0].label,
    total_amount: "",
    due_date: "",
    description: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const oneStudent = target === "student";
  const ready =
    (oneStudent ? student : form.class_id) && Number(form.total_amount) > 0 && form.due_date;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const { class_id: classId, ...fee } = form;
    try {
      if (oneStudent) {
        await billingApi.createFee({ ...fee, student: student.id, semester: fee.semester || null });
        setMessage({ type: "success", text: `Billed ${student.full_name || student.email}.` });
        setStudent(null);
      } else {
        const result = await billingApi.billClass({ ...fee, class_id: classId, semester: fee.semester || null });
        const name = classes.find((c) => String(c.id) === String(classId))?.name;
        setMessage({
          type: "success",
          text: `Billed ${result.created.length} student(s) in ${name}.${result.skipped ? ` ${result.skipped} already had this fee.` : ""}`,
        });
      }
      onBilled();
    } catch (err) {
      setMessage({ type: "error", text: apiErrorDetails(err).messages.join(" ") });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900">Bill a fee</h3>
        <fieldset className="flex gap-4 text-sm">
          <legend className="sr-only">Who to bill</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="bill-target" checked={!oneStudent} onChange={() => setTarget("class")} /> A whole class
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="bill-target" checked={oneStudent} onChange={() => setTarget("student")} /> One student
          </label>
        </fieldset>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {oneStudent ? (
          <div className="text-sm font-medium text-gray-700">
            Student
            <StudentPicker selected={student} onSelect={setStudent} />
          </div>
        ) : (
          <label className="text-sm font-medium text-gray-700">
            Class
            <select value={form.class_id} onChange={set("class_id")} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Choose a class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}
        <label className="text-sm font-medium text-gray-700">
          Fee
          <select value={form.fee_type} onChange={set("fee_type")} className="mt-1 w-full rounded-lg border px-3 py-2">
            {FEE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          {oneStudent ? "Amount (₦)" : "Amount per student (₦)"}
          <input type="number" min="1" step="0.01" value={form.total_amount} onChange={set("total_amount")} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-gray-700">
          Session
          <select value={form.academic_year} onChange={set("academic_year")} className="mt-1 w-full rounded-lg border px-3 py-2">
            {sessionOptions().map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Term
          <select value={form.semester} onChange={set("semester")} className="mt-1 w-full rounded-lg border px-3 py-2">
            {TERMS.map((t) => <option key={t.value} value={t.label}>{t.label}</option>)}
            <option value="">Whole session</option>
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Due date
          <input type="date" value={form.due_date} onChange={set("due_date")} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-gray-700 sm:col-span-3">
          Note (optional)
          <input value={form.description} onChange={set("description")} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
      </div>
      {message && (
        <p role={message.type === "error" ? "alert" : "status"} className={`rounded-lg p-2 text-sm ${message.type === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>
          {message.text}
        </p>
      )}
      <div className="flex justify-end">
        <button type="submit" disabled={busy || !ready} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          <Plus className="h-4 w-4" /> {busy ? "Billing…" : oneStudent ? "Bill student" : "Bill class"}
        </button>
      </div>
    </form>
  );
}

function RecordPaymentDialog({ fee, onClose, onSaved }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const problem = amountProblem(amount, fee.pending_amount);

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const paid = Math.round((Number(fee.paid_amount) + Number(amount)) * 100) / 100;
      await billingApi.updateFee(fee.id, { paid_amount: paid.toFixed(2) });
      onSaved();
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="record-payment-title" className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-xl">
        <h3 id="record-payment-title" className="text-lg font-semibold">Record a payment</h3>
        <p className="text-sm text-gray-600">
          Cash or bank transfer from {fee.student_name} for {feeTypeLabel(fee.fee_type)}. Balance {naira(fee.pending_amount)}.
        </p>
        <label className="block text-sm font-medium text-gray-700">
          Amount received (₦)
          <input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        {amount && (problem || error) && <p role="alert" className="text-sm text-red-700">{problem || error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
          <button type="button" disabled={busy || Boolean(problem)} onClick={save} className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">Save</button>
        </div>
      </section>
    </div>
  );
}

function FeesTable({ classes, refreshKey }) {
  const [filters, setFilters] = useState({ status: "", class_id: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ count: 0, results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await billingApi.schoolFees({ ...filters, page }));
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const pages = Math.max(1, Math.ceil((data.count || 0) / PAGE_SIZE));
  const filter = (field) => (e) => {
    setPage(1);
    setFilters({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium text-gray-700">
          Show class
          <select value={filters.class_id} onChange={filter("class_id")} className="mt-1 block rounded-lg border px-3 py-2">
            <option value="">All classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700">
          Show status
          <select value={filters.status} onChange={filter("status")} className="mt-1 block rounded-lg border px-3 py-2 capitalize">
            <option value="">Any</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <span className="flex-1" />
        <button type="button" onClick={load} aria-label="Reload fees" className="rounded-lg border p-2 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">Student</th>
              <th scope="col" className="px-3 py-2 text-left">Fee</th>
              <th scope="col" className="px-3 py-2 text-left">Session / term</th>
              <th scope="col" className="px-3 py-2 text-right">Amount</th>
              <th scope="col" className="px-3 py-2 text-right">Paid</th>
              <th scope="col" className="px-3 py-2 text-right">Balance</th>
              <th scope="col" className="px-3 py-2 text-left">Due</th>
              <th scope="col" className="px-3 py-2 text-left">Status</th>
              <th scope="col" className="px-3 py-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={9} className="py-6 text-center text-gray-500">Loading fees…</td></tr>
            ) : data.results.length ? (
              data.results.map((fee) => (
                <tr key={fee.id}>
                  <td className="px-3 py-2">{fee.student_name}</td>
                  <td className="px-3 py-2">{feeTypeLabel(fee.fee_type)}</td>
                  <td className="px-3 py-2">{[fee.academic_year, fee.semester].filter(Boolean).join(" · ")}</td>
                  <td className="px-3 py-2 text-right">{naira(fee.total_amount)}</td>
                  <td className="px-3 py-2 text-right">{naira(fee.paid_amount)}</td>
                  <td className="px-3 py-2 text-right font-semibold">{naira(fee.pending_amount)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{formatDate(fee.due_date)}</td>
                  <td className="px-3 py-2 capitalize">{fee.status}</td>
                  <td className="px-3 py-2 text-right">
                    {Number(fee.pending_amount) > 0 && (
                      <button type="button" onClick={() => setRecording(fee)} className="text-xs font-medium text-blue-700 hover:underline">
                        Record payment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={9} className="py-6 text-center text-gray-500">No fees match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Previous</button>
          <span>Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1.5 disabled:opacity-50">Next</button>
        </div>
      )}

      {recording && (
        <RecordPaymentDialog
          fee={recording}
          onClose={() => setRecording(null)}
          onSaved={() => {
            setRecording(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function PaymentsTable() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    billingApi
      .schoolPayments({ status: "success" })
      .then((page) => setRows(page?.results || []))
      .catch((err) => setError(apiErrorDetails(err).messages.join(" ")));
  }, []);

  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!rows.length) return <p className="py-6 text-center text-gray-500">No online payments yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left">Date</th>
            <th scope="col" className="px-3 py-2 text-left">Student</th>
            <th scope="col" className="px-3 py-2 text-left">Fee</th>
            <th scope="col" className="px-3 py-2 text-right">Amount</th>
            <th scope="col" className="px-3 py-2 text-left">Paid by</th>
            <th scope="col" className="px-3 py-2 text-left">Reference</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="whitespace-nowrap px-3 py-2">{formatDate(p.paid_at || p.created_at)}</td>
              <td className="px-3 py-2">{p.student_name}</td>
              <td className="px-3 py-2">{feeTypeLabel(p.fee_type)}</td>
              <td className="px-3 py-2 text-right">{naira(p.amount)}</td>
              <td className="px-3 py-2 text-gray-600">{p.email}</td>
              <td className="px-3 py-2 font-mono text-xs text-gray-500">{p.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** School admins: bill classes, track balances, record offline payments. */
export default function SchoolFeesPage() {
  const [classes, setClasses] = useState([]);
  const [tab, setTab] = useState("fees");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    resultsApi
      .myClasses()
      .then((list) => setClasses(Array.isArray(list) ? list : []))
      .catch(() => setClasses([]));
  }, []);

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <header>
        <h2 className="text-xl font-bold text-gray-900">School fees</h2>
        <p className="text-sm text-gray-600">
          Bill a class, follow balances, and record cash or transfer payments. Online payments settle to the account set under Billing.
        </p>
      </header>
      <BillForm classes={classes} onBilled={() => setRefreshKey((k) => k + 1)} />
      <div role="tablist" className="flex gap-2 border-b">
        {[["fees", "Fees"], ["payments", "Online payments"]].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === id ? "border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:text-gray-900"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "fees" ? <FeesTable classes={classes} refreshKey={refreshKey} /> : <PaymentsTable />}
    </section>
  );
}
