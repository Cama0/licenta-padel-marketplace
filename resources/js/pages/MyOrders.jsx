import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { downloadPdf } from '../utils/downloadPdf';
import { orderStatusLabel, paymentLabel } from './OrderConfirmation';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my')
            .then((res) => setOrders(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">
                        Comenzile <span className="text-gradient">mele</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {orders.length === 0 ? 'Nu ai inca nicio comanda' : `${orders.length} ${orders.length === 1 ? 'comanda' : 'comenzi'}`}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="font-['Oswald'] text-xl font-bold uppercase mb-2">Nu ai inca comenzi</h2>
                        <p className="text-gray-500 mb-5">Cand vei plasa o comanda, va aparea aici.</p>
                        <Link
                            to="/products"
                            className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25"
                        >
                            Vezi produsele
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderCard({ order }) {
    const statusColor = {
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
        processing: 'bg-purple-50 text-purple-700 border-purple-200',
        shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        delivered: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
    }[order.status] || 'bg-gray-50 text-gray-700 border-gray-200';

    const date = new Date(order.created_at).toLocaleDateString('ro-RO', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <Link
            to={`/order-confirmation/${order.id}`}
            className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all"
            style={{ animation: 'slide-up 0.2s ease-out' }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Comanda</p>
                    <p className="font-mono font-semibold text-sm text-gray-800">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Plasata la {date}</p>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${statusColor}`}>
                    {orderStatusLabel(order.status)}
                </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
                {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        {item.product_image_url ? (
                            <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
                {order.items.length > 3 && (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-500">
                        +{order.items.length - 3}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{paymentLabel(order.payment_method)}</p>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            downloadPdf(`/orders/${order.id}/invoice`, `factura-${order.order_number}.pdf`);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1"
                        title="Descarca factura PDF"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        PDF
                    </button>
                </div>
                <p>
                    <span className="font-['Oswald'] text-xl font-bold text-[#1a2332]">{order.total}</span>
                    <span className="text-xs text-gray-400 ml-1">RON</span>
                </p>
            </div>
        </Link>
    );
}
