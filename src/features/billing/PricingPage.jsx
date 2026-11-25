import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { billingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { naira, planLength } from "./subscriptionUtils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Plans for a new school. Paying through Paystack emails the payer an access
 * code; signing up with that email applies it automatically, or the code
 * can be handed to whoever will run the school.
 */
export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chosen, setChosen] = useState(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    billingApi
      .plans()
      .then((list) => setPlans((list || []).filter((p) => Number(p.amount) > 0)))
      .catch((err) => setError(apiErrorDetails(err).messages.join(" ")))
      .finally(() => setLoading(false));
  }, []);

  const buy = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const checkout = await billingApi.checkout(chosen.code, email.trim());
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setError(
        err?.status === 503
          ? "Online payment is not available yet. Contact iLearnova to get an access code."
          : apiErrorDetails(err).messages.join(" ")
      );
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bring your school to iLearnova</h1>
          <p className="mt-2 text-gray-600">
            Pick a plan. We email you an access code to create your school.{" "}
            Already have a code? <Link to="/register/school" className="font-medium text-blue-600 hover:underline">Create your school</Link>.
          </p>
        </header>

        {error && <p role="alert" className="mx-auto max-w-md rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-500">Loading plans…</p>
        ) : plans.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const selected = chosen?.code === plan.code;
              return (
                <button
                  key={plan.code}
                  type="button"
                  onClick={() => setChosen(plan)}
                  aria-pressed={selected}
                  className={`rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition hover:shadow-md ${selected ? "border-blue-600" : "border-transparent"}`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                    {selected && <Check className="h-5 w-5 text-blue-600" />}
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">{naira(plan.amount)}</p>
                  <p className="text-sm text-gray-500">{planLength(plan.duration_days)}</p>
                  {plan.description && <p className="mt-3 text-sm text-gray-600">{plan.description}</p>}
                </button>
              );
            })}
          </div>
        ) : (
          !error && <p className="text-center text-gray-600">No plans are on sale right now. Contact iLearnova for an access code.</p>
        )}

        {chosen && (
          <form onSubmit={buy} className="mx-auto max-w-md space-y-3 rounded-2xl bg-white p-6 shadow">
            <label className="block text-sm font-medium text-gray-700">
              Email for the access code
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="principal@yourschool.ng"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
            <p className="text-xs text-gray-500">Sign up with this email and the code is applied for you.</p>
            <button type="submit" disabled={busy || !EMAIL_RE.test(email.trim())} className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {busy ? "Opening Paystack…" : `Pay ${naira(chosen.amount)} with Paystack`}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
