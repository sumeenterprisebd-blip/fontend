export const AVAILABLE_COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Gray",
  "Brown",
  "Pink",
  "Purple",
  "Orange",
];

export const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

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
  freeDelivery: false,
  freeDeliveryMinQty: "2",
  category: "",
  dressStyle: "Casual",
  colors: [],
  sizes: [],
  measurements: [],
  stock: "",
  description: "",
  images: [""],
  tags: "",
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};
