import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userDropdown, setUserDropdown] = useState(false);
    const userDropdownRef = useRef(null);
    const menuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setUserDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    // inchide dropdown la click in afara
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdown(false);
            }
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // inchide meniul mobil cand se schimba ruta
    useEffect(() => {
        setMenuOpen(false);
        setUserDropdown(false);
    }, [location.pathname]);

    const navLinks = [
        { to: '/products', label: 'TOATE PRODUSELE' },
        { to: '/products?type=new', label: 'NOU' },
        { to: '/products?type=refurbished', label: 'REFURBISHED' },
        { to: '/advisor', label: 'GASESTE RACHETA', accent: 'green' },
        { to: '/buyback', label: 'VINDE RACHETA', accent: 'orange' },
    ];

    return (
        <nav className="sticky top-0 z-50">
            
            <div className="bg-[#111921] text-gray-500 text-[11px] tracking-wide">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-8">
                    <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            0721 000 000
                        </span>
                        <span className="hidden sm:flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            contact@padelmarket.ro
                        </span>
                    </div>
                    <span className="text-green-400/80 font-medium flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Transport gratuit peste 300 RON
                    </span>
                </div>
            </div>

            <div className="bg-[#1a2332]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        
                        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div className="flex items-baseline">
                                <span className="font-['Oswald'] text-xl font-bold text-white uppercase tracking-wider">
                                    Padel
                                </span>
                                <span className="font-['Oswald'] text-xl font-bold text-green-400 uppercase tracking-wider">
                                    Market
                                </span>
                            </div>
                        </Link>

                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cauta rachete, echipamente..."
                                    className="w-full bg-white/[0.07] border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"
                                />
                                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg w-8 h-8 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`px-3 py-1.5 text-[11px] font-['Oswald'] font-medium tracking-wider uppercase rounded-lg transition-all ${
                                        item.accent === 'orange'
                                            ? 'text-orange-400 hover:bg-orange-500/10 hover:text-orange-300'
                                            : item.accent === 'green'
                                            ? 'text-green-400 hover:bg-green-500/10 hover:text-green-300'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-2 ml-4">
                            
                            {user && (
                                <Link
                                    to="/wishlist"
                                    className="relative text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition group"
                                    title="Wishlist"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-pink-500 to-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-pink-500/40 ring-2 ring-[#1a2332]">
                                            {wishlistCount > 99 ? '99+' : wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            <Link
                                to="/cart"
                                className="relative text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition group"
                                title="Cosul meu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-orange-500/40 ring-2 ring-[#1a2332]">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setUserDropdown(!userDropdown)}
                                        className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-500/20 flex items-center justify-center">
                                            <span className="text-green-400 text-xs font-bold">{user.name[0]}</span>
                                        </div>
                                        <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                                        <svg className={`w-3.5 h-3.5 transition-transform ${userDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {userDropdown && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1e2b3a] border border-white/10 rounded-xl shadow-2xl shadow-black/30 py-1.5 z-50"
                                             style={{ animation: 'slide-up 0.15s ease-out' }}>
                                            <div className="px-3.5 py-2 border-b border-white/5">
                                                <p className="text-white text-sm font-medium">{user.name}</p>
                                                <p className="text-gray-500 text-xs">{user.email}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Profilul meu
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                Wishlist {wishlistCount > 0 && <span className="ml-auto text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded">{wishlistCount}</span>}
                                            </Link>
                                            <Link to="/my-orders" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                Comenzile mele
                                            </Link>
                                            <Link to="/my-requests" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                Cereri buyback
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-white/5 transition">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    Panou Admin
                                                </Link>
                                            )}
                                            <div className="border-t border-white/5 mt-1 pt-1">
                                                <button onClick={handleLogout} className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition w-full text-left">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    Deconectare
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-400 hover:text-white transition text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                                        Cont
                                    </Link>
                                    <Link to="/register" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30">
                                        Inregistrare
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="md:hidden relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {menuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-[#1e2b3a] border border-white/10 rounded-xl shadow-2xl shadow-black/40 py-2 z-50"
                                     style={{ animation: 'slide-up 0.15s ease-out' }}>
                                    
                                    <form onSubmit={handleSearch} className="px-3 mb-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cauta produse..."
                                            className="w-full bg-white/[0.07] border border-white/10 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/50"
                                        />
                                    </form>

                                    {navLinks.map((item) => (
                                        <Link
                                            key={item.to}
                                            to={item.to}
                                            className={`block px-4 py-2.5 text-sm font-medium transition ${
                                                item.accent === 'orange'
                                                    ? 'text-orange-400 hover:bg-orange-500/10'
                                                    : item.accent === 'green'
                                                    ? 'text-green-400 hover:bg-green-500/10'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}

                                    <Link to="/cart" className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            Cosul meu
                                        </span>
                                        {itemCount > 0 && (
                                            <span className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                                {itemCount}
                                            </span>
                                        )}
                                    </Link>

                                    <div className="border-t border-white/5 mt-2 pt-2">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 text-gray-500 text-xs">{user.name}</div>
                                                <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">Profilul meu</Link>
                                                <Link to="/wishlist" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
                                                    <span>Wishlist</span>
                                                    {wishlistCount > 0 && <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded">{wishlistCount}</span>}
                                                </Link>
                                                <Link to="/my-orders" className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">Comenzile mele</Link>
                                                <Link to="/my-requests" className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">Cereri buyback</Link>
                                                {user.role === 'admin' && (
                                                    <Link to="/admin" className="block px-4 py-2.5 text-sm text-orange-400 hover:bg-white/5 transition">Panou Admin</Link>
                                                )}
                                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition">Deconectare</button>
                                            </>
                                        ) : (
                                            <div className="px-3 flex gap-2">
                                                <Link to="/login" className="flex-1 text-center py-2 text-gray-400 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition">Login</Link>
                                                <Link to="/register" className="flex-1 text-center py-2 bg-green-500 text-white rounded-lg text-sm font-medium">Inregistrare</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
