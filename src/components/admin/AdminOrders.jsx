import React, { useState } from 'react';
import useAdminOrders from '@/hooks/admin/useAdminOrders';
import OrdersFilters from '@/components/admin/orders/OrdersFilters';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import ExportButtons from '@/components/admin/orders/ExportButtons';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import OrderEditModal from '@/components/admin/orders/OrderEditModal';
import OrderPricingModal from '@/components/admin/orders/OrderPricingModal';
import DeleteConfirmModal from '@/components/admin/orders/DeleteConfirmModal';
import WhatsAppMessageModal from '@/components/admin/orders/WhatsAppMessageModal';
import { useToast } from '@/contexts/ToastContext';
import { ordersAPI } from '@/services/api';
import { normalizeWhatsAppNumber } from '@/utils/whatsappOrderMessage';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalState, setModalState] = useState({ view: false, edit: false, pricing: false, delete: false, whatsapp: false });
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [savingMemoOrderId, setSavingMemoOrderId] = useState(null);
  const [savingItemsOrderId, setSavingItemsOrderId] = useState(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const { showToast } = useToast();

  const getOrderId = (order) => order?._id || order?.id || null;

  const {
    orders,
    loading,
    error,
    displayOrders,
    startDate,
    endDate,
    orderStatus,
    searchCustomer,
    searchProduct,
    isFilterOpen,
    setStartDate,
    setEndDate,
    setOrderStatus,
    setSearchCustomer,
    setSearchProduct,
    setIsFilterOpen,
    clearFilters,
    hasActiveFilters,
    handleStatusUpdate,
    handleApproveOrder,
    handleRejectOrder,
    approvingOrderId,
    rejectingOrderId,
    refreshOrders,
  } = useAdminOrders();

  const openModal = (type, order) => {
    setSelectedOrder(order);
    setModalState({
      view: type === 'view',
      edit: type === 'edit',
      pricing: type === 'pricing',
      delete: type === 'delete',
      whatsapp: type === 'whatsapp',
    });
  };

  const closeModals = () => {
    setModalState({ view: false, edit: false, pricing: false, delete: false, whatsapp: false });
    setSelectedOrder(null);
  };

  const handleSendWhatsApp = async (message) => {
    if (!selectedOrder) return;
    const orderId = getOrderId(selectedOrder);
    if (!orderId) {
      showToast('Invalid order: missing id', 'error');
      return;
    }

    const rawPhone = selectedOrder?.shippingAddress?.phone || selectedOrder?.guestInfo?.phone || '';
    const digits = normalizeWhatsAppNumber(rawPhone);
    if (!digits) {
      showToast('Customer phone number is missing/invalid', 'error');
      return;
    }

    const text = encodeURIComponent(String(message || ''));
    const url = `https://wa.me/${encodeURIComponent(digits)}?text=${text}`;

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // ignore window open failures
    }

    setSendingWhatsApp(true);
    try {
      const res = await ordersAPI.markWhatsAppSent(orderId);
      const updatedOrder = res?.data?.order;
      showToast('WhatsApp message opened', 'success');
      await refreshOrders({ silent: true });
      if (updatedOrder) setSelectedOrder(updatedOrder);
      closeModals();
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to record WhatsApp send time', 'error');
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;
    const orderId = getOrderId(selectedOrder);
    if (!orderId) {
      showToast('Invalid order: missing id', 'error');
      return;
    }

    setDeletingOrderId(orderId);
    try {
      await ordersAPI.deleteOrder(orderId);
      showToast('Order deleted successfully', 'success');
      closeModals();
      refreshOrders();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete order', 'error');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleSaveOrder = async (updatedData) => {
    if (!selectedOrder) return;
    try {
      const orderId = getOrderId(selectedOrder);
      if (!orderId) {
        showToast('Invalid order: missing id', 'error');
        return;
      }

      await ordersAPI.updateOrder(orderId, updatedData);
      showToast('Order updated successfully', 'success');
      closeModals();
      refreshOrders();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update order', 'error');
    }
  };

  const handleSavePricing = async (pricingData) => {
    if (!selectedOrder) return;
    try {
      const orderId = getOrderId(selectedOrder);
      if (!orderId) {
        const msg = 'Invalid order: missing id';
        showToast(msg, 'error');
        throw new Error(msg);
      }

      const res = await ordersAPI.updateOrderPricing(orderId, pricingData);
      const msg = res?.data?.message;

      if (msg === 'No pricing changes detected') {
        showToast(msg, 'info');
        return;
      }

      showToast(msg || 'Order pricing updated successfully', 'success');
      closeModals();
      refreshOrders();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to update order pricing';
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const result = await handleStatusUpdate(orderId, newStatus);
    showToast(result.success ? (result.message || 'Order status updated successfully') : (result.message || 'Failed to update order status'), result.success ? 'success' : 'error');
    setUpdatingOrderId(null);
  };

  const handleApprove = async (orderId) => {
    const result = await handleApproveOrder(orderId);
    showToast(
      result.success ? result.message : result.message,
      result.success ? 'success' : 'error'
    );
  };

  const handleReject = async (orderId) => {
    const result = await handleRejectOrder(orderId);
    showToast(
      result.success ? result.message : result.message,
      result.success ? 'success' : 'error'
    );
  };

  const handleSaveMemo = async (orderId, memo) => {
    if (!orderId) return;
    setSavingMemoOrderId(orderId);
    try {
      await ordersAPI.updateOrder(orderId, { memo });
      showToast('Memo saved', 'success');
      // Refresh orders list and selected order for immediate view
      await refreshOrders();
      setSelectedOrder((prev) => (prev && prev._id === orderId ? { ...prev, memo } : prev));
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save memo', 'error');
    } finally {
      setSavingMemoOrderId(null);
    }
  };

  const handleSelectedOrderUpdate = async (updatedOrder) => {
    if (!updatedOrder) return;
    setSelectedOrder((prev) => (prev && getOrderId(prev) === getOrderId(updatedOrder) ? updatedOrder : prev));
    await refreshOrders({ silent: true });
  };

  const handleSaveOrderItems = async (orderId, orderItems) => {
    if (!orderId) return { success: false, message: 'Invalid order id' };
    setSavingItemsOrderId(orderId);
    try {
      const res = await ordersAPI.updateOrderItems(orderId, { orderItems });
      const updatedOrder = res?.data?.order;
      showToast(res?.data?.message || 'Order items updated', 'success');
      await refreshOrders();
      if (updatedOrder) {
        setSelectedOrder((prev) => {
          const prevId = getOrderId(prev);
          return prev && prevId === orderId ? updatedOrder : prev;
        });
      }
      return { success: true, order: updatedOrder };
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update order items', 'error');
      return { success: false, message: error.response?.data?.message };
    } finally {
      setSavingItemsOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track all customer orders</p>
        </div>

        <ExportButtons orders={displayOrders} startDate={startDate} endDate={endDate} />
      </div>

      <OrdersFilters
        startDate={startDate}
        endDate={endDate}
        orderStatus={orderStatus}
        searchCustomer={searchCustomer}
        searchProduct={searchProduct}
        isFilterOpen={isFilterOpen}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setOrderStatus={setOrderStatus}
        setSearchCustomer={setSearchCustomer}
        setSearchProduct={setSearchProduct}
        setIsFilterOpen={setIsFilterOpen}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={displayOrders.length}
        totalCount={orders.length}
      />

      <OrdersTable
        orders={displayOrders}
        onStatusUpdate={handleStatusChange}
        onApproveOrder={handleApprove}
        onRejectOrder={handleReject}
        onViewOrder={(order) => openModal('view', order)}
        onEditOrder={(order) => openModal('edit', order)}
        onSendWhatsApp={(order) => openModal('whatsapp', order)}
        onUpdatePricing={(order) => openModal('pricing', order)}
        onDeleteOrder={(order) => openModal('delete', order)}
        updatingOrderId={updatingOrderId}
        deletingOrderId={deletingOrderId}
        approvingOrderId={approvingOrderId}
        rejectingOrderId={rejectingOrderId}
      />

      {/* Defensive: Only render modal if selectedOrder is a valid object */}
      {modalState.view && selectedOrder && typeof selectedOrder === 'object' ? (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={modalState.view}
          onClose={closeModals}
          onSaveMemo={handleSaveMemo}
          savingMemo={!!savingMemoOrderId}
          onSaveItems={handleSaveOrderItems}
          savingItems={savingItemsOrderId === getOrderId(selectedOrder)}
          onStatusUpdate={handleStatusChange}
          updatingOrderId={updatingOrderId}
          onOrderUpdated={handleSelectedOrderUpdate}
        />
      ) : null}
      {/* Log selectedOrder for debugging */}
      {modalState.view && (!selectedOrder || typeof selectedOrder !== 'object') && (
        (() => { console.error('AdminOrders: selectedOrder is invalid', selectedOrder); return null; })()
      )}
      <OrderEditModal order={selectedOrder} isOpen={modalState.edit} onClose={closeModals} onSave={handleSaveOrder} />
      <OrderPricingModal order={selectedOrder} isOpen={modalState.pricing} onClose={closeModals} onSave={handleSavePricing} />
      <DeleteConfirmModal order={selectedOrder} isOpen={modalState.delete} onClose={closeModals} onConfirm={confirmDelete} deleting={!!deletingOrderId} />
      <WhatsAppMessageModal
        order={selectedOrder}
        isOpen={modalState.whatsapp}
        onClose={closeModals}
        onSend={handleSendWhatsApp}
        sending={sendingWhatsApp}
      />
    </div>
  );
}
