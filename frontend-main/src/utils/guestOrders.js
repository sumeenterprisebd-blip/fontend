/**
 * Guest Order Management Utilities
 * Handles tracking guest orders using localStorage
 */

const GUEST_ORDERS_KEY = "drip_drop_guest_orders";

/**
 * Save guest order ID for tracking
 * @param {String} orderId - Order ID
 * @param {String} email - Customer email
 */
export const saveGuestOrder = (orderId, email) => {
  if (typeof window === "undefined") return;

  try {
    const orders = getGuestOrders();
    orders.push({
      orderId,
      email,
      createdAt: new Date().toISOString(),
    });

    // Keep only last 10 orders
    const recentOrders = orders.slice(-10);
    localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(recentOrders));
  } catch (error) {
  }
};

/**
 * Get all guest orders
 * @returns {Array} Array of guest orders
 */
export const getGuestOrders = () => {
  if (typeof window === "undefined") return [];

  try {
    const ordersData = localStorage.getItem(GUEST_ORDERS_KEY);
    return ordersData ? JSON.parse(ordersData) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Clear guest orders (after login)
 */
export const clearGuestOrders = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_ORDERS_KEY);
  } catch (error) {
  }
};
