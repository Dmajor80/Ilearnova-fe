import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { billingApi } from "@/api/billingApi";
import { apiErrorDetails } from "@/lib/apiHelpers";
import { getTokens } from "@/api/auth";
import { BILLING_PATH, naira } from "./subscriptionUtils";

/** What to tell the payer once Paystack confirms, by what they paid for. */
function nextStep(payment) {
  if (payment.purpose === "school_fee") {
    return { text: "The school fee has been credited.", link: "/post-login", label: "Back to dashboard" };
  }
  // A renewal comes from a signed-in school admin; a new school's payment
  // can come from anyone and buys an access code sent by email.
  if (getTokens()?.access) {
    return { text: "Your school's subscription has been renewed.", link: BILLING_PATH, label: "Back to billing" };
  }
  return {
    text: "We've emailed you an access code. Sign up with the same email address to create your school.",
    link: "/signup",
    label: "Create your school",
  };
}

/**
 * Paystack sends payers back here with ?reference=… . Ask the backend to
 * confirm the payment (it checks with Paystack and credits it once).
 */
export default function PaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    if (!reference) {
      setError("This link has no payment reference.");
      setChecking(false);
      return;
    }
    setChecking(true);
    setError("");
    try {
      setPayment(await billingApi.verifyPayment(reference));
    } catch (err) {
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      setChecking(false);
    }
  }, [reference]);

  useEffect(() => {
    check();
  }, [check]);

  let body;
  if (checking) {
    body = <p className="text-gray-600">Confirming your payment…</p>;
  } else if (error) {
    body = (
      <>
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <p role="alert" className="text-red-700">{error}</p>
      </>
    );
  } else if (payment?.status === "success") {
    const step = nextStep(payment);
    body = (
      <>
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h1 className="text-xl font-bold text-gray-900">Payment received: {naira(payment.amount)}</h1>
        <p className="text-gray-700">{step.text}</p>
        <p className="text-xs text-gray-500">Reference {payment.reference}</p>
        <Link to={step.link} className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          {step.label}
        </Link>
      </>
    );
  } else if (payment?.status === "failed") {
    body = (
      <>
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-xl font-bold text-gray-900">Payment failed</h1>
        <p className="text-gray-700">You have not been charged. Please try again.</p>
      </>
    );
  } else {
    body = (
      <>
        <Clock className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="text-xl font-bold text-gray-900">Payment not confirmed yet</h1>
        <p className="text-gray-700">If you completed the payment, it can take a minute to come through.</p>
        <button type="button" onClick={check} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Check again</button>
      </>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <section className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow">{body}</section>
    </main>
  );
}
