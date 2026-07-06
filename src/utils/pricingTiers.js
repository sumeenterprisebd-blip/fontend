export const normalizePricingTiers = (tiers = []) => {
  if (!Array.isArray(tiers)) return [];

  return tiers
    .map((tier) => ({
      minQty: Number(tier?.minQty),
      maxQty: tier?.maxQty === "" || tier?.maxQty === null || tier?.maxQty === undefined
        ? null
        : Number(tier.maxQty),
      price: Number(tier?.price),
    }))
    .filter((tier) => Number.isFinite(tier.minQty) && tier.minQty > 0 && Number.isFinite(tier.price) && tier.price >= 0)
    .sort((a, b) => a.minQty - b.minQty);
};

export const getPricingTierSummary = (product, quantity) => {
  const basePrice = Number(product?.price ?? 0);
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const tiers = normalizePricingTiers(product?.pricingTiers);

  let appliedTier = null;
  let effectiveUnitPrice = basePrice;

  for (const tier of tiers) {
    const meetsMin = safeQuantity >= tier.minQty;
    const meetsMax = tier.maxQty === null || safeQuantity <= tier.maxQty;

    if (meetsMin && meetsMax) {
      appliedTier = tier;
      effectiveUnitPrice = tier.price;
      break;
    }
  }

  const regularTotal = basePrice * safeQuantity;
  const totalPrice = effectiveUnitPrice * safeQuantity;
  const savings = Math.max(0, regularTotal - totalPrice);
  const discountPercent = regularTotal > 0 ? Math.round((savings / regularTotal) * 100) : 0;

  return {
    basePrice,
    effectiveUnitPrice,
    appliedTier,
    regularTotal,
    totalPrice,
    savings,
    discountPercent,
    quantity: safeQuantity,
  };
};
