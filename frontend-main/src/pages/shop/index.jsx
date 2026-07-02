import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '@/components/shared/SEO';
import Breadcrumb from '@/components/shop/Breadcrumb';
import { useShopFilters } from '@/hooks/useShopFilters';
import { useCart } from '@/hooks/useCart';
import { API_BASE_URL } from '@/config/api';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });
const FilterSidebar = dynamic(() => import('@/components/shop/FilterSidebar'), { ssr: true });
const ProductGrid = dynamic(() => import('@/components/shop/ProductGrid'), {
  ssr: true,
  loading: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm">
          <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-9 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  ),
});
const ShopSearch = dynamic(() => import('@/components/shop/ShopSearch'), { ssr: true });
const Pagination = dynamic(() => import('@/components/shop/Pagination'), { ssr: true });

export default function ShopPage({
  initialProducts = [],
  initialCategories = [],
  initialSearchQuery = '',
  initialTotalPages = 1,
  initialTotalProducts = 0,
  initialSort = 'category-min-price-low',
}) {
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { addToCart } = useCart();
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const {
    currentPage,
    itemsPerPage,
    filters,
    searchQuery,
    filteredProducts,
    totalPages,
    totalProducts,
    loading,
    handleFilterChange,
    handleApplyFilters,
    handleSortChange,
    setSearchQuery,
    handleSearchClear,
    sortBy,
  } = useShopFilters({
    initialProducts,
    initialSearchQuery,
    initialTotalPages,
    initialTotalProducts,
    initialSort,
  });

  // Get selected category name from URL or filters
  const selectedCategory = useMemo(() => {
    const categoryFirstParam = router.query.categoryFirst;
    if (categoryFirstParam) {
      return Array.isArray(categoryFirstParam) ? categoryFirstParam[0] : categoryFirstParam;
    }
    const categoryParam = router.query.category;
    if (categoryParam) {
      return Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
    }
    if (filters.categories && filters.categories.length > 0) {
      return filters.categories[0];
    }
    return 'All Products';
  }, [router.query.categoryFirst, router.query.category, filters.categories]);

  const prioritizedCategory = useMemo(() => {
    const categoryFirstParam = router.query.categoryFirst;
    if (!categoryFirstParam) return '';
    return Array.isArray(categoryFirstParam) ? categoryFirstParam[0] : categoryFirstParam;
  }, [router.query.categoryFirst]);

  const openMobileFilters = useCallback(() => setIsMobileFilterOpen(true), []);
  const closeMobileFilters = useCallback(() => setIsMobileFilterOpen(false), []);

  const handleApplyAndClose = useCallback(() => {
    handleApplyFilters();
    setIsMobileFilterOpen(false);
  }, [handleApplyFilters]);

  const handleAddToCart = useCallback(async (productId) => {
    const product = filteredProducts.find(p => (p._id || p.id) === productId);
    if (!product) return;

    // If product has multiple sizes/colors, redirect for selection
    if ((product.sizes && product.sizes.length > 1) || (product.colors && product.colors.length > 1)) {
      router.push(`/product/${product.slug || productId}`);
      return;
    }

    // If only one size/color, allow quick add
    const result = await addToCart({
      productId,
      name: product.name,
      image: product.image,
      price: product.price,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default',
      quantity: 1,
      stock: product.stock,
    });

    if (result.success) {
      setAlert({
        show: true,
        message: `${product.name} added to cart!`,
        type: 'success',
      });
    } else {
      setAlert({
        show: true,
        message: result.message || 'Failed to add item to cart',
        type: 'error',
      });
    }
  }, [filteredProducts, addToCart, router]);

  // Generate SEO data
  const seoTitle = selectedCategory !== 'All Products'
    ? `${selectedCategory} Collection - DeshWear`
    : 'Shop All Products - DeshWear';

  const seoDescription = selectedCategory !== 'All Products'
    ? `Browse ${selectedCategory.toLowerCase()} at DeshWear. Quality products with affordable prices and fast delivery across Bangladesh.`
    : 'Explore our complete clothing collection. Find the perfect style for every occasion with free shipping on orders over ৳500.';

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${selectedCategory.toLowerCase()}, online shopping, clothing bangladesh`}
        type="website"
      />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8" aria-label="Shop page header">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: selectedCategory, href: '/shop' }
              ]}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black capitalize">
                  {selectedCategory}
                </h1>
                {totalProducts > 0 && (
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyAndClose}
              isMobileOpen={isMobileFilterOpen}
              onMobileClose={closeMobileFilters}
              onMobileOpen={openMobileFilters}
              initialCategories={initialCategories}
            />

            {/* Product Grid with Search */}
            <div className="flex-1">
              <ShopSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClear={handleSearchClear}
              />
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm">
                      <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
                      <div className="mt-4 space-y-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-9 w-full bg-gray-200 rounded-xl animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalProducts={totalProducts}
                  serverPaginated={true}
                  searchQuery={searchQuery}
                  prioritizeCategory={prioritizedCategory}
                  groupByCategory={true}
                  onAddToCart={handleAddToCart}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/shop"
              query={router.query}
            />
          )}
        </div>

        {/* Alert (lazy-loaded to reduce initial JS) */}
        {alert.show ? React.createElement(SweetAlert, {
          isOpen: alert.show,
          onClose: () => setAlert({ ...alert, show: false }),
          title: alert.type === 'success' ? 'Success' : 'Error',
          message: alert.message,
          type: alert.type,
          confirmText: 'OK',
        }) : null}
      </main>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const initialSearchQuery = typeof query.search === 'string'
    ? query.search.replace(/\s+/g, ' ').trim().slice(0, 64)
    : '';
  const initialSort = 'category-min-price-low';
  const page = Number(query.page || 1) || 1;
  const itemsPerPage = 20;

  // Backward compatibility: Home used to link with `categoryFirst`.
  // Treat it as an alias for `category` to ensure server-side filtering works.
  const effectiveCategoryQuery = query.category ?? query.categoryFirst;

  const params = new URLSearchParams({
    limit: String(itemsPerPage),
    sort: initialSort,
    page: String(page),
  });

  if (initialSearchQuery) {
    params.set('search', initialSearchQuery);
  }

  const appendParam = (key, value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((val) => params.append(key, String(val)));
      return;
    }
    params.set(key, String(value));
  };

  appendParam('category', effectiveCategoryQuery);
  appendParam('size', query.size);
  appendParam('minPrice', query.minPrice);
  appendParam('maxPrice', query.maxPrice);

  let initialProducts = [];
  let initialTotalPages = 1;
  let initialTotalProducts = 0;

  try {
    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    const data = await res.json();
    const fetchedProducts = data.products || [];

    initialProducts = fetchedProducts
      .map((product) => {
        const categoryName = typeof product.category === 'string'
          ? product.category
          : product.category?.name || '';

        return ({
          id: product._id,
          _id: product._id,
          name: product.name,
          title: product.title || product.name,
          image: product.images && product.images[0] ? product.images[0] : '/logo.jpeg',
          rating: product.rating || 0,
          price: Number(product.price || 0),
          originalPrice: product.originalPrice !== undefined && product.originalPrice !== null
            ? Number(product.originalPrice)
            : null,
          discount: product.discount !== undefined && product.discount !== null
            ? Number(product.discount)
            : null,
          link: `/product/${product.slug || product._id}`,
          category: categoryName,
          color: Array.isArray(product.colors)
            ? (typeof product.colors[0] === 'string'
              ? product.colors[0].toLowerCase()
              : product.colors[0]?.name
                ? String(product.colors[0].name).toLowerCase()
                : '')
            : '',
          colors: Array.isArray(product.colors)
            ? product.colors
              .map((c) => (typeof c === 'string' ? c : c?.name))
              .filter(Boolean)
            : [],
          size: product.sizes || [],
          sizes: product.sizes || [],
          dressStyle: product.dressStyle || 'Casual',
          stock: Number(product.stock || 0),
          isActive: product.isActive !== false,
          slug: product.slug,
          createdAt: product.createdAt,
        });
      })
      .filter((product) => product.isActive);

    initialTotalPages = data.pages || 1;
    initialTotalProducts = data.total || initialProducts.length;
  } catch (error) {
    initialProducts = [];
  }

  let initialCategories = [];
  try {
    const res = await fetch(`${API_BASE_URL}/categories?onlyWithActiveProducts=true`);
    const data = await res.json();
    const apiCategories = data.categories || [];
    initialCategories = apiCategories
      .map((cat) => ({
        id: cat._id || cat.id || cat.name,
        name: cat.name,
        slug: cat.slug || cat.name,
        count: typeof cat.count === 'number' ? cat.count : 0,
        image: cat.image || null,
      }))
      .filter((cat) => (cat.count || 0) > 0);
  } catch (error) {
    initialCategories = [];
  }

  return {
    props: {
      initialProducts,
      initialCategories,
      initialSearchQuery,
      initialTotalPages,
      initialTotalProducts,
      initialSort,
    },
  };
}

