import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api';
import StarRating from '../../components/StarRating';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus) params.append('status', filterStatus);
            const res = await api.get(`/admin/reviews?${params}`);
            setReviews(res.data.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filterStatus]);

    const handleToggleApproval = async (review) => {
        try {
            const res = await api.put(`/admin/reviews/${review.id}`, {
                is_approved: !review.is_approved,
            });
            setReviews((prev) => prev.map((r) => (r.id === review.id ? res.data.review : r)));
            toast.success(review.is_approved ? 'Recenzie ascunsa' : 'Recenzie aprobata');
        } catch {
            toast.error('Eroare la actualizarea recenziei.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei sa stergi aceasta recenzie? Actiunea e ireversibila.')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews((prev) => prev.filter((r) => r.id !== id));
            toast.success('Recenzie stearsa');
        } catch {
            toast.error('Eroare la stergere.');
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Recenzii</h1>
                <p className="text-sm text-gray-500 mt-1">Modereaza recenziile lasate de clienti</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-2">
                {[
                    { value: '', label: 'Toate' },
                    { value: 'approved', label: 'Aprobate' },
                    { value: 'pending', label: 'Ascunse' },
                ].map((s) => (
                    <button
                        key={s.value}
                        onClick={() => setFilterStatus(s.value)}
                        className={`px-4 py-1.5 text-sm rounded-lg font-medium transition ${
                            filterStatus === s.value
                                ? 'bg-green-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
            {loading ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">Se incarca...</div>
            ) : reviews.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                    Nu exista recenzii in aceasta categorie.
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <ReviewRow
                            key={review.id}
                            review={review}
                            onToggle={() => handleToggleApproval(review)}
                            onDelete={() => handleDelete(review.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ReviewRow({ review, onToggle, onDelete }) {
    const date = new Date(review.created_at).toLocaleDateString('ro-RO', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
        <div className={`bg-white rounded-xl border p-5 ${review.is_approved ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50/30'}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Link to={`/products/${review.product?.slug}`} target="_blank" className="font-semibold text-sm text-gray-800 hover:text-green-600 transition truncate">
                            {review.product?.name || 'Produs sters'}
                        </Link>
                        {!review.is_approved && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                Ascunsa
                            </span>
                        )}
                        {review.is_verified_purchase && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                Achizitie verificata
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                        <span>
                            <span className="font-medium text-gray-700">{review.user?.name}</span>
                            <span className="text-gray-400"> ({review.user?.email})</span>
                        </span>
                        <span>·</span>
                        <StarRating value={review.rating} size="xs" />
                        <span>·</span>
                        <span>{date}</span>
                    </div>
                    {review.title && (
                        <p className="font-semibold text-sm text-gray-800 mb-1">{review.title}</p>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {review.comment}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                <button
                    onClick={onToggle}
                    className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition ${
                        review.is_approved
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                    {review.is_approved ? 'Ascunde' : 'Aproba'}
                </button>
                <button
                    onClick={onDelete}
                    className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                    Sterge
                </button>
            </div>
        </div>
    );
}
