import { http } from "./baseClient";

/**
 * Authentication API functions for login, registration, logout, refresh, and user info.
 */

export async function login({ username, password }) {
  return await http.post("/api/auth/login/", {
    body: { username, password },
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
  return await http.post("/api/auth/register/super-admin/", {
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
  return await http.post("/api/auth/logout/");
}

export async function refreshToken() {
  return await http.post("/api/auth/refresh/");
}

export async function getCurrentUser() {
  return await http.get("/api/auth/profile/");
}

export async function updateProfile(data) {
  return await http.put("/api/auth/profile/", { body: data });
}

export async function changePassword(current_password, password, password_confirmation) {
  return await http.post("/api/auth/change-password/", {
    body: { current_password, password, password_confirmation },
  });
}

export async function getOrganizations() {
  return await http.get("/api/organizations/", {
    auth: false,
  });
}
