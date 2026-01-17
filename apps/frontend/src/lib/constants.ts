// constants.js - Application-wide constants

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_TIMEOUT = 10_000; // 10 seconds

export const REFRESH_INTERVAL = 10_000 // 10 seconds
