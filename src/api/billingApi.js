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

  // School fees: lists are paginated as { count, next, previous, results }.
  schoolFees: (params) => http.get(`${BILLING}/school/fees/`, { auth: true, params }),
  updateFee: (id, changes) => http.patch(`${BILLING}/school/fees/${id}/`, changes, { auth: true }),
  billClass: async (body) =>
    data(await http.post(`${BILLING}/school/fees/assign-class/`, body, { auth: true })),
  schoolPayments: (params) => http.get(`${BILLING}/school/payments/`, { auth: true, params }),

  // Students and parents
  myFees: (params) => http.get(`${BILLING}/fees/`, { auth: true, params }),
  payFee: async (feeId, amount) =>
    data(
      await http.post(
        `${BILLING}/fees/${feeId}/pay/`,
        amount ? { amount: String(amount) } : {},
        { auth: true }
      )
    ),
  myPayments: (params) => http.get(`${BILLING}/payments/`, { auth: true, params }),
};

export const FEE_TYPES = [
  ["tuition", "Tuition"],
  ["library", "Library"],
  ["laboratory", "Laboratory"],
  ["sports", "Sports"],
  ["transport", "Transport"],
  ["meal", "Meal"],
  ["exam", "Exam"],
  ["activity", "Activity"],
  ["other", "Other"],
];

export const feeTypeLabel = (value) =>
  (FEE_TYPES.find(([key]) => key === value) || [null, value])[1];
