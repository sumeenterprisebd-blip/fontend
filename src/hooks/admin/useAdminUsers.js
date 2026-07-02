import { useEffect, useRef, useState } from "react";
import { usersAPI } from "@/services/api";

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterHasOrders, setFilterHasOrders] = useState("all");
    const [filterSuspicious, setFilterSuspicious] = useState("all");
    const [filterEmailVerified, setFilterEmailVerified] = useState("all");
    const [filterPhoneVerified, setFilterPhoneVerified] = useState("all");
    const [registeredFrom, setRegisteredFrom] = useState("");
    const [registeredTo, setRegisteredTo] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [pagination, setPagination] = useState({
        page: 1,
        limit: itemsPerPage,
        total: 0,
        totalPages: 1,
    });

    const [summary, setSummary] = useState({
        total: 0,
        admins: 0,
        moderators: 0,
        regular: 0,
        active: 0,
        suspended: 0,
        blocked: 0,
        suspicious: 0,
        emailUnverified: 0,
        phoneUnverified: 0,
    });

    const [duplicatePhoneUserIds, setDuplicatePhoneUserIds] = useState(new Set());
    const [duplicateEmailUserIds, setDuplicateEmailUserIds] = useState(new Set());

    // Orders modal
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [ordersUser, setOrdersUser] = useState(null);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [ordersPagination, setOrdersPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });

    // Role modal
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [selectedNewRole, setSelectedNewRole] = useState("");
    const [showRoleConfirmation, setShowRoleConfirmation] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
        return () => clearTimeout(t);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setOpenDropdown(null);
                setShowViewModal(false);
                if (!actionLoading) {
                    setShowRoleModal(false);
                    setShowRoleConfirmation(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [actionLoading]);

    const buildParams = (page) => ({
        q: debouncedSearchTerm || undefined,
        role: filterRole,
        status: filterStatus,
        hasOrders:
            filterHasOrders === "all"
                ? undefined
                : filterHasOrders === "yes"
                    ? true
                    : false,
        suspicious:
            filterSuspicious === "all"
                ? undefined
                : filterSuspicious === "yes"
                    ? true
                    : false,
        emailVerified:
            filterEmailVerified === "all"
                ? undefined
                : filterEmailVerified === "yes"
                    ? true
                    : false,
        phoneVerified:
            filterPhoneVerified === "all"
                ? undefined
                : filterPhoneVerified === "yes"
                    ? true
                    : false,
        registeredFrom: registeredFrom || undefined,
        registeredTo: registeredTo || undefined,
        sort: sortBy,
        order: sortOrder,
        page,
        limit: itemsPerPage,
    });

    const fetchUsers = async (page = currentPage, options = {}) => {
        const { silent = false } = options;
        try {
            if (!silent) setLoading(true);
            const response = await usersAPI.listUsers(buildParams(page));
            setUsers(response.data.users || []);
            if (response.data.pagination) setPagination(response.data.pagination);
            if (response.data.summary) setSummary(response.data.summary);
            if (!silent) setError("");
        } catch (err) {
            if (!silent) {
                setError(err.response?.data?.message || "Failed to load users");
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchDuplicates = async () => {
        try {
            const response = await usersAPI.getDuplicates();
            const phones = response.data?.duplicates?.phones || [];
            const emails = response.data?.duplicates?.emails || [];

            const phoneSet = new Set();
            phones.forEach((group) => (group.users || []).forEach((u) => phoneSet.add(u._id)));

            const emailSet = new Set();
            emails.forEach((group) => (group.users || []).forEach((u) => emailSet.add(u._id)));

            setDuplicatePhoneUserIds(phoneSet);
            setDuplicateEmailUserIds(emailSet);
        } catch {
            setDuplicatePhoneUserIds(new Set());
            setDuplicateEmailUserIds(new Set());
        }
    };

    useEffect(() => {
        fetchUsers(1);
        fetchDuplicates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        debouncedSearchTerm,
        filterRole,
        filterStatus,
        filterHasOrders,
        filterSuspicious,
        filterEmailVerified,
        filterPhoneVerified,
        registeredFrom,
        registeredTo,
        sortBy,
        sortOrder,
    ]);

    useEffect(() => {
        fetchUsers(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        debouncedSearchTerm,
        filterRole,
        filterStatus,
        filterHasOrders,
        filterSuspicious,
        filterEmailVerified,
        filterPhoneVerified,
        registeredFrom,
        registeredTo,
        sortBy,
        sortOrder,
    ]);

    useEffect(() => {
        const refreshIntervalMs = 15000;
        const duplicatesIntervalMs = 60000;

        const usersTimer = setInterval(() => {
            if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
            fetchUsers(currentPage, { silent: true });
        }, refreshIntervalMs);

        const dupTimer = setInterval(() => {
            if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
            fetchDuplicates();
        }, duplicatesIntervalMs);

        return () => {
            clearInterval(usersTimer);
            clearInterval(dupTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        debouncedSearchTerm,
        filterRole,
        filterStatus,
        filterHasOrders,
        filterSuspicious,
        filterEmailVerified,
        filterPhoneVerified,
        registeredFrom,
        registeredTo,
        sortBy,
        sortOrder,
    ]);

    const toggleDropdown = (userId) => {
        setOpenDropdown(openDropdown === userId ? null : userId);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
        setOpenDropdown(null);
    };

    const fetchUserOrders = async (userId, page = 1) => {
        setOrdersLoading(true);
        try {
            const response = await usersAPI.getUserOrders(userId, { page, limit: 20 });
            setUserOrders(response.data.orders || []);
            setOrdersPagination(
                response.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 }
            );
        } catch {
            setUserOrders([]);
            setOrdersPagination({ page: 1, limit: 20, total: 0, totalPages: 1 });
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleViewOrders = async (user) => {
        setOrdersUser(user);
        setShowOrdersModal(true);
        setOpenDropdown(null);
        if (user?._id) {
            await fetchUserOrders(user._id, 1);
        }
    };

    const handleDeleteUser = async (userId) => {
        const user = users.find((u) => u._id === userId);
        setUserToDelete(user || null);
        setShowDeleteModal(true);
        setOpenDropdown(null);
    };

    const confirmDelete = async () => {
        if (!userToDelete?._id) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");
            await usersAPI.deleteUser(userToDelete._id);
            await fetchUsers(1);
            await fetchDuplicates();
            setSuccessMessage("User deleted successfully");
            setTimeout(() => setSuccessMessage(""), 3000);
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");
            const response = await usersAPI.updateUserStatus(userId, { status });
            const updated = response.data?.user;
            if (updated?._id) {
                setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
                setSelectedUser((prev) => (prev?._id === updated._id ? { ...prev, ...updated } : prev));
            }
            setSuccessMessage("User status updated");
            setTimeout(() => setSuccessMessage(""), 3000);
            setOpenDropdown(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user status");
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleSuspicious = async (user) => {
        if (!user?._id) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");
            const suspicious = !user.isSuspicious;
            const response = await usersAPI.setUserSuspicious(user._id, {
                suspicious,
                reason: suspicious ? "Marked by admin" : "",
            });
            const updated = response.data?.user;
            if (updated?._id) {
                setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
                setSelectedUser((prev) => (prev?._id === updated._id ? { ...prev, ...updated } : prev));
            }
            setSuccessMessage(suspicious ? "User marked suspicious" : "User unmarked suspicious");
            setTimeout(() => setSuccessMessage(""), 3000);
            setOpenDropdown(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update suspicious flag");
            setTimeout(() => setError(""), 5000);
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenRoleModal = (user) => {
        setUserToChangeRole(user);
        setSelectedNewRole(user?.role || "user");
        setShowRoleModal(true);
        setShowRoleConfirmation(false);
        setOpenDropdown(null);
        setError("");
        setSuccessMessage("");
    };

    const handleRoleSelection = (role) => {
        setSelectedNewRole(role);
    };

    const handleSaveRole = () => {
        if (!userToChangeRole) return;
        if (selectedNewRole === userToChangeRole.role) {
            setError("Please select a different role to update");
            setTimeout(() => setError(""), 3000);
            return;
        }
        setShowRoleConfirmation(true);
    };

    const closeRoleModal = () => {
        if (actionLoading) return;
        setShowRoleModal(false);
        setShowRoleConfirmation(false);
        setUserToChangeRole(null);
        setSelectedNewRole("");
    };

    const confirmRoleChange = async () => {
        if (!userToChangeRole?._id || !selectedNewRole) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");
            const response = await usersAPI.updateUserRole(userToChangeRole._id, {
                role: selectedNewRole,
            });
            const updatedRole = response.data?.user?.role || selectedNewRole;

            setUsers((prev) => prev.map((u) => (u._id === userToChangeRole._id ? { ...u, role: updatedRole } : u)));
            setSelectedUser((prev) => (prev?._id === userToChangeRole._id ? { ...prev, role: updatedRole } : prev));

            setSuccessMessage(`User role updated to ${updatedRole} successfully`);
            setTimeout(() => setSuccessMessage(""), 3000);
            closeRoleModal();
            await fetchUsers(currentPage, { silent: true });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user role");
            setTimeout(() => setError(""), 5000);
            setShowRoleConfirmation(false);
        } finally {
            setActionLoading(false);
        }
    };

    const cancelRoleChange = () => {
        closeRoleModal();
    };

    const setEmailVerified = async (userId, verified) => {
        try {
            setError("");
            setSuccessMessage("");
            const response = await usersAPI.verifyUserEmail(userId, verified);
            const updated = response.data?.user;
            if (updated?._id) {
                setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
                setSelectedUser((prev) => (prev?._id === updated._id ? { ...prev, ...updated } : prev));
            }
            setSuccessMessage(verified ? "Email marked as verified" : "Email verification revoked");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update email verification");
            setTimeout(() => setError(""), 5000);
        }
    };

    const setPhoneVerified = async (userId, verified) => {
        try {
            setError("");
            setSuccessMessage("");
            const response = await usersAPI.verifyUserPhone(userId, verified);
            const updated = response.data?.user;
            if (updated?._id) {
                setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));
                setSelectedUser((prev) => (prev?._id === updated._id ? { ...prev, ...updated } : prev));
            }
            setSuccessMessage(verified ? "Phone marked as verified" : "Phone verification revoked");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update phone verification");
            setTimeout(() => setError(""), 5000);
        }
    };

    const stats = {
        total: summary.total,
        admins: summary.admins,
        moderators: summary.moderators,
        regular: summary.regular,
        active: summary.active,
        suspended: summary.suspended,
        blocked: summary.blocked,
        suspicious: summary.suspicious,
        emailUnverified: summary.emailUnverified,
        phoneUnverified: summary.phoneUnverified,
    };

    return {
        users,
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
        setShowDeleteModal,
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
        itemsPerPage,
        stats,
        pagination,
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
    };
}
