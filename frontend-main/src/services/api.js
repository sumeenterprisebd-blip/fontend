import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

// Lazily create the axios instance on first usage.
// This keeps axios (and its parsing/execution cost) out of the critical path for pages
// that don't immediately hit the API (improves TBT/LCP and reduces unused JS).
let apiPromise;

const getApi = async () => {
  if (apiPromise) return apiPromise;

  apiPromise = (async () => {
    const { default: axios } = await import("axios");

    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      // Include cookies (fbp/fbc) for conversion API and server-side dedupe
      withCredentials: true,
      timeout: 30000, // Increased to 30 seconds for serverless cold starts
    });

    // Request interceptor to add auth token
    api.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login for admin routes only
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (
              currentPath.startsWith("/admin") &&
              currentPath !== "/login" &&
              currentPath !== "/register"
            ) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return api;
  })();

  return apiPromise;
};

const apiGet = (url, config) => getApi().then((api) => api.get(url, config));
const apiPost = (url, data, config) => getApi().then((api) => api.post(url, data, config));
const apiPut = (url, data, config) => getApi().then((api) => api.put(url, data, config));
const apiPatch = (url, data, config) => getApi().then((api) => api.patch(url, data, config));
const apiDelete = (url, config) => getApi().then((api) => api.delete(url, config));

// Auth API
export const authAPI = {
  register: (data) => apiPost(API_ENDPOINTS.AUTH.REGISTER, data),
  login: (data) => apiPost(API_ENDPOINTS.AUTH.LOGIN, data),
  getMe: () => apiGet(API_ENDPOINTS.AUTH.ME),
};

// Products API
export const productsAPI = {
  getProducts: (params, config) => apiGet(API_ENDPOINTS.PRODUCTS.LIST, { params, ...(config || {}) }),
  getAdminProducts: (params) => apiGet("/products/admin/all", { params }),
  getAllProducts: () => apiGet(API_ENDPOINTS.PRODUCTS.LIST),
  getProduct: (id) => apiGet(API_ENDPOINTS.PRODUCTS.DETAIL(id)),
  getCategories: () => apiGet(API_ENDPOINTS.PRODUCTS.CATEGORIES),
  createProduct: (data) => apiPost(API_ENDPOINTS.PRODUCTS.LIST, data),
  updateProduct: (id, data) => apiPut(API_ENDPOINTS.PRODUCTS.DETAIL(id), data),
  deleteProduct: (id) => apiDelete(API_ENDPOINTS.PRODUCTS.DETAIL(id)),
};

// Search API
export const searchAPI = {
  search: (params, config) => apiGet(API_ENDPOINTS.SEARCH.LIST, { params, ...(config || {}) }),
  suggest: (params, config) => apiGet(API_ENDPOINTS.SEARCH.SUGGEST, { params, ...(config || {}) }),
};

// Cart API
export const cartAPI = {
  getCart: () => apiGet(API_ENDPOINTS.CART.GET),
  addToCart: (data) => apiPost(API_ENDPOINTS.CART.ADD, data),
  updateCartItem: (itemId, data) => apiPut(API_ENDPOINTS.CART.UPDATE(itemId), data),
  removeFromCart: (itemId) => apiDelete(API_ENDPOINTS.CART.REMOVE(itemId)),
  clearCart: () => apiDelete(API_ENDPOINTS.CART.CLEAR),
};

