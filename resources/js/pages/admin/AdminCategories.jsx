import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', image_url: '' });
    const [showForm, setShowForm] = useState(false);

    const load = () => api.get('/categories').then((res) => setCategories(res.data));

    useEffect(() => { load(); }, []);

    const resetForm = () => { setForm({ name: '', description: '', image_url: '' }); setEditing(null); setShowForm(false); };

    const handleEdit = (cat) => {
        setForm({ name: cat.name, description: cat.description || '', image_url: cat.image_url || '' });
        setEditing(cat.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form };
        if (!data.image_url) delete data.image_url;

        if (editing) {
            await api.put(`/admin/categories/${editing}`, data);
        } else {
            await api.post('/admin/categories', data);
        }
        resetForm();
        load();
    };

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei să ștergi această categorie?')) return;
        await api.delete(`/admin/categories/${id}`);
        load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Categorii</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Categorie nouă</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nume categorie" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input type="text" placeholder="URL imagine (opțional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border rounded-lg px-3 py-2" />
                    </div>
                    <textarea placeholder="Descriere" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows="2" />
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
                            <th className="text-left px-4 py-3">Descriere</th>
                            <th className="text-right px-4 py-3">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="px-4 py-3 font-medium">{c.name}</td>
                                <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{c.description?.substring(0, 50)}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs">Editează</button>
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Șterge</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
