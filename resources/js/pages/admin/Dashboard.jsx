import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import api from '../../api';

// paleta culori grafice
const STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#6366f1',
    delivered: '#10b981',
    cancelled: '#ef4444',
    approved: '#10b981',
    rejected: '#ef4444',
    completed: '#06b6d4',
};

const BRAND_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard-stats')
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-center text-gray-400 py-12">Eroare la incarcarea datelor.</div>;

    const k = data.kpis;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Vedere de ansamblu asupra activitatii magazinului</p>
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">
                    Actualizat: {new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    label="Venit total"
                    value={`${k.total_revenue.toFixed(0)} RON`}
                    sublabel={`Comanda medie: ${k.avg_order_value.toFixed(0)} RON`}
                    color="from-green-500 to-emerald-600"
                    icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <KpiCard
                    label="Comenzi totale"
                    value={k.total_orders}
                    sublabel={`${k.orders_today} azi · ${k.orders_this_month} luna`}
                    color="from-blue-500 to-indigo-600"
                    badge={k.pending_orders > 0 ? `${k.pending_orders} in asteptare` : null}
                    badgeColor="bg-yellow-100 text-yellow-700"
                    icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    link="/admin/orders"
                />
                <KpiCard
                    label="Clienti"
                    value={k.total_customers}
                    sublabel="Conturi inregistrate"
                    color="from-purple-500 to-pink-600"
                    icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <KpiCard
                    label="Produse"
                    value={k.total_products}
                    sublabel={`${k.low_stock_products} stoc redus · ${k.out_of_stock_products} epuizate`}
                    color="from-orange-500 to-red-600"
                    icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    link="/admin/products"
                />
            </div>

            {(k.pending_orders > 0 || k.pending_buyback > 0 || k.pending_reviews > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {k.pending_orders > 0 && (
                        <ActionCard
                            label="Comenzi neconfirmate"
                            count={k.pending_orders}
                            link="/admin/orders?status=pending"
                            color="yellow"
                        />
                    )}
                    {k.pending_buyback > 0 && (
                        <ActionCard
                            label="Cereri buyback in asteptare"
                            count={k.pending_buyback}
                            link="/admin/buyback-requests"
                            color="orange"
                        />
                    )}
                    {k.pending_reviews > 0 && (
                        <ActionCard
                            label="Recenzii ascunse"
                            count={k.pending_reviews}
                            link="/admin/reviews?status=pending"
                            color="red"
                        />
                    )}
                </div>
            )}

            <Card title="Evolutia vanzarilor (ultimele 30 zile)" subtitle={`Total venit perioada: ${data.sales_timeline.reduce((sum, d) => sum + d.revenue, 0).toFixed(0)} RON`}>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data.sales_timeline} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date_label"
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            name="Venit (RON)"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Top branduri (dupa venit)">
                    {data.top_brands.length === 0 ? (
                        <EmptyState message="Nu exista vanzari inregistrate inca." />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.top_brands} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                                <YAxis type="category" dataKey="brand" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip
                                    formatter={(value, name) => [name === 'revenue' ? `${value.toFixed(0)} RON` : value, name === 'revenue' ? 'Venit' : 'Unitati']}
                                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                                    {data.top_brands.map((_, i) => (
                                        <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                <Card title="Distributie comenzi pe status">
                    {data.order_status_distribution.length === 0 ? (
                        <EmptyState message="Nu exista comenzi inca." />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={data.order_status_distribution}
                                    dataKey="count"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {data.order_status_distribution.map((entry, i) => (
                                        <Cell key={i} fill={STATUS_COLORS[entry.status] || '#9ca3af'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value, 'Comenzi']}
                                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconSize={10}
                                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Top produse (dupa unitati vandute)">
                    {data.top_products.length === 0 ? (
                        <EmptyState message="Nu exista vanzari inca." />
                    ) : (
                        <div className="space-y-2">
                            {data.top_products.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        i === 1 ? 'bg-gray-200 text-gray-700' :
                                        i === 2 ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-50 text-blue-700'
                                    }`}>
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {p.slug ? (
                                            <Link to={`/products/${p.slug}`} target="_blank" className="text-sm font-medium text-gray-800 hover:text-green-600 transition truncate block">
                                                {p.name}
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                        )}
                                        <p className="text-[11px] text-gray-500">{p.units} unitati · {p.revenue.toFixed(0)} RON</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
                <Card title="Distributie cereri buyback">
                    {data.buyback_status_distribution.length === 0 ? (
                        <EmptyState message="Nu exista cereri buyback inca." />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={data.buyback_status_distribution}
                                    dataKey="count"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={50}
                                    paddingAngle={2}
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {data.buyback_status_distribution.map((entry, i) => (
                                        <Cell key={i} fill={STATUS_COLORS[entry.status] || '#9ca3af'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [value, 'Cereri']}
                                    contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconSize={10}
                                    formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </Card>
            </div>

            <Card
                title="Ultimele comenzi"
                action={<Link to="/admin/orders" className="text-xs text-green-600 hover:text-green-700 font-semibold uppercase tracking-wider">Vezi toate →</Link>}
            >
                {data.recent_orders.length === 0 ? (
                    <EmptyState message="Nu exista comenzi inca." />
                ) : (
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-y border-gray-100">
                                <tr>
                                    <th className="px-5 py-2.5 text-left">Comanda</th>
                                    <th className="px-5 py-2.5 text-left">Client</th>
                                    <th className="px-5 py-2.5 text-left">Status</th>
                                    <th className="px-5 py-2.5 text-right">Total</th>
                                    <th className="px-5 py-2.5 text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.recent_orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-2.5 font-mono text-xs font-semibold">{order.order_number}</td>
                                        <td className="px-5 py-2.5">{order.shipping_name}</td>
                                        <td className="px-5 py-2.5">
                                            <span
                                                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                                                style={{
                                                    background: `${STATUS_COLORS[order.status] || '#9ca3af'}15`,
                                                    color: STATUS_COLORS[order.status] || '#9ca3af',
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-2.5 text-right font-semibold">{order.total} RON</td>
                                        <td className="px-5 py-2.5 text-right text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}

/* ===== Componente helper ===== */

function KpiCard({ label, value, sublabel, color, icon, link, badge, badgeColor }) {
    const content = (
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all relative">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </div>
                {badge && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className="font-['Oswald'] text-2xl font-bold text-[#1a2332]">{value}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">{label}</p>
            {sublabel && <p className="text-[11px] text-gray-400 mt-1.5">{sublabel}</p>}
        </div>
    );

    if (link) {
        return <Link to={link}>{content}</Link>;
    }
    return content;
}

function ActionCard({ label, count, link, color }) {
    const colorMap = {
        yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 text-yellow-800',
        orange: 'bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-800',
        red: 'bg-red-50 border-red-200 hover:border-red-300 text-red-800',
    };
    return (
        <Link
            to={link}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${colorMap[color]}`}
        >
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
                <p className="font-['Oswald'] text-2xl font-bold mt-0.5">{count}</p>
            </div>
            <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

function Card({ title, subtitle, action, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-['Oswald'] text-base font-bold uppercase tracking-wide text-gray-800">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="text-center py-10 text-sm text-gray-400">
            {message}
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            <p className="text-green-600">
                <span className="font-medium">Venit:</span> {item.revenue.toFixed(0)} RON
            </p>
            <p className="text-blue-600">
                <span className="font-medium">Comenzi:</span> {item.orders}
            </p>
        </div>
    );
}
