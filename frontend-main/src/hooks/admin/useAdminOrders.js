import { useState, useEffect, useCallback } from "react";
import { ordersAPI } from "@/services/api";

/**
 * useAdminOrders Hook
 * Responsibility: Manage orders state, filtering logic, and API calls
 * Max Lines: 50-120 ✅
 */
export default function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [approvingOrderId, setApprovingOrderId] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);

  const fetchOrders = useCallback(async (options = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) setLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data.orders || []);
      setError(null);
      if (!silent) setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to fetch orders");
      if (!silent) setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) <= endDateTime
      );
    }

    if (orderStatus) {
      filtered = filtered.filter((order) => order.orderStatus === orderStatus);
    }

    if (searchCustomer) {
      const searchLower = searchCustomer.toLowerCase();
      filtered = filtered.filter((order) => {
        const fullName = `${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""
          }`.toLowerCase();
        const email = (
          order.shippingAddress?.email ||
          order.guestInfo?.email ||
          ""
        ).toLowerCase();
        const phone = (
          order.shippingAddress?.phone ||
          order.guestInfo?.phone ||
          ""
        ).toLowerCase();
        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
    }

    if (searchProduct) {
      const searchLower = searchProduct.toLowerCase();
      filtered = filtered.filter((order) =>
        order.orderItems?.some((item) =>
          item.name?.toLowerCase().includes(searchLower)
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, startDate, endDate, orderStatus, searchCustomer, searchProduct]);

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setOrderStatus("");
    setSearchCustomer("");
    setSearchProduct("");
  };

  const hasActiveFilters = () => {
    return (
      startDate || endDate || orderStatus || searchCustomer || searchProduct
    );
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Optimistic update - update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Make API call
      const response = await ordersAPI.updateOrderStatus(orderId, {
        orderStatus: newStatus,
      });

      if (response.data.success) {
        // Refresh orders to ensure data consistency
        await fetchOrders();
        return { success: true, message: "Order status updated successfully" };
      } else {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      await fetchOrders();
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error updating order status",
      };
    }
  };

  const handleApproveOrder = async (orderId) => {
    if (!orderId) return { success: false, message: "Invalid order" };
    try {
      setApprovingOrderId(orderId);
      const res = await ordersAPI.approveOrder(orderId);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to approve order");
      }
      await fetchOrders();
      return { success: true, message: "Order approved" };
    } catch (error) {
      await fetchOrders();
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to approve order",
      };
    } finally {
      setApprovingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!orderId) return { success: false, message: "Invalid order" };
    try {
      setRejectingOrderId(orderId);
      const res = await ordersAPI.rejectOrder(orderId);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to reject order");
      }
      await fetchOrders();
      return { success: true, message: "Order rejected (cancelled)" };
    } catch (error) {
      await fetchOrders();
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to reject order",
      };
    } finally {
      setRejectingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const refreshIntervalMs = 15000;
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      fetchOrders({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [fetchOrders]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    // Core data
    orders,
    loading,
    error,
    displayOrders: filteredOrders,

    // Filter states
    startDate,
    endDate,
    orderStatus,
    searchCustomer,
    searchProduct,
    isFilterOpen,

    // Filter handlers
    setStartDate,
    setEndDate,
    setOrderStatus,
    setSearchCustomer,
    setSearchProduct,
    setIsFilterOpen,
    clearFilters,
    hasActiveFilters,

    // Actions
    handleStatusUpdate,
    handleApproveOrder,
    handleRejectOrder,
    refreshOrders: fetchOrders,

    // Action state
    approvingOrderId,
    rejectingOrderId,
  };
}
