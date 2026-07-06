// API Configuration
// Both sumetraders.com and sumetraders.shop use the same API backend
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get the current domain for domain-specific configurations
export const getCurrentDomain = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sumetraders.shop';
  return window.location.origin;
};

// Check which domain is being used
export const isSumetradersShop = () => {
  const domain = getCurrentDomain();
  return domain.includes('sumetraders.shop');
};

export const isSumetradersCom = () => {
  const domain = getCurrentDomain();
  return domain.includes('sumetraders.com');
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    FORGOT_PASSWORD_VERIFY_OTP: "/auth/forgot-password/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
  },
  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
    CATEGORIES: "/products/categories",
  },
  // Search
  SEARCH: {
    LIST: "/search",
    SUGGEST: "/search/suggest",
  },
  // Cart
  CART: {
    GET: "/cart",
    ADD: "/cart",
    UPDATE: (itemId) => `/cart/${itemId}`,
    REMOVE: (itemId) => `/cart/${itemId}`,
    CLEAR: "/cart",
  },
  // Orders
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: (id) => `/orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },
  // Users
  USERS: {
    LIST: "/users",
    PROFILE: "/users/profile",
    ADDRESSES: "/users/addresses",
    ADDRESS: (id) => `/users/addresses/${id}`,
    UPDATE_ROLE: (id) => `/users/${id}/role`,
    DELETE: (id) => `/users/${id}`,
  },
  // Reviews
  REVIEWS: {
    PRODUCT: (productId) => `/reviews/product/${productId}`,
    CREATE: "/reviews",
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
  },
  // Favorites
  FAVORITES: {
    LIST: "/favorites",
    ADD: "/favorites",
    CHECK: (productId) => `/favorites/check/${productId}`,
    REMOVE: (productId) => `/favorites/${productId}`,
  },
  // Contact
  CONTACT: "/contact",
  // Upload
  UPLOAD: {
    SIGNATURE: "/upload/signature",
  },
};
