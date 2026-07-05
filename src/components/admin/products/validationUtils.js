/**
 * Validates product form data
 */
export const validateProductForm = (formData) => {
  const errors = [];

  if (!formData.name?.trim()) {
    errors.push("Product name is required");
  }

  if (
    !formData.price ||
    isNaN(parseFloat(formData.price)) ||
    parseFloat(formData.price) <= 0
  ) {
    errors.push("Valid price is required");
  }

  if (
    !formData.stock ||
    isNaN(parseInt(formData.stock)) ||
    parseInt(formData.stock) < 0
  ) {
    errors.push("Valid stock quantity is required");
  }

  const validImages = formData.images?.filter((img) => img && img.trim()) || [];
  if (validImages.length === 0) {
    errors.push("Please add at least one image URL");
  }

  if (Array.isArray(formData.measurements)) {
    formData.measurements.forEach((group, groupIndex) => {
      const category = group?.category;
      const sizes = Array.isArray(group?.sizes) ? group.sizes : [];

      if (!category) {
        errors.push(`Measurement category is missing for section ${groupIndex + 1}`);
        return;
      }

      if (sizes.length === 0) {
        errors.push(`Add at least one size row for selected measurement category`);
      }

      sizes.forEach((row, rowIndex) => {
        const hasSize = row && row.size && String(row.size).trim();
        const values = row?.values || {};
        const hasAnyValue = Object.values(values).some(
          (value) => String(value || "").trim()
        );

        if (!hasSize && hasAnyValue) {
          errors.push(`Please enter a size label for row ${rowIndex + 1} in measurement category ${groupIndex + 1}`);
        }

        if (hasSize && !hasAnyValue) {
          errors.push(`Please enter at least one value for size ${String(row.size).trim() || `row ${rowIndex + 1}`} in measurement category ${groupIndex + 1}`);
        }
      });
    });
  }

  return errors;
};
