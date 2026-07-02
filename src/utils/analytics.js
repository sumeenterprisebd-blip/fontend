/**
 * Analytics tracking utility
 */

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, {
      event_category: parameters.category || "general",
      event_label: parameters.label,
      value: parameters.value,
      ...parameters,
    });
  }

  if (window.fbq) {
    // Use `track` for standard Pixel events and `trackCustom` for custom events.
    const standard = new Set(["Purchase", "AddToCart", "ViewContent", "InitiateCheckout", "Search", "CompleteRegistration", "Lead"]);
    try {
      if (standard.has(String(eventName))) {
        window.fbq("track", eventName, parameters);
      } else {
        window.fbq("trackCustom", eventName, parameters);
      }
    } catch (e) {
      // swallow errors to avoid breaking the page
    }
  }

  if (window.ttq) {
    window.ttq.track(eventName, parameters);
  }
};

const asNumber = (value, fallback = 0) => {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeContentId = (item) => {
  if (!item || typeof item !== "object") return null;
  return item.id || item.productId || item.item_id || item.itemId || null;
};

const normalizeQuantity = (item) => {
  if (!item || typeof item !== "object") return 1;
  return asNumber(item.quantity, 1) || 1;
};

const normalizeUnitPrice = (item) => {
  if (!item || typeof item !== "object") return 0;
  return asNumber(item.item_price ?? item.price ?? item.itemPrice, 0);
};

const toGaItems = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const id = normalizeContentId(item);
      if (!id) return null;
      const quantity = normalizeQuantity(item);
      const price = normalizeUnitPrice(item);
      const name = item.item_name || item.name || item.productName;
      return {
        item_id: String(id),
        ...(name ? { item_name: String(name) } : {}),
        ...(Number.isFinite(price) ? { price } : {}),
        ...(Number.isFinite(quantity) ? { quantity } : {}),
      };
    })
    .filter(Boolean);
};

const toFbContents = (items = []) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const id = normalizeContentId(item);
      if (!id) return null;
      const quantity = normalizeQuantity(item);
      const item_price = normalizeUnitPrice(item);
      return {
        id: String(id),
        quantity,
        ...(Number.isFinite(item_price) ? { item_price } : {}),
      };
    })
    .filter(Boolean);
};

export const trackPurchase = ({ transactionId, value, currency = "BDT", items, eventId }) => {
  if (typeof window === "undefined") return;

  const safeValue = asNumber(value, 0);
  const gaItems = toGaItems(items);
  const fbContents = toFbContents(items);
  const contentIds = fbContents.map((c) => c.id);

  if (window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: safeValue,
      currency,
      items: gaItems,
    });
  }
  if (window.fbq) {
    const fbPayload = {
      value: safeValue,
      currency,
      content_type: "product",
      content_id: contentIds[0] || undefined,
      content_ids: contentIds,
      contents: fbContents,
      ...(transactionId ? { order_id: transactionId } : {}),
      num_items: fbContents.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0),
      ...(eventId ? { event_id: String(eventId) } : {}),
    };

    try {
      console.info('FB Purchase event', {
        pixelId: window.__dwPixelId || null,
        eventId: eventId || null,
        transactionId,
        value: safeValue,
        currency,
        content_ids: contentIds,
        num_items: fbPayload.num_items,
      });
    } catch (e) {}

    // For browser pixel deduping with CAPI, Meta expects the eventID in the 4th param.
    // Including `event_id` in the payload is also harmless and helps with debugging.
    window.fbq(
      "track",
      "Purchase",
      fbPayload,
      eventId ? { eventID: String(eventId) } : undefined
    );
  }
  if (window.ttq) {
    window.ttq.track("CompletePayment", {
      value: safeValue,
      currency,
      content_type: "product",
      contents: fbContents,
    });
  }
};

export const trackAddToCart = ({ productId, productName, value, currency = "BDT", quantity = 1 }) => {
  if (typeof window === "undefined") return;

  const safeValue = asNumber(value, 0);
  const safeQty = asNumber(quantity, 1) || 1;

  const item = { item_id: String(productId), item_name: productName, price: safeValue, quantity: safeQty };
  if (window.gtag) {
    window.gtag("event", "add_to_cart", { currency, value: safeValue, items: [item] });
  }
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      value: safeValue,
      currency,
      content_type: "product",
      content_id: String(productId),
      content_ids: [String(productId)],
      content_name: productName,
      contents: [{ id: String(productId), quantity: safeQty, item_price: safeValue }],
    });
  }
  if (window.ttq) {
    window.ttq.track("AddToCart", { value: safeValue, currency, content_type: "product", content_id: String(productId), quantity: safeQty });
  }
};

export const trackViewContent = ({ productId, productName, value, currency = "BDT" }) => {
  if (typeof window === "undefined") return;

  const safeValue = asNumber(value, 0);

  if (window.gtag) {
    window.gtag("event", "view_item", {
      currency,
      value: safeValue,
      items: [{ item_id: String(productId), item_name: productName, price: safeValue }],
    });
  }
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      value: safeValue,
      currency,
      content_type: "product",
      content_id: String(productId),
      content_ids: [String(productId)],
      content_name: productName,
      contents: [{ id: String(productId), quantity: 1, item_price: safeValue }],
    });
  }
  if (window.ttq) {
    window.ttq.track("ViewContent", { value: safeValue, currency, content_type: "product", content_id: String(productId) });
  }
};

export const trackInitiateCheckout = ({ value, currency = "BDT", items }) => {
  if (typeof window === "undefined") return;

  const safeValue = asNumber(value, 0);
  const gaItems = toGaItems(items);
  const fbContents = toFbContents(items);
  const contentIds = fbContents.map((c) => c.id);

  if (window.gtag) {
    window.gtag("event", "begin_checkout", { currency, value: safeValue, items: gaItems });
  }
  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: safeValue,
      currency,
      content_type: "product",
      content_id: contentIds[0] || undefined,
      content_ids: contentIds,
      contents: fbContents,
      num_items: fbContents.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0),
    });
  }
  if (window.ttq) {
    window.ttq.track("InitiateCheckout", { value: safeValue, currency, contents: fbContents });
  }
};

export const trackSearch = (searchTerm) => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "search", { search_term: searchTerm });
  }
  if (window.fbq) {
    window.fbq("track", "Search", { search_string: searchTerm });
  }
  if (window.ttq) {
    window.ttq.track("Search", { query: searchTerm });
  }
};