// Orders API
export const ordersAPI = {
  getOrders: () => apiGet(API_ENDPOINTS.ORDERS.LIST),
  getAllOrders: () => apiGet(API_ENDPOINTS.ORDERS.LIST),
  createOrder: (data) => apiPost(API_ENDPOINTS.ORDERS.CREATE, data),
  getOrder: (id) => apiGet(API_ENDPOINTS.ORDERS.DETAIL(id)),
  updateOrder: (id, data) => apiPut(API_ENDPOINTS.ORDERS.DETAIL(id), data),
  updateOrderItems: (id, data) => apiPut(`/orders/${id}/items`, data),
  updateOrderPricing: (id, data) => apiPut(`/orders/${id}/pricing`, data),
  payAdvance: (id, data) => apiPost(`/orders/${id}/pay-advance`, data),
  updateAdvancePayment: (id, data) => apiPut(`/orders/${id}/advance-payment`, data),
  deleteOrder: (id) => apiDelete(API_ENDPOINTS.ORDERS.DETAIL(id)),
  updateOrderStatus: (id, data) => apiPut(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data),
  approveOrder: (id, data) => apiPut(`/orders/${id}/approve`, data || {}),
  rejectOrder: (id, data) => apiPut(`/orders/${id}/reject`, data || {}),
  markWhatsAppSent: (id) => apiPost(`/orders/${id}/whatsapp-sent`, {}),
  syncToGoogleSheets: (data) => apiPost("/orders/sync-sheets", data),
  exportToGoogleSheets: (data) => apiPost("/orders/export-to-sheets", data),
  getUnsyncedCount: (params) => apiGet("/orders/unsynced-count", { params }),
  trackGuestOrder: (data) => apiPost("/orders/track-guest", data),
  // Unified tracking search: Order ID / Invoice ID / Phone Number
  trackOrderSearch: (query) => {
    const q = String(query || "").trim();
    if (!q) {
      return Promise.reject(new Error("Search query is required"));
    }

    return apiPost("/orders/track-search", { query: q })
      .then((res) => res.data.data || res.data)
      .catch((err) => {
        throw err;
      });
  },
  // Track orders by phone number only
  trackOrdersByPhone: (phoneNumber) =>
    apiPost("/orders/track-by-phone", { phone: phoneNumber })
      .then((res) => res.data),
  // Track order by ID (with optional phone verification)
  trackOrder: (orderId, phoneNumber = "") => {
    // Validate orderId
    if (!orderId || orderId.trim() === "") {
      return Promise.reject(new Error("Order ID is required"));
    }

    const params = {
      ...(phoneNumber ? { phone: phoneNumber } : {}),
      // Cache-bust to avoid any CDN/proxy/browser caching of tracking responses
      _ts: Date.now(),
    };

    return apiGet(`/orders/track/${orderId.trim()}`, { params })
      .then((res) => {
        return res.data.data || res.data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

// Advance Payment API
export const advanceAPI = {
  checkUserStatus: (data) => apiPost(`/advance/check-user-status`, data),
  submitAdvance: (data) => apiPost(`/advance/submit-advance`, data),
};

// Admin Analytics API
export const adminAnalyticsAPI = {
  getAnalytics: (params) => apiGet("/admin/analytics", { params }),
};

// Admin Advance Payment Requests
export const adminAdvanceAPI = {
  list: () => apiGet("/admin/advance-list"),
  approve: (id) => apiPost("/admin/approve-advance", { id }),
  reject: (id, reason = "") => apiPost("/admin/reject-advance", { id, reason }),
  edit: (data) => apiPut("/admin/edit-advance", data),
};

// Admin Payment Settings API
export const adminPaymentSettingsAPI = {
  get: () => apiGet("/admin/payment-settings"),
  update: (data) => apiPost("/admin/payment-settings", data),
};

// Blacklist API (Admin)
export const blacklistAPI = {
  list: (params) => apiGet("/blacklist", { params }),
  create: (data) => apiPost("/blacklist", data),
  remove: (id) => apiDelete(`/blacklist/${id}`),
};

// Web Push (Admin)
export const pushAPI = {
  getPublicKey: () => apiGet("/push/public-key"),
  subscribe: (subscription) => apiPost("/push/subscribe", { subscription }),
  unsubscribe: (endpoint) => apiPost("/push/unsubscribe", { endpoint }),
  // Customer push subscription
  subscribeUser: (subscription) => apiPost("/push/subscribe-user", { subscription }),
  unsubscribeUser: (endpoint) => apiPost("/push/unsubscribe-user", { endpoint }),
  // Guest order push subscription (phone-verified)
  subscribeGuest: ({ orderId, phone, subscription }) =>
    apiPost("/push/subscribe-guest", { orderId, phone, subscription }),
  unsubscribeGuest: ({ orderId, phone, endpoint }) =>
    apiPost("/push/unsubscribe-guest", { orderId, phone, endpoint }),
};

// Notifications (Customer)
export const notificationsAPI = {
  listMy: (params) => apiGet("/notifications", { params }),
  unreadCount: () => apiGet("/notifications/unread-count"),
  markRead: (id) => apiPatch(`/notifications/${id}/read`, {}),
  markAllRead: () => apiPatch("/notifications/read-all", {}),
  // Guest notifications (phone-verified)
  guestList: ({ orders, limit = 15 } = {}) =>
    apiPost(`/notifications/guest?limit=${encodeURIComponent(String(limit))}`, { orders }),
  guestUnreadCount: ({ orders } = {}) => apiPost("/notifications/guest/unread-count", { orders }),
  guestMarkRead: (id, { orders } = {}) => apiPatch(`/notifications/guest/${id}/read`, { orders }),
  guestMarkAllRead: ({ orders } = {}) => apiPatch("/notifications/guest/read-all", { orders }),
};

// Notifications (Admin)
export const adminNotificationsAPI = {
  list: (params) => apiGet("/admin/notifications", { params }),
  unreadCount: () => apiGet("/admin/notifications/unread-count"),
  markRead: (id) => apiPatch(`/admin/notifications/${id}/read`, {}),
  markUnread: (id) => apiPatch(`/admin/notifications/${id}/unread`, {}),
  markAllRead: () => apiPatch("/admin/notifications/read-all", {}),
  delete: (id) => apiDelete(`/admin/notifications/${id}`),
};

// Users API
export const usersAPI = {
  getAllUsers: () => apiGet(API_ENDPOINTS.USERS.LIST),
  listUsers: (params) => apiGet(API_ENDPOINTS.USERS.LIST, { params }),
  getProfile: () => apiGet(API_ENDPOINTS.USERS.PROFILE),
  updateProfile: (data) => apiPut(API_ENDPOINTS.USERS.PROFILE, data),
  updateUserRole: (userId, data) => apiPut(API_ENDPOINTS.USERS.UPDATE_ROLE(userId), data),
  updateUserStatus: (userId, data) => apiPut(`/users/${userId}/status`, data),
  setUserSuspicious: (userId, data) => apiPut(`/users/${userId}/suspicious`, data),
  verifyUserEmail: (userId, verified = true) => apiPut(`/users/${userId}/verify`, { verified }),
  verifyUserPhone: (userId, verified = true) => apiPut(`/users/${userId}/verify-phone`, { verified }),
  blockUser: (userId, data) => apiPut(`/users/${userId}/block`, data),
  getUserOrders: (userId, params) => apiGet(`/users/${userId}/orders`, { params }),
  getDuplicates: () => apiGet(`/users/duplicates`),
  deleteUser: (userId) => apiDelete(API_ENDPOINTS.USERS.DELETE(userId)),
  addAddress: (data) => apiPost(API_ENDPOINTS.USERS.ADDRESSES, data),
  updateAddress: (addressId, data) => apiPut(API_ENDPOINTS.USERS.ADDRESS(addressId), data),
  deleteAddress: (addressId) => apiDelete(API_ENDPOINTS.USERS.ADDRESS(addressId)),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) =>
    apiGet(API_ENDPOINTS.REVIEWS.PRODUCT(productId)),
  getPublicReviews: (limit = 10) => apiGet(`/reviews/public?limit=${limit}`),
  createReview: (data) => apiPost(API_ENDPOINTS.REVIEWS.CREATE, data),
  updateReview: (id, data) => apiPut(API_ENDPOINTS.REVIEWS.UPDATE(id), data),
  deleteReview: (id) => apiDelete(API_ENDPOINTS.REVIEWS.DELETE(id)),
  checkReviewExists: (orderId, productId) =>
    apiGet(`/reviews/check/${orderId}/${productId}`),
  // Admin endpoints
  getPendingReviews: () => apiGet("/reviews/pending"),
  getAllReviews: (params) => apiGet("/reviews/admin/all", { params }),
  approveReview: (id) => apiPut(`/reviews/${id}/approve`),
  rejectReview: (id) => apiPut(`/reviews/${id}/reject`),
  adminCreateReview: (data) => apiPost("/reviews/admin", data),
};

// Favorites API
export const favoritesAPI = {
  getFavorites: () => apiGet(API_ENDPOINTS.FAVORITES.LIST),
  addToFavorites: (data) => apiPost(API_ENDPOINTS.FAVORITES.ADD, data),
  checkFavorite: (productId) =>
    apiGet(API_ENDPOINTS.FAVORITES.CHECK(productId)),
  removeFromFavorites: (productId) =>
    apiDelete(API_ENDPOINTS.FAVORITES.REMOVE(productId)),
};

// Contact API
export const contactAPI = {
  sendMessage: (data) => apiPost(API_ENDPOINTS.CONTACT, data),
  // Admin endpoints
  getAllMessages: (params) => apiGet("/contact/admin/messages", { params }),
  getMessageById: (id) => apiGet(`/contact/admin/messages/${id}`),
  toggleReadStatus: (id) => apiPatch(`/contact/admin/messages/${id}/read`),
  deleteMessage: (id) => apiDelete(`/contact/admin/messages/${id}`),
  getStats: () => apiGet("/contact/admin/stats"),
};

// Upload API
export const uploadAPI = {
  getSignature: (folder) => {
    const params = folder ? { folder } : {};
    return apiGet(API_ENDPOINTS.UPLOAD.SIGNATURE, { params });
  },
};

// Brands API
export const brandsAPI = {
  getBrands: () => apiGet("/brands/public"),
  getAllBrands: () => apiGet("/brands"),
  getBrand: (id) => apiGet(`/brands/${id}`),
  createBrand: (data) => apiPost("/brands", data),
  updateBrand: (id, data) => apiPut(`/brands/${id}`, data),
  deleteBrand: (id) => apiDelete(`/brands/${id}`),
  getPressReleases: () => apiGet("/brands/press-releases"),
};

// Settings API
export const settingsAPI = {
  getSettings: (config) => apiGet("/settings", config),
  getSettingsFresh: () =>
    apiGet("/settings", {
      params: { _t: Date.now() },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    }),
  updateSettings: (data) => apiPut("/settings", data),
  uploadLogo: (imageData) => apiPost("/settings/logo", { imageData }),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params) => apiGet("/categories", { params }),
  getCategory: (id) => apiGet(`/categories/${id}`),
  createCategory: (data) => apiPost(`/categories`, data),
  updateCategory: (id, data) => apiPut(`/categories/${id}`, data),
  deleteCategory: (id) => apiDelete(`/categories/${id}`),
};

// Measurements API
export const measurementsAPI = {
  getMeasurements: (params) => apiGet("/measurements", { params }),
  getMeasurement: (id) => apiGet(`/measurements/${id}`),
  createMeasurement: (data) => apiPost(`/measurements`, data),
  updateMeasurement: (id, data) => apiPut(`/measurements/${id}`, data),
  deleteMeasurement: (id) => apiDelete(`/measurements/${id}`),
};

// Colors API
export const colorsAPI = {
  getColors: (params) => apiGet("/colors", { params }),
  getColor: (id) => apiGet(`/colors/${id}`),
  createColor: (data) => apiPost(`/colors`, data),
  updateColor: (id, data) => apiPut(`/colors/${id}`, data),
  deleteColor: (id) => apiDelete(`/colors/${id}`),
};

// Campaigns API
export const campaignsAPI = {
  // Public
  getActiveCampaign: () => apiGet("/campaigns/active").then((res) => res.data),
  trackClick: (id) => apiPost(`/campaigns/${id}/click`),

  // Admin
  getCampaigns: (params) => apiGet("/campaigns", { params }),
  getCampaign: (id) => apiGet(`/campaigns/${id}`),
  createCampaign: (data) => apiPost("/campaigns", data),
  updateCampaign: (id, data) => apiPut(`/campaigns/${id}`, data),
  deleteCampaign: (id) => apiDelete(`/campaigns/${id}`),
  toggleStatus: (id) => apiPatch(`/campaigns/${id}/toggle`),
  getAnalytics: (id) => apiGet(`/campaigns/${id}/analytics`),
};

// Heroes API
export const heroesAPI = {
  // Public
  getActiveHeroes: () => apiGet("/heroes/active").then((res) => res.data),
  trackClick: (id) => apiPost(`/heroes/${id}/click`),

  // Admin
  getHeroes: (params) => apiGet("/heroes", { params }),
  getHero: (id) => apiGet(`/heroes/${id}`),
  createHero: (data) => apiPost("/heroes", data),
  updateHero: (id, data) => apiPut(`/heroes/${id}`, data),
  deleteHero: (id) => apiDelete(`/heroes/${id}`),
  toggleStatus: (id) => apiPatch(`/heroes/${id}/toggle`),
  updatePriority: (id, priority) => apiPatch(`/heroes/${id}/priority`, { priority }),
  getAnalytics: (id) => apiGet(`/heroes/${id}/analytics`),
};

// Likes API
export const likesAPI = {
  likeProduct: (productId) => apiPost(`/likes/${productId}`),
  getLikeCount: (productId) => apiGet(`/likes/${productId}`),
  checkComboOffer: (data) => apiPost("/likes/check-combo", data),
};

// Popup API
export const popupAPI = {
  getHomepagePopup: () => apiGet("/popup/homepage"),
  getPopups: () => apiGet("/popup"),
  getPopup: (id) => apiGet(`/popup/${id}`),
  createPopup: (data) => apiPost("/popup", data),
  updatePopup: (id, data) => apiPut(`/popup/${id}`, data),
  deletePopup: (id) => apiDelete(`/popup/${id}`),
  togglePopupStatus: (id) => apiPatch(`/popup/${id}/toggle`),
};

// Facebook Videos API
export const facebookVideosAPI = {
  getActiveVideos: () => apiGet("/facebook-videos/active"),
  getVideos: () => apiGet("/facebook-videos"),
  getVideo: (id) => apiGet(`/facebook-videos/${id}`),
  createVideo: (data) => apiPost("/facebook-videos", data),
  updateVideo: (id, data) => apiPut(`/facebook-videos/${id}`, data),
  deleteVideo: (id) => apiDelete(`/facebook-videos/${id}`),
  toggleVideoStatus: (id) => apiPatch(`/facebook-videos/${id}/toggle`),
  trackClick: (id) => apiPost(`/facebook-videos/${id}/click`),
  getAnalytics: () => apiGet("/facebook-videos/analytics"),
};

// Default export kept for backward compatibility (some pages import `api` directly).
// Mirrors the axios instance method signatures.
const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  request: (config) => getApi().then((client) => client.request(config)),
};

export default api;
