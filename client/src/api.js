const fallbackBase =
  typeof window !== 'undefined' ? window.location.origin : '';

export const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || fallbackBase;