import { useState } from "react";
import { INITIAL_FORM_DATA } from "../constants";
import { productToFormData } from "../utils";

const normalizeId = (value) => {
  if (value && typeof value === 'object') {
    return String(value._id ?? value.id ?? value);
  }
  return String(value ?? '');
};

export const useProductForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateImage = (index, value) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages.length > 0 ? newImages : [""] };
    });
  };

  const toggleColor = (color) => {
    setFormData((prev) => {
      const colorExists = prev.colors.some(
        (c) => (typeof c === "string" ? c : c.name) === color
      );

      if (colorExists) {
        return {
          ...prev,
          colors: prev.colors.filter(
            (c) => (typeof c === "string" ? c : c.name) !== color
          ),
        };
      } else {
        return {
          ...prev,
          colors: [...prev.colors, color],
        };
      }
    });
  };

  const addCustomColor = (colorObj) => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, colorObj],
    }));
  };

  const removeColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addMeasurementSizeRow = (categoryId, fields = []) => {
    const normalizedCategoryId = normalizeId(categoryId);
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.map((group) => {
        if (normalizeId(group.category) !== normalizedCategoryId) return group;
        return {
          ...group,
          sizes: [
            ...group.sizes,
            {
              size: "",
              values: fields.reduce((acc, field) => ({
                ...acc,
                [field]: "",
              }), {}),
            },
          ],
        };
      }),
    }));
  };

  const removeMeasurementSizeRow = (categoryId, rowIndex) => {
    const normalizedCategoryId = normalizeId(categoryId);
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.map((group) => {
        if (normalizeId(group.category) !== normalizedCategoryId) return group;
        return {
          ...group,
          sizes: group.sizes.filter((_, index) => index !== rowIndex),
        };
      }),
    }));
  };

  const updateMeasurementCell = (categoryId, rowIndex, field, value) => {
    const normalizedCategoryId = normalizeId(categoryId);
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.map((group) => {
        if (normalizeId(group.category) !== normalizedCategoryId) return group;
        const updatedSizes = group.sizes.map((row, index) => {
          if (index !== rowIndex) return row;
          if (field === "size") {
            return { ...row, size: value };
          }
          return {
            ...row,
            values: {
              ...row.values,
              [field]: value,
            },
          };
        });
        return { ...group, sizes: updatedSizes };
      }),
    }));
  };

  const removeMeasurementCategory = (categoryId) => {
    const normalizedCategoryId = normalizeId(categoryId);
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.filter(
        (group) => normalizeId(group.category) !== normalizedCategoryId
      ),
    }));
  };

  const addSizeGuideRow = () => {
    setFormData((prev) => ({
      ...prev,
      sizeGuide: [
        ...prev.sizeGuide,
        {
          size: "",
          measurements: prev.sizeGuideColumns.reduce(
            (acc, column) => ({
              ...acc,
              [column]: "",
            }),
            {}
          ),
        },
      ],
    }));
  };

  const removeSizeGuideRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizeGuide: prev.sizeGuide.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const updateSizeGuideCell = (rowIndex, field, value) => {
    setFormData((prev) => {
      const updatedSizeGuide = [...prev.sizeGuide];
      const row = { ...updatedSizeGuide[rowIndex] };

      if (field === "size") {
        row.size = value;
      } else {
        row.measurements = {
          ...row.measurements,
          [field]: value,
        };
      }

      updatedSizeGuide[rowIndex] = row;
      return { ...prev, sizeGuide: updatedSizeGuide };
    });
  };

  const addSizeGuideColumn = () => {
    setFormData((prev) => {
      const newColumn = `Measure ${prev.sizeGuideColumns.length + 1}`;
      return {
        ...prev,
        sizeGuideColumns: [...prev.sizeGuideColumns, newColumn],
        sizeGuide: prev.sizeGuide.map((row) => ({
          ...row,
          measurements: {
            ...row.measurements,
            [newColumn]: "",
          },
        })),
      };
    });
  };

  const removeSizeGuideColumn = (columnName) => {
    setFormData((prev) => ({
      ...prev,
      sizeGuideColumns: prev.sizeGuideColumns.filter((column) => column !== columnName),
      sizeGuide: prev.sizeGuide.map((row) => {
        const measurements = { ...row.measurements };
        delete measurements[columnName];
        return { ...row, measurements };
      }),
    }));
  };

  const updateSizeGuideColumnLabel = (index, value) => {
    setFormData((prev) => {
      const columnName = String(value || "").trim();
      if (!columnName) {
        return prev;
      }

      const oldColumn = prev.sizeGuideColumns[index];
      const updatedColumns = prev.sizeGuideColumns.map((column, columnIndex) =>
        columnIndex === index ? columnName : column
      );

      const updatedSizeGuide = prev.sizeGuide.map((row) => {
        const measurements = { ...row.measurements };
        measurements[columnName] = measurements[oldColumn] || "";
        if (oldColumn in measurements) {
          delete measurements[oldColumn];
        }
        return { ...row, measurements };
      });

      return {
        ...prev,
        sizeGuideColumns: updatedColumns,
        sizeGuide: updatedSizeGuide,
      };
    });
  };

  const loadProduct = (product) => {
    setFormData(productToFormData(product));
  };

  const reset = () => {
    setFormData(INITIAL_FORM_DATA);
    setError("");
  };

  return {
    formData,
    error,
    setError,
    updateField,
    updateImage,
    addImageField,
    removeImageField,
    toggleColor,
    addCustomColor,
    removeColor,
    toggleSize,
    addSizeGuideRow,
    removeSizeGuideRow,
    updateSizeGuideCell,
    addSizeGuideColumn,
    removeSizeGuideColumn,
    updateSizeGuideColumnLabel,
    loadProduct,
    reset,
    setFormData, // Expose for advanced use cases
  };
};
