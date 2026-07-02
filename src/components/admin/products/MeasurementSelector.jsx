import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';
import { measurementsAPI } from '@/services/api';

const createEmptyField = () => ({ name: '' });

export default function MeasurementSelector({
    measurements,
    selectedMeasurements,
    onMeasurementsChange,
    loading,
    onRefreshMeasurements,
}) {
    const [localMeasurements, setLocalMeasurements] = useState(measurements || []);
    const [showEditor, setShowEditor] = useState(false);
    const [editing, setEditing] = useState(null);
    const [name, setName] = useState('');
    const [fields, setFields] = useState([createEmptyField()]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLocalMeasurements(measurements || []);
    }, [measurements]);

    const selectedIds = Array.isArray(selectedMeasurements) ? selectedMeasurements : [];

    const resetEditor = () => {
        setEditing(null);
        setName('');
        setFields([createEmptyField()]);
        setError('');
    };

    const openEditor = (measurement = null) => {
        if (measurement) {
            setEditing(measurement);
            setName(measurement.name || '');
            setFields(
                Array.isArray(measurement.fields) && measurement.fields.length > 0
                    ? measurement.fields.map((field) => ({ name: field }))
                    : [createEmptyField()]
            );
        } else {
            resetEditor();
        }
        setShowEditor(true);
    };

    const handleToggle = (id) => {
        const next = selectedIds.includes(id)
            ? selectedIds.filter((item) => item !== id)
            : [...selectedIds, id];
        onMeasurementsChange(next);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this measurement category?')) return;

        try {
            await measurementsAPI.deleteMeasurement(id);
            setLocalMeasurements((prev) => prev.filter((item) => item.id !== id));
            onMeasurementsChange(selectedIds.filter((item) => item !== id));
            if (typeof onRefreshMeasurements === 'function') {
                onRefreshMeasurements();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete measurement category');
        }
    };

    const getValidFields = () =>
        fields
            .map((field) => String(field.name || '').trim())
            .filter((field) => field.length > 0);

    const handleSave = async () => {
        const cleanFields = getValidFields();
        if (!name.trim()) {
            setError('Category name is required');
            return;
        }
        if (cleanFields.length === 0) {
            setError('Add at least one field');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const payload = { name: name.trim(), fields: cleanFields };
            const response = editing
                ? await measurementsAPI.updateMeasurement(editing.id, payload)
                : await measurementsAPI.createMeasurement(payload);

            const saved = response.data.measurement;
            if (saved) {
                setLocalMeasurements((prev) => {
                    const next = prev.filter((item) => item.id !== saved._id);
                    return [...next, { id: saved._id, name: saved.name, fields: saved.fields || [] }];
                });
                if (!editing) {
                    onMeasurementsChange([...selectedIds, saved._id], saved);
                }
                if (typeof onRefreshMeasurements === 'function') {
                    onRefreshMeasurements();
                }
                setShowEditor(false);
                resetEditor();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save measurement category');
        } finally {
            setSaving(false);
        }
    };

    const handleFieldChange = (index, value) => {
        setFields((prev) => {
            const next = [...prev];
            next[index] = { name: value };
            return next;
        });
    };

    const addField = () => {
        setFields((prev) => [...prev, createEmptyField()]);
    };

    const removeField = (index) => {
        setFields((prev) => prev.filter((_, idx) => idx !== index));
    };

    if (showEditor) {
        return (
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. European Measurement"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            resetEditor();
                            setShowEditor(false);
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Fields</div>
                    {fields.map((field, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Field name e.g. Chest"
                            />
                            <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 hover:bg-red-100"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addField}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        <FiPlus size={16} /> Add field
                    </button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            resetEditor();
                            setShowEditor(false);
                        }}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : editing ? 'Update category' : 'Create category'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="grid gap-2">
                {loading ? (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">Loading categories...</div>
                ) : localMeasurements.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-500">
                        No measurement categories available. Create one to start adding product size data.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {localMeasurements.map((measurement) => (
                            <label
                                key={measurement.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(measurement.id)}
                                        onChange={() => handleToggle(measurement.id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900">{measurement.name}</div>
                                        <div className="text-sm text-gray-500">{measurement.fields?.join(' · ') || 'No fields yet'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditor(measurement)}
                                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        <FiEdit size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(measurement.id)}
                                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => openEditor(null)}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700"
            >
                <FiPlus size={16} /> Create new category
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
