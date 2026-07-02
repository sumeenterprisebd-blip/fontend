import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { scheduleWork } from "@/utils/scheduleWork";
import {
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
  calculateGuestCartTotals,
} from "@/utils/guestCart";
import { trackAddToCart } from "@/utils/analytics";
import { useSettings } from "@/contexts/SettingsContext";

const normalizeFreeShippingThreshold = (settings) => {
  const raw = Number(settings?.freeShippingThreshold || 0);
  if (!Number.isFinite(raw)) return 999;
  return Math.max(999, raw);
};

const FREE_DELIVERY_MIN_PIECES = 3;

const getCartAPI = async () => {
  const mod = await import("@/services/api");
  return mod.cartAPI;
};

const getProductsAPI = async () => {
  const mod = await import("@/services/api");
  return mod.productsAPI;
};

const computeCartTotals = (items) => {
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

const CartContext = createContext(undefined);

const EMPTY_TOTALS = {
  subtotal: 0,
  discount: 0,
  discountPercent: 0,
  total: 0,
};

const normalizeCartFromApi = async (cart, options = {}) => {
  const { hydrate = true } = options;
  if (!cart || !Array.isArray(cart.items)) {
    return { items: [], totals: { ...EMPTY_TOTALS } };
  }

  let items = cart.items.map((item) => ({
    id: item._id,
    productId: item.product?._id || item.product,
    name: item.product?.name || "Product",
    image: item.product?.images?.[0] || item.product?.image || "/logo.jpeg",
    price: item.product?.price || item.price || 0,
    originalPrice: item.product?.originalPrice || null,
    discountPercent: item.product?.discount || item.discountPercent || 0,
    categoryId: item.product?.category?._id || item.product?.category || item.categoryId,
    categoryName: item.product?.category?.name || item.categoryName,
    category: item.product?.category || item.category,
    isComboOffer: !!item.product?.isComboOffer,
    freeDelivery: !!item.product?.freeDelivery,
    freeDeliveryMinQty: typeof item.product?.freeDeliveryMinQty === "number" ? item.product.freeDeliveryMinQty : undefined,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    stock: item.product?.stock || 0,
  }));

  if (hydrate) {
    items = await hydrateMissingProducts(items);
  }
  return { items, totals: computeCartTotals(items) };
};

// Fetch product details for any cart items missing real data
const hydrateMissingProducts = async (items) => {
  const needsHydration = items.filter(
    (item) =>
      !item?.name ||
      item.name === "Product" ||
      !item?.image ||
      !item?.price ||
      Number(item.price) === 0
  );

  if (needsHydration.length === 0) return items;

  const uniqueIds = [...new Set(needsHydration.map((i) => i.productId).filter(Boolean))];
  if (uniqueIds.length === 0) return items;

  const productsAPI = await getProductsAPI();

  const fetched = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const res = await productsAPI.getProduct(id);
        return { id, product: res?.data?.product || res?.data?.data || res?.data };
      } catch (error) {
        return { id, product: null };
      }
    })
  );

  const map = new Map();
  fetched.forEach(({ id, product }) => {
    if (product) map.set(id, product);
  });

  return items.map((item) => {
    const product = map.get(item.productId);
    if (!product) return item;

    const price = Number(product.price ?? item.price ?? 0);
    return {
      ...item,
      name: product.name || item.name,
      image: product.images?.[0] || product.image || item.image || "/logo.jpeg",
      price,
      originalPrice: product.originalPrice ?? item.originalPrice ?? null,
      discountPercent: product.discount ?? item.discountPercent ?? 0,
      categoryId: product.category?._id || product.category || item.categoryId,
      categoryName: product.category?.name || item.categoryName,
      category: product.category || item.category,
      isComboOffer: !!product.isComboOffer,
      freeDelivery: !!product.freeDelivery,
      freeDeliveryMinQty: typeof product.freeDeliveryMinQty === "number" ? product.freeDeliveryMinQty : item.freeDeliveryMinQty,
      stock: product.stock ?? item.stock ?? 0,
    };
  });
};

