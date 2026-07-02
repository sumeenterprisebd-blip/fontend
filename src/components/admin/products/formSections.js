import ProductFormBasicInfo from "./ProductFormBasicInfo";
import ProductFormPricing from "./ProductFormPricing";
import ProductFormComboOffer from "./ProductFormComboOffer";
import ProductFormInventory from "./ProductFormInventory";
import ProductFormColors from "./ProductFormColors";
import ProductFormSizes from "./ProductFormSizes";
import ProductFormMeasurements from "./ProductFormMeasurements";
import ProductFormImages from "./ProductFormImages";
import ProductFormTags from "./ProductFormTags";
import ProductFormSettings from "./ProductFormSettings";

export function getFormSections(
  formData,
  formActions,
  categories,
  measurementCategories,
  measurementCategoriesLoading,
  refreshMeasurementCategories,
  onAddCategory,
  uploadingImage,
  uploadError,
  onUploadClick
) {
  return [
    {
      Component: ProductFormBasicInfo,
      props: {
        formData,
        onChange: formActions.updateField,
        categories,
        measurements: measurementCategories,
        measurementsLoading: measurementCategoriesLoading,
        refreshMeasurements: refreshMeasurementCategories,
        onAddCategory,
      },
    },
    {
      Component: ProductFormPricing,
      props: { formData, onChange: formActions.updateField },
    },
    {
      Component: ProductFormComboOffer,
      props: { formData, onChange: formActions.updateField },
    },
    {
      Component: ProductFormInventory,
      props: { formData, onChange: formActions.updateField },
    },
    {
      Component: ProductFormColors,
      props: {
        formData,
        onToggleColor: formActions.toggleColor,
        onAddCustomColor: formActions.addCustomColor,
        onRemoveColor: formActions.removeColor,
      },
    },
    {
      Component: ProductFormSizes,
      props: { formData, onToggleSize: formActions.toggleSize },
    },
    {
      Component: ProductFormMeasurements,
      props: {
        formData,
        onAddSizeRow: formActions.addMeasurementSizeRow,
        onRemoveSizeRow: formActions.removeMeasurementSizeRow,
        onUpdateCell: formActions.updateMeasurementCell,
        onRemoveCategory: formActions.removeMeasurementCategory,
        measurements: measurementCategories,
        measurementsLoading: measurementCategoriesLoading,
      },
    },
    {
      Component: ProductFormImages,
      props: {
        formData,
        onImageChange: formActions.updateImage,
        onAddImage: formActions.addImageField,
        onRemoveImage: formActions.removeImageField,
        uploadingImage,
        uploadError,
        onUploadClick,
      },
    },
    {
      Component: ProductFormTags,
      props: { formData, onChange: formActions.updateField },
    },
    {
      Component: ProductFormSettings,
      props: { formData, onChange: formActions.updateField },
    },
  ];
}
