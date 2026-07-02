import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useProductSection } from '@/hooks/useProductSection';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/shared/ProductCard';

const SweetAlert = dynamic(() => import('@/components/shared/SweetAlert'), {
    ssr: false,
});

export default function NewArrivalsSection({ initialProducts = [] }) {
    const hasInitialProducts = Array.isArray(initialProducts) && initialProducts.length > 0;
    const [isVisible, setIsVisible] = useState(hasInitialProducts);
    const sectionRef = useRef(null);
    const { products, loading } = useProductSection({
        limit: 4,
        sort: 'newest',
        isNewArrival: true,
        enabled: isVisible && !hasInitialProducts,
        initialProducts,
    });
    const { addToCart } = useCart();
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    const showViewAll = (products?.length || 0) > 4;

    const handleAddToCart = async (productId) => {
        const product = products.find(p => (p._id || p.id) === productId);
        if (!product) return;

        const result = await addToCart({
            productId,
            quantity: 1,
            size: product.sizes?.[0] || 'M',
            color: product.colors?.[0] || 'Default',
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

    useEffect(() => {
        if (hasInitialProducts) return undefined;
        const node = sectionRef.current;
        if (!node || typeof window === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry && entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    if (!isVisible) {
        return (
            <section ref={sectionRef} className="w-full bg-gray-50 py-12 lg:py-16">
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
        );
    }

    if (loading) {
        return (
            <section ref={sectionRef} className="w-full bg-gray-50 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="w-full bg-gray-50 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-3 uppercase">
                        New Arrivals
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Discover the latest fashion trends
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No new products available at the moment.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product._id || product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>

                        {showViewAll && (
                            <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                                <Link
                                    href="/shop"
                                    className="inline-block bg-white border-2 border-black text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-black hover:text-white active:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                >
                                    View All
                                </Link>
                            </div>
                        )}
                    </>
                )}
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
        </section>
    );
}
