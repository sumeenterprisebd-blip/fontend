import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/shop/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import { ordersAPI, reviewsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import ReviewModal from '@/components/orders/ReviewModal';
import SEO from '@/components/shared/SEO';

const ordersStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'My Orders',
    description: 'View and track your orders'
};

function OrderCard({ order, onReviewSuccess }) {
    const [reviewModal, setReviewModal] = useState({ open: false, product: null });
    const [reviewedProducts, setReviewedProducts] = useState(new Set());

    useEffect(() => {
        // Check which products have been reviewed
        const checkReviews = async () => {
            if (order.orderStatus?.toLowerCase() === 'delivered') {
                const orderId = order._id;
                const reviewed = new Set();

                for (const item of order.orderItems || []) {
                    const productId = item.product?._id || item.product;
                    if (productId) {
                        try {
                            const response = await reviewsAPI.checkReviewExists(orderId, productId);
                            if (response.data.exists) {
                                reviewed.add(productId);
                            }
                        } catch (error) {
                        }
                    }
                }

                setReviewedProducts(reviewed);
            }
        };

        checkReviews();
    }, [order]);

    const handleReviewClick = (item) => {
        setReviewModal({
            open: true,
            product: {
                _id: item.product?._id || item.product,
                name: item.name || item.product?.name,
                image: item.image || item.product?.images?.[0]
            },
            orderId: order._id
        });
    };

    const handleReviewSuccess = () => {
        setReviewModal({ open: false, product: null });
        // Add product to reviewed set
        if (reviewModal.product?._id) {
            setReviewedProducts(prev => new Set([...prev, reviewModal.product._id]));
        }
        onReviewSuccess?.();
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        switch (statusLower) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const orderId = order.orderNumber || (order._id ? order._id.slice(-8).toUpperCase() : order.id || 'N/A');
    const orderDate = order.createdAt || order.date;
    const orderStatus = order.orderStatus || order.status || 'pending';
    const orderTotal = order.total || 0;
    const orderItems = order.orderItems || order.items || [];
    const isDelivered = orderStatus?.toLowerCase() === 'delivered';

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-bold text-black mb-1">Order #{orderId}</h3>
                        <p className="text-sm text-gray-600" suppressHydrationWarning>
                            Placed on {formatDate(orderDate)}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(orderStatus)}`}>
                            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-black">৳{orderTotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {orderItems.map((item, index) => {
                        const itemId = item._id || item.id || item.product?._id || item.product || index;
                        const itemName = item.name || item.product?.name || 'Product';
                        const itemImage = item.image || item.product?.images?.[0] || '/logo.jpeg';
                        const itemQuantity = item.quantity || 1;
                        const itemPrice = item.price || 0;
                        const productId = item.product?._id || item.product;
                        const hasReviewed = reviewedProducts.has(productId);

                        return (
                            <div key={itemId} className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:border-gray-300 transition-all">
                                <div className="relative w-full aspect-square overflow-hidden bg-white">
                                    <Image
                                        src={itemImage}
                                        alt={itemName}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3">
                                    <h4 className="text-sm font-semibold text-black mb-1 line-clamp-2">{itemName}</h4>
                                    <p className="text-xs text-gray-600 mb-1">Qty: {itemQuantity}</p>
                                    <p className="text-sm font-bold text-black mb-2">৳{itemPrice.toFixed(2)}</p>

                                    {isDelivered && (
                                        <button
                                            onClick={() => handleReviewClick(item)}
                                            disabled={hasReviewed}
                                            className={`w-full text-xs py-1.5 rounded-md font-medium transition-colors ${hasReviewed
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-yellow-400 text-black hover:bg-yellow-500'
                                                }`}
                                        >
                                            {hasReviewed ? 'Reviewed' : 'Write Review'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {reviewModal.open && (
                <ReviewModal
                    isOpen={reviewModal.open}
                    onClose={() => setReviewModal({ open: false, product: null })}
                    product={reviewModal.product}
                    orderId={reviewModal.orderId}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </>
    );
}

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated() && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
                    <Link
                        href="/login"
                        className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <>
                <SEO
                    title="My Orders - DeshWear"
                    description="View your order history and track current deliveries. Check order status and leave reviews for delivered items."
                    noindex={true}
                    structuredData={ordersStructuredData}
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title="My Orders - DeshWear"
                description="View your order history and track current deliveries. Check order status and leave reviews for delivered items."
                noindex={true}
                structuredData={ordersStructuredData}
            />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Orders', href: '/orders' }
                        ]}
                    />

                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">My Orders</h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            View and track your order history
                        </p>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-16 sm:py-20">
                            <div className="max-w-md mx-auto">
                                <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                                    No Orders Yet
                                </h2>
                                <p className="text-base sm:text-lg text-gray-600 mb-8">
                                    Start shopping to see your orders here.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                >
                                    Browse Shop
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {orders.map((order) => (
                                <OrderCard
                                    key={order._id || order.id}
                                    order={order}
                                    onReviewSuccess={fetchOrders}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

