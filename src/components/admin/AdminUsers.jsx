import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import UsersStats from './users/UsersStats';
import UsersFilters from './users/UsersFilters';
import UsersTable from './users/UsersTable';
import UsersPagination from './users/UsersPagination';
import UserViewModal from './users/UserViewModal';
import UserDeleteModal from './users/UserDeleteModal';
import UserRoleModal from './users/UserRoleModal';
import UserOrdersModal from './users/UserOrdersModal';
import AdminAlert from './users/AdminAlert';
import AdminUsersLoading from './users/AdminUsersLoading';

export default function AdminUsers() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    filterHasOrders,
    setFilterHasOrders,
    filterSuspicious,
    setFilterSuspicious,
    filterEmailVerified,
    setFilterEmailVerified,
    filterPhoneVerified,
    setFilterPhoneVerified,
    registeredFrom,
    setRegisteredFrom,
    registeredTo,
    setRegisteredTo,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    openDropdown,
    dropdownRef,
    selectedUser,
    showViewModal,
    setShowViewModal,
    showDeleteModal,
    userToDelete,
    actionLoading,
    currentPage,
    setCurrentPage,
    showRoleModal,
    userToChangeRole,
    selectedNewRole,
    showRoleConfirmation,
    setShowRoleConfirmation,
    handleOpenRoleModal,
    handleRoleSelection,
    handleSaveRole,
    confirmRoleChange,
    cancelRoleChange,
    handleViewUser,
    handleViewOrders,
    handleDeleteUser,
    confirmDelete,
    handleUpdateStatus,
    handleToggleSuspicious,
    toggleDropdown,
    users,
    pagination,
    stats,
    duplicatePhoneUserIds,
    duplicateEmailUserIds,
    showOrdersModal,
    setShowOrdersModal,
    ordersUser,
    userOrders,
    ordersLoading,
    ordersPagination,
    fetchUserOrders,

    setEmailVerified,
    setPhoneVerified,
  } = useAdminUsers();

  const hasActiveFilters =
    Boolean(searchTerm) ||
    filterRole !== 'all' ||
    filterStatus !== 'all' ||
    filterHasOrders !== 'all' ||
    filterSuspicious !== 'all' ||
    filterEmailVerified !== 'all' ||
    filterPhoneVerified !== 'all' ||
    Boolean(registeredFrom) ||
    Boolean(registeredTo) ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  if (loading) {
    return <AdminUsersLoading />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">User Management</h1>
        <p className="text-blue-100 text-xs sm:text-sm lg:text-base">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Statistics Cards */}
      <UsersStats stats={stats} />

      {/* Success/Error Messages */}
      <AdminAlert
        message={error}
        type="error"
        onClose={() => setError('')}
      />
      <AdminAlert
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage('')}
      />

      {/* Filters and Search */}
      <UsersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterHasOrders={filterHasOrders}
        setFilterHasOrders={setFilterHasOrders}
        filterSuspicious={filterSuspicious}
        setFilterSuspicious={setFilterSuspicious}
        filterEmailVerified={filterEmailVerified}
        setFilterEmailVerified={setFilterEmailVerified}
        filterPhoneVerified={filterPhoneVerified}
        setFilterPhoneVerified={setFilterPhoneVerified}
        registeredFrom={registeredFrom}
        setRegisteredFrom={setRegisteredFrom}
        registeredTo={registeredTo}
        setRegisteredTo={setRegisteredTo}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        currentUsersCount={users.length}
        totalUsersCount={pagination.total}
        onClearFilters={() => {
          setSearchTerm('');
          setFilterRole('all');
          setFilterStatus('all');
          setFilterHasOrders('all');
          setFilterSuspicious('all');
          setFilterEmailVerified('all');
          setFilterPhoneVerified('all');
          setRegisteredFrom('');
          setRegisteredTo('');
          setSortBy('createdAt');
          setSortOrder('desc');
          setCurrentPage(1);
        }}
      />

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <UsersTable
          currentUsers={users}
          searchTerm={searchTerm}
          filterRole={filterRole}
          hasActiveFilters={hasActiveFilters}
          openDropdown={openDropdown}
          dropdownRef={dropdownRef}
          actionLoading={actionLoading}
          onToggleDropdown={toggleDropdown}
          onViewUser={handleViewUser}
          onViewOrders={handleViewOrders}
          onDeleteUser={handleDeleteUser}
          onOpenRoleModal={handleOpenRoleModal}
          onUpdateStatus={handleUpdateStatus}
          onToggleSuspicious={handleToggleSuspicious}
          duplicatePhoneUserIds={duplicatePhoneUserIds}
          duplicateEmailUserIds={duplicateEmailUserIds}
          onClearFilters={() => {
            setSearchTerm('');
            setFilterRole('all');
            setFilterStatus('all');
            setFilterHasOrders('all');
            setFilterSuspicious('all');
            setFilterEmailVerified('all');
            setFilterPhoneVerified('all');
            setRegisteredFrom('');
            setRegisteredTo('');
            setSortBy('createdAt');
            setSortOrder('desc');
            setCurrentPage(1);
          }}
        />

        <UsersPagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <UserViewModal
        user={selectedUser}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        onUpdateStatus={handleUpdateStatus}
        onToggleSuspicious={handleToggleSuspicious}
        onViewOrders={handleViewOrders}
        onSetEmailVerified={(userId, verified) => setEmailVerified(userId, verified)}
        onSetPhoneVerified={(userId, verified) => setPhoneVerified(userId, verified)}
        duplicatePhone={selectedUser?._id ? duplicatePhoneUserIds.has(selectedUser._id) : false}
        duplicateEmail={selectedUser?._id ? duplicateEmailUserIds.has(selectedUser._id) : false}
      />

      <UserRoleModal
        user={userToChangeRole}
        isOpen={showRoleModal}
        onClose={cancelRoleChange}
        selectedRole={selectedNewRole}
        onRoleSelect={handleRoleSelection}
        onSave={handleSaveRole}
        showConfirmation={showRoleConfirmation}
        onConfirm={confirmRoleChange}
        onBackFromConfirmation={() => setShowRoleConfirmation(false)}
        isLoading={actionLoading}
      />

      <UserDeleteModal
        user={userToDelete}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={actionLoading}
      />

      <UserOrdersModal
        user={ordersUser}
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
        orders={userOrders}
        loading={ordersLoading}
        pagination={ordersPagination}
        onPageChange={(page) => {
          if (ordersUser?._id) fetchUserOrders(ordersUser._id, page);
        }}
      />
    </div>
  );
}

