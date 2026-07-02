import { useState, useEffect, useCallback, useMemo } from "react";
import { adminAdvanceAPI } from "@/services/api";

const normalizeSearch = (value) => String(value || "").trim().toLowerCase();

export default function useAdminAdvancePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState("All");
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);

    const fetchPayments = useCallback(async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            const response = await adminAdvanceAPI.list();
            setPayments(response.data.payments || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load advance payments");
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    const handleApprove = useCallback(async (id) => {
        if (!id) return null;
        setApprovingId(id);
        try {
            const response = await adminAdvanceAPI.approve(id);
            await fetchPayments({ silent: true });
            return response.data;
        } finally {
            setApprovingId(null);
        }
    }, [fetchPayments]);

    const handleReject = useCallback(async (id, reason) => {
        if (!id) return null;
        setRejectingId(id);
        try {
            const response = await adminAdvanceAPI.reject(id, reason);
            await fetchPayments({ silent: true });
            return response.data;
        } finally {
            setRejectingId(null);
        }
    }, [fetchPayments]);

    const handleEdit = useCallback(async (data) => {
        if (!data?.id) return null;
        try {
            const response = await adminAdvanceAPI.edit(data);
            await fetchPayments({ silent: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    }, [fetchPayments]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const filteredPayments = useMemo(() => {
        const query = normalizeSearch(searchQuery);
        return payments.filter((payment) => {
            if (status && status !== "All" && String(payment.status) !== status) {
                return false;
            }

            if (!query) return true;

            const phone = String(payment.customerPhone || "").toLowerCase();
            const txn = String(payment.transactionId || "").toLowerCase();
            const sender = String(payment.senderNumber || "").toLowerCase();
            const method = String(payment.paymentMethod || "").toLowerCase();
            return (
                phone.includes(query) ||
                txn.includes(query) ||
                sender.includes(query) ||
                method.includes(query)
            );
        });
    }, [payments, searchQuery, status]);

    return {
        payments,
        filteredPayments,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        approvingId,
        rejectingId,
        refreshPayments: fetchPayments,
        handleApprove,
        handleReject,
        handleEdit,
    };
}
