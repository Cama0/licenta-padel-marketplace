import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/orders', label: 'Comenzi' },
    { to: '/admin/products', label: 'Produse' },
    { to: '/admin/brands', label: 'Branduri' },
    { to: '/admin/categories', label: 'Categorii' },
    { to: '/admin/padel-rackets', label: 'Rachete Buyback' },
    { to: '/admin/evaluation', label: 'Criterii Evaluare' },
    { to: '/admin/buyback-requests', label: 'Cereri Buyback' },
    { to: '/admin/reviews', label: 'Recenzii' },
];

export default function AdminLayout() {
    const location = useLocation();

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.to;
        return location.pathname.startsWith(item.to);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-56 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h2 className="font-bold text-lg text-orange-600 mb-4">Admin Panel</h2>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        isActive(item)
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>
                <div className="flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
