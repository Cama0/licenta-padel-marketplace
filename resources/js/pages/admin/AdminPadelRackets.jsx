import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

export default function AdminPadelRackets() {
    const [rackets, setRackets] = useState([]);
    const [brands, setBrands] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const fileInputRef = useRef(null);
    const [form, setForm] = useState({ brand_id: '', model: '', base_buyback_price: '' });

    const load = () => api.get('/admin/padel-rackets').then((res) => setRackets(res.data));

    useEffect(() => {
        load();
        api.get('/brands').then((res) => setBrands(res.data));
    }, []);

    const resetForm = () => {
        setForm({ brand_id: '', model: '', base_buyback_price: '' });
        setEditing(null);
        setShowForm(false);
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (r) => {
        setForm({
            brand_id: String(r.brand_id),
            model: r.model,
            base_buyback_price: r.base_buyback_price,
        });
        setEditing(r.id);
        setShowForm(true);
        setImageFile(null);
        setRemoveImage(false);
        setImagePreview(r.image_url || null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setRemoveImage(false);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('brand_id', form.brand_id);
        formData.append('model', form.model);
        formData.append('base_buyback_price', form.base_buyback_price);
        if (imageFile) formData.append('image', imageFile);
        if (removeImage) formData.append('remove_image', '1');

        try {
            if (editing) {
                formData.append('_method', 'PUT');
                await api.post(`/admin/padel-rackets/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/admin/padel-rackets', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            resetForm();
            load();
            toast.success(editing ? 'Racheta actualizata' : 'Racheta adaugata');
        } catch (err) {
            const msg = err.response?.data?.message || 'Eroare la salvare.';
            toast.error(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei sa stergi aceasta racheta?')) return;
        try {
            await api.delete(`/admin/padel-rackets/${id}`);
            load();
            toast.success('Racheta stearsa');
        } catch {
            toast.error('Eroare la stergere');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Rachete Buyback</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Racheta noua</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <h2 className="font-semibold text-lg">{editing ? 'Editeaza racheta' : 'Racheta noua'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="border rounded-lg px-3 py-2" required>
                            <option value="">Brand</option>
                            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <input type="text" placeholder="Model (ex: AT10 Genius)" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input type="number" step="0.01" placeholder="Pret baza buyback (RON)" value={form.base_buyback_price} onChange={(e) => setForm({ ...form, base_buyback_price: e.target.value })} className="border rounded-lg px-3 py-2" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagine racheta</label>
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs">Fara imagine</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                                <p className="text-xs text-gray-400">JPG, PNG sau WebP. Max 5MB.</p>
                                {imagePreview && (
                                    <button type="button" onClick={handleRemoveImage} className="text-xs text-red-500 hover:text-red-700 font-medium">
                                        Sterge imaginea
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">{editing ? 'Salveaza' : 'Creaza'}</button>
                        <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Anuleaza</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3 w-12">Img</th>
                            <th className="text-left px-4 py-3">Brand</th>
                            <th className="text-left px-4 py-3">Model</th>
                            <th className="text-left px-4 py-3">Pret Buyback</th>
                            <th className="text-right px-4 py-3">Actiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rackets.map((r) => (
                            <tr key={r.id} className="border-t">
                                <td className="px-4 py-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {r.image_url ? (
                                            <img src={r.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">{r.brand?.name}</td>
                                <td className="px-4 py-3 font-medium">{r.model}</td>
                                <td className="px-4 py-3 text-blue-600 font-medium">{r.base_buyback_price} RON</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => handleEdit(r)} className="text-blue-600 hover:underline text-xs">Editeaza</button>
                                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:underline text-xs">Sterge</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
