import React from 'react';
import Image from 'next/image';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function BrandsTable({ brands, onEdit, onDelete }) {
    if (brands.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-12 text-center text-gray-500">
                    No brands found. Click &quot;Add Brand&quot; to create one.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Brand
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map((brand) => (
                        <tr key={brand._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 relative mr-4 shrink-0">
                                        <Image
                                            src={brand.logo || '/logo.jpeg'}
                                            alt={brand.name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(brand)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(brand._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
