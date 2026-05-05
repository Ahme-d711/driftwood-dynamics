/**
 * Centralized API endpoint constants
 * Makes it easier to manage and update URLs across the application
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY: '/auth/verify',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    REVENUE_ANALYTICS: '/dashboard/revenue-analytics',
  },
  ORDERS: {
    LIST: '/orders',
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  SETTINGS: {
    BASE: '/settings',
  },
  USERS: {
    BASE: '/users',
    PROFILE: (id: string) => `/users/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`,
  },
  VENDOR: {
    STATS: '/vendor/stats',
    PRODUCTS: '/vendor/products',
    ORDERS: '/vendor/orders',
  },
  // Add more as needed
} as const;