export function CartProvider({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { settings } = useSettings();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotals, setCartTotals] = useState({ ...EMPTY_TOTALS });
  const fetchCartRequestId = useRef(0);

  const freeShippingThreshold = normalizeFreeShippingThreshold(settings);
  const totalQuantity = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : 0;

  const qualifiesFreeShippingByAmount = Number(cartTotals?.total || 0) >= freeShippingThreshold;
  const qualifiesFreeShippingByQuantity = totalQuantity >= FREE_DELIVERY_MIN_PIECES;
  const enrichedCartTotals = {
    ...(cartTotals || { ...EMPTY_TOTALS }),
    freeShippingThreshold,
    qualifiesFreeShippingByAmount,
    freeShippingMinQuantity: FREE_DELIVERY_MIN_PIECES,
    totalQuantity,
    qualifiesFreeShippingByQuantity,
  };

  // Fetch cart from API or localStorage
  const fetchCart = useCallback(async (options = {}) => {
    const {
      hydrate = true,
      setLoadingState = true,
      allowNetwork = true,
    } = options;

    const requestId = ++fetchCartRequestId.current;
    if (!isAuthenticated()) {
      // Load guest cart from localStorage
      try {
        if (setLoadingState) setLoading(true);
        setError(null);
        const guestCart = getGuestCart();

        // Normalize guest items
        const normalizedItems = guestCart.map(item => ({
          ...item,
          productId: item.productId || item.id,
        }));
        const items = hydrate
          ? await hydrateMissingProducts(normalizedItems)
          : normalizedItems;

        if (requestId !== fetchCartRequestId.current) return;

        setCartItems(items);

        // Calculate totals for guest cart
        const totals = calculateGuestCartTotals(items);
        setCartTotals(totals);
      } catch (error) {
        setError("Failed to load cart");
      } finally {
        if (setLoadingState) setLoading(false);
      }
      return;
    }

    if (!allowNetwork) {
      // On non-critical routes we intentionally avoid network cart fetches.
      // Cart pages will load the full cart immediately.
      if (setLoadingState) setLoading(false);
      return;
    }

    try {
      if (setLoadingState) setLoading(true);
      setError(null);

      // Check if API is available before making the call
      const cartAPI = await getCartAPI();
      const response = await cartAPI.getCart();
      const cart = response.data.cart;
      const normalized = await normalizeCartFromApi(cart, { hydrate });

      if (requestId !== fetchCartRequestId.current) return;

      setCartItems(normalized.items);
      setCartTotals(normalized.totals);
    } catch (error) {
      // Handle different error types gracefully
      if (error.response?.status === 429) {
        // Keep existing cart data on rate limit, don't show error
        setError(null);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        // On network error, fall back to guest cart
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        const totals = calculateGuestCartTotals(guestCart);
        setCartTotals(totals);
        setError(null); // Don't show error for network issues
      } else if (error.response?.status === 401) {
        // On auth error, use guest cart silently
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        const totals = calculateGuestCartTotals(guestCart);
        setCartTotals(totals);
        setError(null);
      } else {
        setError("Failed to load cart");
        // Fall back to guest cart on any error
        const guestCart = getGuestCart();
        setCartItems(guestCart);
        const totals = calculateGuestCartTotals(guestCart);
        setCartTotals(totals);
      }
    } finally {
      if (requestId === fetchCartRequestId.current) {
        if (setLoadingState) setLoading(false);
      }
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (productData) => {
    if (!isAuthenticated()) {
      // Add to guest cart
      try {
        const result = addToGuestCart(productData);
        if (result.success) {
          // Refresh cart display
          const guestCart = getGuestCart();
          setCartItems(guestCart);
          const totals = calculateGuestCartTotals(guestCart, 0);
          setCartTotals(totals);

          // Show success notification
          showToast(
            `${productData.name || "Product"} added to cart`,
            "success"
          );

          try {
            const currency = settings?.currency || "BDT";
            trackAddToCart({
              productId: productData.productId || productData.id,
              productName: productData.name,
              value: Number(productData.price || 0),
              currency,
              quantity: Number(productData.quantity || 1),
            });
          } catch {
            // ignore
          }
        }
        return result;
      } catch (error) {
        showToast("Failed to add item to cart", "error");
        return { success: false, message: "Failed to add item to cart" };
      }
    }

    try {
      const { productId, quantity, size, color } = productData;

      const cartAPI = await getCartAPI();
      const response = await cartAPI.addToCart({
        productId,
        quantity: quantity || 1,
        size: size || productData.sizes?.[0] || "M",
        color: color || productData.colors?.[0] || "Default",
      });

      const cart = response?.data?.cart;
      if (cart?.items) {
        const normalized = await normalizeCartFromApi(cart);
        setCartItems(normalized.items);
        setCartTotals(normalized.totals);

        try {
          const addedId = productId;
          const found = normalized.items.find((it) => String(it.productId) === String(addedId));
          const currency = settings?.currency || "BDT";
          trackAddToCart({
            productId: addedId,
            productName: productData.name || found?.name,
            value: Number(productData.price || found?.price || 0),
            currency,
            quantity: Number(productData.quantity || quantity || 1),
          });
        } catch {
          // ignore
        }
      } else {
        await fetchCart();
      }

      // Show success notification
      showToast(`${productData.name || "Product"} added to cart`, "success");

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add item to cart";
      showToast(message, "error");
      return { success: false, message };
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (!isAuthenticated()) {
      // Update guest cart
      try {
        const result = updateGuestCartItem(itemId, newQuantity);
        if (result.success) {
          const guestCart = getGuestCart();

          // Hydrate and normalize guest items
          const normalizedItems = guestCart.map(item => ({
            ...item,
            productId: item.productId || item.id,
          }));
          const hydratedItems = await hydrateMissingProducts(normalizedItems);

          setCartItems(hydratedItems);

          // Calculate totals using hydrated items
          const totals = computeCartTotals(hydratedItems);
          setCartTotals(totals);
        }
        return result;
      } catch (error) {
        return { success: false, message: "Failed to update quantity" };
      }
    }

    try {
      if (newQuantity <= 0) {
        await removeItem(itemId);
        return { success: true };
      }

      const cartAPI = await getCartAPI();
      const response = await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      const cart = response?.data?.cart;
      if (cart?.items) {
        const normalized = await normalizeCartFromApi(cart);
        setCartItems(normalized.items);
        setCartTotals(normalized.totals);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update quantity",
      };
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    if (!isAuthenticated()) {
      // Remove from guest cart
      try {
        const result = removeGuestCartItem(itemId);
        if (result.success) {
          const guestCart = getGuestCart();

          // Hydrate and normalize guest items
          const normalizedItems = guestCart.map(item => ({
            ...item,
            productId: item.productId || item.id,
          }));
          const hydratedItems = await hydrateMissingProducts(normalizedItems);

          setCartItems(hydratedItems);

          // Calculate totals using hydrated items
          const totals = computeCartTotals(hydratedItems);
          setCartTotals(totals);
        }
        return result;
      } catch (error) {
        return { success: false, message: "Failed to remove item" };
      }
    }

    try {
      const cartAPI = await getCartAPI();
      const response = await cartAPI.removeFromCart(itemId);
      const cart = response?.data?.cart;
      if (cart?.items) {
        const normalized = await normalizeCartFromApi(cart);
        setCartItems(normalized.items);
        setCartTotals(normalized.totals);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove item",
      };
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated()) {
      // Clear guest cart
      try {
        clearGuestCart();
        setCartItems([]);
        setCartTotals({
          subtotal: 0,
          discount: 0,
          discountPercent: 0,
          total: 0,
        });
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }

    try {
      const cartAPI = await getCartAPI();
      const response = await cartAPI.clearCart();
      const cart = response?.data?.cart;
      if (cart?.items) {
        const normalized = await normalizeCartFromApi(cart);
        setCartItems(normalized.items);
        setCartTotals(normalized.totals);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // Calculate cart item count as a computed value
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const path = router.pathname || "";
    const needsImmediateCart =
      path.startsWith("/cart") ||
      path.startsWith("/checkout") ||
      path.startsWith("/admin") ||
      path.startsWith("/orders");

    const run = () => {
      const options = needsImmediateCart
        ? { hydrate: true, setLoadingState: true, allowNetwork: true }
        : { hydrate: false, setLoadingState: false, allowNetwork: false };

      fetchCart(options).catch(() => {
        // Silently ignore to avoid console errors impacting Lighthouse
      });
    };

    if (needsImmediateCart) {
      run();
      return;
    }

    // Defer lightweight (no-network) cart init to idle/load.
    // This keeps cart badges responsive without triggering expensive hydrations.
    if (typeof window !== "undefined" && document?.readyState !== "complete") {
      const onLoad = () => scheduleWork(run, { timeout: 2000 });
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }

    scheduleWork(run, { timeout: 2000 });
  }, [fetchCart, router.pathname]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotals: enrichedCartTotals,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
