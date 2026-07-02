import { FiSearch, FiPackage, FiMapPin } from 'react-icons/fi';

export function TrackPageHeader() {
    return (
        <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4">
                <FiPackage className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600 text-lg">Enter your order details to see real-time delivery status</p>
        </div>
    );
}

export function HelpSection() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 mb-4">
                If you have any questions about your order or delivery, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold">
                    Contact Support
                </a>
                <a href="/orders" className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-semibold">
                    View All Orders
                </a>
            </div>
        </div>
    );
}

export function NoResultsState() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-slideUp">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tracking Information</h3>
            <p className="text-gray-600">We couldn't find any tracking information for this order.</p>
        </div>
    );
}

export function InfoCards() {
    const cards = [
        { icon: FiSearch, color: 'blue', title: 'Real-Time Tracking', desc: 'Get live updates on your order\'s delivery status' },
        { icon: FiPackage, color: 'green', title: 'Order Details', desc: 'View complete information about your order' },
        { icon: FiMapPin, color: 'purple', title: 'Delivery Updates', desc: 'Track your package from warehouse to doorstep' }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cards.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="bg-white rounded-xl shadow p-6 text-center">
                    <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                </div>
            ))}
        </div>
    );
}
