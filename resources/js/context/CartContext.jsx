import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'padelmarket_cart';

// cos persistat in localStorage
export function CartProvider({ children }) {
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
            // ignor erorile de localStorage
        }
    }, [items]);

    // returneaza false daca stocul nu permite
    const addToCart = (product, quantity = 1) => {
        let success = true;

        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                const newQty = existing.quantity + quantity;
                if (newQty > product.stock) {
                    success = false;
                    return prev;
                }
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: newQty } : item
                );
            }

            if (quantity > product.stock) {
                success = false;
                return prev;
            }

            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: parseFloat(product.price),
                    image_url: product.image_url,
                    stock: product.stock,
                    quantity,
                },
            ];
        });

        return success;
    };

    const removeFromCart = (productId) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== productId) return item;
                const cappedQty = Math.min(quantity, item.stock);
                return { ...item, quantity: cappedQty };
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 500 ? 0 : (items.length > 0 ? 25 : 0);
    const total = subtotal + shippingCost;

    return (
        <CartContext.Provider
            value={{
                items,
                itemCount,
                subtotal,
                shippingCost,
                total,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart trebuie folosit in interiorul CartProvider');
    return ctx;
}
