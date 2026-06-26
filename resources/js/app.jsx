import { createRoot } from 'react-dom/client';
import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { WishlistProvider } from './context/WishlistContext';

import Layout from './components/Layout';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Buyback from './pages/Buyback';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import MyRequests from './pages/MyRequests';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Compare from './pages/Compare';
import Wishlist from './pages/Wishlist';
import RacketAdvisor from './pages/RacketAdvisor';
import AboutUs from './pages/AboutUs';
import HowBuyback from './pages/HowBuyback';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsConditions from './pages/TermsConditions';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPadelRackets from './pages/admin/AdminPadelRackets';
import AdminEvaluation from './pages/admin/AdminEvaluation';
import AdminBuybackRequests from './pages/admin/AdminBuybackRequests';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';

// scroll la top la fiecare schimbare de ruta
function ScrollToTop() {
    const { pathname } = useLocation();
    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);
    return null;
}

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center py-20">Se încarcă...</div>;
    return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center py-20">Se încarcă...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/" />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <CompareProvider>
                            <ScrollToTop />
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:slug" element={<ProductDetail />} />
                            <Route path="/buyback" element={<Buyback />} />
                            <Route path="/advisor" element={<RacketAdvisor />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/compare" element={<Compare />} />
                            <Route path="/despre-noi" element={<AboutUs />} />
                            <Route path="/cum-functioneaza-buyback" element={<HowBuyback />} />
                            <Route path="/politica-retur" element={<ReturnPolicy />} />
                            <Route path="/termeni-conditii" element={<TermsConditions />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />

                            <Route path="/profile" element={
                                <PrivateRoute><Profile /></PrivateRoute>
                            } />
                            <Route path="/wishlist" element={
                                <PrivateRoute><Wishlist /></PrivateRoute>
                            } />
                            <Route path="/checkout" element={
                                <PrivateRoute><Checkout /></PrivateRoute>
                            } />
                            <Route path="/order-confirmation/:id" element={
                                <PrivateRoute><OrderConfirmation /></PrivateRoute>
                            } />
                            <Route path="/my-orders" element={
                                <PrivateRoute><MyOrders /></PrivateRoute>
                            } />
                            <Route path="/my-requests" element={
                                <PrivateRoute><MyRequests /></PrivateRoute>
                            } />

                            <Route path="/admin" element={
                                <AdminRoute><AdminLayout /></AdminRoute>
                            }>
                                <Route index element={<Dashboard />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="brands" element={<AdminBrands />} />
                                <Route path="categories" element={<AdminCategories />} />
                                <Route path="padel-rackets" element={<AdminPadelRackets />} />
                                <Route path="evaluation" element={<AdminEvaluation />} />
                                <Route path="buyback-requests" element={<AdminBuybackRequests />} />
                                <Route path="reviews" element={<AdminReviews />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Route>
                            </Routes>

                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: '#1a2332',
                                        color: '#ffffff',
                                        borderRadius: '12px',
                                        padding: '12px 16px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: '#10b981',
                                            secondary: '#ffffff',
                                        },
                                        style: {
                                            background: '#1a2332',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                        },
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: '#ef4444',
                                            secondary: '#ffffff',
                                        },
                                        style: {
                                            background: '#1a2332',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                        },
                                    },
                                }}
                            />
                        </CompareProvider>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(<App />);
