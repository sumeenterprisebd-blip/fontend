import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function ProductSelectionStep({
    userSelectionMode,
    selectedUser,
    newUserFirstName,
    newUserLastName,
    products,
    fetchingData,
    selectedProduct,
    setSelectedProduct,
    error,
    setError,
    onNext,
    onBack
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        const name = product.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search);
    });

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSearchTerm('');
        setError('');
        onNext();
    };

    const handleBack = () => {
        if (userSelectionMode === 'existing') {
            // Don't clear selectedUser when going back
        }
        onBack();
    };

    const getUserName = () => {
        if (userSelectionMode === 'existing') {
            return `${selectedUser?.firstName} ${selectedUser?.lastName}`;
        }
        return `${newUserFirstName} ${newUserLastName}`.trim();
    };

    return (
        <div>
            <div className="mb-4">
                <p className="text-gray-600">
                    Selected User: <span className="font-semibold">{getUserName()}</span>
                </p>
                <button
                    onClick={handleBack}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Change User
                </button>
            </div>

            <p className="text-gray-600 mb-4">Select a product to review</p>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
            </div>

            {/* Loading State */}
            {fetchingData ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {products.length === 0 ? 'No products found' : 'No matching products'}
                </div>
            ) : (
                <div className="max-h-96 overflow-y-auto grid grid-cols-2 gap-3">
                    {filteredProducts.map((product) => (
                        <button
                            key={product._id}
                            onClick={() => handleProductSelect(product)}
                            className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                            <img
                                src={product.images?.[0] || '/logo.jpeg'}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-md mb-2"
                            />
                            <p className="font-semibold text-sm text-black line-clamp-2">
                                {product.name}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={handleBack}
                className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
                Back to User Selection
            </button>
        </div>
    );
}
