import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function ReviewSection({ productId }) {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myReview, setMyReview] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/products/${productId}/reviews`);
            setData(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyReview = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/products/${productId}/my-review`);
            setMyReview(res.data.review);
        } catch {
            setMyReview(null);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchMyReview();
    }, [productId, user]);

    const handleSubmitted = () => {
        setShowForm(false);
        fetchReviews();
        fetchMyReview();
    };

    const handleDelete = async (reviewId) => {
        if (!confirm('Sigur vrei sa stergi aceasta recenzie?')) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            toast.success('Recenzia a fost stearsa');
            fetchReviews();
            fetchMyReview();
            setShowForm(false);
        } catch {
            toast.error('Eroare la stergerea recenziei');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">Se incarca recenziile...</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* sumar + buton scrie recenzie */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    {/* media + total */}
                    <div className="flex items-center gap-5">
                        <div className="text-center">
                            <p className="font-['Oswald'] text-5xl font-bold text-[#1a2332] leading-none">
                                {data.average > 0 ? data.average.toFixed(1) : '—'}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">din 5</p>
                        </div>
                        <div>
                            <StarRating value={data.average} size="md" />
                            <p className="text-sm text-gray-500 mt-1">
                                {data.total === 0
                                    ? 'Nicio recenzie inca'
                                    : `Bazat pe ${data.total} ${data.total === 1 ? 'recenzie' : 'recenzii'}`}
                            </p>
                        </div>
                    </div>

                    {/* distributie */}
                    {data.total > 0 && (
                        <div className="flex-1 max-w-xs">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = data.distribution[star] || 0;
                                const percent = data.total > 0 ? (count / data.total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 text-gray-500">{star}</span>
                                        <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                                        </div>
                                        <span className="w-6 text-right text-gray-400">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* scrie / editeaza */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                    {!user ? (
                        <p className="text-sm text-gray-500 text-center">
                            <Link to="/login" className="text-green-600 hover:underline font-medium">Conecteaza-te</Link>
                            {' '}pentru a scrie o recenzie
                        </p>
                    ) : myReview && !showForm ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <p className="text-sm text-gray-600">Ai scris deja o recenzie pentru acest produs.</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-sm px-4 py-2 border border-gray-200 hover:border-green-500 hover:text-green-600 rounded-lg font-medium transition"
                                >
                                    Editeaza
                                </button>
                                <button
                                    onClick={() => handleDelete(myReview.id)}
                                    className="text-sm px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
                                >
                                    Sterge
                                </button>
                            </div>
                        </div>
                    ) : !showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20"
                        >
                            Scrie o recenzie
                        </button>
                    ) : null}
                </div>
            </div>

            {/* formular */}
            {showForm && (
                <ReviewForm
                    productId={productId}
                    existing={myReview}
                    onCancel={() => setShowForm(false)}
                    onSuccess={handleSubmitted}
                />
            )}

            {/* lista recenzii */}
            {data.reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Fii primul care scrie o recenzie pentru acest produs!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} isMine={myReview?.id === review.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ReviewCard({ review, isMine }) {
    const date = new Date(review.created_at).toLocaleDateString('ro-RO', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className={`bg-white rounded-2xl border p-5 ${isMine ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'}`}
             style={{ animation: 'slide-up 0.2s ease-out' }}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    {/* avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/20 flex items-center justify-center text-green-600 font-bold text-sm">
                        {review.user?.name?.[0] || '?'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-gray-800">{review.user?.name || 'Anonim'}</p>
                            {review.is_verified_purchase && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Achizitie verificata
                                </span>
                            )}
                            {isMine && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                    Recenzia ta
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StarRating value={review.rating} size="xs" />
                            <span className="text-[11px] text-gray-400">{date}</span>
                        </div>
                    </div>
                </div>
            </div>
            {review.title && (
                <h4 className="font-semibold text-gray-800 mb-1.5">{review.title}</h4>
            )}
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{review.comment}</p>
        </div>
    );
}

function ReviewForm({ productId, existing, onCancel, onSuccess }) {
    const [rating, setRating] = useState(existing?.rating || 0);
    const [title, setTitle] = useState(existing?.title || '');
    const [comment, setComment] = useState(existing?.comment || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (rating < 1) {
            setError('Te rog selecteaza o nota.');
            return;
        }
        if (comment.trim().length < 10) {
            setError('Recenzia trebuie sa aiba minim 10 caractere.');
            return;
        }

        setSubmitting(true);
        try {
            if (existing) {
                await api.put(`/reviews/${existing.id}`, { rating, title: title || null, comment });
                toast.success('Recenzia a fost actualizata');
            } else {
                await api.post(`/products/${productId}/reviews`, { rating, title: title || null, comment });
                toast.success('Multumim pentru recenzie!');
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'A aparut o eroare.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-green-200 p-6"
              style={{ animation: 'slide-up 0.3s ease-out' }}>
            <h3 className="font-['Oswald'] text-lg font-bold uppercase mb-4">
                {existing ? 'Editeaza recenzia' : 'Scrie o recenzie'}
            </h3>

            {/* rating */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Nota ta *
                </label>
                <div className="flex items-center gap-2">
                    <StarRating value={rating} onChange={setRating} readOnly={false} size="lg" />
                    {rating > 0 && (
                        <span className="text-sm font-semibold text-gray-700 ml-2">
                            {['', 'Slab', 'Sub asteptari', 'OK', 'Foarte bun', 'Excelent'][rating]}
                        </span>
                    )}
                </div>
            </div>

            {/* titlu */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                    Titlu (optional)
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    placeholder="Ex: Racheta excelenta pentru atac"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition bg-gray-50 focus:bg-white"
                />
            </div>

            {/* comentariu */}
            <div className="mb-5">
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5">
                    Recenzia ta *
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    minLength={10}
                    maxLength={2000}
                    placeholder="Descrie experienta ta cu acest produs - ce ti-a placut, ce nu, recomanzi?"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition bg-gray-50 focus:bg-white"
                />
                <p className="text-[11px] text-gray-400 mt-1">{comment.length} / 2000 caractere</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5 mb-4">
                    {error}
                </div>
            )}

            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium text-sm transition"
                >
                    Anuleaza
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-wait"
                >
                    {submitting ? 'Se trimite...' : existing ? 'Actualizeaza' : 'Trimite recenzia'}
                </button>
            </div>
        </form>
    );
}
