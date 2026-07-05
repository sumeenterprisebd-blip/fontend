import { useEffect, useMemo, useState } from 'react';
import { HiX, HiOutlinePrinter, HiOutlineSave } from 'react-icons/hi';
import { FaWhatsapp } from '@react-icons/all-files/fa/FaWhatsapp';
import OrderCustomerInfo from './OrderCustomerInfo';
import OrderStatusSummary from './OrderStatusSummary';
import OrderItemsTable from './OrderItemsTable';
import { blacklistAPI, ordersAPI } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function OrderDetailsModal({
    order,
    isOpen,
    onClose,
    onSaveMemo,
    savingMemo,
    onSaveItems,
    savingItems,
    onStatusUpdate,
    updatingOrderId,
    onOrderUpdated,
}) {
    const { showToast } = useToast();
    const [memoValue, setMemoValue] = useState('');
    const [isEditingItems, setIsEditingItems] = useState(false);
    const [draftOrderItems, setDraftOrderItems] = useState([]);
    const [blockingKey, setBlockingKey] = useState('');
    const [isEditingAdvance, setIsEditingAdvance] = useState(false);
    const [advanceForm, setAdvanceForm] = useState({
        paymentMethod: 'bkash',
        senderNumber: '',
        transactionId: '',
        amount: 0,
        status: 'Pending',
        rejectedReason: '',
    });
    const [advanceSaving, setAdvanceSaving] = useState(false);
    const [advanceError, setAdvanceError] = useState('');

    const orderId = order?._id || order?.id || null;

    const STATUS_OPTIONS = [
        { value: 'pending', label: 'Pending' },
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const getStatusPillClass = (status, active) => {
        const base = active ? 'text-white' : 'text-gray-700 bg-gray-100 hover:bg-gray-200';
        switch (status) {
            case 'delivered':
                return active ? 'bg-green-600 text-white' : base;
            case 'pending':
                return active ? 'bg-yellow-600 text-white' : base;
            case 'pending_approval':
                return active ? 'bg-orange-600 text-white' : base;
            case 'cancelled':
                return active ? 'bg-red-600 text-white' : base;
            case 'processing':
                return active ? 'bg-blue-600 text-white' : base;
            case 'confirmed':
                return active ? 'bg-purple-600 text-white' : base;
            case 'shipped':
                return active ? 'bg-indigo-600 text-white' : base;
            default:
                return base;
        }
    };

    useEffect(() => {
        setMemoValue(order?.memo || '');
    }, [order]);

    useEffect(() => {
        const fallbackItems = Array.isArray(order?.items) ? order.items : [];
        const orderItemsList = Array.isArray(order?.orderItems) ? order.orderItems : fallbackItems;
        setDraftOrderItems(orderItemsList.map((it) => ({ ...it })));
        setIsEditingItems(false);
    }, [order, isOpen]);

    useEffect(() => {
        setAdvanceForm({
            paymentMethod: String(order?.advancePayment?.paymentMethod || order?.paymentMethod || 'bkash'),
            senderNumber: String(order?.advancePayment?.senderNumber || ''),
            transactionId: String(order?.advancePayment?.transactionId || ''),
            amount: Number(order?.advancePayment?.amount ?? order?.advancePaid ?? 0),
            status: String(order?.advancePaymentStatus || 'Pending'),
            rejectedReason: String(order?.advancePayment?.rejectedReason || ''),
        });
        setAdvanceError('');
        setIsEditingAdvance(false);
    }, [order]);


    // Defensive: Check for required order fields
    if (!isOpen) return null;

    const fallbackItems = Array.isArray(order?.items) ? order.items : [];
    const orderItemsList = Array.isArray(order?.orderItems) ? order.orderItems : fallbackItems;
    const totals = useMemo(() => {
        const orderSubtotal = Number(order?.subtotal);
        const itemsSubtotal = orderItemsList.reduce((sum, item) => {
            const unitPrice = Number(item?.price ?? item?.unitPrice ?? 0);
            const quantity = Number(item?.quantity ?? 0);
            return sum + unitPrice * quantity;
        }, 0);
        const subtotal = Number.isFinite(orderSubtotal) && orderSubtotal > 0
            ? orderSubtotal
            : itemsSubtotal || Number(order?.total ?? order?.totalPrice ?? 0);
        const discount = Number(order?.discount ?? 0);
        // In pricingVersion=2 (and legacy), `subtotal` represents the original price
        // (before discount). `discount` is the discount amount.
        const originalSubtotal = subtotal;
        const discountPercent = originalSubtotal > 0
            ? Math.round((discount / originalSubtotal) * 100)
            : 0;
        const deliveryFee = Number(order?.deliveryFee ?? order?.shipping ?? order?.shippingCost ?? 0);
        const total = Number(order?.total ?? order?.totalPrice ?? 0) || (subtotal - discount + deliveryFee);
        const advancePaid = Number(order?.advancePaid ?? order?.advancePayment?.amount ?? 0);
        const dueAmount = Number(order?.dueAmount ?? Math.max(total - advancePaid, 0));
        const hasAdvance =
            advancePaid > 0 ||
            Number(order?.advancePayment?.amount ?? 0) > 0;
        return {
            subtotal,
            originalSubtotal,
            discountPercent,
            discount,
            deliveryFee,
            total,
            advancePaid,
            dueAmount,
            hasAdvance,
        };
    }, [order, orderItemsList]);
    const formatCurrency = (value) => `৳${Number(value || 0).toFixed(2)}`;
    const titleCase = (value) => {
        if (!value) return '';
        return String(value)
            .toLowerCase()
            .split(/[_\s-]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const advanceStatusPillClass = (status) => {
        switch (String(status || 'None')) {
            case 'Verified':
                return 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800';
            case 'Rejected':
                return 'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800';
            case 'Pending':
                return 'inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800';
            default:
                return 'inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700';
        }
    };

    const handleAdvanceFieldChange = (e) => {
        const { name, value } = e.target;
        setAdvanceForm((prev) => ({ ...prev, [name]: value }));
        setAdvanceError('');
    };

    const saveAdvancePayment = async (data) => {
        if (!orderId) return null;
        setAdvanceSaving(true);
        setAdvanceError('');
        try {
            const response = await ordersAPI.updateAdvancePayment(orderId, {
                advancePayment: data,
            });
            const updatedOrder = response?.data?.order;
            if (typeof onOrderUpdated === 'function') {
                onOrderUpdated(updatedOrder);
            }
            setIsEditingAdvance(false);
            return updatedOrder;
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to update advance payment';
            setAdvanceError(message);
            throw error;
        } finally {
            setAdvanceSaving(false);
        }
    };

    const handleApproveAdvance = async () => {
        if (!orderId) return;
        try {
            await saveAdvancePayment({ status: 'Verified' });
            showToast('Advance payment approved', 'success');
        } catch {
            showToast(advanceError || 'Failed to approve advance payment', 'error');
        }
    };

    const handleRejectAdvance = async () => {
        if (!orderId) return;
        const reason = window.prompt('Enter a reason for rejecting this advance payment (optional):');
        if (reason === null) return;
        try {
            await saveAdvancePayment({ status: 'Rejected', rejectedReason: reason });
            showToast('Advance payment rejected', 'success');
        } catch {
            showToast(advanceError || 'Failed to reject advance payment', 'error');
        }
    };

    const handleSaveAdvanceDetails = async () => {
        if (!orderId) return;
        const payload = {
            paymentMethod: advanceForm.paymentMethod,
            senderNumber: advanceForm.senderNumber,
            transactionId: advanceForm.transactionId,
            amount: Number(advanceForm.amount || 0),
            status: advanceForm.status,
            rejectedReason: advanceForm.rejectedReason,
        };
        try {
            await saveAdvancePayment(payload);
            showToast('Advance payment details saved', 'success');
        } catch {
            showToast(advanceError || 'Failed to save advance payment details', 'error');
        }
    };

    const formattedOrderDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : '';
    const inlineInvoiceLabel = order?.orderNumber || order?._id?.slice(-8) || '';
    const statusLabel = order?.orderStatus?.replace(/_/g, ' ') || 'Pending';
    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-600',
            confirmed: 'text-purple-600',
            processing: 'text-blue-600',
            hold: 'text-orange-600',
            shipped: 'text-indigo-600',
            delivered: 'text-green-600',
            paid_return: 'text-red-600',
            cancelled: 'text-red-600',
            canceled: 'text-red-600',
        };
        return colors[status] || 'text-gray-600';
    };

    const isGuestOrder = !order?.user;
    const blockPhoneValue = order?.shippingAddress?.phone || order?.guestInfo?.phone || '';
    const blockIpValue = order?.client?.ipAddress || '';
    const blockAddressValue = [
        order?.shippingAddress?.streetAddress,
        order?.shippingAddress?.area,
        order?.shippingAddress?.townCity,
        order?.shippingAddress?.state,
        order?.shippingAddress?.zipCode,
        order?.shippingAddress?.country,
    ]
        .map((v) => String(v || '').trim())
        .filter(Boolean)
        .join(', ');

    const handleBlock = async (type, value) => {
        if (!value) {
            showToast('Missing value to blacklist', 'error');
            return;
        }

        const key = `${type}`;
        setBlockingKey(key);
        try {
            const res = await blacklistAPI.create({
                type,
                value,
                reason: `Blocked from order ${inlineInvoiceLabel}`,
            });
            showToast(res?.data?.message || 'Added to blacklist', 'success');
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to add to blacklist', 'error');
        } finally {
            setBlockingKey('');
        }
    };

    const normalizeOrderItemsForSave = (items) => {
        const safe = Array.isArray(items) ? items : [];
        return safe.map((item) => ({
            name: String(item?.name ?? '').trim(),
            price: Number(item?.price ?? 0),
            quantity: Number.parseInt(item?.quantity ?? 0, 10),
            image: item?.image,
            size: item?.size,
            color: item?.color,
        }));
    };

    const toWhatsAppDigits = (rawPhone) => {
        const digits = String(rawPhone || '').replace(/[^\d]/g, '');
        if (!digits) return '';

        // BD mobile: 01XXXXXXXXX -> 8801XXXXXXXXX
        if (digits.startsWith('01') && digits.length === 11) {
            return `88${digits}`;
        }

        // Already has country code
        if (digits.startsWith('8801') && digits.length === 13) {
            return digits;
        }

        // Fallback best-effort
        if (digits.startsWith('1') && digits.length === 10) {
            return `880${digits}`;
        }

        return digits;
    };

    const buildWhatsAppOrderMessage = () => {
        const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Sume Traders';
        const orderLabel = order?.orderNumber
            ? `#${order.orderNumber}`
            : (order?._id ? `#${String(order._id).slice(-8).toUpperCase()}` : '');
        const status = String(order?.orderStatus || 'pending').replace(/_/g, ' ').toUpperCase();
        const statusEmoji = {
            pending: '🕒',
            confirmed: '✅',
            processing: '🧵',
            hold: '⏸️',
            shipped: '🚚',
            delivered: '📦',
            paid_return: '↩️',
            cancelled: '❌',
        }[String(order?.orderStatus || 'pending').toLowerCase()] || 'ℹ️';

        const items = orderItemsList.map((x) => String(x?.name || '').trim()).filter(Boolean);
        const productLine = (() => {
            if (items.length === 0) return '';
            if (items.length === 1) return items[0];
            return `${items[0]} +${items.length - 1} more`;
        })();

        const trackingId = order?.orderNumber || order?.shortId || order?._id;
        const trackingUrl = (() => {
            try {
                if (typeof window === 'undefined') return '';
                const origin = window.location.origin;
                return trackingId ? `${origin}/orders/track?id=${encodeURIComponent(String(trackingId))}` : `${origin}/orders/track`;
            } catch {
                return '';
            }
        })();

        const totalValue = totals.hasAdvance ? totals.totalDue : totals.total;

        const lines = [
            `*${brandName} Order Update*`,
            orderLabel ? `Order: ${orderLabel}` : 'Order update',
            productLine ? `Product: ${productLine}` : '',
            `Total: ৳${Number(totalValue || 0).toFixed(2)}`,
            `Status: ${statusEmoji} ${status}`,
            trackingUrl ? `Track: ${trackingUrl}` : '',
        ].filter(Boolean);

        return lines.join('\n');
    };

    const handleWhatsAppMessage = () => {
        const phoneDigits = toWhatsAppDigits(blockPhoneValue);
        if (!phoneDigits) {
            showToast('Missing customer phone number', 'error');
            return;
        }

        const text = buildWhatsAppOrderMessage();
        const url = `https://wa.me/${encodeURIComponent(phoneDigits)}?text=${encodeURIComponent(text)}`;
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch {
            // ignore
        }
    };

    const printContent = useMemo(() => {
        const companyLogo = 'https://res.cloudinary.com/dczloset7/image/upload/v1768565420/drip_drop/popups/oujst5pamuym9whato3l.jpg';
        const customerName = order?.shippingAddress?.firstName || order?.guestInfo?.name || '';
        const customerLastName = order?.shippingAddress?.lastName || '';
        const customerPhone = order?.shippingAddress?.phone || order?.guestInfo?.phone || '';
        const customerEmail = order?.shippingAddress?.email || order?.guestInfo?.email || '';
        const shippingAddressText = [
            order?.shippingAddress?.streetAddress || order?.shippingAddress?.address || '',
            order?.shippingAddress?.apartment ? `Apt: ${order.shippingAddress.apartment}` : '',
            [order?.shippingAddress?.city, order?.shippingAddress?.state || order?.shippingAddress?.division].filter(Boolean).join(', '),
            order?.shippingAddress?.postalCode || order?.shippingAddress?.zipCode || '',
            order?.shippingAddress?.country || 'Bangladesh'
        ].filter(Boolean).join(', ');
        const items = orderItemsList;
        const itemsMarkup = items.length > 0
            ? items.map((item) => `
                <tr>
                    <td>
                        <div style="display:flex;align-items:center;gap:10px;">
                            ${item.image ? `<img src='${item.image}' alt='${item.name || item.productName || ''}' class='item-image' />` : ''}
                            <div>
                                <div class='item-name'>${item.name || item.productName || ''}</div>
                                        <div class='muted'>${[
                    (item?.product?.category?.name || item?.categoryName || item?.category) ? `Category: ${item.product?.category?.name || item.categoryName || item.category}` : null,
                    item.color ? `Color: ${item.color}` : null,
                    item.size ? `Size: ${item.size}` : null,
                ].filter(Boolean).join(' · ') || '-'}</div>
                            </div>
                        </div>
                    </td>
                    <td class='align-right'>${formatCurrency(item.price || item.unitPrice || 0)}</td>
                    <td class='align-center'>×${Number(item.quantity || 0)}</td>
                    <td class='align-right'>${formatCurrency((item.price || item.unitPrice || 0) * Number(item.quantity || 0))}</td>
                </tr>`).join('')
            : `<tr><td colspan='4' class='align-center' style='padding:16px;color:#64748b;'>No products found for this order.</td></tr>`;
        const invoiceNumber = order?.orderNumber || order?._id || '';
        const billRowsMarkup = [
            `<div class="row-label">Original Price</div><div class="row-value">${formatCurrency(totals.originalSubtotal)}</div>`,
            totals.discount > 0
                ? `<div class="row-label">Discount (${totals.discountPercent}%)</div><div class="row-value discount">-${formatCurrency(totals.discount)}</div>`
                : '',
            `<div class="row-label">ডেলিভারি চার্জ</div><div class="row-value">${formatCurrency(totals.deliveryFee)}</div>`,
            totals.hasAdvance
                ? `<div class="row-label">Advance Paid</div><div class="row-value">${formatCurrency(totals.advancePaid)}</div>`
                : '',
            totals.hasAdvance
                ? `<div class="row-label total">Balance Due</div><div class="row-value total">${formatCurrency(totals.dueAmount)}</div>`
                : `<div class="row-label total">Total Price</div><div class="row-value total">${formatCurrency(totals.total)}</div>`,
        ].filter(Boolean).join('');
        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Order Memo #${invoiceNumber}</title>
                        <style>
                                * { box-sizing: border-box; }
                                body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; color: #0f172a; margin: 0; padding: 24px; }
                                .memo-shell { max-width: 900px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12); overflow: hidden; }
                                .memo-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 28px; border-bottom: 1px solid #e2e8f0; }
                                .header-left { display: flex; align-items: center; gap: 14px; }
                                .logo { width: 48px; height: 48px; border-radius: 12px; border: 1px solid #e2e8f0; object-fit: cover; background: #fff; }
                                .memo-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; }
                                .memo-invoice { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
                                .memo-date { font-size: 12px; color: #64748b; margin-top: 2px; }
                                .status-pill { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 999px; }
                                .section { padding: 20px 28px; }
                                .info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
                                .card { border-radius: 14px; border: 1px solid #e2e8f0; padding: 14px 16px; background: #f8fafc; }
                                .card.white { background: #fff; }
                                .card-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; }
                                .card-name { font-size: 16px; font-weight: 700; margin: 0 0 4px 0; }
                                .card-text { font-size: 13px; color: #475569; margin: 0 0 4px 0; }
                                .table-wrap { border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
                                table { width: 100%; border-collapse: collapse; }
                                thead { background: #0f172a; color: #fff; }
                                th { text-align: left; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 12px 14px; }
                                td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                                tbody tr:last-child td { border-bottom: none; }
                                .item-name { font-weight: 600; }
                                .item-image { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0; object-fit: cover; }
                                .muted { color: #64748b; font-size: 11px; margin-top: 2px; }
                                .align-right { text-align: right; }
                                .align-center { text-align: center; }
                                .summary { border: 1px solid #e2e8f0; border-radius: 14px; background: #f8fafc; padding: 14px 16px; }
                                .summary-header { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 600; }
                                .summary-header span:last-child { font-size: 11px; color: #059669; }
                                .summary-rows { display: grid; grid-template-columns: 1fr auto; gap: 8px 12px; margin-top: 12px; font-size: 13px; color: #475569; }
                                .row-value { text-align: right; font-weight: 600; color: #0f172a; }
                                .row-value.discount { color: #059669; }
                                .row-label.total { font-weight: 700; color: #0f172a; }
                                .row-value.total { font-weight: 700; color: #0f172a; }
                                .section-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
                        </style>
        </head>
        <body>
            <div class="memo-shell">
                <div class="memo-header">
                    <div class="header-left">
                        <img src="${companyLogo}" class="logo" alt="Company Logo" />
                        <div>
                            <div class="memo-title">Order Memo</div>
                            <div class="memo-invoice">Invoice #${invoiceNumber}</div>
                            <div class="memo-date">Placed on ${formattedOrderDate || '—'}</div>
                        </div>
                    </div>
                    <div class="status-pill">${statusLabel}</div>
                </div>
                <div class="section">
                    <div class="info-grid">
                        <div class="card">
                            <p class="card-title">Customer</p>
                            <p class="card-name">${customerName} ${customerLastName}</p>
                            <p class="card-text">${customerPhone}</p>
                            <p class="card-text">${customerEmail}</p>
                        </div>
                        <div class="card white">
                            <p class="card-title">Shipping Address</p>
                            <p class="card-text">${shippingAddressText}</p>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">Order Items</div>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th class="align-right">Price</th>
                                    <th class="align-center">Qty</th>
                                    <th class="align-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsMarkup}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="section">
                    <div class="summary">
                        <div class="summary-header">
                            <span>Payment Summary</span>
                            ${totals.discount > 0 ? '<span>Discount applied</span>' : '<span></span>'}
                        </div>
                        <div class="summary-rows">
                            ${billRowsMarkup}
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>`;
    }, [order, orderItemsList, totals, formattedOrderDate, statusLabel]);

    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=1200');
        if (!printWindow) return;
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                    aria-hidden="true"
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                            <p className="text-sm text-gray-500">Order ID: #{order.orderNumber || order._id?.slice(-8)}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <HiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        <OrderCustomerInfo order={order} />
                        <OrderStatusSummary order={order} getStatusColor={getStatusColor} />

                        {(order?.advancePaymentStatus || order?.advancePaymentRequired || totals.hasAdvance) ? (
                            <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-semibold text-yellow-900">Advance Payment</h4>
                                        <p className="text-xs text-yellow-800">Manual advance payment tracking for mobile banking settlements.</p>
                                    </div>
                                    <span className={advanceStatusPillClass(order?.advancePaymentStatus || 'None')}>
                                        {String(order?.advancePaymentStatus || 'None').replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-yellow-200 bg-white p-3">
                                        <div className="text-xs text-gray-500">Required</div>
                                        <div className="mt-1 font-semibold text-gray-900">{order?.advancePaymentRequired ? 'Yes' : 'No'}</div>
                                    </div>
                                    <div className="rounded-2xl border border-yellow-200 bg-white p-3">
                                        <div className="text-xs text-gray-500">Paid Amount</div>
                                        <div className="mt-1 font-semibold text-gray-900">{formatCurrency(totals.advancePaid)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-yellow-200 bg-white p-3">
                                        <div className="text-xs text-gray-500">Due Amount</div>
                                        <div className="mt-1 font-semibold text-gray-900">{formatCurrency(totals.dueAmount)}</div>
                                    </div>
                                    <div className="rounded-2xl border border-yellow-200 bg-white p-3 sm:col-span-2">
                                        <div className="text-xs text-gray-500">Payment Details</div>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            <div>
                                                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Method</div>
                                                <div className="mt-1 font-semibold text-gray-900">{titleCase(order?.advancePayment?.paymentMethod || order?.paymentMethod || '—')}</div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Sender</div>
                                                <div className="mt-1 font-semibold text-gray-900">{order?.advancePayment?.senderNumber || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Txn ID</div>
                                                <div className="mt-1 font-semibold text-gray-900">{order?.advancePayment?.transactionId || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Paid At</div>
                                                <div className="mt-1 font-semibold text-gray-900">{order?.advancePayment?.paidAt ? new Date(order.advancePayment.paidAt).toLocaleString('en-GB') : '—'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {advanceError ? (
                                    <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                        {advanceError}
                                    </div>
                                ) : null}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {order?.advancePayment && order.advancePaymentStatus === 'Pending' ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleApproveAdvance}
                                                disabled={advanceSaving}
                                                className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                            >
                                                Approve Advance
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRejectAdvance}
                                                disabled={advanceSaving}
                                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Reject Advance
                                            </button>
                                        </>
                                    ) : null}
                                    {order?.advancePayment ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingAdvance((prev) => !prev)}
                                            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                        >
                                            {isEditingAdvance ? 'Cancel edit' : 'Edit payment details'}
                                        </button>
                                    ) : null}
                                </div>

                                {isEditingAdvance ? (
                                    <div className="mt-4 rounded-2xl border border-yellow-200 bg-white p-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Payment Method</label>
                                                <select
                                                    name="paymentMethod"
                                                    value={advanceForm.paymentMethod}
                                                    onChange={handleAdvanceFieldChange}
                                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                >
                                                    <option value="bkash">bKash</option>
                                                    <option value="nagad">Nagad</option>
                                                    <option value="rocket">Rocket</option>
                                                    <option value="upay">UPay</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Sender Number</label>
                                                <input
                                                    type="text"
                                                    name="senderNumber"
                                                    value={advanceForm.senderNumber}
                                                    onChange={handleAdvanceFieldChange}
                                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Transaction ID</label>
                                                <input
                                                    type="text"
                                                    name="transactionId"
                                                    value={advanceForm.transactionId}
                                                    onChange={handleAdvanceFieldChange}
                                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Paid Amount</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    name="amount"
                                                    value={advanceForm.amount}
                                                    onChange={handleAdvanceFieldChange}
                                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Payment Status</label>
                                                <select
                                                    name="status"
                                                    value={advanceForm.status}
                                                    onChange={handleAdvanceFieldChange}
                                                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Verified">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="None">None</option>
                                                </select>
                                            </div>
                                            {advanceForm.status === 'Rejected' ? (
                                                <div className="sm:col-span-2">
                                                    <label className="text-sm font-semibold text-gray-900">Rejection Reason</label>
                                                    <input
                                                        type="text"
                                                        name="rejectedReason"
                                                        value={advanceForm.rejectedReason}
                                                        onChange={handleAdvanceFieldChange}
                                                        className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-700 focus:outline-none"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={handleSaveAdvanceDetails}
                                                disabled={advanceSaving}
                                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                Save advance details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingAdvance(false)}
                                                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Change Status</div>
                                    <div className="text-xs text-gray-500">Current: {String(order?.orderStatus || 'pending')}</div>
                                </div>
                                {updatingOrderId === orderId ? (
                                    <span className="text-xs text-gray-500">Updating…</span>
                                ) : null}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map((opt) => {
                                    const active = String(order?.orderStatus || 'pending') === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (!orderId) return;
                                                if (updatingOrderId === orderId) return;
                                                if (typeof onStatusUpdate === 'function') onStatusUpdate(orderId, opt.value);
                                            }}
                                            disabled={!orderId || updatingOrderId === orderId}
                                            className={`text-[11px] font-semibold rounded-full px-3 py-1 transition-opacity ${updatingOrderId === orderId ? 'opacity-50 cursor-wait' : ''} ${getStatusPillClass(opt.value, active)}`}
                                            title={`Set status: ${opt.label}`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {(order?.requiresApproval || (Array.isArray(order?.riskFlags) && order.riskFlags.length > 0) || order?.client?.ipAddress) ? (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900">Risk & Tracking</h4>
                                <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Approval:</span>
                                        <span className={`text-xs font-semibold rounded-full px-3 py-1 ${order?.approval?.status === 'pending'
                                            ? 'bg-red-100 text-red-800'
                                            : order?.approval?.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : order?.approval?.status === 'rejected'
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {String(order?.approval?.status || 'none').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Risk score:</span>
                                        <span className="font-medium text-gray-900">{typeof order?.riskScore === 'number' ? order.riskScore : 0}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-600">Flags:</span>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(Array.isArray(order?.riskFlags) ? order.riskFlags : []).length ? (
                                                order.riskFlags.map((flag) => (
                                                    <span key={flag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        {String(flag).replace(/_/g, ' ')}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">No flags</span>
                                            )}
                                        </div>
                                    </div>
                                    {order?.client?.ipAddress ? (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">IP:</span>
                                            <span className="font-medium text-gray-900">{order.client.ipAddress}</span>
                                        </div>
                                    ) : null}
                                    {order?.client?.userAgent ? (
                                        <div className="text-sm">
                                            <div className="text-gray-600">User agent:</div>
                                            <div className="mt-1 text-xs text-gray-700 break-words">{order.client.userAgent}</div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {isGuestOrder ? (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900">Blacklist (Guest Order)</h4>
                                <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="text-sm text-gray-600">
                                        Block this customer’s phone/IP/address. After blocking, new orders using the same info will be prevented.
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleBlock('phone', blockPhoneValue)}
                                            disabled={!blockPhoneValue || blockingKey === 'phone'}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={blockPhoneValue ? `Block phone: ${blockPhoneValue}` : 'No phone found'}
                                        >
                                            {blockingKey === 'phone' ? 'Blocking…' : 'Block Phone'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleBlock('ip', blockIpValue)}
                                            disabled={!blockIpValue || blockingKey === 'ip'}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={blockIpValue ? `Block IP: ${blockIpValue}` : 'No IP found'}
                                        >
                                            {blockingKey === 'ip' ? 'Blocking…' : 'Block IP'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleBlock('address', blockAddressValue)}
                                            disabled={!blockAddressValue || blockingKey === 'address'}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={blockAddressValue ? 'Block delivery address' : 'No address found'}
                                        >
                                            {blockingKey === 'address' ? 'Blocking…' : 'Block Address'}
                                        </button>
                                    </div>

                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div><span className="font-semibold">Phone:</span> {blockPhoneValue || '—'}</div>
                                        <div><span className="font-semibold">IP:</span> {blockIpValue || '—'}</div>
                                        <div className="break-words"><span className="font-semibold">Address:</span> {blockAddressValue || '—'}</div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-sm text-gray-600">
                                    Edit product name, price, and quantity. Total updates automatically.
                                </div>
                                <div className="flex gap-2">
                                    {!isEditingItems ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingItems(true)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            disabled={!orderId || !!savingItems}
                                        >
                                            Edit Items
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const fallbackItems = Array.isArray(order?.items) ? order.items : [];
                                                    const orderItemsList = Array.isArray(order?.orderItems) ? order.orderItems : fallbackItems;
                                                    setDraftOrderItems(orderItemsList.map((it) => ({ ...it })));
                                                    setIsEditingItems(false);
                                                }}
                                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                disabled={!!savingItems}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!orderId) return;
                                                    if (typeof onSaveItems !== 'function') return;
                                                    const payload = normalizeOrderItemsForSave(draftOrderItems);
                                                    const res = await onSaveItems(orderId, payload);
                                                    if (res?.success !== false) {
                                                        setIsEditingItems(false);
                                                    }
                                                }}
                                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!!savingItems || !orderId}
                                            >
                                                Save Items
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <OrderItemsTable
                                orderItems={isEditingItems ? draftOrderItems : orderItemsList}
                                editable={isEditingItems}
                                disabled={!!savingItems}
                                onOrderItemsChange={setDraftOrderItems}
                                showTotals={isEditingItems}
                                deliveryFee={totals.deliveryFee}
                            />
                        </div>

                        <div className="mt-8">
                            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src="https://res.cloudinary.com/dczloset7/image/upload/v1768565420/drip_drop/popups/oujst5pamuym9whato3l.jpg"
                                            alt="Sume Traders"
                                            className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                                        />
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Order Memo</p>
                                            <p className="text-lg font-semibold text-slate-900">Invoice #{inlineInvoiceLabel || '—'}</p>
                                            <p className="text-sm text-slate-500">Placed on {formattedOrderDate || '—'}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                        {statusLabel}
                                    </span>
                                </div>
                                <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Customer</p>
                                        <p className="mt-2 text-base font-semibold text-slate-900">
                                            {order?.shippingAddress?.firstName || order?.guestInfo?.name || ''} {order?.shippingAddress?.lastName || ''}
                                        </p>
                                        <p className="text-sm text-slate-600">{order?.shippingAddress?.phone || order?.guestInfo?.phone || ''}</p>
                                        <p className="text-sm text-slate-500">{order?.shippingAddress?.email || order?.guestInfo?.email || ''}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Shipping Address</p>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                            {order?.shippingAddress?.streetAddress || order?.shippingAddress?.address || ''}
                                            {order?.shippingAddress?.apartment ? `, Apt: ${order?.shippingAddress?.apartment}` : ''}
                                            <br />
                                            {[order?.shippingAddress?.city, order?.shippingAddress?.state || order?.shippingAddress?.division].filter(Boolean).join(', ')} {order?.shippingAddress?.postalCode || order?.shippingAddress?.zipCode || ''}
                                            <br />
                                            {order?.shippingAddress?.country || 'Bangladesh'}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-2">
                                    <div className="overflow-hidden rounded-xl border border-slate-200">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-900 text-white">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Qty</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {orderItemsList.length > 0 ? (
                                                    orderItemsList.map((item, idx) => (
                                                        <tr key={idx} className="bg-white">
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                                                                    ) : null}
                                                                    <div>
                                                                        <div className="font-semibold text-slate-900">{item.name || item.productName || ''}</div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {[
                                                                                (() => {
                                                                                    const category = String(item?.category ?? item?.product?.category ?? '').trim();
                                                                                    return category ? `Category: ${category}` : null;
                                                                                })(),
                                                                                item.color ? `Color: ${item.color}` : null,
                                                                                item.size ? `Size: ${item.size}` : null,
                                                                            ]
                                                                                .filter(Boolean)
                                                                                .join(' · ')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-left text-slate-700">{formatCurrency(item.price || item.unitPrice || 0)}</td>
                                                            <td className="px-4 py-3 text-center text-slate-700">×{Number(item.quantity || 0)}</td>
                                                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                                {formatCurrency((item.price || item.unitPrice || 0) * Number(item.quantity || 0))}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                                                            No products found for this order.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="px-6 py-5">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-900">Payment Summary</span>
                                            {totals.discount > 0 ? (
                                                <span className="text-xs text-emerald-600">Discount applied</span>
                                            ) : null}
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-slate-700">
                                            <span>Original Price</span>
                                            <span className="text-right font-semibold text-slate-900">{formatCurrency(totals.originalSubtotal)}</span>
                                            {totals.discount > 0 ? (
                                                <>
                                                    <span>Discount ({totals.discountPercent}%)</span>
                                                    <span className="text-right font-semibold text-emerald-600">-{formatCurrency(totals.discount)}</span>
                                                </>
                                            ) : null}
                                            <span>ডেলিভারি চার্জ</span>
                                            <span className="text-right font-semibold text-slate-900">{formatCurrency(totals.deliveryFee)}</span>
                                            {totals.hasAdvance ? (
                                                <>
                                                    <span>Advance Payment</span>
                                                    <span className="text-right font-semibold text-slate-900">{formatCurrency(totals.advance)}</span>
                                                    <span className="font-semibold text-slate-900">Balance Due</span>
                                                    <span className="text-right font-semibold text-slate-900">{formatCurrency(totals.totalDue)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-semibold text-slate-900">Total Price</span>
                                                    <span className="text-right font-semibold text-slate-900">{formatCurrency(totals.total)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={handlePrint}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                                        >
                                            <HiOutlinePrinter className="h-4 w-4" />
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={handleWhatsAppMessage}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                            type="button"
                        >
                            <FaWhatsapp className="h-4 w-4" />
                            WhatsApp Message
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
