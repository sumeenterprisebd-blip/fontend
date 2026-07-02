import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';

export function useProductSection({
  limit = 8,
  sort = 'newest',
  featured = false,
  isNewArrival = false,
  enabled = true,
  initialProducts = [],
}) {
  const initialList = Array.isArray(initialProducts) ? initialProducts : [];
  const [products, setProducts] = useState(initialList);
  const [loading, setLoading] = useState(initialList.length === 0);

  useEffect(() => {
    // If we're not supposed to fetch, or we already have products,
    // avoid any extra state updates (prevents an extra render on mount).
    if (!enabled || initialList.length > 0) return undefined;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { limit, sort };
        if (featured) params.featured = 'true';
        if (isNewArrival) params.isNewArrival = 'true';

        const response = await productsAPI.getProducts(params);
        const fetchedProducts = response.data.products || [];

        const transformedProducts = fetchedProducts
          .filter(p => p.isActive !== false)
          .map(product => ({
            _id: product._id,
            id: product._id,
            name: product.name,
            image: product.images && product.images[0] ? product.images[0] : '/logo.jpeg',
            images: product.images || [],
            rating: product.rating || 0,
            price: product.price,
            originalPrice: product.originalPrice || null,
            discount: product.discount || null,
            slug: product.slug,
            category: product.category,
            stock: product.stock || 0,
            createdAt: product.createdAt,
            isNew: sort === 'newest'
          }))
          .slice(0, limit);

        setProducts(transformedProducts);
      } catch (error) {
        // Handle rate limit errors gracefully
        if (error.response?.status === 429) {
          // Keep existing products on rate limit
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, sort, featured, isNewArrival, enabled, initialList.length]);

  return { products, loading };
}

