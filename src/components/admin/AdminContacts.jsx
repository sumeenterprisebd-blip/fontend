import { HiMail, HiRefresh } from "react-icons/hi";
import StatsCards from "./contacts/StatsCards";
import MessageFilters from "./contacts/MessageFilters";
import MessageTable from "./contacts/MessageTable";
import MessagePagination from "./contacts/MessagePagination";
import MessageDetailsModal from "./contacts/MessageDetailsModal";
import DeleteConfirmModal from "./contacts/DeleteConfirmModal";
import { useContactMessages } from "./contacts/useContactMessages";

export default function AdminContacts() {
    const {
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
        setDeleteConfirm
    } = useContactMessages();

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Contact Messages</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage and view messages from customers
                    </p>
                </div>
                <button
                    onClick={() => {
                        fetchMessages();
                        fetchStats();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <HiRefresh className="w-5 h-5" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Filters */}
            <MessageFilters
                filterRead={filterRead}
                stats={stats}
                onFilterChange={handleFilterChange}
            />

            {/* Messages Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                        <HiMail className="w-16 h-16 mb-4" />
                        <p className="text-lg">No messages found</p>
                    </div>
                ) : (
                    <>
                        <MessageTable
                            messages={messages}
                            onViewMessage={viewMessage}
                            onToggleRead={handleToggleRead}
                            onDeleteClick={setDeleteConfirm}
                        />

                        {/* Pagination */}
                        <MessagePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalMessages={totalMessages}
                            limit={limit}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>

            {/* View Message Modal */}
            {showModal && selectedMessage && (
                <MessageDetailsModal
                    message={selectedMessage}
                    onClose={closeModal}
                    onToggleRead={handleToggleRead}
                    onDeleteClick={setDeleteConfirm}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={() => handleDelete(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
}
