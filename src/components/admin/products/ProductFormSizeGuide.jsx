export default function ProductFormSizeGuide({
    formData,
    onUpdateRow,
    onAddRow,
    onRemoveRow,
    onUpdateColumnLabel,
    onAddColumn,
    onRemoveColumn,
}) {
    const columns = Array.isArray(formData.sizeGuideColumns) ? formData.sizeGuideColumns : [];
    const rows = Array.isArray(formData.sizeGuide) ? formData.sizeGuide : [];

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Size Guide</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Add per-product size rows and measurement columns. Use columns like EU and Asia, or add custom measurements for this product.
                </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <div className="min-w-[700px]">
                    <div className="flex gap-2 flex-wrap items-center px-4 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        <div className="min-w-[120px]">Size</div>
                        {columns.map((column, columnIndex) => (
                            <div key={columnIndex} className="flex min-w-[140px] flex-1 items-center gap-2">
                                <input
                                    type="text"
                                    value={column}
                                    onChange={(e) => onUpdateColumnLabel(columnIndex, e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                    placeholder="Metric"
                                />
                                {columns.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveColumn(column)}
                                        className="rounded-full bg-gray-100 px-2 py-1 text-gray-500 hover:bg-red-100 hover:text-red-700"
                                        aria-label={`Remove ${column} column`}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 px-4 py-3">
                        {rows.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                                No size guide rows added yet. Use the buttons below to add rows and custom measurement columns.
                            </div>
                        )}

                        {rows.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-2 flex-wrap items-start">
                                <input
                                    type="text"
                                    value={row.size || ""}
                                    onChange={(e) => onUpdateRow(rowIndex, "size", e.target.value)}
                                    className="min-w-[120px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                    placeholder="Size label"
                                />

                                {columns.map((column) => (
                                    <input
                                        key={column}
                                        type="text"
                                        value={(row.measurements?.[column] || "")}
                                        onChange={(e) => onUpdateRow(rowIndex, column, e.target.value)}
                                        className="min-w-[140px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                                        placeholder={column}
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={() => onRemoveRow(rowIndex)}
                                    className="mt-1 inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onAddRow}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        Add row
                    </button>
                    <button
                        type="button"
                        onClick={onAddColumn}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
                    >
                        Add measurement column
                    </button>
                </div>

                <p className="text-xs text-gray-500 sm:text-right">
                    You can add different measurement types for different products, such as EU, Asia, Bust, or Waist.
                </p>
            </div>
        </section>
    );
}
