import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { downloadPdf } from '../../utils/downloadPdf';

const statusLabels = {
    pending: { text: 'În așteptare', color: 'bg-yellow-100 text-yellow-700' },
    accepted: { text: 'Acceptată', color: 'bg-green-100 text-green-700' },
    rejected: { text: 'Respinsă', color: 'bg-red-100 text-red-700' },
    completed: { text: 'Finalizată', color: 'bg-blue-100 text-blue-700' },
};

export default function AdminBuybackRequests() {
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', admin_notes: '' });

    const load = () => {
        const params = filterStatus ? `?status=${filterStatus}` : '';
        api.get(`/admin/buyback-requests${params}`).then((res) => setRequests(res.data.data));
    };

    useEffect(() => { load(); }, [filterStatus]);

    const handleExpand = (req) => {
        if (expandedId === req.id) {
            setExpandedId(null);
        } else {
            setExpandedId(req.id);
            setUpdateForm({ status: req.status, admin_notes: req.admin_notes || '' });
        }
    };

    const handleUpdate = async (id) => {
        await api.put(`/admin/buyback-requests/${id}`, updateForm);
        setExpandedId(null);
        load();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Cereri Buyback</h1>
            <div className="mb-4 flex gap-2">
                {[
                    { value: '', label: 'Toate' },
                    { value: 'pending', label: 'În așteptare' },
                    { value: 'accepted', label: 'Acceptate' },
                    { value: 'rejected', label: 'Respinse' },
                    { value: 'completed', label: 'Finalizate' },
                ].map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilterStatus(f.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            filterStatus === f.value ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">Nicio cerere găsită.</div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => {
                        const status = statusLabels[req.status] || statusLabels.pending;
                        return (
                            <div key={req.id} className="bg-white rounded-xl shadow-sm">
                                <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleExpand(req)}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold">{req.padel_racket?.brand?.name} {req.padel_racket?.model}</span>
                                            <span className="text-gray-500 text-sm ml-3">de la {req.user?.name} ({req.user?.email})</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-blue-600">{req.offered_price} RON</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span>
                                            <span className="text-gray-400">{expandedId === req.id ? '▲' : '▼'}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">#{req.id} &middot; {new Date(req.created_at).toLocaleString('ro-RO')}</p>
                                </div>

                                {expandedId === req.id && (
                                    <div className="px-4 pb-4 border-t">
                                        {req.selected_options && req.selected_options.length > 0 && (
                                            <div className="mt-3 mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Răspunsurile utilizatorului:</p>
                                                <div className="space-y-1">
                                                    {req.selected_options.map((opt) => (
                                                        <div key={opt.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                                            <span>{opt.criterion?.name}: <strong>{opt.label}</strong></span>
                                                            <span className="text-red-500">
                                                                {Number(opt.price_modifier_value) !== 0 && (
                                                                    opt.price_modifier_type === 'percentage'
                                                                        ? `${opt.price_modifier_value}%`
                                                                        : `${opt.price_modifier_value} RON`
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-orange-50 rounded-lg p-4 space-y-3">
                                            <h4 className="font-semibold text-sm">Actualizează cererea</h4>
                                            <div className="flex gap-3">
                                                <select
                                                    value={updateForm.status}
                                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                                    className="border rounded-lg px-3 py-2 text-sm"
                                                >
                                                    <option value="pending">În așteptare</option>
                                                    <option value="accepted">Acceptată</option>
                                                    <option value="rejected">Respinsă</option>
                                                    <option value="completed">Finalizată</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Note admin (opțional)"
                                                    value={updateForm.admin_notes}
                                                    onChange={(e) => setUpdateForm({ ...updateForm, admin_notes: e.target.value })}
                                                    className="border rounded-lg px-3 py-2 text-sm flex-grow"
                                                />
                                                <button
                                                    onClick={() => handleUpdate(req.id)}
                                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
                                                >
                                                    Salvează
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadPdf(`/admin/buyback-requests/${req.id}/receipt`, `buyback-${req.id}.pdf`);
                                                    }}
                                                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 flex items-center gap-1.5 font-semibold"
                                                    title="Descarca chitanta PDF"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    PDF
                                                </button>
                                            </div>
                                        </div>

                                        {(req.status === 'accepted' || req.status === 'completed') && (
                                            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-semibold text-green-800">Listeaza racheta in magazin</p>
                                                        <p className="text-xs text-green-700 mt-0.5">Genereaza un produs refurbished cu datele pre-completate din aceasta cerere.</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/admin/products?fromBuyback=${req.id}`}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                                                >
                                                    Creeaza produs refurbished
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
