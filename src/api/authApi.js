import { http } from "./baseClient";
import { getTokens } from "./auth";

/**
 * Authentication API functions for login, registration, logout, refresh, and user info.
 */

export async function login({ username, password, organization_code }) {
  return await http.post("/api/auth/login/", {
    body: { username, password, ...(organization_code ? { organization_code } : {}) },
    auth: false,
  });
}

export async function register(data) {
  // data should include role and other required fields depending on role
  return await http.post("/api/auth/register/", {
    body: data,
    auth: false,
  });
}

export async function registerSuperAdmin(data) {
  return await http.post("/api/auth/register/", {
    body: data,
    auth: false,
  });
}

export async function registerOrgAdmin(data) {
  return await http.post("/api/auth/register/org-admin/", {
    body: data,
    auth: false,
  });
}

export async function schoolAdminLogin({ email, password, school_code }) {
  return await http.post("/api/auth/school-admin/login/", {
    body: { email, password, ...(school_code ? { school_code } : {}) },
    auth: false,
  });
}

export async function registerTeacher(data) {
  return await http.post("/api/auth/register/teacher/", {
    body: data,
    auth: false,
  });
}

export async function registerStudent(data) {
  return await http.post("/api/auth/register/student/", {
    body: data,
    auth: false,
  });
}

export async function registerParent(data) {
  return await http.post("/api/auth/register/parent/", {
    body: data,
    auth: false,
  });
}


export async function registerIndividualLearner(data) {
  console.log(data)
  return await http.post("/api/auth/register/individual-learner/", {
    body: data,
    auth: false,
  });
}

export async function logout() {
  const { refresh } = getTokens();
  return await http.post("/api/auth/logout/", {
    body: refresh ? { refresh_token: refresh } : {},
  });
}

export async function refreshToken() {
  const { refresh } = getTokens();
  return await http.post("/api/auth/refresh/", {
    body: refresh ? { refresh } : {},
    auth: false,
  });
}

export async function forgotPassword(email) {
  return await http.post("/api/forgot-password/", {
    body: { email },
    auth: false,
  });
}

export async function resendOtp(email) {
  return await http.post("/api/resend-otp/", {
    body: { email },
    auth: false,
  });
}

export async function verifyOtp(email, otp) {
  return await http.post("/api/verify-otp/", {
    body: { email, otp },
    auth: false,
  });
}

export async function resetPassword(reset_token, new_password, confirm_password) {
  return await http.post("/api/reset-password/", {
    body: { reset_token, new_password, confirm_password },
    auth: false,
  });
}

export async function getCurrentUser() {
  return await http.get("/api/auth/profile/");
}

export async function updateProfile(data) {
  return await http.put("/api/auth/profile/", { body: data });
}

export async function getOrganizations() {
  return await http.get("/api/organizations/", {
    auth: false,
  });
}
