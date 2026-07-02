import { useState, useEffect, useCallback } from "react";
import { contactAPI } from "@/services/api";

export function useContactMessages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [filterRead, setFilterRead] = useState("all");

  const limit = 10;

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: currentPage, limit };
      if (filterRead !== "all") {
        params.isRead = filterRead === "read";
      }

      const response = await contactAPI.getAllMessages(params);

      if (response.data.success) {
        setMessages(response.data.messages);
        setTotalPages(response.data.pagination.totalPages);
        setTotalMessages(response.data.pagination.totalMessages);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterRead]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await contactAPI.getStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);


  const handleToggleRead = async (id) => {
    try {
      const response = await contactAPI.toggleReadStatus(id);
      if (response.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id
              ? {
                  ...msg,
                  isRead: response.data.message.isRead,
                  readAt: response.data.message.readAt,
                }
              : msg
          )
        );
        fetchStats();
        if (selectedMessage?._id === id) {
          setSelectedMessage(response.data.message);
        }
      }
    } catch (err) {
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await contactAPI.deleteMessage(id);
      if (response.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setDeleteConfirm(null);
        setShowModal(false);
        fetchStats();

        if (messages.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchMessages();
        }
      }
    } catch (err) {
    }
  };

  const viewMessage = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.isRead) {
      await handleToggleRead(message._id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
    setDeleteConfirm(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filter) => {
    setFilterRead(filter);
    setCurrentPage(1);
  };

  return {
    messages,
    stats,
    loading,
    error,
    selectedMessage,
    showModal,
    deleteConfirm,
    currentPage,
    totalPages,
    totalMessages,
    filterRead,
    limit,
    fetchMessages,
    fetchStats,
    handleToggleRead,
    handleDelete,
    viewMessage,
    closeModal,
    handlePageChange,
    handleFilterChange,
    setDeleteConfirm,
  };
}
