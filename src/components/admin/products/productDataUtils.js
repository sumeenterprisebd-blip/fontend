/**
 * Builds product data object for API
 */
export const buildProductData = (formData) => {
  const validImages = formData.images.filter((img) => img && img.trim());

  const productData = {
    name: formData.name.trim(),
    price: parseFloat(formData.price),
    stock: parseInt(formData.stock),
    category: formData.category,
    dressStyle: formData.dressStyle,
    description: formData.description ? formData.description.trim() : "",
    images: validImages,
    isFeatured: formData.isFeatured || false,
    isNewArrival: formData.isNewArrival || false,
    isActive: formData.isActive !== false,
    isComboOffer: formData.isComboOffer || false,
    freeDelivery: formData.freeDelivery || false,
  };

  if (productData.isComboOffer && productData.freeDelivery) {
    const minQty = parseInt(formData.freeDeliveryMinQty, 10);
    if (!isNaN(minQty) && minQty >= 1) {
      productData.freeDeliveryMinQty = minQty;
    } else {
      productData.freeDeliveryMinQty = 2;
    }
  }

  // Add optional fields
  if (
    formData.originalPrice &&
    !isNaN(parseFloat(formData.originalPrice)) &&
    parseFloat(formData.originalPrice) > 0
  ) {
    productData.originalPrice = parseFloat(formData.originalPrice);
  }

  // Discount is auto-calculated from Original Price and Price.
  // Keep legacy manual discount only when originalPrice isn't provided.
  const price = Number(productData.price);
  const originalPrice = Number(productData.originalPrice);
  const canDeriveDiscount = Number.isFinite(price) && price > 0 && Number.isFinite(originalPrice) && originalPrice > price;
  if (canDeriveDiscount) {
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    if (pct > 0 && pct <= 100) {
      productData.discount = pct;
    }
  } else if (
    formData.discount !== "" &&
    formData.discount !== undefined &&
    formData.discount !== null &&
    !isNaN(parseFloat(formData.discount)) &&
    parseFloat(formData.discount) >= 0 &&
    parseFloat(formData.discount) <= 100
  ) {
    productData.discount = parseFloat(formData.discount);
  }

  if (Array.isArray(formData.measurements) && formData.measurements.length > 0) {
    const cleanGroups = formData.measurements
      .filter((group) => group && group.category && Array.isArray(group.sizes))
      .map((group) => ({
        category: String(group.category).trim(),
        sizes: group.sizes
          .filter((row) => row && row.size && String(row.size).trim())
          .map((row) => ({
            size: String(row.size).trim(),
            values:
              row.values && typeof row.values === "object"
                ? Object.fromEntries(
                  Object.entries(row.values).map(([key, value]) => [
                    String(key).trim(),
                    String(value || "").trim(),
                  ])
                )
                : {},
          })),
      }))
      .filter((group) => group.sizes.length > 0);

    if (cleanGroups.length > 0) {
      productData.measurements = cleanGroups;
    }
  }

  // Add combo offer fields
  if (
    formData.comboPrice &&
    !isNaN(parseFloat(formData.comboPrice)) &&
    parseFloat(formData.comboPrice) > 0
  ) {
    productData.comboPrice = parseFloat(formData.comboPrice);
  }

  if (
    formData.comboDiscount !== "" &&
    formData.comboDiscount !== undefined &&
    formData.comboDiscount !== null &&
    !isNaN(parseFloat(formData.comboDiscount)) &&
    parseFloat(formData.comboDiscount) >= 0 &&
    parseFloat(formData.comboDiscount) <= 100
  ) {
    productData.comboDiscount = parseFloat(formData.comboDiscount);
  }

  if (Array.isArray(formData.pricingTiers) && formData.pricingTiers.length > 0) {
    productData.pricingTiers = formData.pricingTiers
      .filter((tier) => tier && Number.isFinite(Number(tier.minQty)) && Number(tier.minQty) > 0 && Number.isFinite(Number(tier.price)))
      .map((tier) => ({
        minQty: Number(tier.minQty),
        maxQty: tier.maxQty === "" || tier.maxQty === null || tier.maxQty === undefined ? null : Number(tier.maxQty),
        price: Number(tier.price),
      }))
      .sort((a, b) => a.minQty - b.minQty);
  } else if (Array.isArray(formData.pricingTiers)) {
    productData.pricingTiers = [];
  }

  if (formData.tags && formData.tags.trim()) {
    productData.tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
  }

  return productData;
};

/**
 * Converts product object to form data
 */
export const productToFormData = (product) => ({
  name: product.name || "",
  price: product.price ?? "",
  originalPrice: product.originalPrice ?? "",
  discount: product.discount ?? "",
  isComboOffer: product.isComboOffer || false,
  comboPrice: product.comboPrice ?? "",
  comboDiscount: product.comboDiscount ?? "",
  freeDelivery: product.freeDelivery || false,
  freeDeliveryMinQty:
    product.freeDeliveryMinQty !== undefined && product.freeDeliveryMinQty !== null
      ? String(product.freeDeliveryMinQty)
      : "2",
  category: product.category || "",
  dressStyle: product.dressStyle || "Casual",
  measurements: Array.isArray(product.measurements)
    ? product.measurements.map((group) => ({
      category:
        group.category && typeof group.category === 'object'
          ? group.category._id
          : group.category,
      sizes: Array.isArray(group.sizes)
        ? group.sizes.map((row) => ({
          size: row.size || "",
          values:
            row.values && typeof row.values === 'object'
              ? row.values
              : {},
        }))
        : [],
    }))
    : [],
  stock: product.stock ?? "",
  description: product.description || "",
  images: product.images && product.images.length > 0 ? product.images : [""],
  tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
  isFeatured: product.isFeatured || false,
  isNewArrival: product.isNewArrival || false,
  isActive: product.isActive !== undefined ? product.isActive : true,
  pricingTiers: Array.isArray(product.pricingTiers) ? product.pricingTiers : [],
});
