import { http } from "@/api/baseClient";

/**
 * Voucher Management API functions
 */

// Voucher CRUD operations
export const getVouchers = async (params = {}) => {
  return await http.get("/api/vouchers", { auth: true, params });
};

export const createVoucher = async (voucherData) => {
  return await http.post("/api/vouchers", { auth: true, body: voucherData });
};

export const getVoucher = async (voucherId) => {
  return await http.get(`/api/vouchers/${voucherId}`, { auth: true });
};

export const updateVoucher = async (voucherId, voucherData) => {
  return await http.put(`/api/vouchers/${voucherId}`, { auth: true, body: voucherData });
};

export const deleteVoucher = async (voucherId) => {
  return await http.del(`/api/vouchers/${voucherId}`, { auth: true });
};

// Voucher redemption operations
export const redeemVoucher = async (voucherCode, userId, orderData = {}) => {
  return await http.post("/api/vouchers/redeem", {
    auth: true,
    body: { code: voucherCode, userId, ...orderData }
  });
};

export const validateVoucher = async (voucherCode, userId = null) => {
  return await http.post("/api/vouchers/validate", {
    auth: true,
    body: { code: voucherCode, userId }
  });
};

// Voucher filtering and search
export const getVouchersByStatus = async (status) => {
  return await http.get(`/api/vouchers/status/${status}`, { auth: true });
};

export const getVouchersByType = async (type) => {
  return await http.get(`/api/vouchers/type/${type}`, { auth: true });
};

export const searchVouchers = async (query) => {
  return await http.get("/api/vouchers/search", {
    auth: true,
    params: { q: query }
  });
};

// Voucher analytics
export const getVoucherStats = async () => {
  return await http.get("/api/vouchers/stats", { auth: true });
};

export const getVoucherUsageHistory = async (voucherId) => {
  return await http.get(`/api/vouchers/${voucherId}/usage`, { auth: true });
};
