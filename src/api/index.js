/**
 * API Modules Export
 */
export * from './authApi';
export * from './academicApi';
export * from './studentApi';
export * from './teacherApi';
export * from './assignmentApi';
export * from './gradeApi';
export * from './examApi';
export * from './communicationApi';
export * from './announcementApi';
export * from './voucherApi'; // Added voucher API export
export * from './learningApi'; // Added learning API export
export * from './schoolAdminApi';

/**
 * Core API utilities
 */
export { http } from './baseClient';
export { authorizedFetch, getAuthHeader, clearAuth, getTokens, setTokens } from './auth';

/**
 * Configuration
 */
export { API_BASE_URL, REFRESH_PATH } from './config';
