export default function ColorSelector({ availableColors }) {
    return (
        <div className="mb-0">
            <label className="block text-sm font-semibold text-black mb-1">
                <p>Color</p>
            </label>
            <div className="flex gap-3 flex-wrap mb-2">
                {availableColors.map((color) => {
                    const name = typeof color === 'string' ? color : color?.name;
                    const hex = typeof color === 'string' ? color : color?.hex;
                    return (
                        <div
                            key={name}
                            className="w-12 h-12 rounded-full border-2 border-gray-200 cursor-not-allowed flex items-center justify-center"
                            style={{ backgroundColor: hex }}
                            title={name}
                        />
                    );
                })}
            </div>
            <div className="flex gap-3 flex-wrap -mt-1">
                {availableColors.map((color) => {
                    const name = typeof color === 'string' ? color : color?.name;
                    return (
                        <div key={name} className="w-12 text-center">
                            <span className="block text-sm font-medium text-gray-700 py-1">
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
