// Categories are now fully dynamic and fetched from database
// No hardcoded categories - all managed through Admin Panel

export const DRESS_STYLES = ["Casual", "Formal", "Sport", "Other"];

export const INITIAL_FORM_DATA = {
  name: "",
  price: "",
  originalPrice: "",
  discount: "",
  isComboOffer: false,
  comboPrice: "",
  comboDiscount: "",
  pricingTiers: [],
  freeDelivery: false,
  freeDeliveryMinQty: "2",
  category: "",
  dressStyle: "Casual",
  measurements: [],
  stock: "",
  description: "",
  images: [""],
  tags: "",
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};
