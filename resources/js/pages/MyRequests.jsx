import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { downloadPdf } from '../utils/downloadPdf';

const statusLabels = {
    pending: { text: 'In asteptare', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    accepted: { text: 'Acceptata', color: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { text: 'Respinsa', color: 'bg-red-50 text-red-700 border-red-200' },
    completed: { text: 'Finalizata', color: 'bg-blue-50 text-blue-700 border-blue-200' },
};

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/buyback/my-requests')
            .then((res) => setRequests(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="text-center py-20">
            <div className="flex justify-center gap-1.5 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-gray-400 text-sm">Se incarca...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gradient-to-r from-[#0f1720] to-[#1a2332]">
                <div className="max-w-4xl mx-auto px-4 py-10">
                    <h1 className="font-['Oswald'] text-3xl font-bold uppercase tracking-wide text-white">Cererile Mele</h1>
                    <p className="text-gray-500 text-sm mt-1.5">Istoricul cererilor tale de buyback</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {requests.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium mb-2">Nu ai nicio cerere de buyback.</p>
                        <Link to="/buyback" className="text-green-500 hover:text-green-600 font-semibold text-sm transition flex items-center gap-1 justify-center">
                            Vinde-ti racheta acum
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => {
                            const status = statusLabels[req.status] || statusLabels.pending;
                            return (
                                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-['Oswald'] font-semibold text-lg uppercase">
                                                {req.padel_racket?.brand?.name} {req.padel_racket?.model}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Cerere #{req.id} · {new Date(req.created_at).toLocaleDateString('ro-RO')}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-['Oswald'] text-2xl font-bold text-green-600">{req.offered_price} RON</div>
                                        <button
                                            onClick={() => downloadPdf(`/buyback/requests/${req.id}/receipt`, `buyback-${req.id}.pdf`)}
                                            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1.5"
                                            title="Descarca chitanta PDF"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            PDF
                                        </button>
                                    </div>

                                    {req.selected_options?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-1.5">
                                                {req.selected_options.map((opt) => (
                                                    <span key={opt.id} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100">
                                                        {opt.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {req.admin_notes && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 bg-blue-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                                            <p className="text-[11px] text-blue-500 font-medium uppercase tracking-wider mb-1">Note admin</p>
                                            <p className="text-sm text-blue-700">{req.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
