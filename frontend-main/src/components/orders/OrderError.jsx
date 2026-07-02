import Link from 'next/link';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import Breadcrumb from '@/components/shop/Breadcrumb';
import SEO from '@/components/shared/SEO';

export default function OrderError({ error }) {
    return (
        <>
            <SEO title="Order Not Found" description="Order not found" />
            <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: 'Orders', href: '/orders' },
                { label: 'Order Details' }
            ]} />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                            <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Order Not Found'}</h2>
                            <p className="text-gray-600 mb-6">
                                {error === 'Please login to view order details'
                                    ? 'Redirecting to login...'
                                    : 'The order you are looking for does not exist or you do not have permission to view it.'}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    View All Orders
                                </Link>
                                <Link href="/shop" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
