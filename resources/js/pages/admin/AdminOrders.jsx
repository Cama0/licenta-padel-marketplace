import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import { downloadPdf } from '../../utils/downloadPdf';
import { orderStatusLabel, paymentLabel, paymentStatusLabel } from '../OrderConfirmation';

const STATUS_OPTIONS = [
    { value: '', label: 'Toate' },
    { value: 'pending', label: 'Plasate' },
    { value: 'confirmed', label: 'Confirmate' },
    { value: 'processing', label: 'In procesare' },
    { value: 'shipped', label: 'Expediate' },
    { value: 'delivered', label: 'Livrate' },
    { value: 'cancelled', label: 'Anulate' },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            if (search) params.append('search', search);
            const res = await api.get(`/admin/orders?${params}`);
            setOrders(res.data.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const handleUpdateStatus = async (orderId, field, value) => {
        try {
            const res = await api.put(`/admin/orders/${orderId}`, { [field]: value });
            setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data.order : o)));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(res.data.order);
            }
            toast.success('Comanda actualizata');
        } catch {
            toast.error('Eroare la actualizarea comenzii.');
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Comenzi</h1>
                <p className="text-sm text-gray-500 mt-1">Gestioneaza comenzile clientilor</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cauta dupa numar comanda, nume sau email..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    />
                    <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                        Cauta
                    </button>
                </form>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Se incarca...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Nu exista comenzi.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">Comanda</th>
                                    <th className="px-4 py-3 text-left">Client</th>
                                    <th className="px-4 py-3 text-left">Data</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Plata</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-4 py-3">
                                            <p className="font-mono font-semibold text-gray-800 text-xs">{order.order_number}</p>
                                            <p className="text-[11px] text-gray-400">{order.items?.length || 0} produse</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-800">{order.shipping_name}</p>
                                            <p className="text-[11px] text-gray-500">{order.shipping_email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs">
                                            {new Date(order.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{order.total} RON</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.id, 'status', e.target.value)}
                                                className={`text-xs px-2 py-1 rounded font-semibold border-0 cursor-pointer ${statusColor(order.status)}`}
                                            >
                                                {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.payment_status}
                                                onChange={(e) => handleUpdateStatus(order.id, 'payment_status', e.target.value)}
                                                className={`text-xs px-2 py-1 rounded font-semibold border-0 cursor-pointer ${paymentColor(order.payment_status)}`}
                                            >
                                                <option value="pending">In asteptare</option>
                                                <option value="paid">Platita</option>
                                                <option value="failed">Esuata</option>
                                                <option value="refunded">Rambursata</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-green-600 hover:text-green-700 text-xs font-semibold uppercase tracking-wider"
                                            >
                                                Detalii
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
}

function statusColor(status) {
    return {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';
}

function paymentColor(status) {
    return {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800';
}

function OrderDetailsModal({ order, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                style={{ animation: 'slide-up 0.2s ease-out' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Comanda</p>
                        <p className="font-mono font-semibold">{order.order_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => downloadPdf(`/admin/orders/${order.id}/invoice`, `factura-${order.order_number}.pdf`)}
                            className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition flex items-center gap-1.5"
                            title="Descarca factura PDF"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            PDF
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex gap-2">
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded ${statusColor(order.status)}`}>
                            {orderStatusLabel(order.status)}
                        </span>
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded ${paymentColor(order.payment_status)}`}>
                            {paymentStatusLabel(order.payment_status)}
                        </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-2">Livrare</h3>
                        <p className="font-semibold text-sm">{order.shipping_name}</p>
                        <p className="text-sm text-gray-600">{order.shipping_phone}</p>
                        <p className="text-sm text-gray-600">{order.shipping_email}</p>
                        <p className="text-sm text-gray-600 mt-2">{order.shipping_address}</p>
                        <p className="text-sm text-gray-600">{order.shipping_city} {order.shipping_postal_code}</p>
                    </div>

                    {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <h3 className="font-semibold text-xs uppercase tracking-wider text-yellow-700 mb-1">Observatii client</h3>
                            <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-2">Produse</h3>
                        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-3 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product_image_url ? (
                                            <img src={item.product_image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.product_name}</p>
                                        <p className="text-xs text-gray-400">{item.unit_price} × {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-sm">{item.subtotal} RON</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span><span>{order.subtotal} RON</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Transport</span><span>{parseFloat(order.shipping_cost) === 0 ? 'Gratuit' : `${order.shipping_cost} RON`}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Plata</span><span>{paymentLabel(order.payment_method)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-base">
                            <span>Total</span><span>{order.total} RON</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
