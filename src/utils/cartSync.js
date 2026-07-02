/**
 * Guest Cart API utilities
 * Handles merging guest cart with user cart after login
 */

import { cartAPI } from "@/services/api";
import { getGuestCartForMerge, clearGuestCart } from "@/utils/guestCart";

/**
 * Sync guest cart to user cart after login
 * @returns {Object} Result with success status
 */
export const syncGuestCartToUser = async () => {
  try {
    const guestItems = getGuestCartForMerge();

    if (guestItems.length === 0) {
      return { success: true, message: "No items to sync" };
    }

    // Add each item to user's cart
    const promises = guestItems.map((item) =>
      cartAPI.addToCart(item).catch((error) => {
        return { success: false };
      })
    );

    await Promise.all(promises);

    // Clear guest cart after successful sync
    clearGuestCart();

    return { success: true, message: "Cart synced successfully" };
  } catch (error) {
    return { success: false, message: "Failed to sync cart" };
  }
};
