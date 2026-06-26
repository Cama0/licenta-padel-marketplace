import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminBrands() {
    const [brands, setBrands] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', logo_url: '' });
    const [showForm, setShowForm] = useState(false);

    const load = () => api.get('/brands').then((res) => setBrands(res.data));

    useEffect(() => { load(); }, []);

    const resetForm = () => { setForm({ name: '', logo_url: '' }); setEditing(null); setShowForm(false); };

    const handleEdit = (brand) => {
        setForm({ name: brand.name, logo_url: brand.logo_url || '' });
        setEditing(brand.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form };
        if (!data.logo_url) delete data.logo_url;

        if (editing) {
            await api.put(`/admin/brands/${editing}`, data);
        } else {
            await api.post('/admin/brands', data);
        }
        resetForm();
        load();
    };

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei să ștergi acest brand?')) return;
        await api.delete(`/admin/brands/${id}`);
        load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Branduri</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Brand nou</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nume brand" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input type="text" placeholder="URL logo (opțional)" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="border rounded-lg px-3 py-2" />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">{editing ? 'Salvează' : 'Creează'}</button>
                        <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-lg text-sm">Anulează</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3">Nume</th>
                            <th className="text-left px-4 py-3">Slug</th>
                            <th className="text-right px-4 py-3">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((b) => (
                            <tr key={b.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{b.name}</td>
                                <td className="px-4 py-3 text-gray-500">{b.slug}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => handleEdit(b)} className="text-blue-600 hover:underline text-xs">Editează</button>
                                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline text-xs">Șterge</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
