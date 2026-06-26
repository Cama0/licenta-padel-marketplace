import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { downloadPdf } from '../utils/downloadPdf';

export default function OrderConfirmation() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then((res) => setOrder(res.data))
            .catch(() => setError('Comanda nu a putut fi gasita.'))
            .finally(() => setLoading(false));
    }, [id]);

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

    if (error || !order) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">{error}</p>
                    <Link to="/" className="text-green-600 hover:underline mt-2 inline-block">Inapoi acasa</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6 shadow-sm" style={{ animation: 'slide-up 0.3s ease-out' }}>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase mb-2">Comanda plasata!</h1>
                    <p className="text-gray-500 mb-1">Multumim pentru comanda ta!</p>
                    <p className="text-sm text-gray-400">
                        Numar comanda: <span className="font-mono font-semibold text-gray-700">{order.order_number}</span>
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6" style={{ animation: 'slide-up 0.4s ease-out' }}>
                    <h2 className="font-['Oswald'] text-lg font-bold uppercase mb-4">Status comanda</h2>
                    <OrderStatusBar status={order.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ animation: 'slide-up 0.5s ease-out' }}>
                        <h3 className="font-semibold text-sm uppercase text-gray-700 tracking-wider mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Adresa de livrare
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-800">{order.shipping_name}</p>
                            <p>{order.shipping_phone}</p>
                            <p>{order.shipping_email}</p>
                            <p className="pt-1">{order.shipping_address}</p>
                            <p>{order.shipping_city} {order.shipping_postal_code}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ animation: 'slide-up 0.5s ease-out' }}>
                        <h3 className="font-semibold text-sm uppercase text-gray-700 tracking-wider mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Plata
                        </h3>
                        <p className="text-sm text-gray-600">{paymentLabel(order.payment_method)}</p>
                        <span className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded mt-2 ${
                            order.payment_status === 'paid' ? 'bg-green-50 text-green-700' :
                            order.payment_status === 'failed' ? 'bg-red-50 text-red-700' :
                            'bg-yellow-50 text-yellow-700'
                        }`}>
                            {paymentStatusLabel(order.payment_status)}
                        </span>
                        {order.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Observatii</p>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animation: 'slide-up 0.6s ease-out' }}>
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="font-['Oswald'] text-lg font-bold uppercase">Produsele tale</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                            <div key={item.id} className="p-4 flex gap-4 items-center">
                                <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                    {item.product_image_url ? (
                                        <img src={item.product_image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {item.product_slug ? (
                                        <Link to={`/products/${item.product_slug}`} className="font-medium text-sm text-gray-800 hover:text-green-600 transition truncate block">
                                            {item.product_name}
                                        </Link>
                                    ) : (
                                        <p className="font-medium text-sm text-gray-800 truncate">{item.product_name}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">{item.unit_price} RON × {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-sm text-gray-800 flex-shrink-0">{item.subtotal} RON</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 bg-gray-50/50 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{order.subtotal} RON</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Transport</span>
                            <span>{parseFloat(order.shipping_cost) === 0 ? 'Gratuit' : `${order.shipping_cost} RON`}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
                            <span className="font-semibold text-gray-700">Total</span>
                            <span className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">
                                {order.total}
                                <span className="text-sm text-gray-400 ml-1">RON</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                    <button
                        onClick={() => downloadPdf(`/orders/${order.id}/invoice`, `factura-${order.order_number}.pdf`)}
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Descarca factura PDF
                    </button>
                    <Link
                        to="/my-orders"
                        className="bg-white border-2 border-gray-200 hover:border-green-500 text-gray-700 hover:text-green-600 px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all text-center"
                    >
                        Vezi toate comenzile
                    </Link>
                    <Link
                        to="/products"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/25 text-center"
                    >
                        Continua cumparaturile
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ===== Status bar pentru comanda ===== */
function OrderStatusBar({ status }) {
    const steps = [
        { key: 'pending', label: 'Plasata' },
        { key: 'confirmed', label: 'Confirmata' },
        { key: 'processing', label: 'In procesare' },
        { key: 'shipped', label: 'Expediata' },
        { key: 'delivered', label: 'Livrata' },
    ];

    if (status === 'cancelled') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-700 font-semibold">Comanda a fost anulata</p>
            </div>
        );
    }

    const currentIndex = steps.findIndex((s) => s.key === status);

    return (
        <div className="flex items-center justify-between gap-2">
            {steps.map((step, i) => {
                const completed = i <= currentIndex;
                const isActive = i === currentIndex;
                return (
                    <div key={step.key} className="flex-1 flex flex-col items-center gap-2 relative">
                        {i > 0 && (
                            <div className={`absolute right-1/2 top-3 h-0.5 w-full ${i <= currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative z-10 transition-all ${
                            completed
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/30'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                        } ${isActive ? 'ring-4 ring-green-100' : ''}`}>
                            {completed ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                i + 1
                            )}
                        </div>
                        <span className={`text-[10px] font-medium uppercase tracking-wider text-center ${completed ? 'text-gray-700' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export function paymentLabel(method) {
    return {
        cash_on_delivery: 'Ramburs la curier',
        card: 'Card online',
        bank_transfer: 'Transfer bancar',
    }[method] || method;
}

export function paymentStatusLabel(status) {
    return {
        pending: 'In asteptare',
        paid: 'Platita',
        failed: 'Esuata',
        refunded: 'Rambursata',
    }[status] || status;
}

export function orderStatusLabel(status) {
    return {
        pending: 'Plasata',
        confirmed: 'Confirmata',
        processing: 'In procesare',
        shipped: 'Expediata',
        delivered: 'Livrata',
        cancelled: 'Anulata',
    }[status] || status;
}
