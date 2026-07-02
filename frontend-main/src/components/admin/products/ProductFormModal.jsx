import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';
import { validateProductForm, buildProductData, formatErrorMessage } from './utils';
import ErrorMessage from './ErrorMessage';
import ProductFormModalHeader from './ProductFormModalHeader';
import ProductFormModalFooter from './ProductFormModalFooter';
import { useCloudinaryUpload } from './hooks/useCloudinaryUpload';
import { useFormData, useFormHandlers } from './useProductFormHandlers';
import { useMeasurements } from '@/hooks/useMeasurements';
import { getFormSections } from './formSections';

export default function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  formData,
  formActions,
  onSuccess
}) {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const { uploading: uploadingImage, error: uploadError, uploadImage } = useCloudinaryUpload();
  const { fetchCategoriesAndColors } = useFormData(isOpen, formActions);
  const { handleAddCategory: addCategory, handleAddColor: addColor } = useFormHandlers(formActions);
  const {
    measurements: measurementCategories,
    loading: measurementCategoriesLoading,
    refresh: refreshMeasurementCategories,
  } = useMeasurements();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoadingData(true);
    const data = await fetchCategoriesAndColors();
    setCategories(data.categories);
    setColors(data.colors);
    setLoadingData(false);
  };

  const handleAddCategory = async (name) => {
    const result = await addCategory(name);
    if (result.success) {
      setCategories(prev => [...prev, result.category].sort((a, b) => a.name.localeCompare(b.name)));
      formActions.updateField('category', result.category.name);
    }
    return result;
  };

  const handleAddColor = async (colorData) => {
    const result = await addColor(colorData);
    if (result.success) {
      setColors(prev => [...prev, result.color].sort((a, b) => a.name.localeCompare(b.name)));
    }
    return result;
  };

  const handleImageUpload = async (index) => {
    await uploadImage((imageUrl) => {
      formActions.updateImage(index, imageUrl);
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    formActions.setError('');

    // Validate form
    const validationErrors = validateProductForm(formData);
    if (validationErrors.length > 0) {
      formActions.setError(validationErrors.join('\n'));
      return;
    }

    setSubmitting(true);

    try {
      const productData = buildProductData(formData);

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, productData);
      } else {
        await productsAPI.createProduct(productData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      formActions.setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formSections = getFormSections(
    formData,
    formActions,
    categories,
    measurementCategories,
    measurementCategoriesLoading,
    refreshMeasurementCategories,
    handleAddCategory,
    uploadingImage,
    uploadError,
    handleImageUpload
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductFormModalHeader
          editingProduct={editingProduct}
          onClose={onClose}
          submitting={submitting}
        />
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ErrorMessage error={formActions.error} />
          {formSections.map(({ Component, props }, idx) => (
            <Component key={idx} {...props} />
          ))}
          <ProductFormModalFooter
            onClose={onClose}
            submitting={submitting}
            editingProduct={editingProduct}
          />
        </form>
      </div>
    </div>
  );
}

