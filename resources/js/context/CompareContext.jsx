import { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext();

const STORAGE_KEY = 'padelmarket_compare';
const MAX_ITEMS = 3;

// comparator persistat in localStorage, maxim 3 produse
export function CompareProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items]);

    const toggle = (product) => {
        let added = false;
        let full = false;

        setItems((prev) => {
            const existing = prev.find((p) => p.id === product.id);
            if (existing) {
                added = false;
                return prev.filter((p) => p.id !== product.id);
            }

            if (prev.length >= MAX_ITEMS) {
                full = true;
                return prev;
            }

            added = true;
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    image_url: product.image_url || null,
                    brand_name: product.brand?.name || null,
                    price: product.price,
                },
            ];
        });

        return { added, full };
    };

    const remove = (productId) => {
        setItems((prev) => prev.filter((p) => p.id !== productId));
    };

    const clear = () => setItems([]);

    const isInCompare = (productId) => items.some((p) => p.id === productId);

    return (
        <CompareContext.Provider
            value={{
                items,
                count: items.length,
                maxItems: MAX_ITEMS,
                isFull: items.length >= MAX_ITEMS,
                toggle,
                remove,
                clear,
                isInCompare,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error('useCompare trebuie folosit in interiorul CompareProvider');
    return ctx;
}
