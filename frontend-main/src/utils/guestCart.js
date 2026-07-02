/**
 * Guest Cart Management Utilities
 * Handles cart operations for non-authenticated users using localStorage
 */

const GUEST_CART_KEY = "drip_drop_guest_cart";
const GUEST_CART_VERSION = "1.0";

/**
 * Get guest cart from localStorage
 * @returns {Array} Array of cart items
 */
export const getGuestCart = () => {
  if (typeof window === "undefined") return [];

  try {
    const cartData = localStorage.getItem(GUEST_CART_KEY);
    if (!cartData) return [];

    const parsed = JSON.parse(cartData);
    // Validate version
    if (parsed.version !== GUEST_CART_VERSION) {
      clearGuestCart();
      return [];
    }

    return parsed.items || [];
  } catch (error) {
    return [];
  }
};

/**
 * Save guest cart to localStorage
 * @param {Array} items - Cart items to save
 */
export const saveGuestCart = (items) => {
  if (typeof window === "undefined") return;

  try {
    const cartData = {
      version: GUEST_CART_VERSION,
      items,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartData));
  } catch (error) {
  }
};

/**
 * Add item to guest cart
 * @param {Object} productData - Product data to add
 * @returns {Object} Result with success status
 */
export const addToGuestCart = (productData) => {
  try {
    const cart = getGuestCart();
    const { productId, name, image, price, originalPrice, discountPercent, size, color, quantity, stock } =
      productData;

    // Check if item already exists
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart[existingItemIndex].quantity + (quantity || 1);

      // Check stock
      if (stock && newQuantity > stock) {
        return {
          success: false,
          message: `Only ${stock} items available in stock`,
        };
      }

      cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const newItem = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        name: name || "Product",
        image: image || "/logo.jpeg",
        price: price || 0,
        originalPrice: originalPrice || null,
        discountPercent: discountPercent || 0,
        size: size || "M",
        color: color || "Default",
        quantity: quantity || 1,
        stock: stock || 0,
        addedAt: new Date().toISOString(),
      };
      cart.push(newItem);
    }

    saveGuestCart(cart);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to add item to cart" };
  }
};

/**
 * Update guest cart item quantity
 * @param {String} itemId - Cart item ID
 * @param {Number} quantity - New quantity
 * @returns {Object} Result with success status
 */
export const updateGuestCartItem = (itemId, quantity) => {
  try {
    const cart = getGuestCart();
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return { success: false, message: "Item not found" };
    }

    if (quantity <= 0) {
      // Remove item
      cart.splice(itemIndex, 1);
    } else {
      // Check stock
      const item = cart[itemIndex];
      if (item.stock && quantity > item.stock) {
        return {
          success: false,
          message: `Only ${item.stock} items available`,
        };
      }
      cart[itemIndex].quantity = quantity;
    }

    saveGuestCart(cart);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update item" };
  }
};

/**
 * Remove item from guest cart
 * @param {String} itemId - Cart item ID
 * @returns {Object} Result with success status
 */
export const removeGuestCartItem = (itemId) => {
  try {
    const cart = getGuestCart();
    const filteredCart = cart.filter((item) => item.id !== itemId);
    saveGuestCart(filteredCart);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to remove item" };
  }
};

/**
 * Clear guest cart
 */
export const clearGuestCart = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
  }
};

/**
 * Calculate guest cart totals
 * @param {Array} items - Cart items
 * @param {Number} discountPercent - Discount percentage
 * @returns {Object} Cart totals
 */
export const calculateGuestCartTotals = (items) => {
  let subtotal = 0;
  let discount = 0;
  let total = 0;

  items.forEach((item) => {
    const qty = item.quantity || 0;
    const unitEffective = typeof item.price === "number"
      ? item.price
      : Number(item.price) || 0;
    const rawOriginal = typeof item.originalPrice === "number"
      ? item.originalPrice
      : Number(item.originalPrice) || 0;
    const rawDiscountPercent = typeof item.discountPercent === "number"
      ? item.discountPercent
      : Number(item.discountPercent) || 0;

    const derivedOriginal = rawDiscountPercent > 0 && unitEffective > 0
      ? unitEffective / (1 - rawDiscountPercent / 100)
      : unitEffective;
    const unitOriginal = Math.max(rawOriginal, derivedOriginal, unitEffective);

    subtotal += unitOriginal * qty;
    total += unitEffective * qty;
    discount += Math.max(unitOriginal - unitEffective, 0) * qty;
  });

  const discountPercent = subtotal > 0 ? Math.round((discount / subtotal) * 100) : 0;

  return {
    subtotal,
    discount,
    discountPercent,
    total,
  };
};

/**
 * Get guest cart item count
 * @returns {Number} Total number of items
 */
export const getGuestCartCount = () => {
  const cart = getGuestCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Merge guest cart with user cart (for after login)
 * @returns {Array} Guest cart items formatted for API
 */
export const getGuestCartForMerge = () => {
  const cart = getGuestCart();
  return cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
  }));
};
