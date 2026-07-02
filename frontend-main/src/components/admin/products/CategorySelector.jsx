import { useState } from 'react';
import { categoriesAPI } from '@/services/api';
import { FiPlus, FiX } from 'react-icons/fi';

export default function CategorySelector({ categories, selectedCategory, onCategoryChange, loading }) {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);
    const [categoryError, setCategoryError] = useState('');

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            setCategoryError('Category name is required');
            return;
        }

        setAddingCategory(true);
        setCategoryError('');

        try {
            const response = await categoriesAPI.createCategory({ name: newCategory.trim() });
            const createdCategory = response.data.category;

            // Notify parent of new category
            onCategoryChange(createdCategory.name, createdCategory);

            // Reset and hide form
            setNewCategory('');
            setShowAddCategory(false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add category';
            setCategoryError(message);
        } finally {
            setAddingCategory(false);
        }
    };

    if (!showAddCategory) {
        return (
            <div className="space-y-2">
                <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    disabled={loading}
                >
                    <option value="">
                        {loading
                            ? "Loading categories..."
                            : categories.length === 0
                                ? "No categories - add one below"
                                : "Select a category"}
                    </option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => setShowAddCategory(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <FiPlus size={16} />
                    {categories.length === 0 ? 'Add First Category' : 'Add New Category'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter category name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCategory}
                    onChange={(e) => {
                        setNewCategory(e.target.value);
                        setCategoryError('');
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCategory();
                        }
                    }}
                    autoFocus
                />
                <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={addingCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {addingCategory ? 'Adding...' : 'Add'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setShowAddCategory(false);
                        setNewCategory('');
                        setCategoryError('');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <FiX size={20} />
                </button>
            </div>

            {categoryError && (
                <p className="text-sm text-red-600">{categoryError}</p>
            )}

            <p className="text-xs text-gray-500">
                Category will be available immediately after adding
            </p>
        </div>
    );
}
