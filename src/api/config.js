export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;
export const LOGO_URL = import.meta.env.VITE_LOGO_URL;
// Allow overriding refresh path via env; default to a common REST pattern with trailing slash
export const REFRESH_PATH =
  import.meta.env.VITE_REFRESH_PATH || "/api/auth/refresh/";
