import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from './ProductCard';

const normalizeCategory = (product) => {
  const category = product?.category;
  if (!category) return '';
  if (typeof category === 'string') return category.trim().toLowerCase();

  const value = category?.name || category?.title || category?.slug;
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
};

function ProductGrid({
  products,
  currentPage,
  itemsPerPage = 9,
  totalProducts,
  searchQuery = '',
  onAddToCart,
  prioritizeCategory = '',
  serverPaginated = false,
  groupByCategory = false,
  sortBy: controlledSortBy,
  onSortChange,
}) {
  const [sortBy, setSortBy] = useState(controlledSortBy || 'newest');

  const effectiveSortBy = groupByCategory ? 'price-low' : sortBy;

  useEffect(() => {
    if (groupByCategory) {
      setSortBy('price-low');
      return;
    }
    if (controlledSortBy) {
      setSortBy(controlledSortBy);
    }
  }, [groupByCategory, controlledSortBy]);

  // Default handler if onAddToCart is not provided
  const handleAddToCart = useCallback((productId) => {
    if (onAddToCart) {
      onAddToCart(productId);
    } else {
    }
  }, [onAddToCart]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (effectiveSortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'price-low':
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price-high':
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'rating':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'most-popular':
        default:
          return (Number(b.rating) || 0) - (Number(a.rating) || 0); // Default to rating
      }
    });
  }, [products, effectiveSortBy]);

  const normalizedPriority = typeof prioritizeCategory === 'string'
    ? prioritizeCategory.trim().toLowerCase()
    : '';

  const compareByCategoryThenPriceAsc = (a, b) => {
    const aCat = normalizeCategory(a);
    const bCat = normalizeCategory(b);

    if (aCat !== bCat) {
      // Put uncategorized items at the end
      if (!aCat) return 1;
      if (!bCat) return -1;
      return aCat.localeCompare(bCat);
    }

    const ap = Number(a?.price) || 0;
    const bp = Number(b?.price) || 0;
    if (ap !== bp) return ap - bp;

    const an = String(a?.name || '').trim().toLowerCase();
    const bn = String(b?.name || '').trim().toLowerCase();
    if (an !== bn) return an.localeCompare(bn);
    return String(a?._id || a?.id || '').localeCompare(String(b?._id || b?.id || ''));
  };

  const categoryOrderedProducts = useMemo(() => {
    if (!groupByCategory) return null;
    return [...products].sort(compareByCategoryThenPriceAsc);
  }, [groupByCategory, products]);

  const categoryOrderedWithPriority = useMemo(() => {
    if (!groupByCategory || !categoryOrderedProducts || !normalizedPriority) return categoryOrderedProducts;
    return [
      ...categoryOrderedProducts.filter((p) => normalizeCategory(p) === normalizedPriority),
      ...categoryOrderedProducts.filter((p) => normalizeCategory(p) !== normalizedPriority),
    ];
  }, [groupByCategory, categoryOrderedProducts, normalizedPriority]);

  const prioritizedProducts = useMemo(() => {
    if (groupByCategory) {
      return categoryOrderedWithPriority || [];
    }
    if (!normalizedPriority) return sortedProducts;
    return [
      ...sortedProducts.filter((product) => normalizeCategory(product) === normalizedPriority),
      ...sortedProducts.filter((product) => normalizeCategory(product) !== normalizedPriority),
    ];
  }, [groupByCategory, normalizedPriority, sortedProducts, categoryOrderedWithPriority]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = serverPaginated
    ? prioritizedProducts
    : prioritizedProducts.slice(startIndex, startIndex + itemsPerPage);
  const resolvedTotal = typeof totalProducts === 'number' ? totalProducts : products.length;
  const endIndex = startIndex + paginatedProducts.length;

  return (
    <div className="flex-1">
      {/* Header with count and sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          {searchQuery && (
            <p className="text-sm font-medium text-black mb-1">
              Search results for &quot;{searchQuery}&quot;
            </p>
          )}
          <p className="text-sm text-gray-600">
            Showing {resolvedTotal === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, resolvedTotal)} of {resolvedTotal} Products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={effectiveSortBy}
            disabled={groupByCategory}
            onChange={(e) => {
              const value = e.target.value;
              if (groupByCategory) return;
              setSortBy(value);
              if (onSortChange) {
                onSortChange(value);
              }
            }}
            className={`px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${groupByCategory ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {groupByCategory ? (
              <option value="price-low">Price: Low to High</option>
            ) : (
              <>
                <option value="newest">Newest</option>
                <option value="most-popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <>
              <p className="text-lg font-semibold text-black mb-2">
                No products found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-base text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-600">No products found matching your filters.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-stretch">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(ProductGrid);

