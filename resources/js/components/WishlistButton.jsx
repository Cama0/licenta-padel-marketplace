import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({ productId, variant = 'icon', className = '' }) {
    const { isInWishlist, toggle } = useWishlist();
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);
    const [pulse, setPulse] = useState(false);

    const inWishlist = isInWishlist(productId);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (busy) return;
        setBusy(true);

        try {
            const result = await toggle(productId);
            if (result.needsAuth) {
                toast('Conecteaza-te pentru a folosi wishlist-ul');
                navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
                return;
            }
            if (result.added) {
                setPulse(true);
                setTimeout(() => setPulse(false), 600);
                toast.success('Adaugat in wishlist');
            } else {
                toast('Scos din wishlist');
            }
        } catch {
            toast.error('A aparut o eroare. Te rog incearca din nou.');
        } finally {
            setBusy(false);
        }
    };

    if (variant === 'full') {
        return (
            <button
                onClick={handleClick}
                disabled={busy}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all border-2 ${
                    inWishlist
                        ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                } ${className}`}
            >
                <svg
                    className={`w-4 h-4 ${pulse ? 'animate-ping-once' : ''}`}
                    fill={inWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={inWishlist ? 0 : 2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {inWishlist ? 'In wishlist' : 'Adauga la favorite'}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={busy}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all backdrop-blur-md ${
                inWishlist
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                    : 'bg-white/90 text-gray-500 hover:bg-red-500 hover:text-white shadow-sm'
            } ${className}`}
            title={inWishlist ? 'Scoate din wishlist' : 'Adauga la favorite'}
        >
            <svg
                className={`w-4 h-4 transition-transform ${pulse ? 'scale-125' : ''}`}
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={inWishlist ? 0 : 2}
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}
