import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/components/shop/Breadcrumb';
import ProductGrid from '@/components/shop/ProductGrid';
import Pagination from '@/components/shop/Pagination';
import ShopSearch from '@/components/shop/ShopSearch';
import { productsAPI } from '@/services/api';
import { useCart } from '@/hooks/useCart';
import SEO from '@/components/shared/SEO';
import { API_BASE_URL } from '@/config/api';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), { ssr: false });

export default function NewArrivalsPage({ initialProducts = [], initialTotalProducts = 0, initialError = null }) {
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const itemsPerPage = 21;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState(initialError);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const { addToCart } = useCart();
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (initialProducts.length === 0) {
          setLoading(true);
        }
        setError(null);
        const response = await productsAPI.getProducts({
          limit: 100,
          sort: 'category-min-price-low',
          isNewArrival: 'true',
        });

        const fetchedProducts = response.data.products || [];
        const transformedProducts = fetchedProducts
          .filter(p => p.isActive !== false)
          .map((product) => {
            const categoryName = typeof product.category === 'string'
              ? product.category
              : product.category?.name || '';

            return {
              id: product._id,
              _id: product._id,
              name: product.name,
              title: product.title || product.name,
              image: product.images && product.images[0] ? product.images[0] : '/logo.jpeg',
              images: product.images || [],
              rating: Number(product.rating || 0),
              price: Number(product.price || 0),
              originalPrice: product.originalPrice !== undefined && product.originalPrice !== null
                ? Number(product.originalPrice)
                : null,
              discount: product.discount !== undefined && product.discount !== null
                ? Number(product.discount)
                : null,
              slug: product.slug,
              link: `/product/${product.slug || product._id}`,
              category: categoryName,
              colors: Array.isArray(product.colors) ? product.colors : [],
              sizes: Array.isArray(product.sizes) ? product.sizes : [],
              dressStyle: product.dressStyle || 'Casual',
              stock: Number(product.stock || 0),
              createdAt: product.createdAt,
              isNew: true,
              description: product.description,
            };
          });

        setProducts(transformedProducts);
        setTotalProducts(response.data.total || transformedProducts.length);
      } catch (err) {
        setError(null);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts.length]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const categoryMatch = product.category?.toLowerCase().includes(query);
      return nameMatch || categoryMatch;
    });
  }, [searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleAddToCart = async (productId) => {
    const product = filteredProducts.find(p => (p._id || p.id) === productId);
    if (!product) return;

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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="mt-4 h-8 w-64 bg-gray-200 rounded-full animate-pulse" />
            <div className="mt-3 h-4 w-72 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-sm">
                <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />f
                  <div className="h-9 w-full bg-gray-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="New Arrivals - Latest Fashion Collection | Drip Drop"
        description="Discover the latest fashion trends and newest additions to our collection. Shop new arrivals in clothing, accessories, and more at Drip Drop."
        keywords="new arrivals, latest fashion, trending styles, new collection, fashion trends, latest products"
        structuredData={{
          "@type": "CollectionPage",
          "name": "New Arrivals",
          "description": "Latest fashion arrivals and trending styles",
          "numberOfItems": totalProducts
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb and Page Title */}
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'New Arrivals', href: '/new-arrivals' }
              ]}
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-black mt-4">
              New Arrivals
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Check out our newest pieces added to the collection
              {totalProducts > 0 && ` (${totalProducts} products)`}
            </p>
            {error && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col">
            {/* Search Bar */}
            <ShopSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClear={handleSearchClear}
            />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={filteredProducts}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  searchQuery={searchQuery}
                  groupByCategory={true}
                  onAddToCart={handleAddToCart}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/new-arrivals"
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery ? 'No products found' : 'No new arrivals yet.'}
                </p>
                {searchQuery && (
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <SweetAlert
            isOpen={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
            title={alert.type === 'success' ? 'Success' : 'Error'}
            message={alert.message}
            type={alert.type}
            confirmText="OK"
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  let initialProducts = [];
  let initialTotalProducts = 0;
  let initialError = null;

  try {
    let allProducts = [];
    let page = 1;
    let totalPages = 1;

    do {
      const res = await fetch(`${API_BASE_URL}/products?limit=100&sort=category-min-price-low&isNewArrival=true&page=${page}`);
      const data = await res.json();
      const fetchedProducts = data.products || [];
      allProducts = allProducts.concat(fetchedProducts);
      totalPages = data.pages || 1;
      page += 1;
    } while (page <= totalPages);

    const transformedProducts = allProducts
      .filter((p) => p.isActive !== false)
      .map((product) => {
        const categoryName = typeof product.category === 'string'
          ? product.category
          : product.category?.name || '';

        return {
          id: product._id,
          _id: product._id,
          name: product.name,
          title: product.title || product.name,
          image: product.images && product.images[0] ? product.images[0] : '/logo.jpeg',
          images: product.images || [],
          rating: Number(product.rating || 0),
          price: Number(product.price || 0),
          originalPrice: product.originalPrice !== undefined && product.originalPrice !== null
            ? Number(product.originalPrice)
            : null,
          discount: product.discount !== undefined && product.discount !== null
            ? Number(product.discount)
            : null,
          slug: product.slug,
          link: `/product/${product.slug || product._id}`,
          category: categoryName,
          colors: Array.isArray(product.colors) ? product.colors : [],
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          dressStyle: product.dressStyle || 'Casual',
          stock: Number(product.stock || 0),
          createdAt: product.createdAt,
          isNew: true,
          description: product.description,
        };
      });

    initialProducts = transformedProducts;
    initialTotalProducts = transformedProducts.length;
  } catch (error) {
    initialError = null;
    initialProducts = [];
    initialTotalProducts = 0;
  }

  return {
    props: {
      initialProducts,
      initialTotalProducts,
      initialError,
    },
  };
}

