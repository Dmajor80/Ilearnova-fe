import { http } from "@/api/baseClient";

/**
 * School Admin API functions for organization and user profile management
 */

/**
 * Upload organization logo
 * @param {File} logoFile - The logo image file
 * @param {string} organizationId - The organization ID
 * @returns {Promise} API response
 */
export const uploadOrganizationLogo = async (logoFile, organizationId) => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  formData.append('organization_id', organizationId);

  const response = await http.post('/api/organizations/upload-logo/', formData, {
    auth: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};

/**
 * Update organization details
 * @param {string} organizationId - The organization ID
 * @param {Object} organizationData - The organization data to update
 * @returns {Promise} API response
 */
export const updateOrganization = async (organizationId, organizationData) => {
  const response = await http.put(`/api/organizations/${organizationId}/`, organizationData, {
    auth: true,
  });

  return response;
};

/**
 * Get organization details
 * @param {string} organizationId - The organization ID
 * @returns {Promise} API response
 */
export const getOrganization = async (organizationId) => {
  const response = await http.get(`/api/organizations/${organizationId}/`, {
    auth: true,
  });

  return response;
};

/**
 * Upload user profile picture
 * @param {File} profileFile - The profile image file
 * @returns {Promise} API response
 */
export const uploadUserProfilePicture = async (profileFile) => {
  const formData = new FormData();
  formData.append('profile_picture', profileFile);

  const response = await http.post('/api/users/upload-profile-picture/', formData, {
    auth: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};

/**
 * Update user profile
 * @param {Object} profileData - The user profile data to update
 * @returns {Promise} API response
 */
export const updateUserProfile = async (profileData) => {
  const response = await http.put('/api/users/profile/', profileData, {
    auth: true,
  });

  return response;
};

/**
 * Get current user profile
 * @returns {Promise} API response
 */
export const getUserProfile = async () => {
  const response = await http.get('/api/users/profile/', {
    auth: true,
  });

  return response;
};

/**
 * School dashboard specific API calls
 */

/**
 * Get school dashboard metrics
 * @returns {Promise} API response
 */
export const getSchoolDashboardMetrics = async () => {
  const response = await http.get('/api/admin/school/dashboard/metrics/', {
    auth: true,
  });

  return response;
};

/**
 * Get school performance data
 * @param {Object} params - Query parameters (period, metric)
 * @returns {Promise} API response
 */
export const getSchoolPerformanceData = async (params = {}) => {
  const response = await http.get('/api/admin/school/dashboard/performance/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * Get school teachers data
 * @param {Object} params - Query parameters (limit, include_performance, etc.)
 * @returns {Promise} API response
 */
export const getSchoolTeachers = async (params = {}) => {
  const response = await http.get('/api/admin/school/teachers/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * Get unpaid tuition data
 * @param {Object} params - Query parameters (limit, overdue_only, etc.)
 * @returns {Promise} API response
 */
export const getUnpaidTuition = async (params = {}) => {
  const response = await http.get('/api/admin/school/students/unpaid_tuition/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * Get recent school activities
 * @param {Object} params - Query parameters (limit, type, etc.)
 * @returns {Promise} API response
 */
export const getSchoolActivities = async (params = {}) => {
  const response = await http.get('/api/admin/school/dashboard/activities/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * Get school students data
 * @param {Object} params - Query parameters (limit, search, grade, status, etc.)
 * @returns {Promise} API response
 */
export const getSchoolStudents = async (params = {}) => {
  const response = await http.get('/api/admin/school/students/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * Get individual student details
 * @param {string} studentId - The student ID
 * @returns {Promise} API response
 */
export const getStudentDetails = async (studentId) => {
  const response = await http.get(`/api/admin/school/students/${studentId}/`, {
    auth: true,
  });

  return response;
};

/**
 * Create new student
 * @param {Object} studentData - The student data to create
 * @returns {Promise} API response
 */
export const createStudent = async (studentData) => {
  const response = await http.post('/api/admin/school/students/', studentData, {
    auth: true,
  });

  return response;
};

/**
 * Update student details
 * @param {string} studentId - The student ID
 * @param {Object} studentData - The student data to update
 * @returns {Promise} API response
 */
export const updateStudent = async (studentId, studentData) => {
  const response = await http.put(`/api/admin/school/students/${studentId}/`, studentData, {
    auth: true,
  });

  return response;
};

/**
 * Delete student
 * @param {string} studentId - The student ID
 * @returns {Promise} API response
 */
export const deleteStudent = async (studentId) => {
  const response = await http.del(`/api/admin/school/students/${studentId}/`, {
    auth: true,
  });

  return response;
};

/**
 * Get available grades/classes
 * @param {Object} params - Query parameters (active_only, etc.)
 * @returns {Promise} API response
 * @note Organization ID is automatically injected via X-Org-Id header by the org_gate system
 */
export const getSchoolGrades = async (params = {}) => {
  const response = await http.get('/api/classes/', {
    auth: true,
    params,
  });

  return response;
};

/**
 * School exams (org admin, scoped server-side to the admin's school).
 * List envelope: { success, data: { exams: [...], pagination: { page, limit, total, pages, has_next, has_prev } } }
 * @param {Object} params - page, page_size, status (draft|published|archived), class_id, subject_id, search, ordering
 */
export const getSchoolExams = (params = {}) =>
  http.get('/api/admin/school/exams/', { auth: true, params });

export const getSchoolExam = (examId) =>
  http.get(`/api/admin/school/exams/${examId}/`, { auth: true });

export const createSchoolExam = (examData) =>
  http.post('/api/admin/school/exams/', examData, { auth: true });

// The backend exam viewset disallows PUT; PATCH is the update method.
export const updateSchoolExam = (examId, examData) =>
  http.patch(`/api/admin/school/exams/${examId}/`, examData, { auth: true });

// Hard-deletes drafts; archives exams that already have attempts.
export const deleteSchoolExam = (examId) =>
  http.del(`/api/admin/school/exams/${examId}/`, { auth: true });

/** Attempt summaries: [{ id, student_name, status, started_at, submitted_at, score, percentage, is_passed, ... }] */
export const getSchoolExamResults = (examId) =>
  http.get(`/api/admin/school/exams/${examId}/results/`, { auth: true });

/** Legacy admin subject list (currently returns an empty list from the backend). */
export const getAdminSubjects = () =>
  http.get('/api/admin/subjects/', { auth: true });

/**
 * API endpoints being used by the school admin dashboard:
 * 
 * Organization Management:
 * - POST /api/organizations/upload-logo/ - Upload organization logo
 * - PUT /api/organizations/{id}/ - Update organization details
 * - GET /api/organizations/{id}/ - Get organization details
 * 
 * User Profile Management:
 * - POST /api/users/upload-profile-picture/ - Upload user profile picture
 * - PUT /api/users/profile/ - Update user profile
 * - GET /api/users/profile/ - Get current user profile
 * 
 * School Dashboard Data:
 * - GET /api/admin/school/dashboard/metrics/ - School overview metrics
 * - GET /api/admin/school/dashboard/performance/ - Performance analytics
 * - GET /api/admin/school/teachers/ - Teachers data
 * - GET /api/admin/school/students/ - Students data
 * - GET /api/admin/school/students/{id}/ - Individual student details
 * - POST /api/admin/school/students/ - Create new student
 * - PUT /api/admin/school/students/{id}/ - Update student details
 * - DELETE /api/admin/school/students/{id}/ - Delete student
 * - GET /api/classes/ - Available grades/classes (org ID via X-Org-Id header)
 * - GET /api/admin/school/students/unpaid_tuition/ - Unpaid tuition data
 * - GET /api/admin/school/dashboard/activities/ - Recent activities
 * - GET/POST /api/admin/school/exams/ - School exams list / create
 * - GET/PATCH/DELETE /api/admin/school/exams/{id}/ - Exam detail / update / delete (archives if attempted)
 * - GET /api/admin/school/exams/{id}/results/ - Exam attempt summaries
 *
 * Expected API Response Structures:
 * 
 * Organization Data:
 * {
 *   "id": "0a74830d-54ce-49c6-9a22-2ae8ca9f7dae",
 *   "name": "Bytes Analytics",
 *   "code": "CREA80KI",
 *   "logo": "https://cdn.example.com/logos/org_logo.png",
 *   "address": "Lagos",
 *   "phone_number": "081234566",
 *   "email": "super.user@yopmail.com",
 *   "website": null
 * }
 * 
 * User Profile Data:
 * {
 *   "id": "1df9e9c8-98ee-441e-98ed-7a5d58d76958",
 *   "email": "super.user@yopmail.com",
 *   "first_name": "super",
 *   "last_name": "user",
 *   "profile_picture": "https://cdn.example.com/profiles/user_avatar.jpg",
 *   "organizations": [
 *     {
 *       "organization": { ... },
 *       "roles": [...]
 *     }
 *   ]
 * }
 */
