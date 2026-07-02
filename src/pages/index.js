import dynamic from 'next/dynamic';
import Head from 'next/head';
import SEO from "@/components/shared/SEO";
import HeroSection from "@/components/Home/HeroSection";
import TopCategorySection from '@/components/Home/TopCategorySection';
import LazyMount from '@/components/shared/LazyMount';
import { API_BASE_URL } from "@/config/api";
import { optimizeCloudinaryUrl } from '@/utils/imageOptimization';

const TopSellingSection = dynamic(() => import('@/components/Home/TopSellingSection'), { ssr: false });
const NewArrivalsSection = dynamic(() => import('@/components/Home/NewArrivalsSection'), { ssr: false });

const WhyDeshWearSection = dynamic(() => import('@/components/Home/WhyDeshWearSection'), {
  ssr: false,
  loading: () => (
    <section className="w-full bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse" />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
              <div className="mt-4 h-4 w-3/4 bg-gray-100 rounded-full animate-pulse" />
              <div className="mt-3 h-3 w-full bg-gray-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
});

const CustomerReviewsSection = dynamic(() => import('@/components/Home/CustomerReviewsSection'), {
  ssr: false,
  loading: () => (
    <section className="w-full py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-52 bg-gray-100 rounded-full animate-pulse" />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
              <div className="mt-3 h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
              <div className="mt-4 h-3 w-full bg-gray-200 rounded-full animate-pulse" />
              <div className="mt-2 h-3 w-5/6 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
});

export default function Home({
  initialHeroData,
  firstHeroImage,
  firstHeroImagePreload,
  firstHeroImageSrcSet,
  firstHeroImageSizes,
  initialCategories,
  initialReviews,
  initialTopSelling,
  initialNewArrivals,
}) {
  const heroHost = (() => {
    if (!firstHeroImage || typeof firstHeroImage !== 'string') return null;
    try {
      const url = new URL(firstHeroImage);
      return url.hostname;
    } catch {
      return null;
    }
  })();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DeshWear",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://deshwear.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://deshwear.com"
          }/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SEO
        title="DeshWear - Your Destination for Quality Fashion in Bangladesh"
        description="Find the perfect outfit at DeshWear. We offer a curated collection of clothing for every occasion, from casual wear to formal attire. Enjoy fast delivery and free shipping on orders over ৳500."
        keywords="clothing store Bangladesh, fashion deshwear, online shopping BD, men's wear, women's wear"
        type="website"
        structuredData={structuredData}
      />
      {(firstHeroImagePreload || firstHeroImage) && (
        <Head>
          {heroHost && (
            <>
              <link rel="preconnect" href={`https://${heroHost}`} crossOrigin="" />
              <link rel="dns-prefetch" href={`//${heroHost}`} />
            </>
          )}
          <link
            rel="preload"
            as="image"
            href={firstHeroImagePreload || firstHeroImage}
            imageSrcSet={firstHeroImageSrcSet || undefined}
            imageSizes={firstHeroImageSizes || undefined}
            fetchPriority="high"
          />
        </Head>
      )}
      <div className="min-h-screen bg-gray-100">
        <HeroSection initialData={initialHeroData} />
        {/* Only render top categories above the fold, lazy load the rest for TBT/LCP */}
        <TopCategorySection initialCategories={initialCategories} />
        <main suppressHydrationWarning>
          <LazyMount
            rootMargin="0px 0px"
            placeholder={
              <section className="w-full bg-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <div className="h-8 w-48 bg-gray-100 rounded-full mx-auto animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="w-full aspect-[3/4] bg-gray-100 animate-pulse" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                          <div className="h-3 w-1/2 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            }
          >
            <TopSellingSection initialProducts={initialTopSelling} />
          </LazyMount>

          <LazyMount
            rootMargin="0px 0px"
            placeholder={
              <section className="w-full bg-gray-50 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <div className="h-8 w-48 bg-gray-100 rounded-full mx-auto animate-pulse" />
                    <div className="h-4 w-56 bg-gray-100 rounded-full mx-auto mt-3 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                        <div className="w-full aspect-[3/4] bg-gray-100 animate-pulse" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                          <div className="h-3 w-1/2 bg-gray-100 rounded-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            }
          >
            <NewArrivalsSection initialProducts={initialNewArrivals} />
          </LazyMount>

          <LazyMount
            rootMargin="0px 0px"
            placeholder={
              <section className="w-full bg-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse" />
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                        <div className="h-10 w-10 bg-gray-100 rounded-xl animate-pulse" />
                        <div className="mt-4 h-4 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                        <div className="mt-3 h-3 w-full bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            }
          >
            <WhyDeshWearSection />
          </LazyMount>

          <LazyMount
            rootMargin="0px 0px"
            placeholder={
              <section className="w-full py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                    <div className="h-8 w-52 bg-gray-100 rounded-full mx-auto animate-pulse" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
                        <div className="mt-3 h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
                        <div className="mt-4 h-3 w-full bg-gray-200 rounded-full animate-pulse" />
                        <div className="mt-2 h-3 w-5/6 bg-gray-200 rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            }
          >
            <CustomerReviewsSection initialReviews={initialReviews} />
          </LazyMount>
        </main>
      </div>
    </>
  );
}

// Preload critical data at build/ISR time to reduce TTFB
export async function getStaticProps(context) {
  const isBuild = context?.revalidateReason === 'build';
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    if (trimmed.startsWith('//')) return `https:${trimmed}`;

    // Avoid mixed-content on https sites: upgrade http->https for known hosts
    // (safe because these hosts support https in production)
    if (trimmed.startsWith('http://')) {
      try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname;
        const upgradeHosts = new Set([
          'deshwear.shop',
          'www.deshwear.shop',
          'deshwear.com',
          'www.deshwear.com',
          'res.cloudinary.com',
        ]);
        if (upgradeHosts.has(host) || host.endsWith('.fbcdn.net') || host.endsWith('.fbsbx.com')) {
          parsed.protocol = 'https:';
          return parsed.toString();
        }
      } catch {
        // ignore
      }
    }

    // Absolute URLs already ok
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;

    // Many backend responses store uploads as a relative path.
    // On the frontend domain this would 404; make it absolute so Next/Image can load it.
    if (trimmed.startsWith('/uploads/')) return `${apiOrigin}${trimmed}`;
    if (trimmed.startsWith('uploads/')) return `${apiOrigin}/${trimmed}`;
    return trimmed;
  };

  const fetchWithTimeout = async (url, options, timeoutMs) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    // Fetch hero data during static generation/ISR
    const response = await fetchWithTimeout(`${API_BASE_URL}/heroes/active`, {
      headers: {
        'Accept': 'application/json',
      },
    }, 8000);

    if (response.ok) {
      const data = await response.json();
      const heroesRaw = data.success ? data.data : [];
      const heroes = heroesRaw.map((hero) => {
        const images = Array.isArray(hero?.images) ? hero.images.map(normalizeImageUrl) : hero?.images;
        return { ...hero, images };
      });

      // Extract first hero image for preloading
      let firstHeroImage = null;
      if (heroes.length > 0 && heroes[0].images && heroes[0].images.length > 0) {
        firstHeroImage = normalizeImageUrl(heroes[0].images[0]);
      }

      const isCloudinary = (url) => typeof url === 'string' && url.includes('cloudinary.com') && url.includes('/upload/');
      const heroSizes = '(max-width: 1280px) 100vw, 1280px';
      const heroWidths = [640, 750, 828, 1080, 1200, 1280];

      const firstHeroImagePreload = firstHeroImage && isCloudinary(firstHeroImage)
        ? optimizeCloudinaryUrl(firstHeroImage, {
          width: 1080,
          quality: 'auto:good',
          format: 'auto',
          crop: 'limit',
          gravity: 'auto',
          dpr: 1,
        })
        : firstHeroImage;

      const firstHeroImageSrcSet = firstHeroImage && isCloudinary(firstHeroImage)
        ? heroWidths
          .map((width) => `${optimizeCloudinaryUrl(firstHeroImage, {
            width,
            quality: 'auto:good',
            format: 'auto',
            crop: 'limit',
            gravity: 'auto',
            dpr: 1,
          })} ${width}w`)
          .join(', ')
        : null;

      let initialCategories = [];
      try {
        const catRes = await fetchWithTimeout(`${API_BASE_URL}/categories`, {
          headers: { 'Accept': 'application/json' },
        }, 2500);
        if (catRes.ok) {
          const catData = await catRes.json();
          const apiCategories = catData.categories || [];
          initialCategories = apiCategories
            .map((cat) => ({
              id: cat._id || cat.id || cat.name,
              name: cat.name,
              slug: cat.slug || cat.name,
              count: typeof cat.count === 'number' ? cat.count : 0,
              image: cat.image || null,
              createdAt: cat.createdAt || null,
            }))
            .filter((cat) => Boolean(cat?.name));
        }
      } catch (error) {
        initialCategories = [];
      }

      let initialReviews = [];
      try {
        const reviewsRes = await fetchWithTimeout(`${API_BASE_URL}/reviews/public?limit=12`, {
          headers: { 'Accept': 'application/json' },
        }, 2500);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          initialReviews = reviewsData.reviews || [];
        }
      } catch (error) {
        initialReviews = [];
      }

      let initialTopSelling = [];
      try {
        const topRes = await fetchWithTimeout(`${API_BASE_URL}/products?limit=4&sort=rating&featured=true`, {
          headers: { 'Accept': 'application/json' },
        }, 2500);
        if (topRes.ok) {
          const topData = await topRes.json();
          const fetched = topData.products || [];
          initialTopSelling = fetched
            .filter((p) => p.isActive !== false)
            .map((product) => ({
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
              isNew: false,
            }));
        }
      } catch (error) {
        initialTopSelling = [];
      }

      let initialNewArrivals = [];
      try {
        const newRes = await fetchWithTimeout(`${API_BASE_URL}/products?limit=4&sort=newest&isNewArrival=true`, {
          headers: { 'Accept': 'application/json' },
        }, 2500);
        if (newRes.ok) {
          const newData = await newRes.json();
          const fetched = newData.products || [];
          initialNewArrivals = fetched
            .filter((p) => p.isActive !== false)
            .map((product) => ({
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
              isNew: true,
            }));
        }
      } catch (error) {
        initialNewArrivals = [];
      }

      return {
        props: {
          initialHeroData: heroes,
          firstHeroImage,
          firstHeroImagePreload,
          firstHeroImageSrcSet,
          firstHeroImageSizes: heroSizes,
          initialCategories,
          initialReviews,
          initialTopSelling,
          initialNewArrivals,
        },
        revalidate: 300,
      };
    }

    // Non-200 response: during ISR, throw to keep the last good page
    if (!isBuild) {
      throw new Error(`Heroes fetch failed: ${response.status}`);
    }
  } catch (error) {
    // During ISR revalidation, throwing prevents overwriting the cached page with empty data.
    if (!isBuild) throw error;
  }

  return {
    props: {
      initialHeroData: [],
      firstHeroImage: null,
      firstHeroImagePreload: null,
      firstHeroImageSrcSet: null,
      firstHeroImageSizes: '(max-width: 1280px) 100vw, 1280px',
      initialCategories: [],
      initialReviews: [],
      initialTopSelling: [],
      initialNewArrivals: [],
    },
    revalidate: 300,
  };
}
