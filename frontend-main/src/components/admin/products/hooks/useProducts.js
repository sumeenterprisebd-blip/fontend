import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const pageLimit = 100;
      let allProducts = [];
      let page = 1;
      let totalPages = 1;

      do {
        const response = await productsAPI.getAdminProducts({
          limit: pageLimit,
          page,
          _ts: Date.now(),
          ...filters,
        });
        const fetchedProducts = response.data.products || [];
        allProducts = allProducts.concat(fetchedProducts);
        totalPages = response.data.pages || 1;
        page += 1;
      } while (page <= totalPages);

      setProducts(allProducts);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.deleteProduct(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete product' };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    setProducts,
  };
};

