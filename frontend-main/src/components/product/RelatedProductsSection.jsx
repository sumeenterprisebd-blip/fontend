import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';
import RelatedProductCard from './RelatedProductCard';

export default function RelatedProductsSection({ product, onAddToCart }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productsAPI.getProducts({
          category: product.category,
          limit: 5, // Get 5, then filter out current product
          sort: 'newest'
        });

        const fetchedProducts = response.data.products || [];
        
        // Filter out current product and transform
        const transformedProducts = fetchedProducts
          .filter(p => p._id !== product._id && p.isActive !== false)
          .map(p => ({
            _id: p._id,
            id: p._id,
            name: p.name,
            image: p.images && p.images[0] ? p.images[0] : '/logo.jpeg',
            images: p.images || [],
            price: p.price,
            originalPrice: p.originalPrice || null,
            discount: p.discount || null,
            slug: p.slug,
            category: p.category,
            rating: p.rating || 0,
            link: `/product/${p.slug || p._id}`
          }))
          .slice(0, 4); // Limit to 4 products

        setRelatedProducts(transformedProducts);
      } catch (error) {
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  if (!product || loading) {
    return null;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-black mb-8">YOU MIGHT ALSO LIKE</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {relatedProducts.map((relatedProduct) => (
          <RelatedProductCard
            key={relatedProduct._id || relatedProduct.id}
            product={relatedProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
