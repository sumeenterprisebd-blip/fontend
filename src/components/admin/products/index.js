// Main component
export { default as AdminProducts } from "../../AdminProducts";

// Sub-components
export { default as ProductTable } from "./ProductTable";
export { default as ProductFormModal } from "./ProductFormModal";
export { default as ErrorMessage } from "./ErrorMessage";

// Form sections
export { default as ProductFormBasicInfo } from "./ProductFormBasicInfo";
export { default as ProductFormPricing } from "./ProductFormPricing";
export { default as ProductFormComboOffer } from "./ProductFormComboOffer";
export { default as ProductFormInventory } from "./ProductFormInventory";
export { default as ProductFormColors } from "./ProductFormColors";
export { default as ProductFormSizes } from "./ProductFormSizes";
export { default as ProductFormImages } from "./ProductFormImages";
export { default as ProductFormTags } from "./ProductFormTags";
export { default as ProductFormSettings } from "./ProductFormSettings";

// Hooks
export { useProducts } from "./hooks/useProducts";
export { useProductForm } from "./hooks/useProductForm";
export { useCloudinaryUpload } from "./hooks/useCloudinaryUpload";

// Utils
export * from "./utils";
export * from "./constants";
