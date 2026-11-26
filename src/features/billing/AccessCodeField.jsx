import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { billingApi } from "@/api/billingApi";
import { planLength } from "./subscriptionUtils";

/**
 * Access code for creating a school (ILN-XXXX-XXXX-XXXX). Optional when the
 * email already has a subscription or was sent the code. Checks the code as
 * it is typed, without using it up.
 */
export default function AccessCodeField({ value, email, onChange, error, darkMode = false, hint, inputRef, onKeyDown }) {
  const [check, setCheck] = useState(null); // null | "checking" | result

  useEffect(() => {
    const code = (value || "").trim();
    if (code.length < 8) {
      setCheck(null);
      return undefined;
    }
    let active = true;
    setCheck("checking");
    const timer = setTimeout(() => {
      billingApi
        .checkAccessCode(code, (email || "").trim() || undefined)
        .then((result) => active && setCheck(result))
        .catch(() => active && setCheck(null));
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [value, email]);

  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  return (
    <div>
      <label htmlFor="access_code" className={`mb-2 block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Access code
      </label>
      <div className="relative">
        <KeyRound className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${muted}`} />
        <input
          ref={inputRef}
          onKeyDown={onKeyDown}
          id="access_code"
          name="access_code"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="ILN-XXXX-XXXX-XXXX"
          autoComplete="off"
          aria-describedby="access_code_help"
          className={`w-full rounded-xl border py-3 pl-10 pr-4 font-mono tracking-wide ${darkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white"}`}
        />
      </div>
      <div id="access_code_help" className="mt-1 text-sm">
        {error ? (
          <p role="alert" className="text-red-600">{error}</p>
        ) : check === "checking" ? (
          <p className={muted}>Checking code…</p>
        ) : check?.valid ? (
          <p className="text-green-700">
            Valid code{check.plan ? ` · ${check.plan}` : ""} · {planLength(check.duration_days)}
            {check.school_name ? ` · for ${check.school_name}` : ""}
          </p>
        ) : check ? (
          <p role="alert" className="text-red-600">
            This code is invalid, expired, used, or was issued to a different email.
          </p>
        ) : hint ? (
          <p className={muted}>{hint}</p>
        ) : (
          <p className={muted}>
            Leave blank if iLearnova set up a subscription for your email.{" "}
            <Link to="/pricing" className="font-medium text-blue-600 hover:underline">
              Need a subscription?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
