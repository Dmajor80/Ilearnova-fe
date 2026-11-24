import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Info } from "lucide-react";
import useSubscriptionStatus from "./useSubscriptionStatus";
import { BILLING_PATH, bannerFor } from "./subscriptionUtils";

const TONES = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  danger: "border-red-300 bg-red-50 text-red-900",
};

/**
 * One line across the top of the app while the school's subscription is
 * ending or has lapsed. Admins get a Renew button; others are told the
 * school is read-only.
 */
export default function SubscriptionBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { status } = useSubscriptionStatus(location.pathname);
  const banner = bannerFor(status);
  if (!banner) return null;

  const Icon = banner.tone === "info" ? Info : AlertTriangle;
  return (
    <div role={banner.tone === "danger" ? "alert" : "status"} className={`flex flex-wrap items-center justify-center gap-3 border-b px-4 py-2 text-sm ${TONES[banner.tone]}`}>
      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{banner.text}</span>
      {banner.canRenew && location.pathname !== BILLING_PATH && (
        <button type="button" onClick={() => navigate(BILLING_PATH)} className="rounded-md bg-white/80 px-3 py-1 font-semibold underline-offset-2 hover:underline">
          Renew
        </button>
      )}
    </div>
  );
}
