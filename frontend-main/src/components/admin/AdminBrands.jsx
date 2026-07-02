import React from 'react';
import { FiPlus } from 'react-icons/fi';
import useAdminBrands from '@/hooks/admin/useAdminBrands';
import BrandsTable from '@/components/admin/brands/BrandsTable';
import BrandForm from '@/components/admin/brands/BrandForm';
import SweetAlert from '@/components/shared/SweetAlert';

export default function AdminBrands() {
  const {
    brands,
    loading,
    showModal,
    editingBrand,
    showAlert,
    formData,
    handleAddBrand,
    handleEditBrand,
    handleDeleteBrand,
    handleInputChange,
    handleLogoUpdate,
    handleSubmit,
    closeModal,
    closeAlert
  } = useAdminBrands();

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Brands</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage collaborating brands</p>
        </div>
        <button
          onClick={handleAddBrand}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <FiPlus className="mr-2" size={20} />
          Add Brand
        </button>
      </div>

      <BrandsTable
        brands={brands}
        onEdit={handleEditBrand}
        onDelete={handleDeleteBrand}
      />

      <BrandForm
        showModal={showModal}
        editingBrand={editingBrand}
        formData={formData}
        onInputChange={handleInputChange}
        onLogoUpdate={handleLogoUpdate}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

      <SweetAlert
        isOpen={showAlert.show}
        onClose={closeAlert}
        title={showAlert.type === 'success' ? 'Success' : 'Error'}
        message={showAlert.message}
        type={showAlert.type}
      />
    </div>
  );
}

