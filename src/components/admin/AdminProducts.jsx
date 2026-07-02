import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { useProducts } from './products/hooks/useProducts';
import { useProductForm } from './products/hooks/useProductForm';
import ProductTable from './products/ProductTable';
import ProductFormModal from './products/ProductFormModal';
import AdvancedProductFilter from './products/AdvancedProductFilter';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function AdminProducts() {
  const router = useRouter();
  const { products, loading, fetchProducts, deleteProduct, setProducts } = useProducts();
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', isActive: false, isFeatured: false });
  const [filtering, setFiltering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFilter = async () => {
    setFiltering(true);
    await fetchProducts(filters);
    setFiltering(false);
  };
  const { formData, error, setError, reset, loadProduct, ...formActions } = useProductForm();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    reset();
    setShowModal(true);
  }, [reset]);

  useEffect(() => {
    if (!router.isReady) return;
    if (String(router.query?.new || '') !== '1') return;

    handleAddProduct();
    router.replace('/admin/products', undefined, { shallow: true });
  }, [router.isReady, router.query?.new, router.replace, handleAddProduct]);

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    loadProduct(product);
    setShowModal(true);
  }, [loadProduct]);

  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      // Optimistic update - remove from UI immediately
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== deleteTarget._id)
      );

      // Make API call
      const result = await deleteProduct(deleteTarget._id);

      if (!result.success) {
        // Rollback on error - refetch products
        await fetchProducts();
        alert(result.error || 'Failed to delete product');
      }
    } catch (err) {
      await fetchProducts();
      alert('Error deleting product');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    reset();
  };


  const handleSuccess = () => {
    // Update the product list without full page reload
    fetchProducts();
    handleModalClose();
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm sm:text-base"
        >
          <FiPlus className="mr-2" size={18} />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
      {/* Advanced Product Filter UI */}
      <AdvancedProductFilter
        filters={filters}
        setFilters={setFilters}
        onFilter={handleFilter}
        products={products}
        loading={filtering}
      />


      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
      />
      <ProductFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        editingProduct={editingProduct}
        formData={formData}
        formActions={{ ...formActions, error, setError }}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
