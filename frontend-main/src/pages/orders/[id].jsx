import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '@/components/shop/Breadcrumb';
import TrackingTimeline from '@/components/orders/TrackingTimeline';
import OrderHeader from '@/components/orders/OrderHeader';
import OrderItemsList from '@/components/orders/OrderItemsList';
import ShippingAddressCard from '@/components/orders/ShippingAddressCard';
import PaymentInfoCard from '@/components/orders/PaymentInfoCard';
import OrderActions from '@/components/orders/OrderActions';
import OrderError from '@/components/orders/OrderError';
import { ordersAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/shared/SEO';

export default function OrderDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id, isAuthenticated]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await ordersAPI.getOrder(id);
            const orderData = response.data?.order || response.data;
            setOrder(orderData);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Order not found');
            } else if (err.response?.status === 401) {
                setError('Please login to view order details');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError('Failed to load order details');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <SEO title="Order Details" description="View your order details" />
                <Breadcrumb items={[
                    { label: 'Home', href: '/' },
                    { label: 'Orders', href: '/orders' },
                    { label: 'Order Details' }
                ]} />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-xl p-8 shadow-lg">
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !order || !order._id) return <OrderError error={error} />;

    const orderId = order.orderNumber || (order._id?.slice(-8).toUpperCase() || 'N/A');
    const orderItems = order.orderItems || [];

    return (
        <>
            <SEO title={`Order #${orderId}`} description={`View details for order #${orderId}`} />
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: 'Orders', href: '/orders' },
                { label: `Order #${orderId}` }
            ]} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <OrderHeader order={order} orderId={orderId} />
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <OrderItemsList items={orderItems} />
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
                                    <TrackingTimeline
                                        currentStatus={order.deliveryStatus || order.orderStatus}
                                        trackingHistory={order.trackingHistory || []}
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <ShippingAddressCard address={order.shippingAddress} />
                                <PaymentInfoCard order={order} />
                                <OrderActions orderId={orderId} trackingId={order._id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
