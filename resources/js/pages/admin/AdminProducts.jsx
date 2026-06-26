import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api';

const EMPTY_FORM = {
    name: '', category_id: '', brand_id: '', price: '', type: 'new',
    condition_grade: '', stock: '0', description: '',
    // specs tehnice (folosite de advisor + filtre)
    shape: '', weight_range: '', balance: '', thickness_mm: '',
    frame_material: '', surface_material: '', core_material: '', core_hardness: '',
    finish: '', playing_level: '', playing_style: '', sweet_spot: '',
    power_rating: '', control_rating: '', spin_rating: '', comfort_rating: '',
};

const TECHNICAL_FIELDS = [
    'shape', 'weight_range', 'balance', 'thickness_mm',
    'frame_material', 'surface_material', 'core_material', 'core_hardness',
    'finish', 'playing_level', 'playing_style', 'sweet_spot',
    'power_rating', 'control_rating', 'spin_rating', 'comfort_rating',
];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showTechSpecs, setShowTechSpecs] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, setForm] = useState(EMPTY_FORM);

    const loadProducts = () => api.get('/admin/products').then((res) => setProducts(res.data.data));

    useEffect(() => {
        loadProducts();
        api.get('/brands').then((res) => setBrands(res.data));
        api.get('/categories').then((res) => setCategories(res.data));
    }, []);

    // pre-fill din cerere buyback cand vine cu ?fromBuyback={id}
    useEffect(() => {
        const buybackId = searchParams.get('fromBuyback');
        if (!buybackId || categories.length === 0) return;

        api.get(`/admin/buyback-requests/${buybackId}`)
            .then((res) => {
                const req = res.data;
                const racket = req.padel_racket;
                if (!racket) {
                    toast.error('Cererea nu mai are racheta asociata');
                    return;
                }

                const racheteCategory = categories.find((c) => c.name.toLowerCase().includes('rachet'));

                // descriere bazata pe optiunile alese de user
                const conditionLines = (req.selected_options || [])
                    .map((opt) => `- ${opt.criterion?.name || ''}: ${opt.label}`)
                    .join('\n');
                const description = `Racheta refurbished primita prin programul de buy-back.\n\nStare declarata de fostul proprietar:\n${conditionLines}\n\nPret achizitie buy-back: ${req.offered_price} RON.`;

                setForm({
                    ...EMPTY_FORM,
                    name: `${racket.brand?.name || ''} ${racket.model}`.trim(),
                    category_id: racheteCategory ? String(racheteCategory.id) : '',
                    brand_id: String(racket.brand_id),
                    type: 'refurbished',
                    stock: '1',
                    description,
                });
                setShowForm(true);
                setImagePreview(racket.image_url || null);

                toast.success(`Formular pre-completat din cererea #${req.id}. Adauga poza, pretul si gradul.`);

                // curatare query param din URL
                setSearchParams({});
            })
            .catch(() => toast.error('Nu s-a putut incarca cererea buyback'));
    }, [searchParams, categories]);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditing(null);
        setShowForm(false);
        setShowTechSpecs(false);
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (product) => {
        const next = { ...EMPTY_FORM };
        Object.keys(EMPTY_FORM).forEach((k) => {
            if (product[k] !== null && product[k] !== undefined) {
                next[k] = String(product[k]);
            }
        });
        setForm(next);
        setEditing(product.id);
        setShowForm(true);
        // deschidem sectiunea tehnica daca produsul are deja date completate
        setShowTechSpecs(TECHNICAL_FIELDS.some((f) => product[f] !== null && product[f] !== undefined && product[f] !== ''));
        setImageFile(null);
        setRemoveImage(false);
        setImagePreview(product.image_url || null);
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
        formData.append('name', form.name);
        formData.append('price', form.price);
        formData.append('category_id', form.category_id);
        formData.append('brand_id', form.brand_id);
        formData.append('type', form.type);
        formData.append('stock', form.stock);
        if (form.description) formData.append('description', form.description);
        if (form.condition_grade) formData.append('condition_grade', form.condition_grade);
        if (imageFile) formData.append('image', imageFile);
        if (removeImage) formData.append('remove_image', '1');

        // specs tehnice - trimit doar valorile completate
        TECHNICAL_FIELDS.forEach((field) => {
            const value = form[field];
            if (value !== '' && value !== null && value !== undefined) {
                formData.append(field, value);
            }
        });

        try {
            if (editing) {
                // laravel are nevoie de _method pentru PUT cu FormData
                formData.append('_method', 'PUT');
                await api.post(`/admin/products/${editing}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/admin/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            resetForm();
            loadProducts();
            toast.success(editing ? 'Produs actualizat' : 'Produs adaugat');
        } catch (err) {
            const msg = err.response?.data?.message || 'Eroare la salvare.';
            toast.error(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Sigur vrei sa stergi acest produs?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            loadProducts();
            toast.success('Produs sters');
        } catch {
            toast.error('Eroare la stergere');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Produse</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    + Produs nou
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <h2 className="font-semibold text-lg">{editing ? 'Editeaza produs' : 'Produs nou'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nume produs" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <input type="number" step="0.01" placeholder="Pret (RON)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2" required />
                        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border rounded-lg px-3 py-2" required>
                            <option value="">Categorie</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="border rounded-lg px-3 py-2" required>
                            <option value="">Brand</option>
                            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded-lg px-3 py-2">
                            <option value="new">Nou</option>
                            <option value="refurbished">Refurbished</option>
                        </select>
                        {form.type === 'refurbished' && (
                            <select value={form.condition_grade} onChange={(e) => setForm({ ...form, condition_grade: e.target.value })} className="border rounded-lg px-3 py-2">
                                <option value="">Grad conditie</option>
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        )}
                        <input type="number" placeholder="Stoc" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagine produs</label>
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

                    <textarea placeholder="Descriere" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows="3" />

                    {/* specs tehnice - colapsabile */}
                    <div className="border rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowTechSpecs(!showTechSpecs)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition"
                        >
                            <div>
                                <p className="font-semibold text-sm text-gray-800">Specificatii tehnice racheta</p>
                                <p className="text-xs text-gray-500 mt-0.5">Optional. Folosit de Racket Advisor si filtrele avansate din catalog.</p>
                            </div>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${showTechSpecs ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showTechSpecs && (
                            <div className="p-4 space-y-4 border-t bg-white">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Caracteristici de joc</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Forma</span>
                                            <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="round">Round (rotunda)</option>
                                                <option value="teardrop">Teardrop (lacrima)</option>
                                                <option value="diamond">Diamond (diamant)</option>
                                                <option value="geometric">Geometric</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Balans</span>
                                            <select value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="low">Low (jos / maner)</option>
                                                <option value="medium">Medium (echilibrat)</option>
                                                <option value="high">High (sus / cap)</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Duritate spuma</span>
                                            <select value={form.core_hardness} onChange={(e) => setForm({ ...form, core_hardness: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="soft">Soft (moale)</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard (tare)</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Stil de joc</span>
                                            <select value={form.playing_style} onChange={(e) => setForm({ ...form, playing_style: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="control">Control</option>
                                                <option value="allround">All-round</option>
                                                <option value="attack">Atac</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Nivel jucator</span>
                                            <select value={form.playing_level} onChange={(e) => setForm({ ...form, playing_level: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="beginner">Incepator</option>
                                                <option value="intermediate">Intermediar</option>
                                                <option value="advanced">Avansat</option>
                                                <option value="professional">Profesionist</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Sweet spot</span>
                                            <select value={form.sweet_spot} onChange={(e) => setForm({ ...form, sweet_spot: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
                                                <option value="">-</option>
                                                <option value="small">Small (mic)</option>
                                                <option value="medium">Medium</option>
                                                <option value="large">Large (mare)</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Materiale si dimensiuni</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Greutate (ex: 360-375g)</span>
                                            <input type="text" placeholder="360-375g" value={form.weight_range} onChange={(e) => setForm({ ...form, weight_range: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Grosime (mm)</span>
                                            <input type="number" placeholder="38" value={form.thickness_mm} onChange={(e) => setForm({ ...form, thickness_mm: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Finisaj suprafata</span>
                                            <input type="text" placeholder="rough / smooth" value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Material cadru</span>
                                            <input type="text" placeholder="Carbon" value={form.frame_material} onChange={(e) => setForm({ ...form, frame_material: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Material suprafata</span>
                                            <input type="text" placeholder="12K Carbon" value={form.surface_material} onChange={(e) => setForm({ ...form, surface_material: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Material spuma</span>
                                            <input type="text" placeholder="EVA" value={form.core_material} onChange={(e) => setForm({ ...form, core_material: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Rating-uri performanta (1-10)</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Putere</span>
                                            <input type="number" min="1" max="10" placeholder="8" value={form.power_rating} onChange={(e) => setForm({ ...form, power_rating: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Control</span>
                                            <input type="number" min="1" max="10" placeholder="8" value={form.control_rating} onChange={(e) => setForm({ ...form, control_rating: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Spin</span>
                                            <input type="number" min="1" max="10" placeholder="8" value={form.spin_rating} onChange={(e) => setForm({ ...form, spin_rating: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                        <label className="block">
                                            <span className="text-xs text-gray-600">Confort</span>
                                            <input type="number" min="1" max="10" placeholder="8" value={form.comfort_rating} onChange={(e) => setForm({ ...form, comfort_rating: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
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
                            <th className="text-left px-4 py-3">Produs</th>
                            <th className="text-left px-4 py-3">Tip</th>
                            <th className="text-left px-4 py-3">Pret</th>
                            <th className="text-left px-4 py-3">Stoc</th>
                            <th className="text-right px-4 py-3">Actiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="px-4 py-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-xs text-gray-500">{p.brand?.name} &middot; {p.category?.name}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.type === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {p.type === 'new' ? 'Nou' : `Refurb ${p.condition_grade || ''}`}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium">{p.price} RON</td>
                                <td className="px-4 py-3">{p.stock}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs">Editeaza</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Sterge</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
