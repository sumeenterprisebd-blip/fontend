import { categoriesAPI, colorsAPI } from "@/services/api";

export function useFormData(isOpen, formActions) {
  const fetchCategoriesAndColors = async () => {
    try {
      const [categoriesRes, colorsRes] = await Promise.all([
        categoriesAPI.getCategories({ status: "active" }),
        colorsAPI.getColors({ status: "active" }),
      ]);
      return {
        categories: categoriesRes.data.categories || [],
        colors: colorsRes.data.colors || [],
      };
    } catch (error) {
      formActions.setError("Failed to load categories and colors");
      return { categories: [], colors: [] };
    }
  };

  return { fetchCategoriesAndColors };
}

export function useFormHandlers(formActions) {
  const handleAddCategory = async (name) => {
    try {
      const response = await categoriesAPI.createCategory({ name });
      const newCategory = response.data.category;
      return { success: true, category: newCategory };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add category",
      };
    }
  };

  const handleAddColor = async (colorData) => {
    try {
      const response = await colorsAPI.createColor(colorData);
      const newColor = response.data.color;
      return { success: true, color: newColor };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add color",
      };
    }
  };

  return { handleAddCategory, handleAddColor };
}
