import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// wishlist sincronizat cu backend, necesita login
export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [productIds, setProductIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // sync la login/logout
    useEffect(() => {
        if (!user) {
            setProductIds(new Set());
            return;
        }

        setLoading(true);
        api.get('/wishlist/ids')
            .then((res) => setProductIds(new Set(res.data)))
            .catch(() => setProductIds(new Set()))
            .finally(() => setLoading(false));
    }, [user]);

    const toggle = async (productId) => {
        if (!user) {
            return { needsAuth: true };
        }

        const wasInWishlist = productIds.has(productId);

        // optimistic update
        setProductIds((prev) => {
            const next = new Set(prev);
            if (wasInWishlist) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });

        try {
            const res = await api.post(`/wishlist/${productId}/toggle`);
            return { added: res.data.in_wishlist };
        } catch (err) {
            // rollback daca backend a esuat
            setProductIds((prev) => {
                const next = new Set(prev);
                if (wasInWishlist) {
                    next.add(productId);
                } else {
                    next.delete(productId);
                }
                return next;
            });
            throw err;
        }
    };

    const remove = async (productId) => {
        if (!user) return;
        setProductIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });
        try {
            await api.delete(`/wishlist/${productId}`);
        } catch {
            // refacem starea din backend daca esueaza
            const res = await api.get('/wishlist/ids').catch(() => ({ data: [] }));
            setProductIds(new Set(res.data));
        }
    };

    const isInWishlist = (productId) => productIds.has(productId);

    return (
        <WishlistContext.Provider
            value={{
                productIds,
                count: productIds.size,
                loading,
                toggle,
                remove,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist trebuie folosit in interiorul WishlistProvider');
    return ctx;
}
