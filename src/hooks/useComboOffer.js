import { useMemo } from "react";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getItemCategoryKey = (item) => {
  const raw = item?.categoryName || item?.categoryId || item?.category;
  return normalizeText(raw);
};

const getItemMinQty = (item) => {
  const raw = item?.freeDeliveryMinQty;
  const parsed = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 2;
};

const isComboFreeDeliveryEligibleItem = (item) => !!item?.isComboOffer && !!item?.freeDelivery;

export function useComboOffer(cartItems) {
  const comboStatus = useMemo(() => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const totalQuantity = items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0);

    if (items.length === 0) {
      return {
        applied: false,
        freeDelivery: false,
        totalLikes: 0,
        totalQuantity: 0,
        reason: "কার্ট খালি",
      };
    }

    // Rule: Free delivery applies only when all items are from the same category,
    // and all items satisfy the same combo/free-delivery criteria (including min quantity).
    const categoryKeys = new Set(items.map(getItemCategoryKey).filter(Boolean));
    const singleCategory = categoryKeys.size === 1;

    const allEligible = items.every(isComboFreeDeliveryEligibleItem);
    const minQtyValues = new Set(items.map(getItemMinQty));
    const sameCriteria = minQtyValues.size === 1;

    const requiredQty = sameCriteria ? [...minQtyValues][0] : null;
    const quantityMeets = requiredQty ? totalQuantity >= requiredQty : false;

    const freeDelivery = singleCategory && allEligible && sameCriteria && quantityMeets;
    const applied = freeDelivery;

    let reason = "";
    if (!singleCategory) {
      reason = "ফ্রি ডেলিভারি পেতে কার্টে একই ক্যাটাগরির পণ্য রাখুন।";
    } else if (!allEligible) {
      reason = "কার্টের সব পণ্যে কম্বো ফ্রি ডেলিভারি প্রযোজ্য নয়।";
    } else if (!sameCriteria) {
      reason = "কার্টের পণ্যের কম্বো শর্ত এক নয়—একই শর্তের পণ্য যোগ করুন।";
    } else if (!quantityMeets) {
      reason = `ফ্রি ডেলিভারির জন্য মোট কমপক্ষে ${requiredQty}+ পিস নিতে হবে।`;
    } else {
      reason = "🎉 কম্বো অফার অনুযায়ী ডেলিভারি ফ্রি প্রযোজ্য হয়েছে!";
    }

    return {
      applied,
      freeDelivery,
      totalLikes: 0,
      totalQuantity,
      requiredQty: requiredQty ?? undefined,
      singleCategory,
      sameCriteria,
      allEligible,
      reason,
    };
  }, [cartItems]);

  return { comboStatus, loading: false };
}