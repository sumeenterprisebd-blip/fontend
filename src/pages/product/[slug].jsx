import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
// Breadcrumb removed for single product page UI (hidden per request)
import { useCart } from '@/hooks/useCart';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductOptions from '@/components/product/ProductOptions';
import ProductDescription from '@/components/product/ProductDescription';
import SEO from '@/components/shared/SEO';
import { API_BASE_URL } from '@/config/api';
import { trackViewContent } from '@/utils/analytics';
import { useSettings } from '@/contexts/SettingsContext';

const ProductReviewsSection = dynamic(
  () => import('@/components/product/ProductReviewsSection'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="h-5 w-40 bg-gray-200 rounded-full animate-pulse" />
        <div className="mt-4 h-4 w-full bg-gray-200 rounded-full animate-pulse" />
        <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded-full animate-pulse" />
      </div>
    ),
  }
);

const RelatedProductsSection = dynamic(
  () => import('@/components/product/RelatedProductsSection'),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="h-5 w-52 bg-gray-200 rounded-full animate-pulse" />
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    ),
  }
);

const SweetAlert = dynamic(
  () => import('@/components/shared/SweetAlert'),
  { ssr: false }
);

export default function ProductDetailPage({ initialProduct = null, initialReviews = [] }) {
  const router = useRouter();
  const { settings } = useSettings();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(0);

  const freeShippingThreshold = useMemo(() => {
    const raw = Number(settings?.freeShippingThreshold || 0);
    if (!Number.isFinite(raw)) return 999;
    return Math.max(999, raw);
  }, [settings?.freeShippingThreshold]);

  const categoryLabel = useMemo(() => {
    if (!product?.category) return 'Product';
    return typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'Product';
  }, [product?.category]);

  useEffect(() => {
    setProduct(initialProduct);
    setLoading(!initialProduct);
    setError(null);
  }, [initialProduct]);

  useEffect(() => {
    router.prefetch('/cart');
  }, [router]);

  // Facebook Pixel / GA: ViewContent
  useEffect(() => {
    if (!product?._id && !product?.id) return;
    const productId = product._id || product.id;
    const productName = product.name || 'Product';
    const value = Number(product.price || 0);
    const currency = settings?.currency || 'BDT';

    trackViewContent({ productId, productName, value, currency });
  }, [product?._id, product?.id, product?.name, product?.price, settings?.currency]);

  // breadcrumbItems removed — breadcrumb hidden on product detail page

  const measurementGroups = useMemo(() => {
    return Array.isArray(product?.measurements) ? product.measurements : [];
  }, [product?.measurements]);

  const activeMeasurementGroup = measurementGroups[activeMeasurementIndex] || null;

  useEffect(() => {
    if (measurementGroups.length === 0) {
      setActiveMeasurementIndex(0);
    } else if (activeMeasurementIndex >= measurementGroups.length) {
      setActiveMeasurementIndex(0);
    }
  }, [measurementGroups.length, activeMeasurementIndex]);

  const handleAddToCart = async (cartData) => {
    const result = await addToCart({
      productId: cartData.productId,
      quantity: cartData.quantity,
    });

    if (result.success) {
      router.push('/cart');
      return;
    } else {
      setAlert({
        show: true,
        message: result.message || 'Failed to add item to cart',
        type: 'error',
      });
    }
  };

  const handleAddToCartForRelated = async (productId) => {
    // Redirect to the related product page so user can select size and color
    router.push(`/product/${productId}`);
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-5 w-40 bg-gray-200 rounded-full animate-pulse" />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="w-full aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <div className="h-6 w-3/4 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 w-1/3 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description
          ? product.description.substring(0, 155)
          : `${product.name}. Price ৳${Number(product.price || 0).toFixed(2)}. ${product.discount ? `${product.discount}% off` : 'Quality guaranteed'}.`}
        keywords={`${product.name}, buy ${product.name} online`}
        image={product.image}
        structuredData={{
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.images || [product.image],
          "brand": {
            "@type": "Brand",
            "name": "Sume Traders"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://sumetraders.shop/product/${product.slug}`,
            "priceCurrency": "BDT",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
          },
          "aggregateRating": (product.rating > 0 || initialReviews.length > 0) ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating || (initialReviews.reduce((sum, review) => sum + review.rating, 0) / (initialReviews.length || 1)),
            "reviewCount": product.numReviews || initialReviews.length
          } : undefined,
          "review": initialReviews.slice(0, 5).map((review) => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": review?.user?.name || review?.name || "Customer"
            },
            "datePublished": review?.createdAt,
            "reviewBody": review?.comment || review?.review || "",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review?.rating || 0,
              "bestRating": "5"
            }
          })),
          "sku": product._id,
          "category": categoryLabel
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb intentionally hidden on single product page */}
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-0">
            {/* Product Images - Left Side */}
            <div className="lg:col-span-2">
              <ProductImageGallery product={product} />
            </div>

            {/* Product Info & Options - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-2">
                <ProductInfo product={product} />
                <div id="product-options">
                  <ProductOptions product={product} onAddToCart={handleAddToCart} />
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Details */}
          <div className="mt-12">
            <ProductDescription product={product} />
          </div>

          {/* Mobile sticky CTA: scroll to options for quick add-to-cart */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={product.image || (product.images && product.images[0])} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-700">৳{Number(product.price || 0).toFixed(2)}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('product-options');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="ml-2 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
              >
                Choose & Add
              </button>
            </div>
          </div>

          {/* Additional Information Sections */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Shipping & Returns */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Delivery & Returns</h2>
              <div className="mt-3 space-y-3 text-sm sm:text-base text-gray-700">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="font-semibold text-gray-900">Delivery</div>
                  <div className="mt-1">Typically delivered within 2–3 days (timing may vary by location).</div>
                </div>

                {/* Free delivery section removed per request */}

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="font-semibold text-gray-900">Returns & Exchange</div>
                  <div className="mt-1">Easy returns & exchange available—see checkout/support for the latest policy details.</div>
                </div>
              </div>
            </section>


            {/* FAQs */}
            <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">FAQs</h2>
              <div className="mt-4 space-y-2">
                {[
                  {
                    q: 'How long does delivery take?',
                    a: 'Typically 2–3 days depending on your location and courier availability.',
                  },
                  {
                    q: 'Can I return or exchange this product?',
                    a: 'Yes—returns/exchanges are available. Please check the latest policy at checkout or contact support for help.',
                  },
                  {
                    q: 'Is Cash on Delivery available?',
                    a: 'If available in your area, you can select it during checkout.',
                  },
                  {
                    q: 'How do I choose the right size?',
                    a: 'Pick from the available sizes and use the Size Guide above. If you’re unsure, contact support with your height/weight.',
                  },
                  {
                    q: 'Does this product have a combo offer?',
                    a: product?.isComboOffer ? 'Yes—combo savings may apply when you buy a combo.' : 'Combo offers may vary by product. If available, it will be shown on this page.',
                  },
                ].map((item) => (
                  <details key={item.q} className="group rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between gap-4">
                      <span>{item.q}</span>
                      <span className="text-gray-400 group-open:text-gray-700">+</span>
                    </summary>
                    <div className="mt-2 text-sm sm:text-base text-gray-700">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Product Reviews Section */}
          <div className="mt-16">
            <ProductReviewsSection productId={product._id} initialReviews={initialReviews} />
          </div>

          {/* Related Products Section */}
          <div className="mt-16">
            <RelatedProductsSection
              product={product}
              onAddToCart={handleAddToCartForRelated}
            />
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

export async function getServerSideProps({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`);
    const data = await res.json();
    const fetchedProduct = data?.product;

    if (!fetchedProduct || fetchedProduct.isActive === false) {
      return { notFound: true };
    }

    let initialReviews = [];
    try {
      const reviewsRes = await fetch(`${API_BASE_URL}/reviews/product/${fetchedProduct._id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        initialReviews = reviewsData.reviews || [];
      }
    } catch (error) {
      initialReviews = [];
    }

    const initialProduct = {
      _id: fetchedProduct._id,
      id: fetchedProduct._id,
      name: fetchedProduct.name,
      slug: fetchedProduct.slug,
      description: fetchedProduct.description || '',
      images: fetchedProduct.images || [],
      image: fetchedProduct.images && fetchedProduct.images[0] ? fetchedProduct.images[0] : '/logo.jpeg',
      price: fetchedProduct.price,
      originalPrice: fetchedProduct.originalPrice || null,
      discount: fetchedProduct.discount || null,
      category: fetchedProduct.category,
      sizeGuideColumns: fetchedProduct.sizeGuideColumns || [],
      sizeGuide: fetchedProduct.sizeGuide || [],
      dressStyle: fetchedProduct.dressStyle || 'Casual',
      rating: fetchedProduct.rating || 0,
      numReviews: fetchedProduct.numReviews || 0,
      stock: fetchedProduct.stock || 0,
      tags: fetchedProduct.tags || [],
      isActive: fetchedProduct.isActive !== false,
    };

    return {
      props: {
        initialProduct,
        initialReviews,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}