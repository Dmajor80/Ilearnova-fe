/**
 * Subscriptions, renewals and the school's Paystack payout account.
 * Backend: /api/billing/ (ilearnova-be billing_app).
 */
import { SUBSCRIPTION_BLOCKED_EVENT, http } from "./baseClient";

export { SUBSCRIPTION_BLOCKED_EVENT };

const BILLING = "/api/billing";
const data = (payload) => (payload && "data" in payload ? payload.data : payload);


export const billingApi = {
  /** Is this code usable (by this email)? Does not redeem it. */
  checkAccessCode: async (code, email) =>
    data(
      await http.post(
        `${BILLING}/access-codes/check/`,
        { code, ...(email ? { email } : {}) },
        { auth: false }
      )
    ),
  /** Buy a plan for a new school; the payer is emailed an access code. */
  checkout: async (plan, email) =>
    data(await http.post(`${BILLING}/subscriptions/checkout/`, { plan, email }, { auth: false })),
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
  /** One fee for one student: `student` is their user id. */
  createFee: async (fee) =>
    data(await http.post(`${BILLING}/school/fees/`, fee, { auth: true })),
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

const SUPER = `${BILLING}/superadmin`;

/** Platform owner (superadmin): onboard schools, grant/renew, codes, plans. */
export const superBillingApi = {
  schools: (params) => http.get(`${SUPER}/schools/`, { auth: true, params }),
  /** Email an access code (optionally locked to that email) with a sign-up link. */
  invite: (body) => http.post(`${SUPER}/access-codes/`, { count: 1, ...body }, { auth: true }),
  /** Grant to an email (new school) or with `organization` (renew a school). */
  grant: (body) => http.post(`${SUPER}/subscriptions/`, body, { auth: true }),
  codes: (params) => http.get(`${SUPER}/access-codes/`, { auth: true, params }),
  sendCode: (id, body = {}) => http.post(`${SUPER}/access-codes/${id}/send/`, body, { auth: true }),
  deactivateCode: (id) => http.del(`${SUPER}/access-codes/${id}/`, { auth: true }),
  plans: (params) => http.get(`${SUPER}/plans/`, { auth: true, params }),
  createPlan: (plan) => http.post(`${SUPER}/plans/`, plan, { auth: true }),
  updatePlan: (id, changes) => http.patch(`${SUPER}/plans/${id}/`, changes, { auth: true }),
  deactivatePlan: (id) => http.del(`${SUPER}/plans/${id}/`, { auth: true }),
};
