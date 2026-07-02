const extractDigits = (value) => String(value || "").replace(/[^0-9]/g, "");

export const normalizeWhatsAppNumber = (rawPhone) => {
    let digits = extractDigits(rawPhone);

    // Bangladesh friendly normalization:
    // - Local: 01XXXXXXXXX -> 8801XXXXXXXXX
    // - Missing leading 0: 1XXXXXXXXX -> 8801XXXXXXXXX
    if (digits.length === 11 && digits.startsWith("0")) {
        digits = `88${digits}`;
    } else if (digits.length === 10 && digits.startsWith("1")) {
        digits = `880${digits}`;
    }

    // WhatsApp expects country code, no leading '+'
    return digits;
};

const formatBDT = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "৳0";
    if (Math.round(n) === n) return `৳${n}`;
    return `৳${n.toFixed(2)}`;
};

const getOrderLabel = (order) => {
    const orderNumber = order?.orderNumber;
    if (orderNumber) return `#${orderNumber}`;
    const shortId = String(order?.shortId || "").trim();
    if (shortId) return `#${shortId}`;
    const id = String(order?._id || order?.id || "").trim();
    if (id) return `#${id.slice(-8).toUpperCase()}`;
    return "#N/A";
};

const getCustomerName = (order) => {
    const first = String(order?.shippingAddress?.firstName || "").trim();
    const last = String(order?.shippingAddress?.lastName || "").trim();
    const full = [first, last].filter(Boolean).join(" ").trim();
    return full || "Customer";
};

const getProductsLines = (order) => {
    const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
    if (items.length === 0) return [];

    return items.map((item) => {
        const name = String(item?.name || item?.productName || "").trim() || "Item";
        const qty = Number(item?.quantity || 0) || 0;
        const suffix = qty > 0 ? ` ×${qty}` : "";
        return `- ${name}${suffix}`;
    });
};

const getTrackingLink = (order, origin) => {
    const trackingId = order?.orderNumber || order?.shortId || order?._id || order?.id;
    if (!trackingId) return "";
    const base = String(origin || "").replace(/\/$/, "");
    const path = `/orders/track?id=${encodeURIComponent(String(trackingId))}`;
    return base ? `${base}${path}` : path;
};

export const buildOrderWhatsAppMessage = (order, options = {}) => {
    const storeName = String(options.storeName || process.env.NEXT_PUBLIC_STORE_NAME || "").trim();
    const origin = options.origin;

    const status = String(order?.orderStatus || "pending").toLowerCase();
    const orderLabel = getOrderLabel(order);
    const name = getCustomerName(order);
    const total = formatBDT(order?.total ?? order?.totalPrice ?? 0);

    const templates = {
        pending: { verb: "placed", emoji: "✅" },
        confirmed: { verb: "confirmed", emoji: "✅" },
        processing: { verb: "confirmed", emoji: "✅" },
        hold: { verb: "confirmed", emoji: "✅" },
        shipped: { verb: "shipped", emoji: "🚚" },
        delivered: { verb: "delivered", emoji: "✅" },
        cancelled: { verb: "cancelled", emoji: "⚠️" },
        paid_return: { verb: "cancelled", emoji: "⚠️" },
    };

    const t = templates[status] || { verb: `updated (${status})`, emoji: "ℹ️" };

    const lines = [
        `Hello ${name},`,
        "",
        `Your order ${orderLabel} has been ${t.verb} ${t.emoji}`,
    ];

    const productLines = getProductsLines(order);
    if (productLines.length) {
        lines.push("Products:");
        lines.push(...productLines);
    }

    lines.push(`Total: ${total}`);

    if (status === "shipped") {
        const link = getTrackingLink(order, origin);
        if (link) lines.push(`Track your order here: ${link}`);
    }

    if (status === "delivered") {
        lines.push("We hope you enjoy your purchase!");
    } else if (status === "cancelled" || status === "paid_return") {
        lines.push("For assistance, contact support.");
    } else if (storeName) {
        lines.push(`Thank you for shopping with ${storeName}.`);
    } else {
        lines.push("Thank you for shopping with us.");
    }

    return lines.join("\n");
};
