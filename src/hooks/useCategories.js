import { useState, useEffect } from "react";
import { categoriesAPI } from "@/services/api";

export function useCategories(options = {}) {
  const {
    onlyWithActiveProducts = false,
    initialCategories = [],
    enabled = true,
    refreshOnMount = false,
  } = options;
  const initialList = Array.isArray(initialCategories) ? initialCategories : [];
  const [categories, setCategories] = useState(() => {
    return onlyWithActiveProducts
      ? initialList.filter((cat) => (cat.count || 0) > 0)
      : initialList;
  });
  const [loading, setLoading] = useState(initialList.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    // If we have initial data, we can render immediately and optionally refresh in the background.
    if (initialList.length > 0 && !refreshOnMount) {
      setLoading(false);
      return undefined;
    }

    const fetchCategories = async () => {
      try {
        // If we're only refreshing, keep UI stable (no skeleton flash)
        if (initialList.length === 0) setLoading(true);
        setError(null);
        const response = await categoriesAPI.getCategories(
          onlyWithActiveProducts ? { onlyWithActiveProducts: true } : undefined
        );
        const apiCategories = response.data.categories || [];

        // Transform API categories to match expected format
        const transformedCategories = apiCategories.map((cat) => ({
          id: cat._id || cat.id || cat.name,
          name: cat.name,
          slug: cat.slug || cat.name,
          count: typeof cat.count === "number" ? cat.count : 0,
          image: cat.image || null, // Include product image from category
          createdAt: cat.createdAt || null,
        }));

        const filteredCategories = onlyWithActiveProducts
          ? transformedCategories.filter((cat) => (cat.count || 0) > 0)
          : transformedCategories;

        setCategories(filteredCategories);
      } catch (error) {
        setError(error.message || "Failed to fetch categories");
        // No fallback - only show database categories
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [onlyWithActiveProducts, initialList.length, enabled, refreshOnMount]);

  return { categories, loading, error };
}
