/**
 * Subscriptions, renewals and the school's Paystack payout account.
 * Backend: /api/billing/ (ilearnova-be billing_app).
 */
import { SUBSCRIPTION_BLOCKED_EVENT, http } from "./baseClient";

export { SUBSCRIPTION_BLOCKED_EVENT };

const BILLING = "/api/billing";
const data = (payload) => (payload && "data" in payload ? payload.data : payload);


export const billingApi = {
  status: async () => data(await http.get(`${BILLING}/subscription/status/`, { auth: true })),
  plans: async () => data(await http.get(`${BILLING}/plans/`, { auth: false })),
  schoolSubscription: async () =>
    data(await http.get(`${BILLING}/school/subscription/`, { auth: true })),
  renew: async (plan) =>
    data(await http.post(`${BILLING}/school/subscription/renew/`, { plan }, { auth: true })),
  verifyPayment: async (reference) =>
    data(
      await http.get(`${BILLING}/payments/${encodeURIComponent(reference)}/verify/`, { auth: false })
    ),
  banks: async () => data(await http.get(`${BILLING}/school/banks/`, { auth: true })),
  payoutAccount: async () =>
    data(await http.get(`${BILLING}/school/payment-account/`, { auth: true })),
  savePayoutAccount: async (account) =>
    data(await http.put(`${BILLING}/school/payment-account/`, account, { auth: true })),
};
