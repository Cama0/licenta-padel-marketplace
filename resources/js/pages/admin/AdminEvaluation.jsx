import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminEvaluation() {
    const [criteria, setCriteria] = useState([]);
    const [editingCriterion, setEditingCriterion] = useState(null);
    const [criterionForm, setCriterionForm] = useState({ name: '', description: '', sort_order: '0' });
    const [showCriterionForm, setShowCriterionForm] = useState(false);

    // state pentru optiuni
    const [addingOptionTo, setAddingOptionTo] = useState(null);
    const [editingOption, setEditingOption] = useState(null);
    const [optionForm, setOptionForm] = useState({ label: '', price_modifier_type: 'percentage', price_modifier_value: '0', sort_order: '0' });

    const load = () => api.get('/admin/evaluation-criteria').then((res) => setCriteria(res.data));

    useEffect(() => { load(); }, []);

    // --- Criteriu CRUD ---
    const resetCriterionForm = () => { setCriterionForm({ name: '', description: '', sort_order: '0' }); setEditingCriterion(null); setShowCriterionForm(false); };

    const handleEditCriterion = (c) => {
        setCriterionForm({ name: c.name, description: c.description || '', sort_order: String(c.sort_order) });
        setEditingCriterion(c.id);
        setShowCriterionForm(true);
    };

    const handleSubmitCriterion = async (e) => {
        e.preventDefault();
        const data = { ...criterionForm, sort_order: Number(criterionForm.sort_order) };
        if (editingCriterion) {
            await api.put(`/admin/evaluation-criteria/${editingCriterion}`, data);
        } else {
            await api.post('/admin/evaluation-criteria', data);
        }
        resetCriterionForm();
        load();
    };

    const handleDeleteCriterion = async (id) => {
        if (!confirm('Sigur? Se vor șterge și toate opțiunile asociate.')) return;
        await api.delete(`/admin/evaluation-criteria/${id}`);
        load();
    };

    // optiune crud
    const resetOptionForm = () => { setOptionForm({ label: '', price_modifier_type: 'percentage', price_modifier_value: '0', sort_order: '0' }); setAddingOptionTo(null); setEditingOption(null); };

    const handleEditOption = (opt) => {
        setOptionForm({ label: opt.label, price_modifier_type: opt.price_modifier_type, price_modifier_value: String(opt.price_modifier_value), sort_order: String(opt.sort_order) });
        setEditingOption(opt.id);
        setAddingOptionTo(opt.criterion_id);
    };

    const handleSubmitOption = async (e, criterionId) => {
        e.preventDefault();
        const data = { ...optionForm, price_modifier_value: Number(optionForm.price_modifier_value), sort_order: Number(optionForm.sort_order) };
        if (editingOption) {
            await api.put(`/admin/evaluation-options/${editingOption}`, data);
        } else {
            await api.post(`/admin/evaluation-criteria/${criterionId}/options`, data);
        }
        resetOptionForm();
        load();
    };

    const handleDeleteOption = async (id) => {
        if (!confirm('Sigur vrei să ștergi această opțiune?')) return;
        await api.delete(`/admin/evaluation-options/${id}`);
        load();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Criterii de Evaluare</h1>
                <button onClick={() => { resetCriterionForm(); setShowCriterionForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">+ Criteriu nou</button>
            </div>

            {showCriterionForm && (
                <form onSubmit={handleSubmitCriterion} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4">
                    <h2 className="font-semibold">{editingCriterion ? 'Editează criteriu' : 'Criteriu nou'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Întrebare (ex: Starea vizuală?)" value={criterionForm.name} onChange={(e) => setCriterionForm({ ...criterionForm, name: e.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" required />
                        <input type="number" placeholder="Ordine" value={criterionForm.sort_order} onChange={(e) => setCriterionForm({ ...criterionForm, sort_order: e.target.value })} className="border rounded-lg px-3 py-2" />
                    </div>
                    <textarea placeholder="Descriere (opțional)" value={criterionForm.description} onChange={(e) => setCriterionForm({ ...criterionForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows="2" />
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">{editingCriterion ? 'Salvează' : 'Creează'}</button>
                        <button type="button" onClick={resetCriterionForm} className="border px-4 py-2 rounded-lg text-sm">Anulează</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {criteria.map((criterion) => (
                    <div key={criterion.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{criterion.name}</h3>
                                {criterion.description && <p className="text-sm text-gray-500">{criterion.description}</p>}
                                <p className="text-xs text-gray-400">Ordine: {criterion.sort_order} &middot; {criterion.is_active ? 'Activ' : 'Inactiv'}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEditCriterion(criterion)} className="text-blue-600 hover:underline text-xs">Editează</button>
                                <button onClick={() => handleDeleteCriterion(criterion.id)} className="text-red-500 hover:underline text-xs">Șterge</button>
                            </div>
                        </div>
                        <table className="w-full text-sm mb-3">
                            <thead>
                                <tr className="text-left text-gray-500 text-xs">
                                    <th className="pb-2">Opțiune</th>
                                    <th className="pb-2">Tip modificator</th>
                                    <th className="pb-2">Valoare</th>
                                    <th className="pb-2">Ordine</th>
                                    <th className="pb-2 text-right">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {criterion.options?.map((opt) => (
                                    <tr key={opt.id} className="border-t">
                                        <td className="py-2">{opt.label}</td>
                                        <td className="py-2">
                                            <span className={`text-xs px-2 py-0.5 rounded ${opt.price_modifier_type === 'percentage' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {opt.price_modifier_type === 'percentage' ? 'Procent' : 'Sumă fixă'}
                                            </span>
                                        </td>
                                        <td className="py-2 font-medium">
                                            {opt.price_modifier_value}{opt.price_modifier_type === 'percentage' ? '%' : ' RON'}
                                        </td>
                                        <td className="py-2 text-gray-500">{opt.sort_order}</td>
                                        <td className="py-2 text-right space-x-2">
                                            <button onClick={() => handleEditOption(opt)} className="text-blue-600 hover:underline text-xs">Editează</button>
                                            <button onClick={() => handleDeleteOption(opt.id)} className="text-red-500 hover:underline text-xs">Șterge</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {addingOptionTo === criterion.id ? (
                            <form onSubmit={(e) => handleSubmitOption(e, criterion.id)} className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <input type="text" placeholder="Label opțiune" value={optionForm.label} onChange={(e) => setOptionForm({ ...optionForm, label: e.target.value })} className="border rounded-lg px-3 py-2" required />
                                    <select value={optionForm.price_modifier_type} onChange={(e) => setOptionForm({ ...optionForm, price_modifier_type: e.target.value })} className="border rounded-lg px-3 py-2">
                                        <option value="percentage">Procent (%)</option>
                                        <option value="fixed_amount">Sumă fixă (RON)</option>
                                    </select>
                                    <input type="number" step="0.01" placeholder="Valoare (ex: -15)" value={optionForm.price_modifier_value} onChange={(e) => setOptionForm({ ...optionForm, price_modifier_value: e.target.value })} className="border rounded-lg px-3 py-2" required />
                                    <input type="number" placeholder="Ordine" value={optionForm.sort_order} onChange={(e) => setOptionForm({ ...optionForm, sort_order: e.target.value })} className="border rounded-lg px-3 py-2" />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">{editingOption ? 'Salvează' : 'Adaugă'}</button>
                                    <button type="button" onClick={resetOptionForm} className="border px-3 py-1.5 rounded-lg text-sm">Anulează</button>
                                </div>
                            </form>
                        ) : (
                            <button onClick={() => { resetOptionForm(); setAddingOptionTo(criterion.id); }} className="text-green-600 hover:underline text-sm">
                                + Adaugă opțiune
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
