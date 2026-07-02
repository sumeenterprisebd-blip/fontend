import { useMemo } from "react";

const normalizeId = (value) => {
    if (value && typeof value === 'object') {
        return String(value._id ?? value.id ?? value);
    }
    return String(value ?? '');
};

export default function ProductFormMeasurements({
    formData,
    onAddSizeRow,
    onRemoveSizeRow,
    onUpdateCell,
    onRemoveCategory,
    measurements,
    measurementsLoading,
}) {
    const categories = Array.isArray(measurements) ? measurements : [];
    const groups = Array.isArray(formData.measurements) ? formData.measurements : [];

    const categoryLookup = useMemo(() => {
        const lookup = {};
        categories.forEach((category) => {
            const id = normalizeId(category.id ?? category._id);
            if (id) lookup[id] = category;
        });
        return lookup;
    }, [categories]);

    const renderGroupFields = (group) => {
        const groupCategoryId = normalizeId(group.category);
        const category = categoryLookup[groupCategoryId];
        const fieldNames = Array.isArray(category?.fields) && category.fields.length > 0
            ? category.fields
            : group.sizes?.[0]?.values
                ? Object.keys(group.sizes[0].values)
                : [];

        return (
            <div key={groupCategoryId} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                        <h4 className="text-base font-semibold text-gray-900">{category?.name || "Measurement Category"}</h4>
                        <p className="text-sm text-gray-500">{fieldNames.length > 0 ? fieldNames.join(" • ") : "No fields defined yet"}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemoveCategory(group.category)}
                        className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                        Remove category
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Size</th>
                                {fieldNames.map((field) => (
                                    <th key={field} className="px-3 py-2 text-left font-semibold text-gray-700">
                                        {field}
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Array.isArray(group.sizes) && group.sizes.length > 0 ? (
                                group.sizes.map((row, rowIndex) => (
                                    <tr key={`${group.category}-${rowIndex}`}>
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                value={row.size || ""}
                                                onChange={(e) => onUpdateCell(group.category, rowIndex, "size", e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                                placeholder="Size label"
                                            />
                                        </td>
                                        {fieldNames.map((field) => (
                                            <td key={field} className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    value={row.values?.[field] || ""}
                                                    onChange={(e) => onUpdateCell(group.category, rowIndex, field, e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                                    placeholder={field}
                                                />
                                            </td>
                                        ))}
                                        <td className="px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() => onRemoveSizeRow(group.category, rowIndex)}
                                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={fieldNames.length + 2} className="px-3 py-4 text-sm text-gray-500">
                                        No size rows yet. Add a size row to fill values for this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => onAddSizeRow(normalizeId(group.category), fieldNames)}
                        className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Add size row
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Size Measurements</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Select one or more measurement categories and then add size rows for each. Each category field appears automatically.
                </p>
            </div>

            {measurementsLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">Loading measurement categories...</div>
            ) : groups.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                    No measurement categories selected. Choose categories from the top section to reveal dynamic size rows.
                </div>
            ) : (
                <div className="space-y-4">
                    {groups.map((group) => renderGroupFields(group))}
                </div>
            )}
        </section>
    );
}
